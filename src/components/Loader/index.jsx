import React from "react";

import "./index.css"

import loadImg from   "../../resources/loading.gif"

const Loader = () =>{
    return (
        <div className="loader-div">
            <img src={loadImg} alt="" />
            {/* <div className="loader"></div> */}
        </div>
    )
}

export default Loader