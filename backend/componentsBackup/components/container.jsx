import React, { Component } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import CommentBox from './commentBox';
import ReactPlayer from 'react-player';

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            liked: false,
            commentOpen: false,
            media: [],
            articleId: -1,
            numLikes: -1,
            contents: "",
            comments: [],
            mediaComments: []
        }
    }
    componentDidMount() {
        const url = "/api/getArticle/" + this.props.articleId.toString();
        function sortInOrder(list) {
            let tempDict = {};
            for (let i = 0; i < list.length; i++) {
                tempDict[parseInt(list[i].split(":::")[0])] = list[i].split(":::")[1]
            }
            console.log("This is tempDict");
            console.log(tempDict)
            let tempList = [];
            let key = 1;
            while (Object.keys(tempDict).length > 0) {
                if (key in tempDict) {
                    tempList.push(tempDict[key]);
                    delete tempDict[key]
                    key++;
                }
            }
            return tempList;
        } 
        fetch(url, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin': "aiscstudents.com"
            }
        }).then((response) => response.json()
        ).then((json) => {
            console.log("here goes the data");
            console.log(json);
            if (json[0]['likedList'] != null) {
                const likedList = json[0]['likedList'].split('`~`');
                for (let i = 0; i < likedList.length; i++) {
                    if (likedList[i] === this.props.passcode) {
                        this.setState({
                            liked: true
                        })
                        break;
                    }
                } this.setState({ numLikes: likedList.length })
            }
            else this.setState({ numLikes: 0 })
            if (json[0]['commentList'] != null) {
                const commentList = sortInOrder(json[0]['commentList'].split("`~`"));
                console.log(commentList)
                this.setState({ comments: commentList })
            }
            if (json[0]['mediaLink'] != null) {
                const mediaList = sortInOrder(json[0]['mediaLink'].split("`~`"));
                this.setState({ media: mediaList })
            }
            this.setState({
                articleId: json[0]['id'],
                contents: json[0]['content'],
            })
        })
    }

    handleLike = function (e) {
        const formData = new FormData();
        formData.append("articleId", this.state.articleId);
        if (!this.state.liked) {
            fetch("/api/likeArticle/", {
                method: "POST",
                credentials: "include",
                body: formData,
                headers: {
                    "Access-Control-Allow-Origin": "localhost:3030"
                }
            }).then((response) => {
                if (response.status === 200) {
                    this.setState({
                        liked: true
                    })
                }
                else {
                    this.setState({
                        liked: false
                    })
                }
            })
        }
        else {
            fetch("/api/unlikeArticle/", {
                method: "POST",
                credentials: "include",
                body: formData,
                headers: {
                    "Access-Control-Allow-Origin": "localhost:3030"
                }
            }).then((response) => {
                if (response.status === 200) {
                    this.setState({
                        liked: false
                    })
                }
                else {
                    this.setState({
                        liked:true
                    })
                }
            })
        }
    }

    render() {
        const screenWidth = window.innerWidth;
        const buttonWidth = ((screenWidth * 0.4)) / 2;
        const leftMargin = screenWidth * 0.25;
        const containerStyle = {
            backgroundColor: "#3d3d3d",
            color: "white",
            padding: "10px",
            paddingTop: "10px",
            marginTop: "10px",
            marginBottom: this.state.commentOpen ? "0px" : "10px",
            fontFamily: "Roboto, Calibri",
            width: `${screenWidth * 0.4}px`,
            position: "relative",
            left: `${leftMargin}px`,
            zIndex: "2",
            borderRadius: "5px"
        }
        const contentStyle = {
            paddingLeft: "10px",
            minHeight: "35px"
        }
        const hrStyle = {
            border: "1px solid #8a8a8a",
        }
        let likeStyle = {
            position: "absolute",
            left: "10px",
            fontFamily: "Roboto, Calibri",
            borderRight: "2px solid #8a8a8a",
            borderTop: "2px solid #8a8a8a",
            borderBottom: "none",
            borderLeft: "none",
            backgroundColor: "gray",
            width: `${buttonWidth}px`,
            height: "35px",
            bottom: "0px",
            borderRadius: "4px",
            zIndex: 3
        }
        let commentButtonStyle = {
            position: "absolute",
            right: "10px",
            bottom: "0px",
            borderLeft: "2px solid #8a8a8a",
            borderTop: "2px solid #8a8a8a",
            borderBottom: "none",
            borderRight: "none",
            backgroundColor: "gray",
            width: `${buttonWidth}px`,
            height: "35px",
            borderRadius: "4px",
            zIndex: 3
        }
        const idStyle = {
            border: "2px solid #8a8a8a",
            padding: "3px",
            borderRadius: "6px",
        }
        const likeNumStyle = {
            border: "2px solid #8a8a8a",
            padding: "3px",
            borderRadius: "6px",
            position: 'absolute',
            right: "10px",
            top: 5
        }
        const imgStyle = {
            maxWidth: "780px",
            maxHeight: "750px",
            overflow: "hidden",
            position: "relative",
            left: "10px"
        }
        const commentStyle = {
            width: `${screenWidth * 0.4}px`,
            position: "relative",
            left: 0,
            backgroundColor: "#3d3d3d",
            padding: 2,
            borderRadius: 2,
            zIndex: 1,
            marginBottom: 20
        }
        const separatorHrStyle = {
            width: (screenWidth * 0.4) - 10,
            position: "absolute",
            left: 3
        }
        const separatorDivStyle = {
            height: 7
        }
        if (this.state.media.length === 0) {
            return (
                <div className="container" style={containerStyle}>
                    <span style={idStyle}># {this.state.articleId}</span>
                    <span style={likeNumStyle}> {this.state.numLikes} Likes</span>
                    <hr style={hrStyle} />
                    <p style={contentStyle}>{this.state.contents}</p>
                    <div>
                        <button style={likeStyle} onMouseEnter={function (e) {
                            e.preventDefault();
                            e.target.style.backgroundColor = "white";
                        }} onMouseLeave={function (e) {
                            e.preventDefault();
                            if (this.state.liked === false) {
                                e.target.style.backgroundColor = "gray";
                            }
                        }.bind(this)} onClick={function (e) {
                            e.preventDefault();
                            if (this.state.liked === false) {
                                this.setState({
                                    liked: true

                                })
                                e.target.style.backgroundColor = "white";
                                e.target.contents = "Liked"
                            }
                            else {
                                this.setState({
                                    liked: false
                                })
                                e.target.style.backgroundColor = "gray";
                                e.target.contents = "Like"
                            }
                        }.bind(this)}> {this.state.liked ? 'Liked' : 'Like'}</button>
                        <button style={commentButtonStyle} onMouseEnter={function (e) {
                            e.preventDefault();
                            e.target.style.backgroundColor = "white";
                            e.target.contents = "Liked";
                        }} onMouseLeave={function (e) {
                            e.preventDefault();
                            if (this.state.commentOpen === false) {
                                e.target.style.backgroundColor = "gray";
                            }
                        }.bind(this)} onClick={function (e) {
                            e.preventDefault();
                            e.target.style.backgroundColor = "white";
                            if (this.state.commentOpen === false) {
                                this.setState({
                                    commentOpen: true
                                });
                                e.target.style.backgroundColor = "white";
                            }
                            else {
                                this.setState({
                                    commentOpen: false
                                })
                                e.target.style.backgroundColor = "gray";
                            }
                        }.bind(this)}> Comment</button>
                    </div>
                    {this.state.commentOpen ? <div style={commentStyle}><hr style={separatorHrStyle} /><div style={separatorDivStyle}></div><CommentBox comments={this.state.comments} /></div> : null}
                </div>
            )
        }
        /* Generate media contents */
        let innerElement = [];
        const YoutubeSlide = ({ url, isSelected }: { url: string; isSelected?: boolean, controls: true }) => (
            <ReactPlayer width="100%" url={url} playing={isSelected} />
        );
        for (let i = 0; i < this.state.media.length; i++) {
            if (this.state.media[i].includes("https://youtu.be/")) {
                let videoId = this.state.media[i].split(".be/")[1];
                let embedLink = "https://youtube.com/embed/" + videoId;
                innerElement.push(
                    <div>
                        <YoutubeSlide url={embedLink} key={this.state.media[i]} alt="" />
                        <p className='legend'>{this.state.mediaComments[i]}</p>
                    </div>);
            }
            else {
                let imageLink = "http://aiscstudents.com" + this.state.media[i];
                console.log(imageLink);
                innerElement.push(
                    <div>
                        <img src={imageLink} key={this.state.media[i]} alt="" />
                        <p className='legend'>{this.state.mediaComments[i]}</p>
                    </div>)
            }
        }

        return (
            <div className="container" style={containerStyle}>
                <span style={idStyle}># {this.state.articleId}</span>
                <span style={likeNumStyle}> {this.state.numLikes} Likes</span>
                <hr style={hrStyle} />
                <p style={contentStyle}>{this.state.contents}</p>
                <Carousel dynamicHeight={true}>
                    {innerElement}
                </Carousel>
                <div>
                    <button style={likeStyle} onMouseEnter={function (e) {
                        e.preventDefault();
                        e.target.style.backgroundColor = "white";
                    }} onMouseLeave={function (e) {
                        e.preventDefault();
                        if (this.state.liked === false) {
                            e.target.style.backgroundColor = "gray";
                        }
                    }.bind(this)} onClick={function (e) {
                        e.preventDefault();
                        this.handleLike(e)
                        if (this.state.liked === false) {
                            this.setState({
                                liked: true

                            })
                            e.target.style.backgroundColor = "white";
                            e.target.contents = "Liked"
                        }
                        else {
                            this.setState({
                                liked: false
                            })
                            e.target.style.backgroundColor = "gray";
                            e.target.contents = "Like"
                        }
                    }.bind(this)}> {this.state.liked ? 'Liked' : 'Like'}</button>
                    <button style={commentButtonStyle} onMouseEnter={function (e) {
                        e.preventDefault();
                        e.target.style.backgroundColor = "white";
                        e.target.contents = "Liked";
                    }} onMouseLeave={function (e) {
                        e.preventDefault();
                        if (this.state.commentOpen === false) {
                            e.target.style.backgroundColor = "gray";

                        }
                    }.bind(this)} onClick={function (e) {
                        e.preventDefault();
                        e.target.style.backgroundColor = "white";
                        if (this.state.commentOpen === false) {
                            this.setState({
                                commentOpen: true
                            });
                            e.target.style.backgroundColor = "white";
                        }
                        else {
                            this.setState({
                                commentOpen: false
                            })
                            e.target.style.backgroundColor = "gray";
                        }
                    }.bind(this)}> Comment</button>
                </div>
                {this.state.commentOpen ? <div style={commentStyle}><hr style={separatorHrStyle} /><div style={separatorDivStyle} ></div><CommentBox comments={this.state.comments} writer={this.props.writer} articleId={this.state.articleId} /></div> : null}
            </div>
        );
    }
}

export default Container;