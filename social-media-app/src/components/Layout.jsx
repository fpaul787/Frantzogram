import React from 'react'
import Navigationbar from "./Navbar";

export default function Layout(props) {
  return (
    <div>
        <Navigationbar />
        <div className="container m-5">{props.children}</div>
    </div>
  ); 
}
