import React, { Component } from 'react';

class bottomBar extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const barStyle = {
			position: "relative",
			bottom: "0px",
			backgroundColor: "#1c1c1c",
			width: window.innerWidth-20,
			zIndex: "999",
			height: "50px"
		}
		const imgStyle = {
			float: "left",
			marginLeft: "10px",
			marginTop: "5px",
			width: "50px"
		}
		return (
			<div style={barStyle}>
				<img src="./images/logo.png" alt="" style={imgStyle} />
			</div>
        );
	}
}

export default bottomBar;