import react, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import * as signalR from '@microsoft/signalr'

import { getSearchsByEmail, achiveDomain, reviewDomain } from '../../../apis/DashboardAPI';
import { createSearchId } from '../../../apis/HomePageAPI';

import DashboardPage from '..';
import DomainCard from '../../../components/DomainCard';
import Loader from '../../../components/Loader';

import "./index.css"

import emptyImg from "../../../resources/Basic.png"

const MyDashboardPage = ()=>{

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [word, setWord] = useState("");

    const [items, setItems] = useState([]);
    const [dispItems, setDispItems] = useState([]);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalPage, setTotalPage]  = useState(0);

    let newConnection = new signalR.HubConnectionBuilder()
                .withUrl("https://api.freedomainbot.com/searchHub",{
                    transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling ,   
                    skipNegotiation: false, 
                    withCredentials: false
                }).withAutomaticReconnect().build();

    const getSearches = async(num) =>{
        let mail = sessionStorage.getItem("mail");
        setIsLoading(true);
        let res = await getSearchsByEmail(mail, num, false);
        setIsLoading(false);
        console.log(res);
        setCurrentPageNumber(res.currentPage);
        setTotalPage(res.totalPages);
        let hereItems = res.items;
        setItems(hereItems.map(item=>{
            let dat = item.requestDateTime.split("T")[0].split("-");
            let newFormat = `${dat[1]}/${dat[2]}/${dat[0]}`;
            item.requestDateTime = newFormat;
            return item;
        }))
        setDispItems(res.items);
    }

    const prev = () =>{
        getSearches(currentPageNumber - 1);
    }

    const next = () =>{
        getSearches(currentPageNumber + 1);
    }

    const archive = async(id) =>{
        let res = await achiveDomain(id);
        console.log(res);
        getSearches(1);
    }

    const seeDetails = async(id) =>{
        await reviewDomain(id);
        navigate(`/detail/${id}`);
    }

    useEffect(()=>{
        setIsLoading(true);
        const run = async() =>{
            let filtersJson = sessionStorage.getItem("filters_json");
            let kwords = sessionStorage.getItem("key_words");
            let mail = sessionStorage.getItem("mail");
            console.log(typeof kwords, kwords);
            if(kwords !== "" && kwords !== undefined && kwords !== null){
                console.log("searching...");
                sessionStorage.setItem("filters_json", "");
                sessionStorage.setItem("key_words", "");
                let {rlt, status} = await createSearchId(mail, kwords, filtersJson);
                
                if(status === 200){
                    let searchId = rlt.data;
                    newConnection.start().then(()=>{
                        console.log("Connected !");
                        // setIsLoading(true);
                        newConnection.invoke("JoinSearchGroup", searchId).then(()=>{
                            newConnection.on("ReceiveSearchUpdate", async(ssearchId, status, message) => {
                                // console.log("isSentToGenerate", isSentToGenerate);
                                // if(!isSentToGenerate) return;
                                if(status.status === 3){
                                    newConnection.off('ReceiveSearchUpdate');
                                    console.log("Failed");
                                } else if(status.status === 1){
                                    newConnection.off('ReceiveSearchUpdate');
                                    console.log("OKKKKKK, Done!");
                                    getSearches(1);
                                } else{
                                    console.log("Waiting...");
                                }
                            });
                        });
                    }).catch(
                        e=>{
                            console.log("Connection failed: ", e)
                            // setIsLoading(true);
                        }
                    );
                    
                } else{
                    alert("InterNal server");
                    setIsLoading(false);
                }
                getSearches(1);
            }
            else getSearches(1);
        }
        
        run();
    }, [])

    useEffect(()=>{
        // setDispItems([]);
        let newArr = items.filter(item=>{
            return item.keywordRelevance.includes(word);
        });

        setDispItems(newArr);
    }, [word])

    return(
        <DashboardPage word={word} setWord={setWord}>
            {
                isLoading ? <Loader /> : <></>
            }
            <div className="my-dashboard-page">
                <div className='top-bar'>
                    <h3>My Dashboard</h3>
                    <p>Recent Acitivity</p>
                </div>
                <div className='content' style={!dispItems.length?{alignItems:"center", justifyContent:"center"}:{}}>
                    {
                        dispItems.length?dispItems.map(item=>{
                            return <DomainCard stats={item.status} date={item.requestDateTime} archive={()=>{archive(item.searchId)}} content={item.keywordRelevance} count={item.domainCount} view={()=>{seeDetails(item.searchId)}}/>; 
                        }) : <div className='empty-div'>
                            <img src={emptyImg} alt="" />
                            <button onClick={()=>{navigate("/new-search")}}>Create Now</button>
                        </div>
                    }
                </div>
                <div className='buton-group'>
                    <button className='before-button' onClick={()=>{prev()}} disabled={currentPageNumber===1}>{"<"}</button>
                    <button className='next-button' onClick={()=>{next()}} disabled={currentPageNumber===totalPage}>{">"}</button>
                </div>
            </div>
        </DashboardPage>
    )

}
export default MyDashboardPage;