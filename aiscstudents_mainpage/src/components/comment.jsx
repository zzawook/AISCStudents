import React, { Component } from 'react';
import TaggedCommentBox from './taggedCommentBox';

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            writer: "",
            writerShort: "",
            user: "",
            editMode: false,
            editingComment: "",
            editMouseDown: false,
            editSubmitMouseDown: false,
            taggedComments: [],
            taggedCommentsOpen: false,
        };
        this.textInput = React.createRef();
    }

    screenWidth = window.innerWidth;

    componentDidMount() {
        let tempThisPerson=false
        if (this.props.writer == this.props.user) {
            tempThisPerson=true
        }
        let tempTag = null
        let tempComment=this.props.comment
        if (this.props.comment.substring(0, 1) === '#') {
            const nextSpaceIndex = this.props.comment.indexOf(' ')
            tempTag = this.props.comment.substring(1, nextSpaceIndex)
            tempComment=this.props.comment.substring(nextSpaceIndex+1)
        }
        this.setState({
            comment: tempComment,
            editingComment: this.props.comment,
            writer: this.props.writer,
            writerShort: this.props.writer.substring(0,15),
            user: this.props.user,
            thisPerson: tempThisPerson,
            order: this.props.order,
            articleId: this.props.articleId,
            taggedComments: this.props.taggedComments
        })
    }

    handleDelete = function (e) {
        e.preventDefault()
        if (window.confirm("Are you sure you want to delete comment " + this.state.order.toString() + " in article " + this.state.articleId.toString() + "?")) {
            fetch('https://aiscstudents.com/api/deleteComment/' + this.state.articleId.toString() + '/' + this.state.order.toString(), {
                method: 'POST',
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
                    if (response.status === 200) {
                        window.alert("Comment has been successfully deleted. Please refresh to see changes.")
                        this.props.update()
                    }
                }
            })
        }
    }.bind(this)

    handleEditMouseDown = function (e) {
        e.preventDefault()
        this.setState({
            editMouseDown: true
        })
    }.bind(this)

    handleEditMouseUp = function (e) {
        if (this.state.editMode) {
            const uneditedComment = this.state.comment.toString()
            this.setState({
                editMode: false,
                editingComment: uneditedComment,
                editMouseDown: false
            })
        }
        else {
            const uneditedComment = this.state.comment
            if (this.state.editMouseDown) {
                this.setState({
                    editMode: true,
                    editingComment: uneditedComment,
                    editMouseDown: false
                })
            }
        }
    }.bind(this)

    handleEditBlur = function (e) {
        e.preventDefault()
        if (!(this.state.editMouseDown || this.state.editSubmitMouseDown) && this.state.editMode) {
            this.setState({
                editMode: false
            })
        }
    }.bind(this)

    handleCommentEdit = function (e) {
        this.setState({
            editingComment: e.target.value
        })
    }.bind(this)

    handleEditMouseDown = function (e) {
        this.setState({
            editMouseDown: true
        })
    }.bind(this)

    handleEditSubmitMouseDown = function (e) {
        this.setState({
            editSubmitMouseDown: true
        })
    }.bind(this)

    handleEditSubmit = function (e) {
        e.preventDefault()
        this.setState({
            editSubmitMouseDown: false
        })
        const editingComment = this.state.editingComment
        let tempTag = null
        if (this.state.editingComment.trim() === "") {
            window.alert("Your edited comment should include letter(s).")
            return;
        }
        if (editingComment.substring(0, 1) === '#') {
            const nextSpaceIndex=editingComment.indexOf(' ')
            if (!editingComment.substring(1, nextSpaceIndex).match("[0-9]+")) {
                window.alert('your tag can only contain 1 integer.')
                return;
            }
            else {
                tempTag=editingComment.substring(1, nextSpaceIndex)
            }
        }
        let formData = new FormData()
        formData.append("commentBody", editingComment)
        fetch('https://aiscstudents.com/api/editComment/' + this.state.articleId + '/' + this.state.order, {
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: {
                "cache-control": 'no-cache'
            }
        }).then((response) => {
            if (response.status === 301) {
                window.location.href = "https://aiscstudents.com/login";
                return;
            }
            else if (response.status === 200) {
                window.alert("Comment was successfully edited.")
                this.setState({
                    comment: editingComment,
                    tag: tempTag,
                    editMode: false
                })
            }
            else {
                window.alert("Error while editing comment. Please try again, and if the error continues, please contact us.")
            }
        })
    }.bind(this)

    handleReply = function (e) {
        this.props.reply(this.state.order)
    }.bind(this)

    componentDidUpdate() {
        if (this.state.editMode) {
            this.textInput.current.focus()
        }
    }

    handleMouseEnter = function (e) {
        e.preventDefault()
        const target = e.target;
        target.style.backgroundColor='darkgray'
    }

    handleMouseLeave = function (e) {
        e.preventDefault()
        const target = e.target;
        target.style.backgroundColor='white'
    }

    handleViewTaggedCommentsClick = function (e) {
        e.preventDefault()
        this.setState({
            taggedCommentsOpen:true
        })
    }.bind(this)

    handleViewTaggedCommentClose = function (e) {
        e.preventDefault()
        this.setState({
            taggedCommentsOpen: false
        })
    }.bind(this)

    render() {
        const menuStyle = {
            fontSize: '12px',
            backgroundColor: 'transparent',
            color: 'black',
            border: 'none',
            borderRadius: '5px'
        }
        const pStyle = {
            backgroundColor: "#c7c7c7",
            padding: 5,
            borderRadius: 5,
            width: (this.screenWidth * 0.4) - 20,
            marginBottom: 0,
            marginTop: 10,
            overflow: 'auto'
        }
        const editInputStyle = {
            backgroundColor: "#8a8a8a",
            padding: 5,
            border: 'none',
            borderRadius: 5,
            width: (this.screenWidth * 0.4) - 20,
            marginBottom: 0,
            marginTop: 10,
            height: 19,
            color: 'white',
            fontSize: '',
            position: 'relative',
            overflow: 'visible'
        }
        const submitStyle = {
            backgroundColor: "#3d3d3d",
            border: 'none',
            borderRadius: '5px',
            color: 'white',
            position: 'relative',
            left: `${(this.screenWidth * 0.4) - 55}px`,
            padding: '3px',
            bottom: 26
        }
        const formStyle = {
            marginBottom: 0,
            paddingBottom: 0,
            height: 48,
            overflow: 'visible'
        }
        const viewRepliesStyle = {
            backgroundColor: "#3d3d3d",
            padding: 5,
            paddingBottom: 0,
            paddingTop:0,
            border: 'none',
            borderRadius: 5,
            marginBottom: 0,
            marginTop: 0,
            overflow: 'auto',
            color: 'white',
            fontSize: '11px'
        }
        return (
            <div>
                {this.state.editMode ?
                    <form style={formStyle} onSubmit={this.handleEditSubmit}>
                        <input style={editInputStyle} ref={this.textInput} type='text' id='editedComment' name='editedComment' onChange={this.handleCommentEdit} onBlur={this.handleEditBlur} value={this.state.editingComment} />
                        <input type='submit' id='submitButton' name='submitButton' value='Enter' style={submitStyle} onMouseDown={this.handleEditSubmitMouseDown} onMouseUp={this.handleEditSubmit}/>
                    </form>
                    :
                    <p style={pStyle}>{this.state.comment}</p>
                }
                {this.state.thisPerson ? <nobr><span style={menuStyle} >#{this.props.order.toString()} - </span><button style={menuStyle} onClick={this.handleDelete} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} type='button'>Delete</button><span style={menuStyle} > | </span><button style={menuStyle} type='button' onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onMouseDown={this.handleEditMouseDown} onMouseUp={this.handleEditMouseUp}>Edit</button><span style={menuStyle} > | </span><button style={menuStyle} type='button' onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.handleReply}>Reply</button><span style={menuStyle} > | by: {this.state.writerShort}</span></nobr> : <nobr><span style={menuStyle} >#{this.props.order.toString()} - </span><button style={menuStyle} type='button' onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.handleReply}>Reply</button><span style={menuStyle} > | by: {this.state.writerShort}</span></nobr>}
                {this.state.taggedComments.length > 0 ? <div>{this.state.taggedCommentsOpen ? <div><TaggedCommentBox taggedCommentList={this.state.taggedComments} reply={this.props.reply} update={this.props.update} user={this.state.user} articleId={this.state.articleId} /><button style={viewRepliesStyle} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.handleViewTaggedCommentClose}>Close Replies</button></div> : <button style={viewRepliesStyle} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.handleViewTaggedCommentsClick}> - View {this.state.taggedComments.length} Replies</button>}</div> : null}
            </div>
        );
    }
}

export default Comment;