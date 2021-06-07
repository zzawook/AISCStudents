import React, { Component } from 'react';

class socialBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			vrTop: 30,
			userID: ""
		};
	}
	componentDidMount() {
		this.setState({
			vrTop: "30px",
			userID: this.props.hashID
        })
		window.addEventListener("scroll", this.handleScroll, { passive: true });
	}

	handleScroll = function () {
		if (window.pageYOffset < 30) {
			this.setState({
				vrTop: 30-window.pageYOffset
			});
		}
		if (window.pageYOffset > 30) {
			this.setState({
				vrTop: 0
            })
        }
	}.bind(this)

	render() {
		const containerWidth = window.innerWidth * 0.245;
		const containerStyle = {
			position: 'fixed',
			top: '50px',
			left: '5px',
			width: `${containerWidth - 5}px`,
			zIndex: '999',
		}
		const vrStyle = {
			borderLeft: "1px solid #8a8a8a",
			height: window.innerHeight-10,
			width: '1px',
			position: 'absolute',
			left: `${containerWidth+3}px`,
			top: `10px`,
			zIndex: "10"
		}
		const IDDivStyle = {
			border: 'none',
			color: 'black',
			backgroundColor: "white",
			position: 'relative',
			top: `30px`,
			width: `${containerWidth - 20}px`,
			borderRadius: '5px',
			paddingLeft: '7px',
			paddingRight: '7px',
			paddingTop: '7px',
			paddingBottom: '7px'
		}
		const spanStyle = {
			width: `200px`,
			fontFamily: 'monospace',
			backgroundColor: "white",
			color: 'black'
		}
		const reminderDivStyle = {
			position: 'relative',
			top: `40px`,
			backgroundColor: 'white',
			borderRadius: '5px',
			paddingLeft: '10px',
			paddingRight: '10px',
			paddingTop: '10px',
			paddingBottom: '10px',
			fontSize: '14px'
        }
		return (
			<div style={containerStyle} >
				<div style={vrStyle}></div>
				<div style={IDDivStyle}>
					Your encrypted ID: <br />
					<span style={spanStyle}>{this.state.userID.substring(0,15)}...</span>
					<br />More features are under development. 
					<ul>
						<li>Instagram/Facebook Automated Synchronized Upload</li>
						<li>Dark Theme</li>
						<li>Notification</li>
						<li>Google Translation Integration</li>
						<li>Social (This section will be used for real-time instant texting!)</li>
						<li>Mobile App</li>
					</ul>
					Coming Soon!<br/><br/>	
				</div>
				<div style={reminderDivStyle}>
					*We are aware of the fact that this website is not perfectly stable and could cause errors. We ask you to take time to fill in our contact form when you encounter any errors or bugs, with detailed as possible description of the error. We will try our best to solve the issue as quickly as possible.*
				</div>
			</div>
		);
	}
}

export default socialBox;