import React, { Component } from 'react';

class CommentBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            commentInput: "Enter comment",
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
        for (let i = 0; i < this.props.comments.length; i++) {
            prevComments.push(<p style={this.pStyle}>{this.props.comments[i]}</p>)
        };
        this.setState({
            comments: prevComments
        })
    }

    handleSubmit = function (e) {
        e.preventDefault();
        const newComments = this.state.comments;
        newComments.push(<p style={this.pStyle}>{this.state.commentInput}</p>)
        this.setState({
            comments: newComments
        })
        let formData = new FormData();
        if (this.state.commentInput === "Enter comment" || this.state.commentInput==="") {
            alert("Please enter comment");
            return false
        }
        formData.append("commentBody", this.state.commentInput);
        formData.append("writer", this.props.writer);
        formData.append("articleId", this.props.articleId)
        const url = "/api/comment/"
        fetch(url, {
            body: formData,
            method: "POST",
            credentials: 'include',
            headers: {
                'Access-Control-Allow-Origin': "localhost:3030",
            }
        }).then((response) => {
            if (response === "Success") {
                console.log("success")
            }
            else console.log(response)
        })
        return false;
    }.bind(this)
    componentDidUpdate() {
        console.log(this.state.comments)
    }
    render() {
        const screenWidth = window.innerWidth;
        const pStyle = {
            backgroundColor: "#8a8a8a",
            padding: 5,
            borderRadius: 5,
            width: (this.screenWidth * 0.4) - 20
        }
        const commentInputContainerStyle = {
            position: 'relative',
            width: (screenWidth * 0.4) - 20,
            backgroundColor: '#e0e0e0',
            paddingTop: '5px',
            paddingBottom: '5px',
            borderRadius: '5px',
            marginBottom: '15px',
            paddingBottom: '5px',
            marginTop: "5px",
            padding: '5px',
            paddingTop: '5px',
        }
        const commentInputStyle = {
            backgroundColor: '#e0e0e0',
            color: 'black',
            border: 'none',
            width: (screenWidth * 0.4) - 80,
            height: '22px',
            fontSize: '15px',
            position: 'relative',
            left: '0px'
        }
        const submitStyle = {
            position: 'absolute',
            padding: "2px",
            bottom: '19px',
            left: `${(screenWidth * 0.4) - 60}px`,
            border: 'none',
            padding: '7px',
            color: 'white',
            backgroundColor: "#3d3d3d",
            borderRadius: '5px'
        }
        
        return (
            <div>
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