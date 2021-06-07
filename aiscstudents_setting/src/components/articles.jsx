import React, { Component } from 'react';

class Articles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles:[],
            listContents:[],
        };
    }

    articleIDStyle = {
        position: 'relative',
        left: '5px',
        top: `${(window.innerHeight*0.02)-8}px`,
        fontSize: '16px',
        color: 'gray',
        paddingLeft: '5px',
        paddingRight: '5px',
        borderRadius: '5px',
        border: '1px solid silver',
    }

    articleStyle = {
        borderBottom: '1px solid silver',
        borderTom: '1px solid silver',
        height: window.innerHeight * 0.05,
        width: '100%',
        cursor: 'pointer'
    }

    articleContentStyle = {
        position: 'relative',
        top: `${(window.innerHeight * 0.02)-40}px`,
        left: '50px',
        width: `${((window.innerWidth * 0.25) - 15) * 0.8}px`,
        fontSize: '14px',
        overflow: 'hidden',
        height: '22px',
        paddingTop: '10px',
        paddingBottom: '20px'
    }

    componentDidMount() {
        fetch('https://aiscstudents.com/api/getMyArticles/', {
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
                const tempArticles = []
                for (let i = 0; i < json.length; i++) {
                    tempArticles.push(<div style={this.articleStyle} id={parseInt(json[i]['id'])} onClick={this.goToArticle}><span id={parseInt(json[i]['id'])} style={this.articleIDStyle}>#{json[i]['id']}</span><div id={parseInt(json[i]['id'])} style={this.articleContentStyle} >{json[i]['content']}</div></div>)
                }
                this.setState({
                    articles: json,
                    listContents: tempArticles,
                })
            })
        })
    }

    goToArticle = function (e) {
        e.preventDefault();
        const target = e.target;
        const articleId = target.id
        window.location.href = 'https://aiscstudents.com/?article=' + articleId.toString();
    }

    render() {
        const containerStyle = {
            backgroundColor: 'white',
            borderRadius: '5px',
            border: 'none',
            position: 'absolute',
            top: `${(window.innerHeight * 0.5) + 100}px`,
            left: '15px',
            width: `${(window.innerWidth * 0.25) - 15}px`,
            height: `${(window.innerHeight * 0.5) - 115}px`,
            //overflowY: 'hidden'
        }
        const titleStyle = {
            position: 'relative',
            top: '10px',
            left: '25px',
            fontSize: '18px',
        }
        const hrStyle = {
            marginBottom: '0px'
        }
        const articlesStyle = {
            position: 'relative',
            overflowY: 'auto',
            height: `${(window.innerHeight * 0.5) - 159}px`,
            //top: ''
        }
        return (
            <div style={containerStyle}>
                <span style={titleStyle} ><strong>Articles</strong></span>
                <hr style={hrStyle} />
                <div style={articlesStyle}>
                    {this.state.listContents}
                </div>

            </div>
        );
    }
}

export default Articles;