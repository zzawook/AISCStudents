import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import PwModal from './pwModal';
import sha256 from 'js-sha256';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Test User Name",
            hashID: 'testHadhId',
            ID: 99999,
            preferredName: "Test Nickname",
            password: "",
            darkTheme: false,
            usePrefName: false,
            pwChangeOpen: false,
            idValue: 'Enter ID',
            nowPwValue: '`~~~~`',
            newPwValue: '`~`~`~',
            newPwAgainValue: '~`~`~`'
        };
    }

    componentDidMount() {
        fetch('https://aiscstudents.com/api/getProfile/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'cache-control': 'no-cache',
            }
        }).then(response => {
            if (response.status === 301) {
                window.location.href = "https://aiscstudents.com/login"
                window.alert('Not logged in')
                return;
            }
            response.json().then(json => {
                const preferredName=(json[0]['preferredName']===null?'No nickname':json[0]['preferredName'])
                this.setState({
                    name: json[0]['name'],
                    hashID: json[0]['hashID'],
                    preferredName: preferredName,
                    usePrefName: (json[0]['usePrefName'] === 0? false:true),
                    darkTheme: (json[0]['darkTheme'] === 0 ? false : true),
                    ID: json[0]['ID']
                })
            })
        })
    }

    handleOpenPWModal = function (e) {
        e.preventDefault();
        this.setState({
            pwChangeOpen: true
        })
    }.bind(this)

    handlePwChangeClose = (e) => {
        e.preventDefault()
        this.setState({
            pwChangeOpen: false,
            idValue: 'Enter ID',
            nowPwValue: "`~~~~`",
            newPwValue: "`~`~`~",
            newPwAgainValue: "~`~`~`"
        })
    }

    handleDarkTheme = function (e) {
        const target = e.target;
        fetch('https://aiscstudents.com/api/setDarkTheme/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'cache-control': 'no-cache'
            }
        }).then((response) => {
            if (response.status === 500) {
                window.alert("An error has occurred. Please retry. If the error continues, please contact us via 'Contact' tab")
                return;
            }
            else if (response.status === 301) {
                window.location.href = "https://aiscstudents.com";
                return;
            }
        })
        if (target.checked) {
            this.setState({
                darkTheme: true
            })
        }
        else {
            this.setState({
                darkTheme: false
            })
        }
    }.bind(this)

    handleUsePName = (e) => {
        const target = e.target;
        fetch('https://aiscstudents.com/api/setUsePreferredName/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'cache-control': 'no-cache'
            }
        }).then((response) => {
            if (response.status === 500) {
                window.alert("An error has occurred. Please retry. If the error continues, please contact us via 'Contact' tab")
                return;
            }
            else if (response.status === 301) {
                window.location.href = "https://aiscstudents.com";
                return;
            }
        })
        if (target.checked) {
            
            this.setState({
                usePrefName: true
            })
        }
        else {
            this.setState({
                usePrefName: false
            })
        }
    }

    handleIdInputFocus = (e) => {
        e.preventDefault()
        if (e.target.value === "Enter ID") {
            this.setState({
                idValue: ""
            })
        }
    }

    handleNowPwInputFocus = (e) => {
        e.preventDefault()
        if (e.target.value === "`~~~~`") {
            this.setState({
                nowPwValue: ""
            })
        }
    }

    handleNewPwInputFocus = (e) => {
        e.preventDefault()
        if (e.target.value === "`~`~`~") {
            this.setState({
                newPwValue: ""
            })
        }
    }

    handleNewPwAgainInputFocus = (e) => {
        e.preventDefault()
        if (e.target.value === "~`~`~`") {
            this.setState({
                newPwAgainValue: ""
            })
        }
    }

    handleIdInputBlur = (e) => {
        e.preventDefault();
        if (e.target.value.toString().trim() === "") {
            this.setState({
                idValue: "Enter ID"
            })
        }
    }

    handleNowPwInputBlur = (e) => {
        e.preventDefault();
        if (e.target.value.toString().trim() === "") {
            this.setState({
                nowPwValue: "`~~~~`"
            })
        }
    }

    handleNewPwInputBlur = (e)=>{
        e.preventDefault();
        if (e.target.value.toString().trim() === "") {
            this.setState({
                newPwValue: "`~`~`~"
            })
        }
    }

    handleNewPwAgainInputBlur = (e) => {
        e.preventDefault();
        if (e.target.value.toString().trim() === "") {
            this.setState({
                newPwAgainValue: "~`~`~`"
            })
        }
    }

    handleIdInputChange = (e) => {
        e.preventDefault();
        this.setState({
            idValue: e.target.value
        })
    }

    handleNowPwInputChange = (e) => {
        e.preventDefault();
        this.setState({
            nowPwValue: e.target.value
        })
    }

    handleNewPwInputChange = (e) => {
        e.preventDefault();
        this.setState({
            newPwValue: e.target.value
        })
    }

    handleNewPwAgainInputChange = (e) => {
        e.preventDefault();
        this.setState({
            newPwAgainValue: e.target.value
        })
    }

    handlePwChangeSubmit = (e) => {
        e.preventDefault();
        if (this.state.idValue.length === 0 || this.state.idValue === 'Enter ID' || this.state.nowPwValue === '' || this.state.nowPwValue === '`~~~~`' || this.state.newPwValue === "" || this.state.newPwValue === "`~`~`~" || this.state.newPwAgainValue === "" || this.state.newPwAgainValue === "~`~`~`") {
            window.alert("Please enter all fields.")
            return;
        }
        if (this.state.newPwValue.length < 6) {
            window.alert('Your new password should be at least 6 characters.')
            return;
        }
        if (!(/^\d+$/.test(this.state.idValue))) {
            window.alert("Your ID should only contain number")
            return;
        }
        if (this.state.idValue.length !== 5) {
            window.alert("Your ID should be 5 digit number.")
            return;
        }
        if (this.state.newPwAgainValue !== this.state.newPwValue) {
            window.alert("Your new password confirmation does not match.")
            return;
        }
        const formData = new FormData();
        formData.append('id', sha256(this.state.idValue));
        formData.append('nowPw', sha256(this.state.nowPwValue));
        formData.append('newPw', sha256(this.state.newPwValue));
        fetch('https://aiscstudents.com/api/changePassword/', {
            body: formData,
            method: 'POST',
            credentials: 'include',
            headers: {
                'cache-control': 'no-cache'
            }
        }).then((response) => {
            if (response.status === 500) {
                window.alert("An error has occurred. Please retry. If the error continues, please contact us via 'Contact' tab")
                return;
            }
            else if (response.status === 301) {
                window.location.href = "https://aiscstudents.com/login";
                return;
            }
            else if (response.status === 202) {
                window.alert("Error! This account was not activated. Redirecting to login page.")
                window.location.href = "https://aiscstudents.com/login";
                return;
            }
            else if (response.status === 403) {
                window.alert("You entered wrong ID/password.")
                return;
            }
            else if (response.status === 200) {
                window.alert("Your password was changed. Redirecting to login page.")
                window.location.href= 'https://aiscstudents.com/login'
                return;
            }
            else {
                window.alert("Unknown error.")
            }
        })
    }

    handlePrefNameChange = (e) => {
        e.preventDefault();
        const target = e.target;
        this.setState({
            preferredName: target.value
        })
    }

    handlePrefNameSubmit = (e) => {
        e.preventDefault();
        if (this.state.preferredName.trim() == 'No nickname' || this.state.preferredName.trim() == "") {
            window.alert("Your nickname is not valid. Please enter other nickname")
        }
        const formData = new FormData();
        formData.append('nickName', this.state.preferredName)
        fetch('https://aiscstudents.com/api/setPrefName/', {
            method: 'POST',
            credentials: 'include',
            body: formData,
            headers: {
                'cache-control': 'no-cache'
            }
        }).then((response) => {
            if (response.status === 301) {
                window.location.href = "https://aiscstudents.com/login"
                window.alert('Not logged in')
                return;
            }
            else if (response.status === 500) {
                window.alert("An error has occurred. Please retry. If the error continues, please contact us via 'Contact' tab");
                return;
            }
            else if (response.status === 200) {
                window.alert('Your nickname was set')
            }
        })
    }

    render() {
        const containerStyle = {
            position: 'absolute',
            top: '85px',
            left: '15px',
            backgroundColor: 'white',
            width: `${(window.innerWidth * 0.6)-10}px`,
            height: `${window.innerHeight * 0.5}px`,
            border: 'none',
            borderRadius: '5px'
        }
        const welcomeStyle = {
            position: 'absolute',
            top: '10px',
            left: '10px',
            fontSize: '15px'
        }
        const nameStyle = {
            position: 'absolute',
            top: '30px',
            left: '10px',
            fontSize: '30px'
        }
        const formStyle = {
            position: 'absolute',
            top: '160px',
            left: '10px'
        }
        const hrStyle = {
            position: 'absolute',
            top: '65px',
            width: `${(window.innerWidth * 0.6)-15}px`,
            left: `7.5px`,
            borderStyle: 'solid',
            borderColor: 'silver'
        }
        const vrStyle = {
            width: '1px',
            borderLeft: '0.1px solid silver',
            height: `${(window.innerHeight * 0.5)-88.5}px`,
            position: 'absolute',
            top: '81px',
            left: '160px'
        }
        const profileBriefTitleStyle = {
            position: 'absolute',
            top: '90px',
            left: '0px',
            width: '160px'
        }
        const nameTitleStyle = {
            position: 'absolute',
            top: '0px',
            width: '150px',
            textAlign: 'right'
        }
        const gradeTitleStyle = {
            position: 'absolute',
            top: '40px',
            width: '150px',
            textAlign: 'right'
        }
        const hashIdTitleStyle = {
            position: 'absolute',
            top: '80px',
            float: 'right',
            width: '150px',
            textAlign: 'right'
        }
        const preferredNameTitleStyle = {
            position: 'absolute',
            top: '120px',
            width: '150px',
            float: 'right',
            textAlign: 'right'
        }
        const nameContentStyle = {
            positon: 'absolute',
            top: '0px',
            textAlign: 'left'
        }
        const gradeContentStyle = {
            position: 'absolute',
            top: '40px',
            textAlign: 'left'
        }
        const hashIdContentStyle = {
            position: 'absolute',
            top: '80px',
            float: 'left',
            width: '160px'
        }
        const profileBriefContentStyle = {
            position: 'absolute',
            top: '90px',
            left: '165px',
            width: `${(window.innerWidth*0.6)-160}px`
        }
        const preferredNameContentStyle = {
            position: 'absolute',
            top: '120px',
            float: 'left',
            width: `${((window.innerWidth * 0.6) - 160) * 0.8}px`,
            border: '1px solid silver',
            borderRadius: '5px'
        }
        const darkThemeTitleStyle = {
            position: 'absolute',
            top: '160px',
            width: '150px',
            textAlign: 'right'
        }
        const usePNameTitleStyle = {
            position: 'absolute',
            top: '200px',
            width: '150px',
            textAlign: 'right',
            lineHeight: '90%'
        }
        const usePNameContentStyle = {
            position: 'relative',
            top: '19px'
        }
        const changePasswordTitleStyle = {
            position: 'absolute',
            top: '240px',
            width: '150px',
            textAlign: 'right'
        }
        const changePasswordContentStyle = {
            position: 'absolute',
            top: '240px',
            textAlign: 'left',
            backgroundColor: '#6870C4',
            border: '1px solid silver',
            borderRadius: '5px',
            color: 'white'
        }
        const h2Style = {
            textAlign: 'center',
            position: 'relative',
            top: '20px',
            color: 'black',
            zIndex: '-1'
        }
        const submitButtonStyle = {
            position: 'absolute',
            top: '20px',
            right: '20px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#4742A8',
            color: 'white',
            padding: '10px'
        }
        const searchedFriendListStyle = {
            position: 'relative'
        }
        const modalHrStyle = {
            borderTop: '1px solid black',
            position: 'relative',
            top: '20px',
            marginTop: '10px',
            marginBottom: '0px',
            marginleft: '0px',
            marginRight: '0px'
        }
        const enterIDLabelStyle = {
            color: 'black',
            position: 'absolute',
            top: '80px',
            left: `${(window.innerWidth * 0.075)}px`,
            fontSize: '13px',
            width: '300px'
        }
        const enterNowPwStyle = {
            color: 'black',
            position: 'absolute',
            top: '140px',
            left: `${(window.innerWidth * 0.075)}px`,
            fontSize: '13px',
            width: '300px'
        }
        const enterNewPwStyle = {
            color: 'black',
            position: 'absolute',
            top: '200px',
            left: `${(window.innerWidth * 0.075)}px`,
            fontSize: '13px',
            width: '300px'
        }
        const enterNewPwAgainStyle = {
            color: 'black',
            position: 'absolute',
            top: '260px',
            left: `${(window.innerWidth * 0.075)}px`,
            fontSize: '13px',
            width: '300px'
        }
        const idInputStyle = {
            position: 'absolute',
            top: '105px',
            width: `${(window.innerWidth * 0.2)}px`,
            height: '25px',
            left: `${(window.innerWidth * 0.075)}px`,
            fontSize: '15px'
        }
        const nowPwInputStyle = {
            position: 'absolute',
            top: '165px',
            width: `${(window.innerWidth * 0.2)}px`,
            height: '25px',
            left: `${(window.innerWidth * 0.075)}px`,
            fontSize: '15px'
        }
        const newPwInputStyle = {
            position: 'absolute',
            top: '225px',
            width: `${(window.innerWidth * 0.2)}px`,
            height: '25px',
            left: `${(window.innerWidth * 0.075)}px`,
            fontSize: '15px'
        }
        const newPwAgainInputStyle = {
            position: 'absolute',
            top: '285px',
            width: `${(window.innerWidth * 0.2)}px`,
            height: '25px',
            left: `${(window.innerWidth * 0.075)}px`,
            fontSize: '15px'
        }
        const preferredNameSubmitStyle = {
            position: 'absolute',
            top: '120px',
            left: `${((window.innerWidth * 0.6) - 160) * 0.8}px`,
            border: '1px solid darkgray',
            borderRadius: '5px',
            backgroundColor: !this.state.usePrefName || this.state.preferredName.trim() == 'No nickname' || this.state.preferredName.trim() == "" ? 'transparent' : '#4742A8',
            color: !this.state.usePrefName || this.state.preferredName.trim() == 'No nickname' || this.state.preferredName.trim() == "" ? 'gray' : 'white',
        }
        return (
            <div style={containerStyle} >
                <div>
                    {this.state.pwChangeOpen ?
                        < PwModal
                            visible={this.state.pwChangeOpen}
                            closable={true}
                            maskClosable={true}
                            onClose={this.handlePwChangeClose}>
                            <h2 style={h2Style}>Change Password</h2>
                            <button style={submitButtonStyle} type='submit' form='form1'>Submit</button>
                            <hr style={modalHrStyle} />
                            <form id='form1' onSubmit={this.handlePwChangeSubmit}>
                                <label style={enterIDLabelStyle} htmlFor='idInput'>Enter School ID</label>
                                <input type='text' style={idInputStyle} name='idInput' id='idInput' value={this.state.idValue} onFocus={this.handleIdInputFocus} onChange={this.handleIdInputChange} onBlur={this.handleIdInputBlur}/>
                                <label style={enterNowPwStyle} htmlFor='nowPwInput'>Enter Current Password</label>
                                <input type='password' style={nowPwInputStyle} name='nowPwInput' id='nowPwInput' value={this.state.nowPwValue} onFocus={this.handleNowPwInputFocus} onChange={this.handleNowPwInputChange} onBlur={this.handleNowPwInputBlur}/>
                                <label style={enterNewPwStyle} htmlFor='newPwInput'>Enter New Password</label>
                                <input type='password' style={newPwInputStyle} name='newPwInput' id='newPwInput' value={this.state.newPwValue} onFocus={this.handleNewPwInputFocus} onChange={this.handleNewPwInputChange} onBlur={this.handleNewPwInputBlur}/>
                                <label style={enterNewPwAgainStyle} htmlFor='newPwAgainInput'>Enter New Password Again</label>
                                <input type='password' style={newPwAgainInputStyle} name='newPwAgainInput' id='newPwAgainInput' value={this.state.newPwAgainValue} onFocus={this.handleNewPwAgainInputFocus} onChange={this.handleNewPwAgainInputChange} onBlur={this.handleNewPwAgainInputBlur}/>
                                <ul style={searchedFriendListStyle}>
                                    {this.state.searchedFriendList}
                                </ul>
                            </form>
                        </PwModal> : <span></span>}
                </div>
                <div>
                    <p style={welcomeStyle}>Welcome,</p>
                    <p style={nameStyle} > <strong>{this.state.name}</strong></p>
                    <hr style={hrStyle} />
                    <div style={vrStyle}/>
                    <div style={profileBriefTitleStyle} >
                        <p style={nameTitleStyle}>Name</p><br />
                        <p style={gradeTitleStyle}>School ID</p><br /> 
                        <p style={hashIdTitleStyle} >Hash ID</p><br />
                        <p style={preferredNameTitleStyle}>Nickname</p><br />
                        <p style={darkThemeTitleStyle}>Use Dark Theme</p><br />
                        <p style={usePNameTitleStyle}>Use nickname in Community</p><br />
                        <p style={changePasswordTitleStyle}>Change Password</p><br />
                    </div>
                    <div style={profileBriefContentStyle}>
                        <p style={nameContentStyle}>{this.state.name}</p>
                        <p style={gradeContentStyle}>{this.state.ID}</p>
                        <p style={hashIdContentStyle}>{this.state.hashID}</p>
                        <input type='text' style={preferredNameContentStyle} value={this.state.preferredName} onChange={this.handlePrefNameChange} disabled={this.state.usePrefName ? false : true} />
                        <button style={preferredNameSubmitStyle} onClick={this.handlePrefNameSubmit} disabled={!this.state.usePrefName || this.state.preferredName.trim() == 'No nickname' || this.state.preferredName.trim() == ""}>OK</button>
                        <Form style={formStyle}>
                            {this.state.darkTheme ?
                                <Form.Check
                                    custom
                                    type='switch'
                                    id='darkThemeSelect'
                                    label={this.state.darkTheme ? "Dark Theme" : "Bright Theme"}
                                    onClick={this.handleDarkTheme}
                                    checked
                                /> :
                                <Form.Check
                                    custom
                                    type='switch'
                                    id='darkThemeSelect'
                                    label={this.state.darkTheme ? "Dark Theme" : "Bright Theme"}
                                    onClick={this.handleDarkTheme}
                                />}
                            {this.state.usePrefName ?
                                <FormCheck
                                    custom
                                    type="switch"
                                    id='nameUseSelect'
                                    label={this.state.usePrefName ? "Preferred Name" : "Hash ID"}
                                    style={usePNameContentStyle}
                                    onClick={this.handleUsePName}
                                    checked
                                /> :
                                <FormCheck
                                    custom
                                    type="switch"
                                    id='nameUseSelect'
                                    label={this.state.usePrefName ? "Preferred Name" : "Hash ID"}
                                    style={usePNameContentStyle}
                                    onClick={this.handleUsePName}
                                />}
                        </Form>
                        <button style={changePasswordContentStyle} onClick={this.handleOpenPWModal}>Click to Change Password</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;