import React, { Component } from 'react';
/*props: */
class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    settingComing = function (e) {
        e.preventDefault();
        window.alert("Setting page is not available now but is being prepared. Please look forward to it :)")
    }
    render() {
        const logoDivStyle = {
            position: "fixed",
            top: "0px",
            left: "0px",
            backgroundColor: "#4742A8",
            zIndex: 500,
            width: window.innerWidth,
            borderBottom: "1px solid #bbb"
        }
        const logoStyle = {
            height: "61px",
            marginLeft: "10px",
            marginTop: "5px"
        }
        const listStyle = {
            listStyleType: "none",
            margin: "0",
            padding: "0",
            overflow: "hidden",
            backgroundColor: "#4742A8",
            position: "fixed",
            zIndex: "1000",
            borderRadius: "5px",
            borderBottom: "1px solid #bababa",
            width: window.innerWidth - 50,
            top: 0,
            left: 210
        }
        const lilinkStyle = {
            display: "block",
            color: "white",
            textAlign: "center",
            padding: "14px 16px",
            textDecoration: "none",
            width: "80px",
            height: "50px",
            position: "relative",
            top: "12px",
            borderRadius: "5px"
        }   
        const liStyle={
            float: "left",
            position: "relative",
            bottom: "0px",
            height: "70px",
        }
        const containerStyle = {
            height: "70px",
            backgroundColor: "#1c1c1c",
            zIndex: "1000",
        }
        const instaLinkStyle = {
            position: "fixed",
            fontSize: "12px",
            color: "white",
            right: "10px",
            top: "42px",
            textDecoration: "none",
            padding: "5px",
            borderRadius: "5px",
            zIndex: '1004'
        }
        const fbLinkStyle = {
            position: "fixed",
            fontSize: "12px",
            color: "white",
            right: "160px",
            top: "42px",
            textDecoration: "none",
            padding: "5px",
            borderRadius: "5px",
            zIndex: '1005'
        }
        const dividerStyle = {
            position: "fixed",
            top: "27px",
            right: "155px",
            color: "white",
            zIndex: '1003'
        }
        function changeBackgroundOn(e) {
            e.target.style.backgroundColor = "#6870C4";
        }
        function changeBackgroundOut(e) {
            e.target.style.backgroundColor = "#4742A8";
        }
        return (
            <div style={containerStyle} >
                <div style={logoDivStyle}><img src='/about/images/logo.jpg' style={logoStyle} alt=""/></div>
                <ul style={listStyle} >
                    <li style={liStyle}><a href="https://aiscstudents.com" style={lilinkStyle} onMouseOver={changeBackgroundOn} onMouseLeave={changeBackgroundOut}>Home</a></li>
                    <li style={liStyle}><a href="https://aiscstudents.com/contact/" style={lilinkStyle} onMouseOver={changeBackgroundOn} onMouseLeave={changeBackgroundOut}> Contact</a></li>
                    <li style={liStyle}><a href="https://aiscstudents.com/setting/" style={lilinkStyle} onMouseOver={changeBackgroundOn} onMouseLeave={changeBackgroundOut} > Setting</a></li>
                    <li style={liStyle}><a href="https://aiscstudents.com/about/" style={lilinkStyle} onMouseOver={changeBackgroundOn} onMouseLeave={changeBackgroundOut}> About</a></li>
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