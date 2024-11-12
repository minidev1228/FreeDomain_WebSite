import react, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getSearchsByEmail } from '../../../apis/DashboardAPI'

import DashboardPage from '..'
import DomainGen from "../../../components/DomainGen"
import Status from "../../../components/Status"
import Loader from '../../../components/Loader'

import "./index.css"



const HistoryPage = () =>{

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [word, setWord] = useState("");

    const [items, setItems] = useState([]);
    const [dispItems, setDispItems] = useState([]);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalPage, setTotalPage]  = useState(0);

    const getSearches = async(num) =>{
        let mail = sessionStorage.getItem("mail");
        setIsLoading(true);
        let res = await getSearchsByEmail(mail, num, true);
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
        setDispItems(res.items)
    }

    const prev = () =>{
        getSearches(currentPageNumber - 1);
    }

    const next = () =>{
        getSearches(currentPageNumber + 1);
    }

    const seeDetails = (id) =>{
        navigate(`/detail/${id}`);
    }

    useEffect(()=>{
        getSearches(1);
    }, [])

    useEffect(()=>{
        // setDispItems([]);
        let newArr = items.filter(item=>{
            return item.keywordRelevance.includes(word);
        });

        setDispItems(newArr);
    }, [word])

    return (
        <DashboardPage word={word} setWord={setWord}>
            {
                isLoading ? <Loader /> : <></>
            }
            <div className="history-page">
                <div className='top-bar'>
                    <h3>Activity history</h3>
                </div>
                <div className='content'>
                    <div style={{width:"100%", marginTop:"20px"}}>
                        <div className='table-div'>
                            <table>
                                <tr className='table-head'>
                                    <th>Date</th>
                                    <th style={{textAlign:"left", paddingLeft:"10px"}}>Search</th>
                                    <th>Domains generated</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                {
                                    dispItems.map(item=><tr>
                                        <td>{item.requestDateTime}</td>
                                        <td className='search-row' onClick={()=>{seeDetails(item.searchId)}}>{item.keywordRelevance.slice(0, 97)}{item.keywordRelevance.length>97?"...":""}</td>
                                        <td><DomainGen val={item.domainCount} /></td>
                                        <td><Status stat={item.status}/></td>
                                        <td style={{cursor:"pointer"}} onClick={()=>{seeDetails(item.searchId)}}>Details</td>
                                    </tr>)
                                }
                            </table>
                        </div>
                        <div className='buton-group'>
                            <button className='before-button' onClick={()=>{prev()}} disabled={currentPageNumber===1}>{"<"}</button>
                            <button className='next-button' onClick={()=>{next()}} disabled={currentPageNumber===totalPage}>{">"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardPage>
    )
}

export default HistoryPage