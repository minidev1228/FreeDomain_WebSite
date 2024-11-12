import React from "react";

import "./index.css"

import checkCircleIcon from "../../resources/CheckCircle.png"

const warningIcon = "https://img.icons8.com/?size=100&id=2856&format=png&color=176cfd";
const errorIcon = "https://img.icons8.com/?size=100&id=8122&format=png&color=FA5252";

const SuccessModal = ({closeModal, title, content, button_txt, type}) =>{
    return (
        // <div className="success-modal">
            <div className="success-modal-card">
                <img src={type==="success" ? checkCircleIcon : type==="error" ? errorIcon : warningIcon} alt="" />
                <div>
                    <div>
                        <h6>{title}</h6>
                        <p>{content}</p>
                    </div>
                    <div className="modal-button-div">
                        <div></div>
                        <button onClick={closeModal}>{button_txt}</button>
                    </div>
                </div>
            </div>
        // </div> 
    )
}

export default SuccessModal