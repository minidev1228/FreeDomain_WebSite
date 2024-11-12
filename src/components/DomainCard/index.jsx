import React, { useState } from "react";

import "./index.css"

import ClockImg from "../../resources/clock.png"
import BoxImg from "../../resources/box.png"
import OpenBoxImg from "../../resources/box-open.png"

const DomainCard = ({stats, date, content, count, archive, view}) =>{
    const ThreedotImg = "https://img.icons8.com/?size=100&id=TlUTqrW6HXXE&format=png&color=a4a4a4";

    const [isDroped, setIsDroped] = useState(false);

    return (
        <div className="doain-card">
            {
                isDroped?<div className="domain-button-card">
                <button onClick={()=>{setIsDroped(false);view();}} disabled={stats === 0}>View</button>
                <button onClick={()=>{setIsDroped(false);archive();}}>Archive</button>
            </div>:<></>
            }
            <div className="domain-card-header">
                <div className="clock-div" style={{backgroundColor:stats===0?"#ebeffd":stats===1?"#e6f8ed":"#fff4e8"}}>
                    <img src={stats===0?ClockImg:stats===1?BoxImg:OpenBoxImg} alt="" />
                </div>
                <div className="state-div" style={{borderColor:stats===0?"#a2b4f6":stats===1?"#8ae0ae":"#fdca94", color:stats===0?"#345bec":stats===1?"#277e4c":"#8a4d0c", backgroundColor:stats===0?"#ebeffd":stats===1?"#daebe0":"#fff4e8"}}>
                    <p>{stats === 0?"In progress":stats === 1?"New":"Reviewed"}</p>
                </div>
                <div style={{flexGrow:1}}>
                </div>
                <div style={{color:"#7b7b7b", marginRight:"10px"}}>
                    <p style={{fontSize:"12px"}}>{date}</p>
                </div>
                <img src={ThreedotImg} style={{cursor:"pointer"}} onClick={()=>{setIsDroped(!isDroped)}} alt="" />
            </div>
            <div className="domain-card-body">
                <p style={{fontSize:"13px"}}>
                    {content.slice(0,97)} 
                    {content.length>97?"...":""}
                </p>
            </div>
            {
                stats === 0?<div className="domain-card-footer"><p>Your search is currently in Progress</p></div> : <div className="domain-card-footer">
                    <p>Your search results</p>
                    <span style={{backgroundColor:stats===1?"#00bc4f":"#fa8c16", fontSize:"13px"}}>{count}</span>
                </div>
            }
        </div>
    )
}

export default DomainCard