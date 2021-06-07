import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import sha256 from 'js-sha256';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "Enter ID",
            pw: "`~~`",
            verifypw: false,
            verpw: "`~~`"
        };
    }

    handleSubmit = e => {
        e.preventDefault();
        if (this.state.id === "Enter ID" || this.state.pw === "`~~`" || this.state.id === "" || this.state.pw === "") {
            alert("Please enter all fields correctly.")
            return false;
        }
        if (this.state.id.length !== 5) {
            alert("Your ID should be a 5 digit number")
            return false;
        }
        if (this.state.pw.length < 6) {
            alert("Your password should be longer than 6 digits for your security")
            return false;
        }
        let formData = new FormData();
        const hashedId = sha256(this.state.id)
        const hashedpw=sha256(this.state.pw)
        formData.append('id', hashedId);
        formData.append('pw', hashedpw);
        if (this.state.verifypw) {
            fetch('https://aiscstudents.com/api/createPassword/', {
                body: formData,
                method: "POST",
                credentials: "include",
                headers: {
                    "cache-control": 'no-cache'
                }
            }).then((response) => {
                if (response.status === 500) {
                    alert("An error has occurred. Please retry. If the error continues, please contact us via link at the bottom left.")
                }
                else if (response.status === 301) {
                    window.location.href = "https://aiscstudents.com"
                }
                else if (response.status === 403) {
                    alert("No such account exists. Please check your ID and password combination.")
                }
            })
            return;
        }
        fetch('https://aiscstudents.com/api/login/', {
            body: formData,
            method: "POST",
            credentials: "include",
            headers: {
                "cache-control": 'no-cache',
            }
        }).then((response) => {
            debugger;
            if (response.status === 202) {
                this.setState({
                    verifypw: true
                })
            }
            else if (response.status === 403) {
                alert("No such account exists. Please check your ID and password combination.")
            }
            else if (response.status === 500) {
                alert("There has been error with login. Please try again. If this problem continues, please contact us via link at the bottom left.")
            }
            else if (response.status === 301) {
                window.location.href="https://aiscstudents.com"
            }
        })
    }
    render() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const formStyle = {
            height: '100px',
            width: windowWidth * 0.2,
            position: 'absolute',
            right: windowWidth*0.0125
        }
        const divStyle = {
            width: windowWidth * 0.225,
            height: (windowHeight * 0.075)+220,
            position: 'absolute',
            top: windowHeight * 0.35,
            right: windowWidth * 0.4,
            backgroundColor: "white",
            border: 'none',
            borderRadius: '5px',
            color: 'white',
            fontSize: '15px',
            textAlign: "center",
            color: 'black'
        }
        const welcomeStyle = {
            position: 'relative',
            width: windowWidth * 0.225,
            height: windowHeight * 0.075,
            marginBottom: "0px"
        }
        const submitStyle = {
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#4742A8',
            color: 'white',
            position: 'relative',
            bottom: '0px',
            width: `${windowWidth * 0.15}px`,
            height: '25px'
        }
        const inputSepStyle = {
            height: "10px",

        }
        const linkStyle = {
            backgroundColor: '#999999',
            border: 'none',
            borderRadius: '10px',
            paddingLeft: '10px',
            paddingRight: '10px',
            color: 'white'
        }
        return (
            <div style={divStyle}>
                <p style={welcomeStyle}>Welcome<br />to<br />AISC Students Community<br /></p>
                <div style={inputSepStyle} />
                <form style={formStyle} onSubmit={this.handleSubmit}>
                    <label htmlFor='id'>School ID: </label>
                    <input type='text' id='id' name='id' value={this.state.id} onChange={function (e) {
                        e.preventDefault();
                        this.setState({
                            id: e.target.value
                        })
                    }.bind(this)} onFocus={function (e) {
                        e.preventDefault();
                        if (this.state.id === "Enter ID") {
                            this.setState({
                                id: ""
                            })
                        }
                    }.bind(this)} onBlur={function (e) {
                        e.preventDefault();
                        if (this.state.id === "") {
                            this.setState({
                                id: "Enter ID"
                            })
                        }
                    }.bind(this)} /> <br />
                    <div style={inputSepStyle}/>
                    <label htmlFor='pw'>Password: </label>
                    <input type='password' id='pw' name='pw' value={this.state.pw} onFocus={function (e) {
                        if (this.state.pw === "`~~`") {
                            this.setState({
                                pw: ""
                            })
                        }
                    }.bind(this)} onBlur={function (e) {
                        if (this.state.pw === "") {
                            this.setState({
                                pw: "`~~`"
                            })
                        }
                    }.bind(this)} onChange={function (e) {
                        this.setState({
                            pw: e.target.value
                        })
                        }.bind(this)} /><br />
                    <div style={inputSepStyle} />
                    {this.state.verifypw ? <label for='verifypw'>Verify password: </label> : null}
                    {this.state.verifypw ? <input type="password" id='verifypw' value={this.state.verpw} name='verifypw' onFocus={function (e) {
                        if (this.state.verpw === "`~~`") {
                            this.setState({
                                verpw: ""
                            })
                        }
                    }.bind(this)} onBlur={function (e) {
                        if (this.state.verpw === "") {
                            this.setState({
                                verpw: "`~~`"
                            })
                        }
                    }.bind(this)} onChange={function (e) {
                        this.setState({
                            verpw: e.target.value
                        })
                        }.bind(this)} /> : null}
                    {this.state.verifypw ? < div style={inputSepStyle} /> : null}
                    <a data-tip data-for="tooltip" style={linkStyle}>New to the community?</a>
                    <ReactTooltip id="tooltip" place="bottom" type="light" effect="solid" wrapper="div">
                        <p>Welcome to AISC student community website. Please enter the ID labeled on your AISC ID card.<br/> If you are new and it's your first time signing in, you can enter password you wish to use then push sign in.<br/>The website will require you to verify it by re-typing it. Re-type your password and push sign-in button again. Enjoy :)</p>
                    </ReactTooltip>
                    <div style={inputSepStyle}/>
                    <input type='submit' style={submitStyle} value="Sign in"/>
                </form>
            </div>

        );
    }
}

export default LoginForm;