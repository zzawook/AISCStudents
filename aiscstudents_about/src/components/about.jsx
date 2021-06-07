import React, { Component } from 'react';

class About extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}
	
	render() {
		const allStyle = {
			color: 'white',
			textAlign: 'center',
			width: window.innerWidth * 0.8,
			backgroundColor: 'white',
			position: 'absolute',
			right: window.innerWidth * 0.1
		}
		const hrStyle = {
			width: window.innerWidth * 0.7,
			height: '0px',
			borderTop: '1px solid black',
		}
		const h5Style = {
			color: '#5c5c5c',
			width: window.innerWidth * 0.7,
			marginLeft: window.innerWidth*0.05
		}
		const h1Style = {
			color: 'black'
		}
		const h3Style = {
			color: 'black'
		}
		return (
			<div style={allStyle}>
				<h1 style={h1Style}><strong>About Us</strong></h1>
				<hr style={hrStyle} />
				<h3 style={h3Style}>Are you official?</h3>
				<h5 style={h5Style}>No.</h5>
				<h3 style={h3Style}>Who are you?</h3>
				<h5 style={h5Style}>We are student group promoting harmony among entire AISC student group.</h5>
				<h3 style={h3Style}>Who can use AISCStudents community?</h3>
				<h5 style={h5Style}>All student above middle school (>5th grade) can be a member of the community.</h5>
				<h3 style={h3Style}>Are you trustworthy? How could we trust you?</h3>
				<h5 style={h5Style}>The only mission of this website is to provide secure and intimate online environment where students 
				can interact. As students of AISC, we will do our best in pursuit of the mission, and will remain transparent throughout
					the decision-making and management process. </h5>
				<h3 style={h3Style}>How and where are datas stored? Are they safe?</h3>
				<h5 style={h5Style}>Your data and images are safely saved in our linux server provided by DigitalOcean. Videos are 
				uploaded to YouTube in private account of AISCStudent with privacy status of 'unlisted', which means video will be 
				unavailable unless link to the video is provided. The entire process is carried out within SSL/TLS protocol, using
					HTTPS.</h5>
				<h3 style={h3Style}>What are the rules in the community?</h3>
				<h5 style={h5Style}>Please refer to 'Read me!' popup at home page. Although we ensure maximum freedom, there are rules
					to prevent from chaos.</h5>
				<h3 style={h3Style}>What else do you have to tell me?</h3>
				<h5 style={h5Style}>We wish to develop this community collaboratively. Please check out right side of the home page
					for opportunities to contribute to the community webpage. </h5>
			</div>
        );
	}
}

export default About;