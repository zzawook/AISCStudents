import React, { Component } from 'react';

class socialBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			vrTop: "0px",
			userID: ""
		};
	}
	componentDidMount() {
		this.setState({
			vrTop: "80px",
			userID: this.props.hashID
        })
		window.addEventListener("scroll", this.handleScroll, { passive: true });
	}

	handleScroll = function () {
		this.setState({
			vrTop: `${80 - window.pageYOffset}px`
		});
	}.bind(this)

	render() {
		const containerWidth = window.innerWidth * 0.245;
		const containerStyle = {
			backgroundColor: "#3d3d3d",
			position: 'fixed',
			top: '85px',
			left: '5px',
			width: `${ containerWidth -5}px`
		}
		const vrStyle = {
			borderLeft: "1px solid #8a8a8a",
			height: window.innerHeight-10,
			width: '1px',
			position: 'absolute',
			left: `${containerWidth}px`,
			top: this.state.vrTop,
			zIndex: "998"
		}
		const IDStyle = {
			border: "none",
			color: 'white'
		}
		const moreComingStyle = {
			border: 'none',
			color: 'white'
        }
		return (
			<div style={containerStyle} >
				<div style={vrStyle}></div>
				<div style={IDStyle}>ID: {this.state.userID}</div>
				<div style={moreComingStyle}>More features are under development. Coming Soon!</div>
			</div>
		);
	}
}

export default socialBox;