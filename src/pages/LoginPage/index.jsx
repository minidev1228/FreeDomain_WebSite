import React, {useState, useRef, useEffect} from "react";
import { useNavigate, NavLink } from "react-router-dom";

import useOutsideClick from '../../hooks/useOutsideClick';

import "./index.css"

import Button1 from "../../components/button1"
import SuccessModal from "../../components/SuccessModal"
import Loader from "../../components/Loader";

import LogoImg from "../../resources/Logo.png"
import menuImg from "../../resources/menu.png"
import linkdenImg from "../../resources/social-logos/linkedin.png"
import facebookImg from "../../resources/social-logos/facebook.png"
import twitterImg from "../../resources/social-logos/twitter.png"
import youtubeImg from "../../resources/social-logos/youtube.png"
import instagramImg from "../../resources/social-logos/instagram.png"
import footerLogoImg from "../../resources/footer_Logo.png"
import gasiImg from "../../resources/gasi.png"

import {sendMyEmail, validateOTP, getPlan} from "../../apis/LoginPageAPI";

const LoginPage = () =>{

    const ref = useRef(null);
    const navigate = useNavigate();

    useOutsideClick(ref, () => { setIsModalOpen(false) });

    const [selectedButton, setSelectedButton] = useState("home");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [remainingTime, setRemainingTime] = useState(150); 
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isCodeCompleted, setIsCodeCompleted] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pinId, setPinId] = useState("");
    const [errorContent, setErrorContent] = useState("");
    const [isErrorShown, setIsErrorShown] = useState(false);
    const [isFromDashboard, setIsFromDashboard] = useState(false);

    const updateCod = (id, value) =>{
        setCode(code.map((val, idd)=>idd===id?value:val));
    }

    useEffect(()=>{
        if (code.includes("")){
            setIsCodeCompleted(false);
        } else{
            setIsCodeCompleted(true);
        }
    }, [code])

    const confirmEmail = async() =>{
        if(email === "") return;
        setIsLoading(true);
        let keywords = sessionStorage.getItem("keywords");
        let rlt = await sendMyEmail(email, keywords);
        console.log(rlt.data);
        setPinId(rlt.data.requestId);
        setIsLoading(false);
        setIsCodeSent(true);
        startTimer();
    }

    const goToPlans = () =>{
        navigate("/plans");
    }

    const confirmedEmail = () =>{
        setIsSuccessModalOpen(false);
        goToPlans();
    }

    const startTimer = () =>{
        setIsErrorShown(false);
        setRemainingTime(150);
    }

    useEffect(()=>{
        if(remainingTime <= 0){
            setRemainingTime(0);
            setErrorContent("Your time expired please make a new request                         on the 'Resend PIN' button");
            setIsErrorShown(true);
            return;
        }
        let tm = setInterval(() => {
            setRemainingTime(remainingTime - 1);
        }, 1000);

        return () => clearInterval(tm);
    }, [remainingTime])

    useEffect(()=>{
        let fromDashboard = localStorage.getItem("is_from_dashboard");
        console.log(fromDashboard);
        if(fromDashboard === "yes"){
            setIsFromDashboard(true);
        } else{
            setIsFromDashboard(false);
        }
    }, [])

    const confirmCode = async () =>{
        if(remainingTime === 0) return;
        let codeToSend = "";
        setIsErrorShown(false);
        for(let i = 0; i < code.length;i++){
            codeToSend = `${codeToSend}${code[i]}`;
        }
        console.log(codeToSend);
        setIsLoading(true);
        let rlt = await validateOTP(pinId, codeToSend)
        console.log(rlt);
        if(rlt.success){
            let planInfo = await getPlan(email);
            console.log(planInfo);
            sessionStorage.setItem("isloged", "yes");
            sessionStorage.setItem("mail", email);
            if(planInfo?.success){
                if(planInfo?.plan?.plan || email === 'mightybluedev@gmail.com'){
                    sessionStorage.setItem("is_member", "yes");
                    navigate("/my-dashboard");
                } else{
                    sessionStorage.setItem("is_member", "no");
                    let path = sessionStorage.getItem("next_path");
                    navigate(path);
                }
                setIsLoading(false);
            }
        } else{
            setCode(['', '', '', '', '', '']);
            setErrorContent("Invalid OTP, Send valid OTP!");
            setIsErrorShown(true);
            setIsLoading(false);
        }
    }

    const onKeyDownHandler = (e) =>{
        let currentId = e.target.id;
        let num = Number(currentId[3]);
        if(num === 6 && (e.code === "Enter" || e.code === "NumpadEnter")){
            confirmCode();
            return;
        }
        if(e.code === "Backspace"){
            num = num - 1;
            if(num < 1) return;
            let newId = `pin${num}`;
            setTimeout(() => {
                document.getElementById(newId).focus();
            }, 200);
        }
        if((e.code[0] === "D" && e.code[1] === "i") || (e.code[0] === "N" && e.code[1] === "u")){
            num = num + 1;
            if(num>6) return;
            let newId = `pin${num}`;
            setTimeout(() => {
                document.getElementById(newId).focus();
            }, 200);
        }
        if(e.ctrlKey && e.code === "KeyV"){
            navigator.clipboard.readText()
            .then(cliptext=>{
                setCode([cliptext[0], cliptext[1], cliptext[2], cliptext[3], cliptext[4], cliptext[5]]);
            })
            document.getElementById("pin6").focus();
        }
    }

    return (
        <div className="login-page">
            {
                isSuccessModalOpen ? <SuccessModal closeModal = {()=>{confirmedEmail()}} title = {"Your registration has been successful"} content={"Now you must opt for a plan to access your customer panel and continue enjoying our service."} button_txt={"See plans"}/> : <></>
            }
            {
                isLoading ? <Loader /> : <></>
            }
            <div className="side-bar-modal" style={{ visibility: isModalOpen ? "visible" : "hidden" }}>
                <div className="side-bar" ref={ref}>
                    <img src={LogoImg} alt="" style={{ width: "175px", cursor:"pointer" }} onClick={()=>{navigate("/")}} />
                    <ul>
                        <li>
                            <a href="#home" className={selectedButton === "home" ? "selected" : ""} onClick={() => { setSelectedButton("home") }}>Home</a>
                        </li>
                        <li>
                            <a href="#feature" className={selectedButton === "feature" ? "selected" : ""} onClick={() => { setSelectedButton("feature") }}>Features</a>
                        </li>
                        <li>
                            <a href="#academy" className={selectedButton === "academy" ? "selected" : ""} onClick={() => { setSelectedButton("academy") }}>Domain Academy</a>
                        </li>
                        <li>
                            <a href="#plans" className={selectedButton === "plans" ? "selected" : ""} onClick={() => { setSelectedButton("plans") }}>Plans</a>
                        </li>
                        <li>
                            <Button1 content={"Dashboard"} />
                        </li>
                    </ul>
                </div>
            </div>
            <div className="home-page-header">
                <img src={LogoImg} alt="" style={{ width: "175px", cursor:"pointer" }} onClick={()=>{navigate("/")}}/>
                <div style={{ flexGrow: "1" }}>&nbsp;</div>
                <ul>
                    <li>
                        <a href="#home" className={selectedButton === "home" ? "selected" : ""} onClick={() => { setSelectedButton("home") }}>Home</a>
                    </li>
                    <li>
                        <a href="#feature" className={selectedButton === "feature" ? "selected" : ""} onClick={() => { setSelectedButton("feature") }}>Features</a>
                    </li>
                    <li>
                        <a href="#academy" className={selectedButton === "academy" ? "selected" : ""} onClick={() => { setSelectedButton("academy") }}>Domain Academy</a>
                    </li>
                    <li>
                        <a href="#plans" className={selectedButton === "plans" ? "selected" : ""} onClick={() => { setSelectedButton("plans") }}>Plans</a>
                    </li>
                    <li>
                        <Button1 content={"Dashboard"} />
                    </li>
                </ul>
                <button className="icon-but" onClick={() => { setIsModalOpen(true) }}>
                    <img src={menuImg} alt="" width={"20px"} />
                </button>
            </div>
            <div className="login-page-body">
                <NavLink to={"/"} style={{ position: "absolute",top: "86px",left: "20px",color: "#2c64fe"}}>{"< Back"}</NavLink>
                <div className="login-page-body-left">
                    {
                        !isCodeSent?<div className="login-page-email-form">
                        {!!isFromDashboard?<h5>One Step Away from Unlocking Your Dashboard!</h5>:<h5>Hello! This is only one small step left.</h5>}
                        {!!isFromDashboard?<p>Enter your email below to get into your dashboard</p>:<p>Enter your email address below to see your search results.</p>}
                        {!!isFromDashboard?<></>:<h6>We promise it's worth it!' So I do.</h6>}
                        <div>
                            <div className="input-css">
                                <label for="email">Email</label>
                                <input type="text" id="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} name="email" placeholder="example@example.com" />
                            </div>
                            <button onClick={confirmEmail}>Confirm</button>
                        </div>
                    </div>:<div className="login-page-code-form">
                        <h5>We've sent a 6-digit OTP to: </h5>
                        <h3>{email}</h3>
                        <p style={{marginTop:"0px", marginBottom:"50px"}}>to verify your identity. Please enter the passcode below to log in.</p>
                        <div>
                            <div>
                                <div className="time-line">
                                    <div style={{flexGrow:"1"}}>&nbsp;</div>
                                    <div><img src="https://img.icons8.com/?size=100&id=113106&format=png&color=345bec" style={{width:"20px", marginTop:"3px", marginRight:"4px"}} alt="" /> <p> Time: <span style={{color:"#0084fe"}}>0{Math.floor(remainingTime/60)}:{Math.floor((remainingTime%60)/10)}{Math.floor((remainingTime%60)%10)}</span></p></div>
                                </div>
                                <div className="enter-pin-field">
                                    <p>Enter PIN</p>
                                    <div className="code-input">
                                        <input type="text" id="pin1" maxLength={1} value={code[0]} onChange={(e)=>{updateCod(0, e.target.value)}} onKeyDown={onKeyDownHandler} />
                                        <input type="text" id="pin2" maxLength={1} value={code[1]} onChange={(e)=>{updateCod(1, e.target.value)}} onKeyDown={onKeyDownHandler}/>
                                        <input type="text" id="pin3" maxLength={1} value={code[2]} onChange={(e)=>{updateCod(2, e.target.value)}} onKeyDown={onKeyDownHandler}/>
                                        <input type="text" id="pin4" maxLength={1} value={code[3]} onChange={(e)=>{updateCod(3, e.target.value)}} onKeyDown={onKeyDownHandler}/>
                                        <input type="text" id="pin5" maxLength={1} value={code[4]} onChange={(e)=>{updateCod(4, e.target.value)}} onKeyDown={onKeyDownHandler}/>
                                        <input type="text" id="pin6" maxLength={1} value={code[5]} onChange={(e)=>{updateCod(5, e.target.value)}} onKeyDown={onKeyDownHandler}/>
                                    </div>
                                </div>
                            </div>
                            <button disabled={!isCodeCompleted} style={{backgroundColor:isCodeCompleted?"#2c64fe":"gray"}} onClick={confirmCode}>Confirm</button>
                            <div className="options">
                                <a onClick={()=>{setIsCodeSent(false)}}>Use another email</a>
                                <a onClick={()=>{confirmEmail()}}>Resend PIN</a>
                            </div>
                            {
                                !isErrorShown ? <></> : <p style={{color:"#e03352", textAlign:"center"}}>
                                {errorContent}
                                </p>
                            }
                        </div>
                    </div>
                    }
                </div>
                <div className="login-page-body-right">
                    <img src={gasiImg} alt="" />
                </div>
            </div>
            <div className="landing-footer">
                <img src={footerLogoImg} alt="" />
                <p>CompanyName @ 202X. All rights reserved.</p>
                <div>
                    <img src={youtubeImg} alt="" />
                    <img src={facebookImg} alt="" />
                    <img src={twitterImg} alt="" />
                    <img src={instagramImg} alt="" />
                    <img src={linkdenImg} alt="" />
                </div>
            </div>
        </div>
    )
}

export default LoginPage