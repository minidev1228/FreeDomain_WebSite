import react, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import DashboardPage from '..'
import MemberShipCard from '../../../components/memberShipCard'
import Loader from '../../../components/Loader'

import haveaccessImg from "../../../resources/have_access.png"

import "./index.css"

const PricingPage = () =>{

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const goToPaymentPage = async(during) =>{
        setIsLoading(true);
        let isLogined = sessionStorage.getItem("isloged");
        if(isLogined !== "yes"){
            navigate("/login");
            setIsLoading(false);
        } else{
            navigate(`/payment/${during}`);
            setIsLoading(false);    
        }
    }

    return (
        <DashboardPage>
            {
                isLoading?<Loader />:<></>
            }
             <div className="pricing-page">
                <div className='top-bar'>
                    <h3>Our pricing plan</h3>
                </div>
                <div className='content'>
                    <div className="card-group-parent" id="plans">
                        <img src={haveaccessImg} alt="" />
                        <h5>Our pricing plan</h5>
                        <p>Find the perfect domain name with the help of cutting-edge AI technology. Say goodbye to hours of searching: FreeDomainBot.com offers instantly available domain names designed exclusively for you.</p>
                        <div className="card-group">
                            <MemberShipCard img = {"https://img.icons8.com/?size=100&id=8rftcrgVZFN7&format=png&color=345bec"} title={"One day pass"} comment={"Unlock one day of unlimited searchs, Ideal for quick decisions"} price={"CA$ 9,00"} limit={"per user/ day"} isPopular={false} func={()=>{goToPaymentPage('day')}}/>
                            <MemberShipCard img = {"https://img.icons8.com/?size=100&id=103&format=png&color=345bec"} title={"One week pass"} comment={"Explore at your leisure with a week of unlimited searches"} price={"CA$ 24,99"} limit={"per user/ week"} isPopular={true} func={()=>{goToPaymentPage('week')}}/>
                            <MemberShipCard img = {"https://img.icons8.com/?size=100&id=V7nNJrd74MXo&format=png&color=345bec"} title={"Monthly pass"} comment={"Domains on demand for a full month for only. Perfect for ongoing projects."} price={"CA$ 49,99"} limit={"per user/ day"} isPopular={false} func={()=>{goToPaymentPage('month')}}/>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardPage>
    )
}

export default PricingPage