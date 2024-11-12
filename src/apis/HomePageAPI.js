import React from "react";
import axios from "axios";

import getCredential from "../utils/getCredential";

export const getFilterDatas = async() =>{
    let credentials = getCredential();
    const data = await axios({
        url: "https://api.freedomainbot.com/PremiumFilters/GetFilters",
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${ credentials }`
        }

    }).then((res) => {
        return res.data;
    }).catch((err) => {});

    return data;
}

export const createSearchId = async(email, keywordRelevance, filtersJson) =>{

    let credentials = getCredential();

    const data = await axios({
        url: "https://api.freedomainbot.com/Search/createSearch",
        method: "POST",
        data:{
            email, keywordRelevance, filtersJson, "status":0
        },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${ credentials }`
        }
    }).then((res) => {
        return {rlt:res.data, status: res.status};
    }).catch((err) => {});

    return data;
}

export const getSingleDomain = async(searchId) =>{

    let credentials = getCredential();

    const data = await axios({
        url: `https://api.freedomainbot.com/Search/getsingledomain/${searchId}`,
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${ credentials }`
        }
    }).then((res) => {
        return res.data;
    }).catch((err) => {});

    return data;
}

export const getLeftCountByEmail = async(email) =>{
    let credentials = getCredential();

    const data = await axios({
        url: `https://api.freedomainbot.com/Search/getSearchInfo`,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${ credentials }`
        },
        data:{
            email
        }
    }).then((res) => {
        return res.data.freeSearchesLeft;
    }).catch((err) => {});

    return data;
}

export const getSearchCountByEmail = async(email) =>{
    let credentials = getCredential();

    const data = await axios({
        url: `https://api.freedomainbot.com/Search/getSearchInfo`,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${ credentials }`
        },
        data:{
            email
        }
    }).then((res) => {
        return res.data.totalSearchesExecuted;
    }).catch((err) => {});

    return data;
}