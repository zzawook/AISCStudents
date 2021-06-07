import React, { Component } from 'react';
import Modal from './modal';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PwModal from './pwModal';
import ReactTooltip from 'react-tooltip';

const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

class Friend {
    constructor(hashID, nickName, prefName) {
        this.hashID = hashID;
        this.nickName = nickName;
        this.preferredName = prefName;
    }
    getHashId() {
        return this.hashID;
    }
    getNickName() {
        return this.nickName;
    }
    getPreferredName() {
        return this.preferredName;
    }
    setNickName(newName) {
        this.nickName = newName;
    }
    setPreferredName(newName) {
        this.preferredName = newName;
    }
    clearNickName() {
        this.nickName = null;
    }
}

class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchFriendOpen: false,
            searchedFriendList: [],
            searchedFriendNodes: [],
            searchValue: "Enter Friend's Hash ID",
            myFriendList: [],
            myFriendNodes: [],
            friendNodes: [],
            friendNameChangeOpen: false,
            currentfriendName: '',
            currentFriendHashID: '',
        };
    }

    gridStyle = {
        height: '60px',
        paddingTop: '5px',
        paddingLeft: '5px',
        paddingRight: '5px',
        textAlign: 'center'
    }

    gridMoldStyle = {
        height: '60px',
        marginBottom: '8px',
        width: `${(window.innerWidth * 0.25) - 44}px`
    }

    gridSpanStyle = {
        height: '60px',
        width: `${(window.innerWidth * 0.25) - 44}px`,
        wordWrap: 'break-word',
        textAlign: 'center'
    }

    friendDivStyle = {
        borderBottom: '1px solid silver',
        borderTom: '1px solid silver',
        height: window.innerHeight * 0.05,
        width: '100%',
        cursor: 'pointer',
    }

    friendContentStyle = {
        position: 'relative',
        top: `${(window.innerHeight * 0.02)-20}px`,
        left: '25px',
        width: `100%`,
        fontSize: '14px',
        overflow: 'hidden',
        height: '22px',
        paddingTop: '10px',
        paddingBottom: '20px',
    }

    componentDidMount() {
        fetch('https://aiscstudents.com/api/getMyFriends/', {
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
            else if (response.status === 500) {
                window.alert("An error has occurred. Please retry. If the error continues, please contact us via 'Contact' tab");
                return;
            }
            response.json().then(json => {
                let nodes=[]
                let myNodes = [];
                let list = [];
                for (let i = 0; i < json.length; i++) {
                    let usingNickName = json[i]['nickName'] === null ? (json[i]['preferredName'] === null ? "" : json[i]['preferredName'].toString()) : json[i]['nickName'].toString()
                    let usedNickName = (json[i]['nickName'] === null) && (json[i]['preferredName'] === null) ? "" : "| ";
                    myNodes.push(
                        <Grid style={this.gridMoldStyle} id={json[i]['hashID']}  item xs={6}>
                            <Paper style={this.gridStyle} id={json[i]['hashID']} className={this.classes.paper}><span id={json[i]['hashID']} style={this.gridSpanStyle}>{json[i]['hashID'].substring(0,27)}...<br/>{usingNickName}</span></Paper>
                        </Grid>)
                    list.push(new Friend(json[i]['hashID'], (json[i]['nickName'] === null) && (json[i]['preferredName'] === null) ? null : usingNickName, json[i]['preferredName']))
                    nodes.push(<div style={this.friendDivStyle} id={json[i]['hashID']} onClick={this.handleFriendClick}><div id={json[i]['hashID']} style={this.friendContentStyle} > {json[i]['hashID'].substring(0, 40)}... {usedNickName}{usingNickName}</div></div>)
                }
                this.setState({
                    myFriendList: list,
                    myFriendNodes: myNodes,
                    friendNodes: nodes
                })
            })
        })
    }

    handleFriendClick = (e) => {
        e.preventDefault();
        const target = e.target;
        let hisNickname = '';
        let hisHashID = '';
        for (let i = 0; i < this.state.myFriendList.length; i++) {
            if (this.state.myFriendList[i].getHashId() == target.id) {
                hisNickname = this.state.myFriendList[i].getNickName();
                hisHashID = this.state.myFriendList[i].getHashId();
                break;
            }
        }
        this.setState({
            friendNameChangeOpen: true,
            currentfriendName: hisNickname,
            currentFriendHashID: hisHashID,
        })
    }

    handleSubmitNewName = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('friendHashID', this.state.currentFriendHashID);
        formData.append('nickName', this.state.currentfriendName);
        fetch('https://aiscstudents.com/api/setName/', {
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: {
                'cache-control': 'no-cache',
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
                let myFriendList = this.state.myFriendList.slice();
                let friendListIndex = -1;
                for (let i = 0; i < myFriendList.length; i++) {
                    if (myFriendList[i].getHashId() == this.state.currentFriendHashID) {
                        this.state.currentfriendName == "" ? myFriendList[i].clearNickName() : myFriendList[i].setNickName(this.state.currentfriendName);
                        friendListIndex = i;
                        break;
                    }
                }
                let myFriendNodes = this.state.myFriendNodes.slice();
                for (let i = 0; i < myFriendNodes.length; i++) {
                    if (myFriendNodes[i].id == this.state.currentfriendHashID) {
                        myFriendNodes[i] =
                            <Grid style={this.gridMoldStyle} id={this.state.currentFriendHashID} onClick={this.handleAddFriend} item xs={6}>
                                <Paper style={this.gridStyle} id={this.state.currentFriendHashID} className={this.classes.paper}><span id={this.state.currentFriendHashID} style={this.gridSpanStyle}>{this.state.currentFriendHashID.substring(0,27)}...<br/>{this.state.currentfriendName}</span></Paper>
                            </Grid>;
                        break;
                    }
                }
                let myFriendDivs = this.state.friendNodes.slice()
                for (let i = 0; myFriendDivs.length; i++) {
                    if (myFriendDivs[i].props.id == this.state.currentFriendHashID) {
                        const clearName = (this.state.currentfriendName == "") && (myFriendList[friendListIndex].getPreferredName() == null) ? true : false;
                        let usedName = this.state.currentfriendName;
                        if (this.state.currentfriendName == "" && myFriendList[friendListIndex].getPreferredName() != null) {
                            usedName = myFriendList[friendListIndex].getPreferredName()
                        }
                        myFriendDivs[i] = <div style={this.friendDivStyle} id={this.state.currentFriendHashID} onClick={this.handleFriendClick}><div id={this.state.currentFriendHashID} style={this.friendContentStyle} > {this.state.currentFriendHashID.substring(0, 40)}... {clearName ? '' : "| "}{usedName}</div></div>
                        break;
                    }
                }
                this.setState({
                    myFriendNodes: myFriendNodes,
                    friendNodes: myFriendDivs,
                    myFriendList: myFriendList,
                    friendNameChangeOpen: false
                })
            }
        })
    }

    handleNewNameInputChange = (e) => {
        e.preventDefault();
        const target = e.target;
        this.setState({
            currentfriendName: target.value
        })
    }

    handleInputFocus = (e) => {
        e.preventDefault();
        if (this.state.searchValue === "Enter Friend's Hash ID") {
            this.setState({
                searchValue: ''
            })
        }    
    }

    handleInputBlur = (e) => {
        e.preventDefault();
        if (this.state.searchValue === "") {
            this.setState({
                searchValue: "Enter Friend's Hash ID"
            })
        }
    }

    handleInputChange = (e) => {
        e.preventDefault();
        this.setState({
            searchValue: e.target.value
        })
    }

    showAddFriend = (e) => {
        e.preventDefault();
        this.setState({
            searchFriendOpen: true,
        })
    }

    closeAddFriend = (e) => {
        e.preventDefault()
        this.setState({
            searchFriendOpen: false,
        })
    }

    closeRenameFriend = (e) => {
        e.preventDefault();
        this.setState({
            friendNameChangeOpen: false
        })
    }

    classes = this.props;

    handleAddFriend = (e) => {
        e.preventDefault();
        const target = e.target;
        if (window.confirm('Would you like to add ' + target.id.toString() + ' to your friend list?')) {
            const formData = new FormData()
            formData.append('hashID', target.id.toString())
            fetch('https://aiscstudents.com/api/addFriend/', {
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
                    window.location.href = "https://aiscstudents.com";
                    return;
                }
                else if (response.status === 200) {
                    fetch('https://aiscstudents.com/api/getMyFriends/', {
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
                        else if (response.status === 500) {
                            window.alert("An error has occurred. Please retry. If the error continues, please contact us via 'Contact' tab");
                            return;
                        }
                        response.json().then(json => {
                            let nodes = []
                            let myNodes = [];
                            let list = [];
                            for (let i = 0; i < json.length; i++) {
                                let usingNickName = json[i]['nickName'] === null ? (json[i]['preferredName'] === null ? "" : json[i]['preferredName'].toString()) : json[i]['nickName'].toString()
                                let usedNickName = (json[i]['nickName'] === null) && (json[i]['preferredName'] === null) ? "" : "| ";
                                myNodes.push(
                                    <Grid style={this.gridMoldStyle} id={json[i]['hashID']} item xs={6}>
                                        <Paper style={this.gridStyle} id={json[i]['hashID']} className={this.classes.paper}><span id={json[i]['hashID']} style={this.gridSpanStyle}>{json[i]['hashID'].substring(0, 27)}...<br />{usingNickName}</span></Paper>
                                    </Grid>)
                                list.push(new Friend(json[i]['hashID'], (json[i]['nickName'] === null) && (json[i]['preferredName'] === null) ? null : usingNickName, json[i]['preferredName']))
                                nodes.push(<div style={this.friendDivStyle} id={json[i]['hashID']} onClick={this.handleFriendClick}><div id={json[i]['hashID']} style={this.friendContentStyle} > {json[i]['hashID'].substring(0, 40)}... {usedNickName}{usingNickName}</div></div>)
                            }
                            this.setState({
                                myFriendList: list,
                                myFriendNodes: myNodes,
                                friendNodes: nodes,
                                searchValue: "Enter Friend's Hash ID",
                                searchFriendOpen: false,
                            })
                        })
                    })
                }
            })
        }
    }

    searchFriend = (e) => {
        e.preventDefault();
        if (this.state.searchValue.length < 4) {
            window.alert("Your search keyword should be at least 4 characters long")
            return;
        }
        const formData = new FormData();
        formData.append('key', this.state.searchValue)
        const getHashIDPromise = new Promise((resolve, reject) => {
            fetch('https://aiscstudents.com/api/whoami/', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'cache-control': 'no-cache'
                }
            }).then(response => {
                if (response.status == 500) {
                    reject("Error")
                }
                else if (response.status == 301) {
                    reject("Login")
                }
                else {
                    response.json().then(json => {
                        const hashID = json[0]['hashID']
                        resolve(hashID)
                    })
                }
            })
        })
        getHashIDPromise.then(result => {
            if (result == "Error") {
                window.alert("An error has occurred. Please retry. If the error continues, please contact us via 'Contact' tab")
            }
            else if (result == 'Login') {
                window.location.href = 'https://aiscstudents.com/login'
            }
            else {
                const hashID = result;
                fetch('https://aiscstudents.com/api/searchFriend/', {
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
                        window.location.href = "https://aiscstudents.com";
                        return;
                    }
                    else if (response.status === 200) {
                        response.json().then((json) => {
                            let nodes = []
                            for (let i = 0; i < json.length; i++) {
                                let isFriend = false;
                                for (let j = 0; j < this.state.myFriendList.length; j++) {
                                    if (this.state.myFriendList[j].getHashId() == json[i]['hashID']) {
                                        isFriend = true;
                                    }
                                }
                                if (json[i]['hashID'].toString() != hashID.toString() && !isFriend) {
                                    nodes.push(
                                        <Grid style={this.gridMoldStyle} id={json[i]['hashID']} onClick={this.handleAddFriend} item xs={6}>
                                            <Paper style={this.gridStyle} id={json[i]['hashID']} className={this.classes.paper}><span id={json[i]['hashID']} style={this.gridSpanStyle}>{json[i]['hashID']}</span></Paper>
                                        </Grid>)
                                }
                            }
                            this.setState({
                                searchedFriendNodes: nodes,
                                searchedFriendList: json
                            })
                        })
                    }
                })
            }
        })
        
    }

    render() {
        const containerStyle = {
            backgroundColor: 'white',
            borderRadius: '5px',
            border: 'none',
            position: 'absolute',
            top: `85px`,
            left: `${(window.innerWidth*0.6)+20}px`,
            width: `${(window.innerWidth * 0.4)-35}px`,
            height: `${(window.innerHeight * 0.5)}px`
        }
        const titleStyle = {
            position: 'relative',
            top: '10px',
            left: '25px',
            fontSize: '18px',
        }
        const searchIconStyle = {
            position: 'absolute',
            bottom: '15px',
            right: '15px',
            width: '40px',
            height: '40px',
            cursor: 'pointer'
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
        const searchInputStyle = {
            position: 'relative',
            top: '10px',
            width: `${(window.innerWidth * 0.5) - 100}px`,
            height: '30px',
            left: `10px`,
            fontSize: '18px'
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
        const searchInstructStyle = {
            position: 'relative',
            top: '0px',
            left: '10px',
            color: 'black',
            fontSize: '11px',
            paddingTop: '5px',
            marginBottom: '0px',
            paddingBottom: '0px'
        }
        const searchImgStyle = {
            position: 'relative',
            right: '-20px',
            top: '7px',
            width: '27px',
            cursor: 'pointer'
        }
        const searchResultStyle = {
            backgroundColor: '#f3f3f3',
            width: `${(window.innerWidth * 0.5) - 40}px`,
            height: `${window.innerHeight * 0.25}px`,
            position: 'absolute',
            top: '75px',
            zIndex: '-1'
        }
        const modalHr2Style = {
            borderTop: '1px solid black',
            position: 'relative',
            top: `${(window.innerHeight * 0.25)+25}px`,
            marginTop: '10px',
            marginBottom: '0px',
            marginleft: '0px',
            marginRight: '0px',
            zIndex: '15000'
        }
        const myFriendListDivStyle = {
            backgroundColor: '#eeeeee',
            width: `${(window.innerWidth * 0.5) - 40}px`,
            height: `${(window.innerHeight * 0.65)-115}px`,
            position: 'absolute',
            top: `${(window.innerHeight*0.25)+100}px`,
        }
        const myFriendSpanStyle = {
            position: 'absolute',
            top: '5px',
            left: '15px',
            color: 'black',
            fontSize: '14px'
        }
        const { classes } = this.props;
        const gridDivStyle = {
            position: 'relative',
            top: '15px',
            left: '10px',
            cursor: 'pointer',
            width: `${(window.innerWidth * 0.5) - 60}px`,
            height: `${(window.innerHeight * 0.25)-60}px`,
            overflowY: 'auto',
            overflowX: 'hidden'
        }
        const friendListDivStyle = {
            position: 'relative',
            width: `${(window.innerWidth * 0.4) - 35}px`,
            height: `${(window.innerHeight * 0.5) - 42}px`,
            paddingRight: '0px',
            marginRight: '0px',
            overflowY: 'auto',
            overflowX: 'hidden'
        }
        const friendListHrStyle = {
            marginBottom: '0px',
            borderTop: '1px solid darkgray'
        }
        const newNameInputStyle = {
            position: 'relative',
            top: '50px',
            width: `${(window.innerWidth * 0.3)}px`,
            height: '25px',
            fontSize: '15px'
        }
        const modalFriendHashIDLabelStyle = {
            position: 'relative',
            top: '45px',
            left: '0px',
            color: 'black',
            fontSize: '18px',
            paddingTop: '5px',
            marginBottom: '0px',
            paddingBottom: '0px'
        }
        const modalFriendHashIDStyle = {
            position: 'relative',
            left: '0px',
            top: '20px',
            color: 'black',
            fontSize: '14px',
            paddingTop: '25px',
            marginBottom: '0px',
            paddingBottom: '0px',
            wordBreak: 'break-all',
            width: `${435 > window.innerWidth * 0.35 ? 405 : ((window.innerWidth * 0.35) - 40)}px`
        }
        const modalFriendNicknameLabelStyle = {
            position: 'relative',
            top: '45px',
            left: '0px',
            color: 'black',
            fontSize: '18px',
            paddingTop: '5px',
            marginBottom: '0px',
            paddingBottom: '0px'
        }
        const myFriendListGridStyle = {
            position: 'relative',
            top: '30px',
            left: '10px',
            width: `${(window.innerWidth * 0.5) - 50}px`,

        }
        const linkStyle = {
            position: 'absolute',
            left: '25px',
            bottom: '10px',
            width: '20px',
            height: '20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: 'darkgray',
            fontSize: '13px',
            paddingLeft: '8px',
            zIndex: '12498'
        }
        const tooltipStyle = {
            zIndex: '12498'
        }
        const finalInfoStyle = {
            position: 'relative',
            top: '70px',
            color: 'black',
            fontSize: '12px',

        }
        return (
            <div style={containerStyle}>
                <div>
                    {this.state.searchFriendOpen ?
                        < Modal
                            visible={this.state.searchFriendOpen}
                            closable={true}
                            maskClosable={true}
                            onClose={this.closeAddFriend}>
                            <h2 style={h2Style}>Add Friend</h2>
                            <button style={submitButtonStyle} type='submit' form='form1'>Submit</button>
                            <hr style={modalHrStyle} />
                            <div style={searchResultStyle}>
                                <p style={searchInstructStyle} > Search hash ID</p>
                                <form id='form1' onSubmit={this.handleSubmitForm}>
                                    <input type='text' style={searchInputStyle} value={this.state.searchValue} onFocus={this.handleInputFocus} onBlur={this.handleInputBlur} onChange={this.handleInputChange} />
                                    <img src='/setting/images/search.png' style={searchImgStyle} alt="search" onClick={this.searchFriend} />
                                    <div style={gridDivStyle} className={classes.root}>
                                        <Grid container spacing={1}>
                                            {this.state.searchedFriendNodes}
                                        </Grid>
                                    </div>
                                </form>
                            </div>
                            <hr style={modalHr2Style} />
                            <div style={myFriendListDivStyle}>
                                <span style={myFriendSpanStyle} > My Friend</span>
                                <Grid container spacing={1} style={myFriendListGridStyle}>
                                    {this.state.myFriendNodes}
                                </Grid>
                                
                            </div>
                            
                        </Modal> : <span></span>}
                </div>
                <div>
                    {this.state.friendNameChangeOpen ?
                        < PwModal
                            visible={this.state.friendNameChangeOpen}
                            closable={true}
                            maskClosable={true}
                            onClose={this.closeRenameFriend}>
                            <h2 style={h2Style}>Change Friend's Name</h2>
                            <button style={submitButtonStyle} type='submit' form='form2'>Submit</button>
                            <hr style={modalHrStyle} />
                            <p style={modalFriendHashIDLabelStyle}><strong>Friend's Hash ID: </strong></p>
                            <p style={modalFriendHashIDStyle} >{this.state.currentFriendHashID} <br /></p>
                            
                            <p style={modalFriendNicknameLabelStyle}><strong>This friend's nickname: </strong></p>
                            <form id='form2' onSubmit={this.handleSubmitNewName}>
                                <input type='text' style={newNameInputStyle} value={this.state.currentfriendName} onFocus={this.handleInputFocus} onBlur={this.handleInputBlur} onChange={this.handleNewNameInputChange} />
                            </form>
                            <p style={finalInfoStyle}>*To use this friend's hash ID or his or her self-defined nickname, clear your custom nickname</p>
                            
                        </PwModal> : <span></span>}
                </div>
                <div>
                    <span style={titleStyle} ><strong>Friends</strong></span>
                    <a data-tip data-for="tooltip" style={linkStyle}><strong>i</strong></a>
                    <ReactTooltip id="tooltip" place="top" type="light" effect="solid" wrapper="div" style={tooltipStyle}>
                        <p>The hash ID or nickname set by the user himself or herself will be replaced with nickname you enter here.<br/><br/>The nickname displayed when you first add friend is the nickname set by the user himself or herself<br/>If the user has not set any nickname and you have not set any custom nickname either, no nickname would be displayed</p>
                    </ReactTooltip>
                    <hr style={friendListHrStyle} />
                    <div style={friendListDivStyle} className={classes.root}>
                        {this.state.friendNodes}
                    </div>
                    <img style={searchIconStyle} src='https://aiscstudents.com/setting/images/add.png' alt='search' onClick={this.showAddFriend} />
                </div>
            </div>
        );
    }
}

export default withStyles(useStyles)(Friends);