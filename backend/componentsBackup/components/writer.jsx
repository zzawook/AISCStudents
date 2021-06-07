import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip'

class Writer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showSpan: true,
			vrTop: "30px",
			otherTop: 35,
			scroll: 0,
			textBody: "",
			imgInput: null,
			vidInput: null,
		};
		this.imgRef = React.createRef();
		this.vidRef = React.createRef();
	}
	componentDidMount() {
		this.setState({
			vrTop:"30px"
		})
		window.addEventListener("scroll", this.handleScroll, { passive: true });
	}

	handleScroll = function () {
		if (window.pageYOffset < 80) {
			if (window.pageYOffset < 35) {
				this.setState({
					otherTop: (35 - window.pageYOffset),
					vrTop: `${30 - window.pageYOffset}px`,
					scroll: window.pageYOffset
				})
			}
		}
	}.bind(this)

	handleSubmit = e => {
		e.preventDefault();
		let formData = new FormData();
		if (this.state.imgInput === null && this.state.vidInput === null && this.state.textBody === "") {
			alert("Please enter content");
			return false;
        }
		if (this.state.textBody != "") {
			formData.append("textBody", this.state.textBody);
		}
		if (this.state.imgInput != null) {
			for (let i = 0; i < this.state.imgInput.length; i++) {
				formData.append("imgInput", this.state.imgInput[i], "img" + i.toString());
				console.log(this.state.imgInput[i])
			}
        }
		if (this.state.vidInput != null) {
			for (let i = 0; i < this.state.vidInput.length; i++) {
				formData.append("vidInput", this.state.vidInput[i], "img" + i.toString());
				console.log(this.state.vidInput[i])
			}
		}
		formData.append("writer", this.props.writer);
		fetch("/api/submitArticle/", {
			body: formData,
			method: "POST",
			credentials: 'include',
			headers: {
				'Access-Control-Allow-Origin': "localhost:3030",
			}
		}).then((response) => response.json()
		).then((json) => {
			console.log(json);
		})
		return false;
	};

	handleChange = e => {
		e.preventDefault();
		const target = e.target;
		if (target.name === "imgInput") {
			this.setState(current => ({
				...current,
				imgInput: target.files,
			}));
		}
		else if (target.name === "vidInput") {
			this.setState(current => ({
				...current,
				vidInput: target.files,
			}));
		}
		else {
			this.setState(current => ({
				...current,
				textBody: target.value,
			}));
		};
	}

	render() {
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		const containerWidth = windowWidth * 0.32;
		const containerStyle = {
			position: "fixed",
			top: "50px",
			right: "0px",
			height: `${windowHeight-50}px`,
			width: `${containerWidth}px`,
		}
		const alertStyle = {
			color: "white",
		}
		const linkStyle = {
			color: "white",
			position: 'absolute',
			top: `${this.state.otherTop}px`,
			right: `${containerWidth - 270}px`,
			backgroundColor: "#3d3d3d",
			paddingTop: "2px",
			paddingBottom: "2px",
			paddingLeft: "3px",
			paddingRight: "3px",
			borderRadius: "5px",
			marginTop: "5px",
			fontSize: "14px",
			width: "58px",
			height: '20px'
		}
		const vrStyle = {
			borderLeft: "1px solid #8a8a8a",
			height: `${windowHeight-50}px`,
			width: '1px',
			position: 'absolute',
			right: `${containerWidth}px`,
			top: this.state.vrTop,
			zIndex: "998"
		}
		const textInputStyle = {
			fontSize: "18px",
			width: `${containerWidth - 25}px`,
			position: "absolute",
			right: "10px",
			bottom: `${windowHeight * 0.11}px`,
			height: `${((windowHeight-50) *0.8)+this.state.scroll}px`,
			fontFamily: "Calibri",
			backgroundColor: "#4a4a4a",
			color: "white",
			resize: "none",
			zIndex: -1,
			borderRadius: "5px"
		}
		const spanStyle = {
			position: "absolute",
			top: `${((windowHeight-95)/2)-(this.state.scroll/2)}px`,
			right: `${((containerWidth - 150) / 2) - 15}px`,
			height: '15px',
			width: "150px",
			color: "white",
			fontFamily: "Calibri",
			zIndex: 2
		}
		const imgUpStyle = {
			position: "absolute",
			top: `${windowHeight * 0.85}px`,
			right: `${containerWidth - 390}px`,
			color: "white",
			fontSize: "15px"
		}
		const imgUpLabelStyle = {
			position: 'absolute',
			top: `${windowHeight*0.85}px`,
			right: `${containerWidth-210}px`,
			width: "200px",
			color: 'white',
			fontSize: "15px"
		}
		const vidUpStyle = {
			position: 'absolute',
			top: `${windowHeight * 0.88}px`,
			right: `${containerWidth - 390}px`,
			color: "white",
			fontSize: "15px"
		}
		const vidUpLabelStyle = {
			position: 'absolute',
			top: `${windowHeight * 0.88}px`,
			right: `${containerWidth - 210}px`,
			width: "200px",
			color: 'white',
			fontSize: "15px"
		}
		const submitStyle = {
			position: "absolute",
			top: `${windowHeight*0.91}px`,
			right: '10px',
			backgroundColor: "#8f8f8f",
			width: `${ containerWidth - 20 }px`,
			height: "30px",
			border: "none",
			color: "white",
			borderRadius: "5px",
			fontSize: "15px"
		}

		const removeSpan = function (e) {
			this.setState({
				showSpan: false
			})
		}.bind(this)

		const checkSpanOn = function (e) {
			if (e.target.value === "") {
				this.setState({
					showSpan: true
				})
			}
		}.bind(this)

		return (
			<div id="container" style={containerStyle}>
				<div style={vrStyle}/>
				<a data-tip data-for="tooltip" style={linkStyle}>Read me!</a>
				<ReactTooltip id="tooltip" place="bottom" type="light" effect="solid" wrapper="div">
					<p><strong>Your anonimity is perfectly ensured</strong> once you are in this page, and no teacher<br /> can access this website with their id. This means, you will be never required to <br />enter your name or reveal identity in the website. None of your activity will be <br />accessed by teachers unless you opt to and no information will be provided to <br />school or any other authority whatsoever. <strong>Complete freedom</strong> is guaranteed, if<br /> you keep the following 3 rules:<br />
						<ol>
							<li><strong>No defamation</strong>: Any criticism of specific figure is welcomed but should <br />be supported with fact or logic, or the figure shouldn't be specified. If any <br />intention to 1. spread false information or 2. groundlessly blame of <br />specific figure is detected, the comment or article will be taken down.</li>
							<li><strong>No discrimination</strong>: Any comments and articles that has discriminative <br />intention, regardless it is sexual, racial, religious, or ethnic, is prohibited. <br />#allLivesMatter</li>
							<li><strong>No spamming.</strong> If an attempt to upload more than 3 of the same article or <br />comment is found, only 1 of them will be preserved.</li>
						</ol>
						Once you submit any article for upload, your article will be reviewed to check if it <br />violated any of the 3 rules above, then uploaded. You are not required to reveal <br /> your identity when submitting.
					</p>
				</ReactTooltip>
				<form onSubmit={this.handleSubmit}>
					<textarea id='textBody' name='textBody' style={textInputStyle} onFocus={removeSpan} onBlur={checkSpanOn} onChange={this.handleChange}/>
					{this.state.showSpan ? <span style={spanStyle}>Share your story!</span> : null}
					<label htmlFor="imgInput" style={imgUpLabelStyle}>Upload image: </label>
					<input type="file" id="imgInput" name="imgInput" accept="image/*" ref={this.imgRef} style={imgUpStyle} multiple={true} onChange={this.handleChange}/>
					<label htmlFor="vidInput" style={vidUpLabelStyle}>Upload video:</label>
					<input type="file" id="vidInput" name="vidInput" accept="video/*" multiple={true} ref={this.vidRef}style={vidUpStyle} onChange={this.handleChange} />
					<input type="submit" id="submitButton" name="submitButton" style={submitStyle} formEncType="multipart/form-data" />
				</form>
			</div>
        );
	}
}

export default Writer;