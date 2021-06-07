import React, { Component } from 'react';
import TaggedComment from './taggedComment';

class TaggedCommentBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taggedComments: []
        }
    }

    componentDidMount() {
        let givenCommentList = this.props.taggedCommentList;
        let taggedCommentList = [];
        for (let i = 0; i < givenCommentList.length; i++) {
            taggedCommentList.push(<TaggedComment comment={givenCommentList[i]} update={this.props.update} reply={this.props.reply} user={this.props.user} articleId={this.props.articleId}/>)
        }
        this.setState({
            taggedComments: taggedCommentList,
            user: this.props.user
        })
    }

    render() {
        return (
            <div>
                {this.state.taggedComments}
            </div>
        );
    }
}

export default TaggedCommentBox;