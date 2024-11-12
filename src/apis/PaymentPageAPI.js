import react from 'react'
import axios from "axios";

import getCredential from "../utils/getCredential";

export const addPlan = async(email, during) =>{

    let credentials = getCredential();

    const data = await axios({
        url: "https://api.freedomainbot.com/Plan/addPlan",
        method: "POST",
        data:{
            email,
            durationInDays: during
        },headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${ credentials }`
        }
    }).then((res) => {
        return {rlt:res.data, status: res.status};
    }).catch((err) => {});

    return data;
}