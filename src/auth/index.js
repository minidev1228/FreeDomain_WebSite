import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useCheckAuth = () =>{
    const navigate = useNavigate();

    useEffect(()=>{
        let isOpen = localStorage.getItem("IsLogIn");
        let role = localStorage.getItem("role");

        if(isOpen === "yes"){
            if(role === "player") navigate("/viewPage")
            else if(role === "captain") navigate("/mainPage");
            else if(role === "admin") navigate("/adminPage");
        } else navigate("/");
    }, [])
    
    return null
};
