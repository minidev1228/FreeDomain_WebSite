import React from "react";

import "./index.css"

const MemberShipCard = ({img, title, comment, price, limit, isPopular, func}) =>{
    return (
        <div className="member-ship-card">
            {
                isPopular?<div className="popular-sign">
                <p>Most popular</p>
            </div>:<></>
            }
          <div className="header">
            <div>
              <img src={img} width="20px" height="20px" />
            </div>
            <h3>{title}</h3>
            <p>{comment}</p>
          </div>
          <div className="body">
            <div className="top">
              <h2>{price}</h2>
              <p>{limit}</p>
            </div>
            <div className="bottom">
                <button onClick={func}>Get started</button>
                <div>
                    <div>
                        <img src="https://img.icons8.com/?size=100&id=Ml61UEn9Z84L&format=png&color=345bec" alt="" />
                        <p >Lorem ipsum dolor sit amet consectetur. </p>
                    </div>
                    <div>
                        <img src="https://img.icons8.com/?size=100&id=Ml61UEn9Z84L&format=png&color=345bec" alt="" />
                        <p >Lorem ipsum dolor sit amet consectetur. </p>
                    </div>
                    <div>
                        <img src="https://img.icons8.com/?size=100&id=Ml61UEn9Z84L&format=png&color=345bec" alt="" />
                        <p >Lorem ipsum dolor sit amet consectetur. </p>
                    </div>
                </div>
            </div>
          </div>
        </div>
    )
}

export default MemberShipCard