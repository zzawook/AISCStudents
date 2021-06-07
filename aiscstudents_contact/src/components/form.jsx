import React, { Component } from 'react';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textBody: " Tell us your experience!", 
            imgInput: null,
            vidInput: null,
            identity: " Your name/nickname/initial (optional)",
            contact: " Your email address (optional)"
        };
    }
    render() {
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        const removeText = function (e) {
            e.preventDefault()
            if (this.state.textBody === " Tell us your experience!") {
                this.setState({
                    textBody: ""
                })
            }
        }.bind(this)

        const putText = function (e) {
            e.preventDefault()
            if (this.state.textBody === "") {
                this.setState({
                    textBody: " Tell us your experience!"
                })
            }
        }.bind(this)

        const handleChange = function (e) {
            e.preventDefault()
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
            else if (target.name === "identityInput") {
                this.setState(current => ({
                    ...current,
                    identity: target.value,
                }))
            }
            else if (target.name === "contactInput") {
                this.setState(current => ({
                    ...current,
                    contact: target.value,
                }))
            }
            else {
                this.setState(current => ({
                    ...current,
                    textBody: target.value,
                }));
            };
        }.bind(this)

        const handleIdFocus = function (e) {
            e.preventDefault()
            if (this.state.identity === " Your name/nickname/initial (optional)") {
                this.setState({
                    identity: ""
                })
            }
        }.bind(this)

        const handleIdBlur = function (e) {
            e.preventDefault()
            if (this.state.identity === "") {
                this.setState({
                    identity: " Your name/nickname/initial (optional)"
                })
            }
        }.bind(this)

        const handleContactChange = function (e) {
            const target = e;
            target.preventDefault()
            this.setState({
                contact: target.value
            })
        }.bind(this)

        const handleContactBlur = function (e) {
            e.preventDefault()
            if (this.state.contact === "") {
                this.setState({
                    contact: ' Your email address (optional)'
                })
            }
        }.bind(this)

        const handleContactFocus = function (e) {
            e.preventDefault()
            if (this.state.contact === " Your email address (optional)") {
                this.setState({
                    contact: ''
                })
            }
        }.bind(this)

        const handleSubmit = function (e) {
            e.preventDefault()
            let formData = new FormData();
            if (this.state.imgInput === null && this.state.vidInput === null && this.state.textBody === "") {
                alert("Please enter content");
                return false;
            }
            if (this.state.textBody !== "") {
                formData.append("textBody", this.state.textBody);
            }
            let imgLength = 0;
            if (this.state.imgInput !== null) {
                imgLength = this.state.imgInput.length;
            }
            let vidLength = 0;
            if (this.state.vidInput !== null) {
                vidLength = this.state.vidInput.length;
            }
            if (imgLength + vidLength > 10) {
                alert("You cannot upload more than 10 medias, including image and video")
                return false;
            }
            const imgLoadPromise = new Promise((resolve, reject) => {
                if (this.state.imgInput !== null) {
                    for (let i = 0; i < this.state.imgInput.length; i++) {
                        formData.append("mediaInput", this.state.imgInput[i]);
                        if (i === this.state.imgInput.length - 1) {
                            resolve(true)
                        }
                    }
                }
                else { resolve(true) };
            })
            const vidLoadPromise = new Promise((resolve, reject) => {
                if (this.state.vidInput != null) {
                    for (let i = 0; i < this.state.vidInput.length; i++) {
                        if (((this.state.vidInput[i].size / 1024) / 1024) > 30) {
                            alert("One of your videos is bigger than 30MB. Only files below 30MB are allowed")
                            reject(false)
                        }
                        else {
                            formData.append("mediaInput", this.state.vidInput[i]);
                            if (i === this.state.vidInput.length - 1) {
                                resolve(true)
                            }
                        }
                    }
                }
                else { resolve(true) };
            })
            Promise.all([imgLoadPromise, vidLoadPromise]).then((values) => {
                let approved = true
                for (let i = 0; i < values.length; i++) {
                    if (values[i] === false) {
                        approved = false
                    }
                }
                if (approved) {
                    if (this.state.textBody !== "" && this.state.textBody !== "Tell us your experience!") {
                        formData.append("textBody", this.state.textBody.toString());
                    }
                    else {
                        formData.append("textBody", "none")
                    }
                    if (this.state.contact !== "" && this.state.contact !== "Your email address (optional)") {
                        formData.append("contact", this.state.contact.toString());
                    }
                    else {
                        formData.append("contact", "none")
                    }
                    if (this.state.identity !== "" && this.state.contact !== "Your name/nickname/initial (optional)") {
                        formData.append("identity", this.state.identity.toString());
                    }
                    else {
                        formData.append("identity", "none")
                    }
                    alert("Your article is being processed. Please wait for further alert.")
                    fetch("http://aiscstudents.com/api/submitContactForm/", {
                        body: formData,
                        method: "POST",
                        credentials: 'include',
                        headers: {
                            'Access-Control-Allow-Origin': "localhost:3030",
                        }
                    }).then((response) => {
                        if (response.status === 301) {
                            window.location.href = "http://aiscstudents.com/login";
                        }
                        else if (response.status === 200) {
                            alert("Your message was successfully delivered. We will get back to you if you left your contact, or will respond correspondingly to your message. Thank you!")
                        }
                        else {
                            alert("An error occurred while processing your messge.")
                        }
                    })
                }
                
            })
        }.bind(this)

        const divStyle = {
            width: '600px',
            position: 'absolute',
            right: '30px',
            color: 'white',
        }

        const labelStyle = {
            margin: 'auto',
            width: '320px',
            position: 'relative',
            color: 'black',
        }

        const textAreaStyle = {
            fontFamily: 'Roboto',
            position: 'relative',
            fontSize: '15px',
            border: 'none',
            borderRadius: '5px',
            width: '600px',
            height: '350px',
            backgroundColor: '#c7c7c7',
            color: '#3c3c3c'
        }

        const inputStyle = {
            fontFamily: 'Roboto',
            position: 'relative',
            fontSize: '15px',
            border: 'none',
            borderRadius: '5px',
            width: '600px',
            height: '25px',
            backgroundColor: '#c7c7c7',
            color: '#3c3c3c'
        }

        const submitStyle = {
            width: '600px',
            border: 'none',
            borderRadius: '5px',
            fontFamily: 'Roboto',
            backgroundColor: '#8f8f8f',
            height: '30px',
            color: 'white'
        }

        const infoDivStyle = {
            width: `${windowWidth - 700}px`,
            position: 'absolute',
            left: '25px',
            height: { windowHeight },
            color: 'black',
            fontFamily: 'Roboto',
        }

        const infoParagraphStyle = {
            fontSize: '20px'
        }

        return (
            <div>
            <div style={infoDivStyle} >
                    <h1>Contact Us</h1>
                    <p style={infoParagraphStyle} > Please report any
                    <ul>
                        <li>advice</li>
                        <li>complaints</li>
                        <li>feedback</li>
                        <li>report</li>
                        <li>error</li>
                        <li>any other discomfort</li> 
                    </ul>
                    you may have on this community website. <br /><br />You may choose to reveal yourself or to leave contact for our reply. <br /><br />If you are reporting an error, please make sure to describe your situation as precise and clear as possible. <br /><br />If you are reporting an article or comment, please let us know what specifically disturbed you. <br /><br />You are always welcomed to use image/video to support your communication, but cannot upload more than 10 images+videos, and every single videos should be smaller than 30MB. <br /><br />Any constructive feedback/advice on the community website is always welcomed. <br /><br />Enjoy!</p>
            </div>
            <div style={divStyle}>
                <form onSubmit={handleSubmit} >
                    <p></p>
                    <label htmlFor='identity' style={labelStyle}>How would you identify yourself? (Optional)</label><br/>
                    <input type='text' style={inputStyle} id='identityInput' name='identityInput' onChange={handleChange} onFocus={handleIdFocus} onBlur={handleIdBlur} value={this.state.identity} /><br />
                    <p></p>
                    <label htmlFor='contact' style={labelStyle}>Email address to which we could contact you? (Optional)</label><br />
                    <input type='text' style={inputStyle} id='contactInput'name='contactInput' onFocus={handleContactFocus} onBlur={handleContactBlur} onChange={handleChange} value={this.state.contact} />
                    <p></p>
                    <textarea style={textAreaStyle} onFocus={removeText} onBlur={putText} onChange={handleChange} value={this.state.textBody} /><br />
                        <label style={labelStyle} htmlFor="imgInput">Upload Image</label><br/>
                    <input style={inputStyle} type='file' id="imgInput" name='imgInput' accept="image/*" multiple={true} onChange={handleChange}/><br/>
                        <label htmlFor="vidInput" style={labelStyle}>Upload Video</label><br />
                    <input style={inputStyle} type='file' id="vidInput" name='vidInput' accept="video/*" multiple={true} onChange={handleChange} /><br />
                    <p></p>
                    <input style={submitStyle} type='submit' id='submitButton' name='submitButton' formEncType='multipart/form-data'/><br/>
                </form>
                </div>
            </div>

        );
    }
}

export default Form;