import React, { Component } from 'react';

class TaggedComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            writer: "",
            writerShort: "",
            user: "",
            editMode: false,
            editingComment: "",
            order: -1
        };
        this.textInput = React.createRef();
    }

    screenWidth = window.innerWidth;

    componentDidMount() {
        const commentData = this.props.comment;
        let tempComment = commentData['content']
        if (tempComment.substring(0, 1) === '#') {
            const nextSpaceIndex = tempComment.indexOf(' ')
            tempComment = tempComment.substring(nextSpaceIndex + 1)
        }
        let tempThisPerson=false
        if (commentData['writer'] == this.props.user) {
            tempThisPerson = true
        }
        this.setState({
            comment: tempComment,
            editingComment: commentData['content'],
            writer: commentData['writer'],
            writerShort: commentData['writer'].substring(0, 15),
            user: this.props.user,
            thisPerson: tempThisPerson,
            order: commentData['order'],
            articleId: this.props.articleId,
            tag: commentData['tag']
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

    handleEdit = function (e) {
        e.preventDefault()
        if (this.state.editMode) {
            const uneditedComment = this.state.comment.toString()
            this.setState({
                editMode: false,
                editingComment: uneditedComment
            })
        }
        else {
            const uneditedComment = "#" + this.state.tag.toString() + " " + this.state.comment
            this.setState({
                editMode: true,
                editingComment: uneditedComment
            })
        }
    }.bind(this)

    handleCommentEdit = function (e) {
        this.setState({
            editingComment: e.target.value
        })
    }.bind(this)

    handleEditSubmit = function (e) {
        e.preventDefault()
        const editingComment = this.state.editingComment
        let tempTag = null
        if (editingComment.substring(0, 1) !== "#") {
            window.alert("Your edited comment should have a tag")
            return;
        }
        const nextSpaceIndex = editingComment.indexOf(' ')
        if (!editingComment.substring(1, nextSpaceIndex).match("[0-9]+")) {
            window.alert('Your tag can only contain 1 integer.')
            return;
        }
        else {
            tempTag = editingComment.substring(1, nextSpaceIndex)
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
                    comment: editingComment.substring(nextSpaceIndex+1),
                    tag: tempTag
                })
                this.textInput.current.blur()
            }
            else { window.alert("Error while editing comment. Please try again, and if the error continues, please contact us.") }
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
        const target = e.target;
        target.style.backgroundColor = '#8a8a8a'
    }

    handleMouseLeave = function (e) {
        const target = e.target;
        target.style.backgroundColor = '#3d3d3d'
    }

    render() {
        const menuStyle = {
            fontSize: '12px',
            backgroundColor: 'transparent',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            position: 'relative',
            left: '20px'
        }
        const pStyle = {
            backgroundColor: "#8a8a8a",
            padding: 5,
            borderRadius: 5,
            width: (this.screenWidth * 0.4) - 40,
            marginBottom: 0,
            marginTop: 10,
            overflow: 'auto',
            position: 'relative',
            left: '20px'
        }
        const editInputStyle = {
            backgroundColor: "#8a8a8a",
            padding: 5,
            border: 'none',
            borderRadius: 5,
            width: (this.screenWidth * 0.4) - 40,
            marginBottom: 0,
            marginTop: 10,
            height: 19,
            color: 'white',
            fontSize: '',
            position: 'relative',
            left: '20px',
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
        const tagStyle = {
            color: '#73cdeb'
        }
        return (
            <div>
                {this.state.editMode ?
                    <form style={formStyle} onSubmit={this.handleEditSubmit}>
                        <input style={editInputStyle} ref={this.textInput} type='text' id='editedComment' name='editedComment' onChange={this.handleCommentEdit} onBlur={this.handleEdit} value={this.state.editingComment} />
                        <input type='submit' id='submitButton' name='submitButton' value='Enter' style={submitStyle} onMouseDown={this.handleEditSubmit} />
                    </form>
                    :
                    <p style={pStyle}>{this.state.tag === null ? <span></span> : <span style={tagStyle}>#{this.state.tag} </span>}{this.state.comment}</p>
                }
                {this.state.thisPerson ? <nobr><span style={menuStyle} >#{this.state.order.toString()} - </span><button style={menuStyle} onClick={this.handleDelete} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} type='button'>Delete</button><span style={menuStyle} > | </span><button style={menuStyle} type='button' onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.handleEdit}>Edit</button><span style={menuStyle} > | </span><button style={menuStyle} type='button' onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.handleReply}>Reply</button><span style={menuStyle} > | by: {this.state.writerShort}</span></nobr> : <nobr><span style={menuStyle} >#{this.state.order.toString()} - </span><button style={menuStyle} type='button' onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.handleReply}>Reply</button><span style={menuStyle} > | by: {this.state.writerShort}</span></nobr>}
            </div>
        );
    }
}

export default TaggedComment;