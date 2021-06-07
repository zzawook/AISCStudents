import React, { Component } from 'react';

class Tags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: []
        };
    }

    commentIDStyle = {
        position: 'relative',
        left: '5px',
        top: `${(window.innerHeight * 0.02) - 8}px`,
        fontSize: '16px',
        color: 'gray',
        paddingLeft: '5px',
        paddingRight: '5px',
        borderRadius: '5px',
        border: '1px solid silver',
    }

    commentStyle = {
        borderBottom: '1px solid silver',
        borderTom: '1px solid silver',
        height: window.innerHeight * 0.05,
        width: '100%',
        cursor: 'pointer'
    }

    commentContentStyle = {
        position: 'relative',
        top: `${(window.innerHeight * 0.02) - 40}px`,
        left: '50px',
        width: `${((window.innerWidth * 0.25) - 15) * 0.8}px`,
        fontSize: '14px',
        overflow: 'hidden',
        height: '22px',
        paddingTop: '10px',
        paddingBottom: '20px'
    }

    componentDidMount() {
        fetch('https://aiscstudents.com/api/getTags/', {
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
                window.alert('An error has occurred')
                return;
            }
            response.json().then((json) => {
                const tempTags = []
                for (let i = 0; i < json.length; i++) {
                    tempTags.push(<div style={this.commentStyle} id={parseInt(json[i]['id'])} onClick={this.goToTag}><span id={parseInt(json[i]['id'])} style={this.commentIDStyle}>#{json[i]['id']}</span><div id={parseInt(json[i]['id'])} style={this.commentContentStyle} >{json[i]['hashTag']}</div></div>)
                }
                this.setState({
                    tags: [],
                    listContents: tempTags,
                })
            })
        })
    }

    goToTag = (e) => {
        e.preventDefault();
        const target = e.target;
        const articleId = target.id
        window.location.href = 'https://aiscstudents.com/?article=' + articleId.toString()
    }

    render() {
        const containerStyle = {
            backgroundColor: 'white',
            borderRadius: '5px',
            border: 'none',
            position: 'absolute',
            top: `${(window.innerHeight * 0.5) + 100}px`,
            left: `${((window.innerWidth * 0.25) + 15) * 3}px`,
            width: `${(window.innerWidth * 0.25)-60}px`,
            height: `${(window.innerHeight * 0.5) - 115}px`
        }
        const titleStyle = {
            position: 'relative',
            top: '10px',
            left: '25px',
            fontSize: '18px',
        }
        const hrStyle = {
            marginBottom: '0px',
            paddingBottom: '0px'
        }
        const tagsStyle = {
            position: 'relative',
            overflowY: 'auto',
            overflowX: 'hidden',
            top: '0px',
            height: `${(window.innerHeight * 0.5) - 159}px`,
        }
        return (
            <div style={containerStyle}>
                <span style={titleStyle} ><strong>Tags</strong></span>
                <hr style={hrStyle}/>
                <div style={tagsStyle}>
                    {this.state.listContents}
                </div>
            </div>
        );
    }
}

export default Tags;