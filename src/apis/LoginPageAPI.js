import react from 'react'
import axios from "axios";

import getCredential from "../utils/getCredential";

export const sendMyEmail = async(email, keywordRelevance) =>{

    let credentials = getCredential();

    let response = await axios({
        url: "https://api.freedomainbot.com/OTP/requestOTP",
        method: "POST",
        data:{
            email,
            keywordRelevance
        },headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${ credentials }`
        }
    }).then((res) => {
        return res.data;
    }).catch((err) => {});

    return response;
}

export const validateOTP = async(id, pin) =>{
    
    let credentials = getCredential();

    let response = await axios({
        url: "https://api.freedomainbot.com/OTP/validateOTP",
        method: "POST",
        data:{
            id,
            pin
        },headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${ credentials }`
        }
    }).then((res) => {
        return res.data;
    }).catch((err) => {});

    return response;
}

export const getPlan = async(email) =>{

    let credentials = getCredential();

    let response = await axios({
        url:`https://api.freedomainbot.com/Plan/getPlan?email=${email}`,
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${ credentials }`
        }
    }).then((res) => {
        return res.data;
    }).catch((err) => {});

    return response;
}