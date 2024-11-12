import React from "react";

import "./index.css"

const SlideButton = ({img, content, selected}) =>{
    return (
        <div className="slide-button">
            <button style={{backgroundColor:selected?"#345bec":"#f9fbf1"}}><img src={img} alt="" /></button>
            <p>{content}</p>
        </div>
    )
}

export default SlideButton