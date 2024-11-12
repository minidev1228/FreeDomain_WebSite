import React from "react";
import { useNavigate } from "react-router-dom";

import Button1 from "../../components/button1";
import Button2 from "../../components/button2";

import dartsMark from "../../resources/darts.png"

import "./index.css"

const Header = () =>{

    const navigate = useNavigate();

    const logOut = () =>{
        localStorage.setItem("IsLogIn", "no");
        navigate("/");
    }

    return (
        <div className="header">
            <div className="header-top">
                <img src={dartsMark} alt="" />
                <Button1 width={"79px"} handleClickEvent={logOut} text={"Log Out"} />
            </div>
            <div className="header-bottom" style={{height:"75px"}}>
                <Button2  text={"My Team"} handleClickEvent={()=>{navigate("/mainPage")}}/>
                <Button2  text={"Events"} handleClickEvent={()=>{navigate("/event")}}/>
            </div>
        </div>
    )
}

export default Header;