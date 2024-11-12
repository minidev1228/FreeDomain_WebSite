import React from "react";

import "./index.css"

const ProfileCard = ({img, name, comment}) =>{
    return (
        <div className="profile-card">
          <div className="top">
            <div>
              <img src={img} alt="" />
            </div>
            <h5>{name}</h5>
          </div>
          <div>
            <p>
              {comment}
            </p>
          </div>
        </div>
    )
}

export default ProfileCard