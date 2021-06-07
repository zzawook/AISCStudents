import React, { Component } from 'react';
/*props: */
class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const logoDivStyle = {
            position: "absolute",
            top: "0px",
            left: "0px",
            backgroundColor: "#1c1c1c",
            zIndex: "1001",
        }
        const logoStyle = {
            width: "71px",
            marginLeft: "10px",
            marginTop: "5px"
        }
        const listStyle = {
            listStyleType: "none",
            margin: "0",
            padding: "0",
            overflow: "hidden",
            backgroundColor: "#1c1c1c",
            position: "fixed",
            zIndex: "1000",
            borderRadius: "5px",
            borderBottom: "1px solid #bababa",
            width: window.innerWidth 
        }
        const lilinkStyle = {
            display: "block",
            color: "white",
            textAlign: "center",
            padding: "14px 16px",
            textDecoration: "none",
            width: "50px",
            height: "50px",
            position: "relative",
            bottom: "0px",
            borderRadius: "5px"
        }   
        const liStyle={
            float: "right",
            position: "relative",
            bottom: "0px",  
            height: "50px",
        }
        const containerStyle = {
            height: "80px",
            backgroundColor: "#1c1c1c",
            borderBottom: "1px solid #bababa",
            zIndex: "1000"
        }
        const instaLinkStyle = {
            position: "absolute",
            fontSize: "12px",
            color: "white",
            right: "10px",
            top: "52px",
            textDecoration: "none",
            padding: "5px",
            borderRadius: "5px"
        }
        const fbLinkStyle = {
            position: "absolute",
            fontSize: "12px",
            color: "white",
            right: "160px",
            top: "52px",
            textDecoration: "none",
            padding: "5px",
            borderRadius: "5px"
        }
        const dividerStyle = {
            position: "absolute",
            top: "35px",
            right: "155px",
            color: "white"
        }
        function changeBackgroundOn(e) {
            e.target.style.backgroundColor = "black";
        }
        function changeBackgroundOut(e) {
            e.target.style.backgroundColor = "#1c1c1c";
        }
        return (
            <div style={containerStyle} >
                <div style={logoDivStyle}><img src='/images/logo.png' style={logoStyle} alt=""/></div>
                <ul style={listStyle} >
                    <li style={liStyle}><a href="http://aiscstudents.com/about" style={lilinkStyle} onMouseOver={changeBackgroundOn} onMouseLeave={changeBackgroundOut}> About</a></li>
                    <li style={liStyle}><a href="http://aiscstudents.com/setting" style={lilinkStyle} onMouseOver={changeBackgroundOn} onMouseLeave={changeBackgroundOut}> Setting</a></li>
                    <li style={liStyle}><a href="http://aiscstudents.com/contact" style={lilinkStyle} onMouseOver={changeBackgroundOn} onMouseLeave={changeBackgroundOut}> Contact</a></li>
                    <li style={liStyle}><a href="http://aiscstudents.com" style={lilinkStyle} onMouseOver={changeBackgroundOn} onMouseLeave={changeBackgroundOut}> Home</a></li>
                </ul>
                <a onClick={function (e) {
                    e.target.style.color = "white";
                }} href="https://www.instagram.com/aiscstudent/" style={instaLinkStyle} target="_blank" onMouseOver={changeBackgroundOn} onMouseLeave={changeBackgroundOut}> Visit our Instagram page!</a>
                <p style={dividerStyle}>|</p>
                <a href="https://www.facebook.com/AISCStudents" onClick={function (e) {
                    e.target.style.color = "white";
                }} style={fbLinkStyle} target="_blank" onMouseOver={changeBackgroundOn} onMouseLeave={changeBackgroundOut}> Visit our Facebook page!</a>
            </div>
        );
    }
}

export default NavBar;