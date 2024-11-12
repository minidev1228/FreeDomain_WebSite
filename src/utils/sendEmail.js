import react from 'react'
import axios from "axios";

import getCredential from './getCredential';

const sendEmail = async (email, name, message) => {
    const requestBody = {
        name: name,
        fromEmail: email,
        message: message,
    };

    const url = 'https://api.freedomainbot.com/api/contact/send';

    let credentials = getCredential();

    let response = await axios({
        url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${ credentials }`
        },
        method: "POST",
        data: requestBody
    }).then((res) => {
        return res.data;
    }).catch((err) => {
        alert("Error! Please try again later");
    });
}

export default sendEmail;