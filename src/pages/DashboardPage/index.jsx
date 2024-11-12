import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getSearchsByEmail } from "../../apis/DashboardAPI";

import "./index.css"

import menuImg from "../../resources/menu.png"
import AwardImg from "../../resources/dashboard_icons/Award.png"
import historyImg from "../../resources/dashboard_icons/History.png"
import homeImg from "../../resources/dashboard_icons/home.png"
import sparkImg from "../../resources/dashboard_icons/Sparkles.png"
import LogoImg from "../../resources/Logo.png"
import profileImg from "../../resources/profile.png"
import signOutImg from "../../resources/sign-out.png"

import { getPlan } from "../../apis/LoginPageAPI";

const DashboardPage = ({children, word, setWord}) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedItem, setSelectedItem] = useState("home");
    const [isSideBarHidden, setIsSideBarHidden] = useState(false);
    const [leftDays, setLeftDays] = useState(0);
    const [leftHours, setLeftHours] = useState(0);
    const [email, setEmail] = useState("");
    const [countOfnew, setCountOfnew] = useState(0);

    const displayPlan = async() =>{
        let email = sessionStorage.getItem("mail");
        let planInfo = await getPlan(email);
        if(planInfo?.success){
            setLeftDays(Number(planInfo?.plan?.remainingDays));
            setLeftHours(Number(planInfo?.plan?.remainingHours));
            setEmail(email);
        }
    }

    useEffect(()=>{
        let isLoged = sessionStorage.getItem("isloged");
        let isMember = sessionStorage.getItem("is_member");
        if(isLoged !== "yes" || isMember !== "yes"){
            navigate("/");
        }
        displayPlan();
    }, [])

    useEffect(()=>{
        if (0 < window.innerWidth && window.innerWidth < 600) {
            setIsSideBarHidden(true);
        }
    }, []);

    useEffect(()=>{
        // Prompt confirmation when reload page is triggered
        // window.onbeforeunload = () => { return "" };
            
        // Unmount the window.onbeforeunload event
        return () => { window.onbeforeunload = null };
    }, [])

    useEffect(()=>{
        const run = async() =>{
            let mail = sessionStorage.getItem("mail");
            console.log(mail);
            let datas = await getSearchsByEmail(mail, 1, false);
            console.log(datas);
            setCountOfnew(datas.totalNewRecords);
        }

        run();
    }, [])

    return (
        <div className="dashboard-page">
            <div className="side-bar" style={{display:isSideBarHidden?"none":"block"}}>
                <button className="sid-close-button" onClick={()=>{setIsSideBarHidden(true)}}>
                    <img src="https://img.icons8.com/?size=100&id=71200&format=png&color=1A1A1A" alt="" />
                </button>
                <img src={LogoImg} alt="" style={{ width: "175px", cursor:"pointer" }} onClick={()=>{navigate("/my-dashboard")}} />
                <div className="profile-info">
                    <img src={profileImg} alt="" />
                    <h6>{email}</h6>
                </div>
                <ul>
                    <li className={location.pathname === "/my-dashboard" ? "selected-item" : ""}>
                        <NavLink to='/my-dashboard'><img src={homeImg} alt="" /><p>My Dashboard</p></NavLink>
                    </li>
                    <li className={location.pathname === "/new-search" ? "selected-item" : ""}>
                        <NavLink to='/new-search'><img src={sparkImg} alt="" /><p>New search with Ai</p></NavLink>
                    </li>
                    <li className={location.pathname === "/history" ? "selected-item" : ""}>
                        <NavLink to='/history'><img src={historyImg} alt="" /><p>Activity history</p></NavLink>
                    </li>
                    <li className={location.pathname === "/dashboard-pricing" ? "selected-item" : ""}>
                        <NavLink to='/dashboard-pricing'><img src={AwardImg} alt="" /><p>Our pricing plan</p></NavLink>
                    </li>
                </ul>
                <div>&nbsp;</div>
                <div className="side-bar-bottom">
                    <div className="play-display">
                        <h4>Monthly Plan</h4>
                        <hr />
                        <p>Remaining Time:</p>
                        <div className="during-display">                            
                            <div><h4>{Math.floor(leftDays / 10)}{Math.floor(leftDays % 10)}</h4><p>days</p></div>
                            <div><h4>{Math.floor(leftHours / 10)}{Math.floor(leftHours % 10)}</h4><p>hours</p></div>
                        </div>
                        <button onClick={()=>{navigate("/dashboard-pricing")}}>Update Now</button>
                    </div>
                    <button style={{display:"flex", justifyContent:"flex-start", alignItems:"center", paddingLeft:"20px", cursor:"pointer"}} onClick={()=>{sessionStorage.setItem("isloged", "no");sessionStorage.setItem("mail", "");navigate("/");}}>
                        <img src={signOutImg} style={{marginRight:"10px"}} alt="" />    
                        Log out
                    </button>
                </div>
            </div>
            <div className="main-content">
                <div className="main-contend-top-bar">
                    <button><img src={menuImg} alt="" onClick={()=>{setIsSideBarHidden(!isSideBarHidden)}} /></button>
                    <div>
                        <div className="tool-bar">
                            <input type="text" name="" id="" style={{width:"30vw", border:"1px solid #00000038"}} value={word} onChange={(e)=>{setWord(e.target.value)}} />
                            <span>
                                <p>{countOfnew}</p>
                            </span>
                            <img src="https://img.icons8.com/?size=100&id=7695&format=png&color=1A1A1A" alt="" />
                            <img src="https://img.icons8.com/?size=100&id=646&format=png&color=1A1A1A" alt="" />
                            <img onClick={()=>{navigate("/my-dashboard")}} src="https://img.icons8.com/?size=100&id=nY7Q73ERmlBS&format=png&color=1A1A1A" alt="" />
                        </div>
                        <div className="profile-info">
                            <img src={profileImg} alt="" />
                            <h6>{email}</h6>
                        </div>
                    </div>
                </div>
                <div style={{height:"calc(100% - 50px)"}}>
                {children}
                </div>
            </div>
        </div>
    )
}

export default DashboardPage