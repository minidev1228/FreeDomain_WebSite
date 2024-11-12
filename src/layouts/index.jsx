import React from "react";

import Header from "./header"

import "./index.css"

const Layout = ({children}) =>{
    return(
        <div className="layout-css">
            <Header />
            <main>{children}</main>
        </div>
    )
}

export default Layout;