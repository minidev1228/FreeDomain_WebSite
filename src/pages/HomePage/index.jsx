import React, { useState, useRef, useEffect, useTransition } from "react";
import { Link, animateScroll as scroll } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import * as signalR from '@microsoft/signalr'

import useOutsideClick from '../../hooks/useOutsideClick';

import "./index.css"

import LogoImg from "../../resources/Logo.png"
import menuImg from "../../resources/menu.png"
import gasiImg from "../../resources/gasi.png"
import starImg from "../../resources/star.png"
import videoImg from "../../resources/video.png"
import aboutImg from "../../resources/About.png"
import videoImg1 from "../../resources/video-m.png"
import aboutImg1 from "../../resources/About-M.png"
import frame1Img from "../../resources/frame1.png"
import frame2Img from "../../resources/frame2.png"
import frame3Img from "../../resources/frame3.png"
import benefitImg from "../../resources/Benefits.png"
import benefitImg1 from "../../resources/Benefits1.png"
import academyImg from "../../resources/Academy.png"
import academyImg1 from "../../resources/Academy1.png"
import needhelpImg from "../../resources/needhelp.png"

import markImg from "../../resources/mark.png"
import windowIcon1 from "../../resources/button_icons/window1.png"
import filterIcon1 from "../../resources/button_icons/filter1.png"
import historyIcon1 from "../../resources/button_icons/history1.png"
import windowIcon2 from "../../resources/button_icons/window2.png"
import filterIcon2 from "../../resources/button_icons/filter2.png"
import historyIcon2 from "../../resources/button_icons/history2.png"
import haveaccessImg from "../../resources/have_access.png"
import wallofloveImg from "../../resources/walloflove.png"

import linkdenImg from "../../resources/social-logos/linkedin.png"
import facebookImg from "../../resources/social-logos/facebook.png"
import twitterImg from "../../resources/social-logos/twitter.png"
import youtubeImg from "../../resources/social-logos/youtube.png"
import instagramImg from "../../resources/social-logos/instagram.png"
import footerLogoImg from "../../resources/footer_Logo.png"


import Button1 from "../../components/button1"
import SlideButton from "../../components/slideButton"
import MemberShipCard from "../../components/memberShipCard"
import ProfileCard from "../../components/profileCard"
import Loader from "../../components/Loader";
import FilterInput from "../../components/FilterInput"
import SuccessModal from "../../components/SuccessModal";
import MySelect from "../../components/MySelect"

import {getFilterDatas, createSearchId , getSingleDomain, getLeftCountByEmail, getSearchCountByEmail } from "../../apis/HomePageAPI"
import sendEmail from "../../utils/sendEmail";
import { getPlan } from "../../apis/LoginPageAPI";


const HomePage = () => {
    const planRef = useRef<HTMLElement | null>(null);
    let { to } = useParams();

    const [isLoading, setIsLoading] = useState(false);  
    const [filters, setFilters] = useState([])
    const [checkBoxs, setCheckBoxs] = useState([]);
    const [keywords, setKeywords] = useState("");

    const [rationale, setRationale] = useState("");
    const [domainName, setDomainName] = useState("");
    const [advantages, setAdvantages] = useState([]);
    const [disAdvantages, setDisAdvantages] = useState([]);

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [countInfo, setCountInfo] = useState({});
    
    const [SMContent, setSMContent] = useState("");
    const [SMTitle, setSMTitle] = useState("");
    const [SMButtonLabel, setSMButtonLabel] = useState("");
    const [SMaction, setSMaction] = useState(0);
    const [SMtype, setSMtype] = useState("");

    const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://api.freedomainbot.com/searchHub",{
                transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling ,   
                skipNegotiation: false, // Ensure negotiation is not skipped
                // transport: signalR.HttpTransportType.WebSockets,
                withCredentials: false
            }).withAutomaticReconnect().build();


    // useEffect(()=>{
    //     if (newConnection) {
    //         newConnection.start().then(()=>{
    //             newConnection.on('ReceiveConnectionId', (id) => {
    //                 console.log('Received Connection ID:', id);
    //                 // setConnectionId(id); // Store the connection ID in state
    //             });
    //         })

    //         // return () => newConnection.off('ReceiveConnectionId'); // Clean up listener
    //     }
    // }, [newConnection])

    const generateDomain = (searchId) =>{
        // console.log(searchId)
        setIsLoading(true);
        // console.log("Before start");
        newConnection.start().then(()=>{
            // console.log("Connected !");
            setIsLoading(true);
            newConnection.invoke("JoinSearchGroup", searchId);
            newConnection.on("ReceiveSearchUpdate", async(ssearchId, status, message) => {
                // console.log("isSentToGenerate", isSentToGenerate);
                // if(!isSentToGenerate) return;
                if(status.status === 3){
                    newConnection.off('ReceiveSearchUpdate');
                    newConnection.stop().then(()=>{
                        setSMContent(`Hmm, it looks like we couldn’t find a domain name based on your input. Try to describe your brand or idea, adding more context will help us suggest better names!`)
                        setSMButtonLabel("Ok");
                        setSMaction(0);
                        setSMTitle("Sorry");
                        setSMtype("announce");
                        setIsSuccessModalOpen(true);
                        setIsLoading(false);
                        return;
                    })
                } else if(status.status === 1){
                    newConnection.off('ReceiveSearchUpdate');
                    if(isTimeOuted) return;
                    setIsTimeOuted(true);
                    let res = await getSingleDomain(ssearchId);
                    if(res.domains[0] === undefined) return;
                    setDomainName(res.domains[0].name);
                    setRationale(res.domains[0].rationale);
                    setAdvantages(res.domains[0].advantages);
                    setDisAdvantages(res.domains[0].disadvantages);
                    sessionStorage.setItem("is_generated", "yes");
                    sessionStorage.setItem("keywords", "");
                    setIsSentToGenerate(false);
                    newConnection.invoke("LeaveSearchGroup", searchId) 
                    // console.log("loading stop");
                    // newConnection.stop().then(()=>{
                        setIsLoading(false);
                        setIsDomainsShown(true);
                    // });
                } else{
                    console.log("Waiting...");
                }
            });
        }).catch(
            e=>{
                // console.log("Connection failed: ", e)
                setIsLoading(true);
            }
        );
    }

    useEffect(()=>{
        const run = async() =>{
            setIsLoading(true)
            let datas = await getFilterDatas();
            // console.log(datas);
            setIsLoading(false)
            if(datas !== undefined){
                setFilters(datas);
                // await setFilters(datas?.filter(data => data.filterTypeText !== "Checkboxes"));
                // await setCheckBoxs(datas?.filter(data => data.filterTypeText === "Checkboxes"));
            }
        }

        run();
    }, [])

    const goToPlan = () =>{
        document.querySelector('#plans').scrollIntoView();
        setIsSuccessModalOpen(false);
    }

    const ref = useRef(null);
    const navigate = useNavigate();

    const [selectedButton, setSelectedButton] = useState("home");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [section1Img, setSection1Img] = useState("");
    const [section2Img, setSection2Img] = useState("");
    const [section3Img, setSection3Img] = useState("");
    const [section4Img, setSection4Img] = useState("");
    const [isDomainsShown, setIsDomainsShown] = useState(false);
    const [isTimeOuted, setIsTimeOuted] = useState(false);


    useOutsideClick(ref, () => { setIsModalOpen(false) });

    const [isMobImgShown, setIsMobImgShown] = useState(false);

    useEffect(() => {
        if (0 < window.innerWidth && window.innerWidth < 600) {
          setSection1Img(videoImg1); 
          setSection2Img(aboutImg1);
          setSection3Img(benefitImg1);
          setSection4Img(academyImg1);
          setIsMobImgShown(true);
        } else{
            setSection1Img(videoImg);
            setSection2Img(aboutImg);
            setSection3Img(benefitImg);
            setSection4Img(academyImg);
            setIsMobImgShown(false);
        }
      }, [window.innerWidth]);

      useEffect(()=>{
        const run = async() => {
            let email = localStorage.getItem("mail");
            if(email === null) return;
            let planInfo = await getPlan(email);
            if(planInfo?.success){
                if(planInfo?.plan?.plan !== null){
                    sessionStorage.setItem("is_member", "yes");
                    sessionStorage.setItem("isloged", "yes");
                    sessionStorage.setItem("mail", email);
                    navigate("/my-dashboard");
                }
            }
        }

        run();
      }, [])

      useEffect(()=>{
        setTimeout(() => {
            const slidesContainer = document.getElementById("slides-container");
            const slide = document.querySelector(".slide");
            if(slide === null) return;
            const slideWidth = slide.clientWidth;
            let direction = 1;
            let current = 0;
            setInterval(()=>{
                slidesContainer.scrollLeft = current;
                if(slideWidth * 3 === current && direction === 1 ) direction = -1; 
                if(current === 0 && direction === -1)  direction = 1;
                current += slideWidth * direction;
            }, 3000);
        }, 3000);
      }, [])

      useEffect(()=>{
        const run = async () =>{
            let mail = sessionStorage.getItem("mail");
            if(mail === null) return;
            if(mail?.length > 0){
                let countinfo = await getSearchCountByEmail(mail);
                setCountInfo(countinfo);
            }
        }

        run();
      }, []);

      useEffect(()=>{
        let run = async() =>{
            let words = sessionStorage.getItem("keywords");
            if(!words?.trim()?.length){
                return;
            }
            let isGenerated = sessionStorage.getItem("is_generated");
            if(isGenerated === "yes") return;
            let isLoged = sessionStorage.getItem("isloged");
            if(isLoged === "yes"){
                let mail = sessionStorage.getItem("mail");
                // let count = await getLeftCountByEmail(mail);
                setKeywords(words);
                // if(!count) return;
                generateDomains();
            }
        }

        run();
      }, [])

      const [isSentToGenerate, setIsSentToGenerate] = useState(false);

      const generateDomains = async()=>{
            setIsSentToGenerate(()=>true);
            setIsLoading(true);
            let mail = sessionStorage.getItem("mail");
            let count = await getLeftCountByEmail(mail);
            if(!count){
                setSMContent(`It looks like you’ve unlocked your first domain recommendation! To see all our suggestions, run more searches, and use advanced filters, you’ll need an active plan. No pressure—just pick the plan that works for you and start exploring!`)
                setSMButtonLabel("View Plans");
                setSMaction(1);
                setSMTitle("Hey there! Ready to Explore More?");
                setSMtype("announce");
                setIsSuccessModalOpen(true);
                setIsLoading(false);
                setIsSentToGenerate(false);
                return;
            }
            let kwords = sessionStorage.getItem("keywords");
            let {rlt, status} = await createSearchId(mail, kwords, "");
            if(status === 200){
                let searchId = rlt.data;
                setIsSentToGenerate(()=>true);
                generateDomain(searchId);
            } else{
                alert("InterNal server");
                setIsLoading(false);
            }
      }

      const collapseFilters = () =>{
        let searchs = countInfo;
        if(!searchs){
            setSMContent(`You haven’t run your first search yet! Try your free search to see what we can find. You can unlock premium filters once you’re ready to dive deeper.`)
            setSMButtonLabel("Got It");
            setSMaction(0);
            setSMTitle("Hold On, Let’s Get Started First!");
            setSMtype("announce");
            setIsSuccessModalOpen(true);
        } else{
            if (0 < window.innerWidth && window.innerWidth < 600) {
                if(!isCollapsed){
                    setIsMobImgShown(false);
                } else{
                    setIsMobImgShown(true);
                }
            }
            setIsCollapsed(!isCollapsed);
        }
      }

      const sendMyEmail = async(email, name, message) =>{
            setEmail('');
            setName('');
            setMessage('');
            setIsLoading(true);
            setSMContent(`🎉 Thank you, ${name}! Your message has been sent successfully. We appreciate you reaching out and will get back to you as soon as possible. If you have any additional questions, feel free to send another message. Have a great day! 😊`)
            setSMButtonLabel("Ok");
            setSMaction(0);
            setSMTitle("Success");
            setSMtype("success");           
            await sendEmail(email, name, message);
            setIsSuccessModalOpen(true);
            setIsLoading(false);
      }

      const unlockFilters = () =>{
        setSMContent(`You haven’t run your first search yet! Try your free search to see what we can find. You can unlock premium filters once you’re ready to dive deeper.`)
        setSMButtonLabel("Got it");
        setSMaction(0);
        setSMTitle("Hold On, Let’s Get Started First!");
        setSMtype("announce");
        setIsSuccessModalOpen(true);
      }

      const goToEmailVerificaion = async() =>{
        if(!keywords.trim().length){
            setSMContent(`Please enter some keywords to help us find the perfect domain for you!`)
            setSMButtonLabel("Ok");
            setSMaction(0);
            setSMTitle("Oops! Looks like we need a little more to go on");
            setSMtype("error");
            setIsSuccessModalOpen(true);
            return;
        }
        setIsLoading(true);
        let isLogined = sessionStorage.getItem("isloged");
        sessionStorage.setItem("keywords", keywords);
        if(isLogined !== "yes"){
            localStorage.setItem("is_from_dashboard", "no")
            sessionStorage.setItem("is_generated", "no");
            sessionStorage.setItem("next_path", "/");
            navigate("/login");
            setIsLoading(false);
        } else{
            setIsDomainsShown(false);
            setIsTimeOuted(false);
            setTimeout(() => {
                setIsTimeOuted(true);
                sessionStorage.setItem("keywords", "");
                setIsLoading(false);
                setSMContent(`Hmm, it looks like we couldn’t find a domain name based on your input. Try to describe your brand or idea, adding more context will help us suggest better names!`)
                setSMButtonLabel("Ok");
                setSMaction(0);
                setSMTitle("Sorry");
                setSMtype("announce");
                setIsSuccessModalOpen(true);
                setIsLoading(false);
            }, 120000);
            await generateDomains();
            setIsLoading(false);    
        }
      }

      const goToPaymentPage = async(during) =>{
        setIsLoading(true);
        let isLogined = sessionStorage.getItem("isloged");
        if(isLogined !== "yes"){
            localStorage.setItem("is_from_dashboard", "no")
            sessionStorage.setItem("next_path", `/payment/${during}`);
            navigate("/login");
            setIsLoading(false);
        } else{
            navigate(`/payment/${during}`);
            setIsLoading(false);    
        }
      }

      const goToDashboard = async () =>{
        // console.log(newConnection.connectionId);
        let isLoged = sessionStorage.getItem("isloged")
        let isMember = sessionStorage.getItem("is_member");
        if(isLoged !== "yes"){
            newConnection.stop().then(()=>{
                localStorage.setItem("is_from_dashboard", "yes");
                sessionStorage.setItem("next_path", "/");
                navigate("/login");
                return;
            });
        }
        
        if(isMember !=="yes"){
            setSMContent(`Looks like you haven’t activated a plan yet! Your dashboard will be available once you’ve got an active plan to run and track unlimited searches, and manage your recommendations. Don’t worry—it’s easy to get started!`)
            setSMButtonLabel("View Plans");
            setSMaction(1);
            setSMTitle("Oops! Let's Unlock Your Dashboard");
            setSMtype("announce");
            setIsSuccessModalOpen(true);
            return;
        }
        await newConnection.stop().then(()=>{
            navigate("/my-dashboard");
        });
      }


    return (
        <div className="home-page">
            {
                isLoading?<Loader />:<></>
            }
            {
                isSuccessModalOpen ? <SuccessModal closeModal={()=>{SMaction === 0? setIsSuccessModalOpen(false):goToPlan()}} title={SMTitle} type={SMtype} content={SMContent} button_txt={SMButtonLabel} /> : <></>
            }
            <div className="side-bar-modal" style={{ visibility: isModalOpen ? "visible" : "hidden" }}>
                <div className="side-bar" ref={ref}>
                    <img src={LogoImg} alt="" style={{ width: "175px", cursor:"pointer" }} onClick={()=>{navigate("/")}}/>
                    <ul>
                        <li>
                            <a href="#home-home" className={selectedButton === "home" ? "selected" : ""} onClick={() => { setSelectedButton("home") }}>Home</a>
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
                            <Button1 content={"Dashboard"} handlerOnClick={goToDashboard} />
                        </li>
                    </ul>
                </div>
            </div>
            <div className="home-page-header">
                <img src={LogoImg} alt="" style={{ width: "175px" , cursor:"pointer"}} onClick={()=>{navigate("/")}} />
                <div style={{ flexGrow: "1" }}>&nbsp;</div>
                <ul>
                    <li>
                        <Link to="home-home" spy={true} smooth={true} duration={500} className={selectedButton === "home" ? "selected" : ""} onClick={() => { setSelectedButton("home") }}>Home</Link>
                    </li>
                    <li>
                        <Link to="feature" spy={true} smooth={true} duration={500} className={selectedButton === "feature" ? "selected" : ""} onClick={() => { setSelectedButton("feature") }}>Features</Link>
                    </li>
                    <li>
                        <Link to="academy" spy={true} smooth={true} duration={500} className={selectedButton === "academy" ? "selected" : ""} onClick={() => { setSelectedButton("academy") }}>Domain Academy</Link>
                    </li>
                    <li>
                        <Link to="plans" spy={true} smooth={true} duration={500} className={selectedButton === "plans" ? "selected" : ""} onClick={() => { setSelectedButton("plans") }}>Plans</Link>
                        
                    </li>
                    <li>
                        <Button1 content={"Dashboard"} handlerOnClick={goToDashboard}/>
                    </li>
                </ul>
                <button className="icon-but" onClick={() => { setIsModalOpen(true) }}>
                    <img src={menuImg} alt="" width={"20px"} />
                </button>
            </div>
            <div className="home-home" id="home-home">
                <div className="home-home-left">
                    <img src={starImg} alt="" className="star-size-1" style={{ top: "108px", left: "37%" }} />
                    <img src={starImg} alt="" className="star-size-2" style={{ top: "135px", left: "41%" }} />
                    <img src={starImg} alt="" className="star-size-2" style={{ top: "162px", left: "51%" }} />
                    <img src={starImg} alt="" className="star-size-2" style={{ top: "120px", left: "30%" }} />
                    <img src={starImg} alt="" className="star-size-2" style={{ top: "130px", left: "20%" }} />
                    <img src={starImg} alt="" className="star-size-2" style={{ top: "150px", left: "10%" }} />
                    <h5>Unleash the power of AI to instantly find <span style={{ color: "#176cfd" }}>your perfect domain in just a few clicks.</span></h5>
                    <p>Needle Your Way Through the Web’s Haystack to Find a Great Domain</p>
                    <img src={gasiImg} alt="" id="mob-img" style={{display:isMobImgShown?"block":"none"}} />
                    <div className="home-home-form">
                        <textarea placeholder="Enter 20 keywords" rows="4" cols="60" value={keywords} onChange={(e)=>{setKeywords(e.target.value)}}></textarea>
                        <div className="premium" onClick={() => { collapseFilters(); }}>
                            <a>Premium filters</a>
                            <img src={isCollapsed ? "https://img.icons8.com/?size=100&id=2760&format=png&color=000000" : "https://img.icons8.com/?size=100&id=Eac574CmaOen&format=png&color=000000"} />
                        </div>
                        {
                            isCollapsed ? <div style={{display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center"}}>
                            {
                                filters?.map((filter, id)=>{

                                    if(filter.filterTypeText !== "Checkboxes") {
                                        let w = "47%";
                                        if(filter.filterColSpan === 2) w = "100%";

                                        return <div className="input-wrap" style={{width:w}}> 
                                                <FilterInput 
                                                    label={filters[id]?.filterName} 
                                                    type={filters[id]?.filterTypeText} 
                                                    key={id} refFilterValues={filters[id]?.refFilterValues} 
                                                    update={(val)=>{}}
                                                    isDisabled={true}
                                                />
                                            </div>;
                                    }
                                    else{
                                        let w = "47%";
                                        if(filter.filterColSpan === 2) w = "100%";
                                        return <div className="input-wrap" style={{width:w}}>
                                            <MySelect 
                                                name = {filter.filterName} 
                                                items={filter.refFilterValues} 
                                                update ={(val)=>{}}  
                                                isDisabled={true}
                                            />
                                        </div>;
                                    }
                                })
                            }
                            <div className="input-group1" style={{marginTop:"20px"}}>
                                <img style={{cursor:"pointer"}} onClick={()=>{unlockFilters();}} src="https://img.icons8.com/?size=100&id=60016&format=png&color=1A1A1A" alt="" style={{width: "13px", marginRight: "6px"}} />
                                <a style={{cursor:"pointer"}} onClick={()=>{unlockFilters();}}>Unlock advanced options</a>
                            </div>
                            </div> : <></>
                        }
                        <div className="input-group3">
                            <div className="left">
                                &nbsp;
                            </div>
                            <div className="right">
                                <button onClick={goToEmailVerificaion}>
                                    Generate Domain
                                </button>
                            </div>
                        </div>
                    </div>
                    {
                        isDomainsShown ? <div className="home-card-div">
                            <div>
                                <div className="home-card-div-header">
                                    <h4 style={{ marginLeft: "20px" }}>Domains generated by AI</h4>
                                </div>
                                <div className="home-card-div-showed-item">
                                    <div className="header">
                                        <h2 style={{ color: "#476aee" }}>{domainName}</h2>
                                        <img src="https://img.icons8.com/?size=100&id=2775&format=png&color=1A1A1A" alt="" style={{ width: "16px" }} />
                                    </div>
                                    <p style={{ fontSize: "13px" }}>{rationale}</p>
                                    <div className="body">
                                        <div className="body-left">
                                            <h4>Advantages</h4>
                                            {
                                                advantages.map(adv=><div>
                                                    <img src="https://img.icons8.com/?size=100&id=IAq2Sv2pQnkn&format=png&color=40C057" alt="" style={{ width: "14px", marginRight: "10px" }} />
                                                    <p style={{ fontSize: "12px" }}>{adv}</p>
                                                </div>)
                                            }
                                        </div>
                                        <div className="body-right">
                                            <h4>Disadvantages</h4>
                                            {
                                                disAdvantages.map(dis=><div>
                                                    <img src="https://img.icons8.com/?size=100&id=8112&format=png&color=FA5252" alt="" style={{ width: "14px", marginRight: "10px" }} />
                                                    <p style={{ fontSize: "12px" }}>{dis}</p>
                                                </div>)
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="home-card-div-footer">
                                    <p style={{ textAlign: "center", fontSize: "11px" }}>Get a plan to see more results</p>
                                    <img src="https://img.icons8.com/?size=100&id=40021&format=png&color=000000" style={{ width: "12px", marginLeft: "8px" }} />
                                </div>
                            </div>
                        </div> :<></>
                    }
                </div>
                <div className="home-home-right">
                    <img src={gasiImg} alt="" />
                </div>
            </div>
            <div style={{width:"100vw", marginTop:"50px"}} className="section1" id="feature">
                <img src={section1Img} alt="" style={{width:"100%", height:"50vw"}}/>
            </div>
            <div style={{width:"100vw", marginTop:"50px"}} className="section2">
                <img src={section2Img} alt="" style={{width:"100%", height:"50vw"}}/>
            </div>
            <section className="slider-wrapper" style={{fontFamily: "Arial, Helvetica, sans-serif"}}>
                <ul className="slides-container" id="slides-container">
                    <li className="slide">
                        <div className="silde-div">
                            <div className="slide-div-left">
                                <img src={frame1Img} alt="" width="100%" height="100%" />
                            </div>
                            <div className="slide-div-right">
                                <img src={markImg} alt="" style={{width: "122px"}} />
                                <h2 style={{marginBottom: "5px"}}>Some App <span style={{color: "#345bec"}}>features</span></h2>
                                <p>These tools give you the control and efficiency needed to find the perfect domain for your online project.</p>
                                <div style={{display: "flex",marginTop: "20px"}}>
                                    <SlideButton img={windowIcon1} content={"Control panel"} selected={true}/>
                                    <SlideButton img={filterIcon1} content={"Premium filters"} selected={false}/>
                                    <SlideButton img={historyIcon1} content={"Search history"} selected={false}/>
                                </div>
                                <p style={{fontSize: "12px",color: "gray"}}>
                                    Our artificial intelligence app has an intuitive and easy-to-use control panel, which allows users to perform domain searches efficiently. With a clean and organized design, users can quickly access all the app's features, view search results and manage their preferences easily.
                                </p>
                            </div>
                        </div>
                    </li>
                    <li className="slide">
                        <div className="silde-div">
                            <div className="slide-div-left">
                                <img src={frame2Img} alt="" width="100%" height="100%" />
                            </div>
                            <div className="slide-div-right">
                                <img src={markImg} alt="" style={{width: "122px"}} />
                                <h2 style={{marginBottom: "5px"}}>Some App <span style={{color: "#345bec"}}>features</span></h2>
                                <p>These tools give you the control and efficiency needed to find the perfect domain for your online project.</p>
                                <div style={{display: "flex",marginTop: "20px"}}>
                                    <SlideButton img={windowIcon2} content={"Control panel"} selected={false}/>
                                    <SlideButton img={filterIcon2} content={"Premium filters"} selected={true}/>
                                    <SlideButton img={historyIcon1} content={"Search history"} selected={false}/>
                                </div>
                                <p style={{fontSize: "12px",color: "gray"}}>
                                To offer a more personalized search experience, our AI app includes premium filters that allow users to refine their domain searches based on specific criteria. With advanced filtering options, users can segment results based on domain length, extension, availability, and other relevant parameters, giving them greater control and precision in their searches.
                                </p>
                            </div>
                        </div>
                    </li>
                    <li className="slide">
                        <div className="silde-div">
                            <div className="slide-div-left">
                                <img src={frame3Img} alt="" width="100%" height="100%" />
                            </div>
                            <div className="slide-div-right">
                                <img src={markImg} alt="" style={{width: "122px"}} />
                                <h2 style={{marginBottom: "5px"}}>Some App <span style={{color: "#345bec"}}>features</span></h2>
                                <p>These tools give you the control and efficiency needed to find the perfect domain for your online project.</p>
                                <div style={{display: "flex",marginTop: "20px"}}>
                                    <SlideButton img={windowIcon2} content={"Control panel"} selected={false}/>
                                    <SlideButton img={filterIcon1} content={"Premium filters"} selected={false}/>
                                    <SlideButton img={historyIcon2} content={"Search history"} selected={true}/>
                                </div>
                                <p style={{fontSize: "12px",color: "gray"}}>
                                Our AI application offers users the convenience of accessing a complete history of their domain searches. This feature allows users to review and remember domains they have previously researched, giving them the ability to revisit previous searches, compare results, and track their activity. Additionally, search history makes it easier for users to manage their past research, which can be useful for ongoing projects or for future references.
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
            </section>
            <div>
                <img src={section3Img} style={{width:"100vw"}} alt="" />
            </div>
            <div  id="academy">
                <img src={section4Img} alt="" style={{width:"100vw"}}/>
            </div>
            <div className="card-group-parent" id="plans">
                <img src={haveaccessImg} alt="" />
                <h5>Our pricing plan</h5>
                <p>Find the perfect domain name with the help of cutting-edge AI technology. Say goodbye to hours of searching: FreeDomainBot.com offers instantly available domain names designed exclusively for you.</p>
                <div className="card-group">
                    {/* <div> */}
                        <MemberShipCard img = {"https://img.icons8.com/?size=100&id=8rftcrgVZFN7&format=png&color=345bec"} title={"One day pass"} comment={"Unlock one day of unlimited searchs, Ideal for quick decisions"} price={"CA$ 9,00"} limit={"per user/ day"} isPopular={false} func={()=>{goToPaymentPage('day')}}/>
                        <MemberShipCard img = {"https://img.icons8.com/?size=100&id=103&format=png&color=345bec"} title={"One week pass"} comment={"Explore at your leisure with a week of unlimited searches"} price={"CA$ 24,99"} limit={"per user/ week"} isPopular={true} func={()=>{goToPaymentPage('week')}}/>
                        <MemberShipCard img = {"https://img.icons8.com/?size=100&id=V7nNJrd74MXo&format=png&color=345bec"} title={"Monthly pass"} comment={"Domains on demand for a full month for only. Perfect for ongoing projects."} price={"CA$ 49,99"} limit={"per user/ day"} isPopular={false} func={()=>{goToPaymentPage('month')}} />
                    {/* </div> */}
                </div>
            </div>
            <div className="comment-section">
                <img src={wallofloveImg} alt="" />
                <h5>What our user says</h5>
                <div className="profile-group">
                    <ProfileCard img={"https://img.icons8.com/?size=100&id=23239&format=png&color=000000"} name={"Jacob Jones"} comment={'"Amazing! This AI app made finding the perfect domain for my business a piece of cake. The premium filters allowed me to refine the search exactly how I wanted."'}/>
                    <ProfileCard img={"https://img.icons8.com/?size=100&id=23240&format=png&color=000000"} name={"Darlene Robertson"} comment={'"The control panel of this app is very easy to use, even for someone like me who is not very technical. I found the ideal domain in a matter of minutes!"'}/>
                    <ProfileCard img={"https://img.icons8.com/?size=100&id=23243&format=png&color=000000"} name={"Albert Flores"} comment={"'Search history was a feature I didn't know I needed until I used it. Now I can keep track of all the domains I've researched, saving me time and effort.'"}/>
                    <ProfileCard img={"https://img.icons8.com/?size=100&id=13042&format=png&color=000000"} name={"Arlene McCoy"} comment={'"As a digital marketing professional, the accuracy of the search results from this AI app has impressed me. I would definitely recommend it to my colleagues."'}/>
                    <ProfileCard img={"https://img.icons8.com/?size=100&id=23265&format=png&color=000000"} name={"Marvin McKinney"} comment={"Premium filters allowed me to find a domain that perfectly suited my project needs. I couldn't be happier with the results!"}/>
                    <ProfileCard img={"https://img.icons8.com/?size=100&id=23235&format=png&color=000000"} name={"Kristin Watson"} comment={"This app has completely simplified the domain search process for my startup. The dashboard is very intuitive, and the search history has helped me stay organized."}/>
                </div> 
            </div>
            <div className="contact-form-div">
                <img src={needhelpImg} alt="" />
                <h5>Contact us</h5>
                <div className="contact-form">
                    <div className="name-email-form">
                        <div className="input-css">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" placeholder="Your Name" value={name} onChange={e=>{setName(e.target.value)}} />
                        </div>
                        <div className="input-css">
                            <label htmlFor="email">Email</label>
                            <input type="text" id="email" name="email" placeholder="example@example.com" value={email} onChange={(e)=>{setEmail(e.target.value)}} />
                        </div>
                    </div>
                    <div className="text-area-css">
                        <label htmlFor="des">Description</label>
                        <textarea name="des" id="des" cols="30" rows="8" value={message} onChange={e=>{setMessage(e.target.value)}}></textarea>
                    </div>
                    <div className="footer">
                        <button onClick={()=>{
                            sendMyEmail(email, name, message)
                        }}>Send Message</button>
                    </div>
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

export default HomePage
