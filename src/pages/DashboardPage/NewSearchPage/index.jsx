import react, { useEffect, useState } from 'react'
import * as signalR from '@microsoft/signalr'
import { useNavigate } from 'react-router-dom';

import { getFilterDatas } from '../../../apis/HomePageAPI';
import { getSearchsByEmail } from '../../../apis/DashboardAPI';

import DashboardPage from '..';

import "./index.css"

import FilterInput from '../../../components/FilterInput';
import MySelect from '../../../components/MySelect';
import Loader from '../../../components/Loader';
import SuccessModal from '../../../components/SuccessModal';

import starImg from "../../../resources/star.png"
import upImg from "../../../resources/Chevron.png"

const NewSearchPage = ()=>{
    const navigate = useNavigate();
    // const [inputFilters, setInputFilters] = useState([{}]);
    // const [checkBoxFilters, setCheckBoxFilters] = useState([{}]);
    const [filters, setFilters] = useState([{}]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [kwords, setKwords] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [SMContent, setSMContent] = useState("");
    const [SMTitle, setSMTitle] = useState("");
    const [SMButtonLabel, setSMButtonLabel] = useState("");
    const [SMaction, setSMaction] = useState(0);
    const [SMtype, setSMtype] = useState("");
    const [countInProgress, setCountInProgress] = useState(0);

    useEffect(()=>{
        const run = async() =>{
            let mail = sessionStorage.getItem("mail");
            console.log(mail);
            let datas = await getSearchsByEmail(mail, 1, false);
            console.log(datas);
            setCountInProgress(datas.totalNewRecords);
        }

        run();
    }, [])

    const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://api.freedomainbot.com/searchHub",{
                transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling ,   
                skipNegotiation: false, // Ensure negotiation is not skipped
                // transport: signalR.HttpTransportType.WebSockets,
                withCredentials: false
            }).withAutomaticReconnect().build();

    const callGetFilterApi = async() =>{
        let datas = await getFilterDatas();
        setFilters(datas);
        // await setInputFilters(datas?.filter(data => data.filterTypeText !== "Checkboxes"));
        // await setCheckBoxFilters(datas?.filter(data => data.filterTypeText === "Checkboxes"));
        // console.log(datas);
    }

    const collapse = () =>{setIsCollapsed(!isCollapsed);}

    useEffect(()=>{
        callGetFilterApi();
    }, [])

    const generate = async() =>{
        setIsLoading(true);
        let filtersJson = [];
        filters.forEach((filter)=>{
            if(filter.value !== null && filter.value !== undefined && filter.value !== "" && filter.value !== []) filtersJson.push({filterCode:filter.filterCode, filterValues:filter.value});
        })
        filtersJson = JSON.stringify(filtersJson);
        
        sessionStorage.setItem("filters_json", filtersJson);
        sessionStorage.setItem("key_words", kwords);

        navigate("/my-dashboard");
    }

    return( 
        <DashboardPage>
            {
                isLoading ? <Loader /> : <></>
            }
            {
                isSuccessModalOpen ? <SuccessModal closeModal={()=>{setIsSuccessModalOpen(false)}} title={SMTitle} type={SMtype} content={SMContent} button_txt={SMButtonLabel} /> : <></>
            }
             <div className="new-search-page">
                <div className='top-bar'>
                    <h3>New search with Ai</h3>
                    <div style={{flexGrow:"1"}}>
                    </div>
                    <h5 style={{marginRight:"5%"}}>Total number in Progress : {countInProgress}</h5>
                </div>
                <div className='content'>
                    <img src={starImg} alt="" className="star-size-1" style={{ top: "48px", left: "52%" }} />
                    <img src={starImg} alt="" className="star-size-2" style={{ top: "75px", left: "62%" }} />
                    <img src={starImg} alt="" className="star-size-2" style={{ top: "112px", left: "65%" }} />
                    <img src={starImg} alt="" className="star-size-2" style={{ top: "95px", left: "45%" }} />
                    <img src={starImg} alt="" className="star-size-2" style={{ top: "55px", left: "35%" }} />
                    <img src={starImg} alt="" className="star-size-2" style={{ top: "100px", left: "25%" }} />
                    <div>
                        <h3>Start a new search with AI</h3>
                        <p>Needle Your Way Through the Web’s Haystack to Find a Great Domain</p>
                        <textarea name="" id="" cols="30" rows="10" style={{resize:"none"}} value={kwords} onChange={(e)=>{setKwords(e.target.value)}}></textarea>
                        <div className='fliter-div' onClick={()=>{collapse()}}>
                            <p>Premium filters</p>
                            <img src={upImg} alt="" />
                        </div>
                        {
                            isCollapsed ? <div style={{width:"100%", display:"flex", flexWrap:"wrap", justifyContent:"space-around"}}>
                            {
                                filters.map((filter, id)=>{
                                    if(filter.filterTypeText !== "Checkboxes"){
                                        let w = "47%";
                                        if(filter.filterColSpan === 2) w = "100%";
                                        return <div className='input-wrap' style={{width:w}}>
                                            <FilterInput label={filters[id]?.filterName} update = {(val)=>{
                                                    // console.log(val);
                                                    setFilters(filters.map((filter, idd)=>{
                                                        if(idd !== id) return filter;
                                                        else {
                                                            filter["value"] = val;
                                                            return filter;
                                                        }
                                                    }))
                                            }} type={filters[id]?.filterTypeText} key={id} refFilterValues={filters[id]?.refFilterValues}
                                            isDisabled={false}
                                            />
                                        </div>
                                    } else {
                                        let w = "47%";
                                        if(filter.filterColSpan === 2) w = "100%";
                                        return <div className='input-wrap' style={{width:w}}>
                                            <MySelect name = {filter.filterName} items={filter.refFilterValues} update ={(val)=>{
                                                    setFilters(filters.map((filter, idd)=>{
                                                        if(idd !== id) return filter;
                                                        else {
                                                            filter["value"] = val;
                                                            return filter;
                                                        }
                                                }))
                                            }}  
                                            isDisabled={false}
                                            />
                                        </div>
                                    }
                                })
                            }</div>:<></>
                        }
                        <button onClick={()=>{generate()}}>Generate Domain</button>
                    </div>
                </div>
            </div>
        </DashboardPage>
    )

}
export default NewSearchPage;