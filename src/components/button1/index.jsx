import React from "react";

import "./index.css"

const Button1 = ({content, handlerOnClick}) =>{
    return (
        <button className="button1" onClick={handlerOnClick}>
            {content}
        </button>
    )
}

export default Button1