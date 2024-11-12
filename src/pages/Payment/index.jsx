import React, {useState, useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import useOutsideClick from '../../hooks/useOutsideClick';

import Button1 from "../../components/button1"
import Loader from "../../components/Loader";
import SuccessModal from "../../components/SuccessModal";

import "./index.css"

import LogoImg from "../../resources/Logo.png"
import menuImg from "../../resources/menu.png"
import linkdenImg from "../../resources/social-logos/linkedin.png"
import facebookImg from "../../resources/social-logos/facebook.png"
import twitterImg from "../../resources/social-logos/twitter.png"
import youtubeImg from "../../resources/social-logos/youtube.png"
import instagramImg from "../../resources/social-logos/instagram.png"
import footerLogoImg from "../../resources/footer_Logo.png"
import radioImg from "../../resources/radio.png"

import { addPlan } from "../../apis/PaymentPageAPI";

const Payment = () => {

    let { long } = useParams();

    const ref = useRef(null);
    const navigate = useNavigate();

    useOutsideClick(ref, () => { setIsModalOpen(false) });

    const [selectedButton, setSelectedButton] = useState("home");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [price, setPrice] = useState(0);
    const [title, setTitle] = useState("");
    const prices = {"month": 49.99, "week":24.99, "day":9};

// ---------- Paypal ----------------------
    
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState("");
    const [orderID, setOrderID] = useState(false);
    // creates a paypal order
    const createOrder = async (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    description: `Bought One ${long} pass card for freedomainbot`,
                    amount: {
                        currency_code: "USD",
                        value: prices[long],
                    },
                },
            ],
        }).then((orderID) => {
                setOrderID(orderID);
                return orderID;
            });
    };

    const [SMContent, setSMContent] = useState("");
    const [SMTitle, setSMTitle] = useState("");
    const [SMButtonLabel, setSMButtonLabel] = useState("");
    const [SMaction, setSMaction] = useState(0);
    const [SMtype, setSMtype] = useState("");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    // check Approval
    const onApprove = (data, actions) => {
        return actions.order.capture().then(function (details) {
            const { payer } = details;
            setSMContent(`Thank you for your payment. Your transaction has been processed successfully.

            To view the full results of your search or start new searches click the button below.`)
            setSMButtonLabel("Continue to Dashboard");
            setSMaction(0);
            setSMTitle("Payment confirmation");
            setSMtype("announce");
            setIsSuccessModalOpen(true);
            setSuccess(true);
        });
    };

    //capture likely error
    const onError = (data, actions) => {
        setErrorMessage("An Error occured with your payment ");
    };

    const getPlan = async() => {
        setIsLoading(true)
        let email = sessionStorage.getItem("mail");
        let during = long === "day" ? 1 : long === "week" ? 7 : 30;
        let res = await addPlan(email, during);
        console.log(res);
        sessionStorage.setItem("is_member", "yes");
        navigate("/my-dashboard");
        setIsLoading(false);
        return;
    }

    useEffect(() => {
        if (success) {
            getPlan();
            // alert("Payment successful!!");
            // console.log('Order successful . Your order id is--', orderID);
        }
    },[success]);


// ------- paypal ------------------
    useEffect(()=>{
        if(long === "day"){
            setPrice(9.00);
            setTitle("Daily Pass");
        } else if(long === "week"){
            setPrice(24.99);
            setTitle("Weekly Pass");
        } else if(long === "month"){
            setPrice(49.99);
            setTitle("Monthly Pass");
        } else{
            navigate("/");
        }
    }, [long])

    return (
        <div className="payment-page">
            {
                isLoading ? <Loader /> : <></>
            }
            {
                isSuccessModalOpen ? <SuccessModal closeModal={()=>{navigate("/my-dashboard")}} title={SMTitle} type={SMtype} content={SMContent} button_txt={SMButtonLabel} /> : <></>
            }
            <div className="side-bar-modal" style={{ visibility: isModalOpen ? "visible" : "hidden" }}>
                <div className="side-bar" ref={ref}>
                    <img src={LogoImg} alt="" style={{ width: "175px", cursor:"pointer" }} onClick={()=>{navigate("/")}}/>
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
                <img src={LogoImg} alt="" style={{ width: "175px" , cursor:"pointer"}} onClick={()=>{navigate("/")}} />
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
            <div className="payment-page-body">
                <div>  
                    <h3>Check payment details</h3>
                    <div className="monthly-div">
                        <img src={radioImg} alt="" />
                        <h6>{title}</h6>
                    </div>
                    <div className="row">
                        <p>Dominion bajo demanda during one full month. Perfectly prepare projects in progress.</p>
                        <h5>CA$ {price}</h5>
                    </div>
                    {/* <div className="row">
                        <p>Again</p>
                        <h5>CA$ 0.00</h5>
                    </div>
                    <div className="row">
                        <p>Again</p>
                        <h5>CA$ 0.00</h5>
                    </div> */}
                    <hr />
                    <div className="row">
                        <div>&nbsp;</div>
                        <h5>Total:    CA${price}</h5>
                    </div>
                    <div className="button-group">
                        <button className="cancel-but" onClick={()=>{navigate(-1)}}>Cancel</button>
                        {/* <button className="paypal-but"><img src="https://img.icons8.com/?size=100&id=3iU35bZGrQYY&format=png&color=FFFFFF" alt="" /> Paypal Pay</button> */}
                        <PayPalButtons
                            style={{ layout: "horizontal", color:"white", height:55 }}
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                        />
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

export default Payment