import React from "react";

const getCredential = () =>{
    const clientId = 'freedomainbot';
    const clientSecret = '?yT@#m7!3Wb8e&F4$Dxq%Z9j^lP*sK8w@V';
    const url = 'https://api.freedomainbot.com/api/contact/send';
    let credentials = btoa(`${clientId}:${ clientSecret}`);
    return credentials;
}

export default getCredential;