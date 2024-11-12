import react from 'react'

import "./index.css"

const Status = ({stat, txt}) =>{
    const colors = ["#345bec", "#00bc4f", "#fb9a32",,"#010304"]
    return (
        <div className='status'>
            <span style={{backgroundColor:colors[stat]}}></span>
            <p>{stat === 0?"In progress":stat === 1?"New":stat===2?"Reviewed":"Archieved"}</p>
        </div>
    )
}

export default Status