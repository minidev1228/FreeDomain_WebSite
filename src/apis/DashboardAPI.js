import React from "react";
import axios from "axios";

import getCredential from "../utils/getCredential";

export const getSearchsByEmail = async(mail, num, includeArchived) =>{
    let credentials = getCredential();
    const data = await axios({
        url: `https://api.freedomainbot.com/Search/getSearchesbyEmail/${mail}?pageNumber=${num}&pageSize=50&includeArchived=${includeArchived}`,
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

export const achiveDomain = async (searchId) =>{
    let credentials = getCredential();
    const data = await axios({
        url: `https://api.freedomainbot.com/Search/updateSearchStatus`,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${ credentials }`
        },
        data:{
            searchId,
            newStatus:4
        }

    }).then((res) => {
        return res.data;
    }).catch((err) => {});

    return data;
}

export const reviewDomain = async (searchId) =>{
    let credentials = getCredential();
    const data = await axios({
        url: `https://api.freedomainbot.com/Search/updateSearchStatus`,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${ credentials }`
        },
        data:{
            searchId,
            newStatus:2
        }

    }).then((res) => {
        return res.data;
    }).catch((err) => {});

    return data;
}

export const getSearchDetail = async(id) =>{
    let credentials = getCredential();
    const data = await axios({
        url: `https://api.freedomainbot.com/Search/getSearch/${id}`,
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

export const getAllDomains = async(id)=>{
    let credentials = getCredential();
    const data = await axios({
        url: `https://api.freedomainbot.com/Search/getdomains/${id}`,
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