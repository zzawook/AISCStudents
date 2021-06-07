import React, { Component } from 'react';
import Comment from './comment'

class CommentBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            commentInput: "Enter comment",
            numComments: -1,
            articleId: -1,
            user: ""
        };
    }
    screenWidth = window.innerWidth;
    pStyle = {
        backgroundColor: "#8a8a8a",
        padding: 5,
        borderRadius: 5,
        width: (this.screenWidth * 0.4) - 20
    }

    componentDidMount() {
        const prevComments = [];
        this.setState({
            articleId: this.props.articleId,
            user: this.props.user
        })
        fetch('https://aiscstudents.com/api/getComment/' + this.props.articleId, {
            method: 'GET',
            credentials: 'include',
            headers: {
                "cache-control": 'no-cache'
            }
        }).then((response) => {
            if (response.status === 301) {
                window.location.href = "https://aiscstudents.com/login";
                return;
            }
            else {
                response.json().then((jsonComments) => {
                    let tagList = []
                    let rawList = []
                    for (let i = 0; i < jsonComments.length; i++) {
                        if (jsonComments[i]['tag'] !== null) {
                            tagList.push(jsonComments[i])
                        }
                        else { rawList.push(jsonComments[i]) }
                    }
                    for (let i = 0; i < rawList.length; i++) {
                        let thisTagList = this.findTagged(parseInt(rawList[i]['order']), tagList, [])
                        prevComments.push(<Comment user={this.props.user} reply={this.handleReplyRequest} taggedComments={thisTagList} update={this.handleRefresh} articleId={this.props.articleId} order={rawList[i]['order']} writer={rawList[i]['writer']} comment={rawList[i]['content']} />)
                    }
                    this.setState({
                        comments: prevComments,
                        numComments: jsonComments.length
                    })
                })
            }
        })
    }

    findTagged = function (tag, tempList, copyNewList) {
        //variable 복사
        let list = tempList;
        let newList = copyNewList.slice()
        //tag 있는 코멘트 리스트 찾기
        let thisTagList = list.filter(x => x.tag == tag)
        //찾은 코멘트 빼기
        for (let i = 0; i < thisTagList.length; i++) {
            newList.push(thisTagList[i])
            list.splice(list.indexOf(thisTagList[i]),1)
        }
        //찾은 각 코멘트에 태그된 코멘트 찾기
        for (let i = 0; i < thisTagList.length; i++) {
            newList=this.findTagged(thisTagList[i]['order'], list, newList)
        }
        return newList
    }.bind(this)

    handleRefresh = function (e) {
        const prevComments = [];
        fetch('https://aiscstudents.com/api/getComment/' + this.state.articleId, {
            method: 'GET',
            credentials: 'include',
            headers: {
                "cache-control": 'no-cache'
            }
        }).then((response) => {
            if (response.status === 301) {
                window.location.href = "https://aiscstudents.com/login";
                return;
            }
            else {
                response.json().then((jsonComments) => {
                    let tagList = []
                    let rawList = []
                    for (let i = 0; i < jsonComments.length; i++) {
                        if (jsonComments[i]['tag'] !== null) {
                            tagList.push(jsonComments[i])
                        }
                        else { rawList.push(jsonComments[i]) }
                    }
                    for (let i = 0; i < rawList.length; i++) {
                        let thisTagList = this.findTagged(parseInt(rawList[i]['order']), tagList, [])
                        prevComments.push(<Comment user={this.props.user} reply={this.handleReplyRequest} taggedComments={thisTagList} update={this.handleRefresh} articleId={this.props.articleId} order={rawList[i]['order']} writer={rawList[i]['writer']} comment={rawList[i]['content']} />)
                    }
                    this.setState({
                        comments: prevComments,
                        numComments: jsonComments.length
                    })
                })
            }
        })
    }.bind(this)

    handleReplyRequest = function (order) {
        const prevComment = this.state.commentInput
        let newComment=""
        if (prevComment.substring(0, 1) === "#") {
            const indexOfNextSpace = prevComment.indexOf(' ')
            newComment = prevComment.replace(prevComment.substring(0, indexOfNextSpace), '#' + order.toString() + ' ')
        }
        else if (prevComment === "Enter comment") {
            newComment = '#'+order.toString()+' '
        }
        else {
            newComment = '#' + order.toString() + ' ' + prevComment+' '
        }
        this.setState({
            commentInput: newComment
        })
    }.bind(this)

    handleSubmit = function (e) {
        e.preventDefault()
        //const newComments = this.state.comments.map(l => Object.assign({}, l));
        //newComments.push(<Comment user={this.state.user} reply={this.handleReplyRequest} reply={this.handleReplyRequest} update = { this.handleRefresh } articleId={this.state.articleId} order={this.state.numComments + 1} writer={this.state.user} comment={this.state.commentInput} />)
        let formData = new FormData();
        let isTagged = false
        if (this.state.commentInput.substring(0, 1) == "#") {
            isTagged = true;
        }
        if (this.state.commentInput === "Enter comment" || this.state.commentInput==="") {
            alert("Please enter comment");
            return false
        }
        formData.append("commentBody", this.state.commentInput);
        formData.append("writer", this.props.user);
        formData.append("articleId", this.props.articleId)
        this.setState({
            commentInput: "Enter comment"
        })
        const url = "https://aiscstudents.com/api/comment/"
        fetch(url, {
            body: formData,
            method: "POST",
            credentials: 'include',
            headers: {
                'Access-Control-Allow-Origin': "localhost:3030",
                "cache-control": 'no-cache'
            }
        }).then((response) => {
            if (response.status === 200) {
                if (isTagged) {
                    window.alert("Tagged comments need commend to be closed and re-opened, or refreshed to be updated.")
                }
                this.handleRefresh()
            }
            else {
                window.alert("There was an error submitting your comment. Please try again, and if the error continues, please contact us via 'Contact' tab")
            }
        })
    }.bind(this)


    render() {
        const screenWidth = window.innerWidth;
        const commentInputContainerStyle = {
            position: 'relative',
            width: (screenWidth * 0.4) - 20,
            backgroundColor: '#c7c7c7',
            paddingTop: '5px',
            paddingBottom: '5px',
            borderRadius: '5px',
            marginBottom: '15px',
            marginTop: "5px",
            padding: '5px',
        }
        const commentInputStyle = {
            backgroundColor: '#c7c7c7',
            color: 'black',
            border: 'none',
            width: (screenWidth * 0.4) - 80,
            height: '22px',
            fontSize: '15px',
            position: 'relative',
            left: '0px',
            overflow: 'auto'
        }
        const submitStyle = {
            position: 'absolute',
            bottom: '19px',
            left: `${(screenWidth * 0.4) - 60}px`,
            border: 'none',
            padding: '7px',
            color: 'white',
            backgroundColor: "#3d3d3d",
            borderRadius: '5px'
        }
        const hrStyle = {
            borderTop: '1px solid gray',
            marginTop: '0px',
            marginBottom: '0px',
            height: '0px',
            borderBottom: 'none',
            borderLeft: 'none',
            borderRight: 'none'
        }
        return (
            <div>
                <hr style={hrStyle}/>
                {this.state.comments}
                <form onSubmit={this.handleSubmit}>
                    <div style={commentInputContainerStyle}>
                    <input type='text' style={commentInputStyle} id='commentInput' name='commentInput' value={this.state.commentInput} onFocus={function (e) {
                        e.preventDefault();
                        if (this.state.commentInput==="Enter comment") {
                            this.setState({
                                commentInput:""
                            })
                            }
                            e.target.style.border = 'none';
                    }.bind(this)
                    } onBlur={function (e) {
                        if (this.state.commentInput==="") {
                            this.setState({
                                commentInput:"Enter comment"
                            })
                        }
                    }.bind(this)
                    } onChange={function (e) {
                        e.preventDefault();
                        this.setState({
                            commentInput: e.target.value
                        })
                            }.bind(this)} />
                        </div>
                    <input type="submit" id="submitButton" name="submitButton" style={submitStyle} value="Enter"/>
                </form>
            </div>
        );
    }
}

export default CommentBox;