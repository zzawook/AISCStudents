import React, { Component } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import CommentBox from './commentBox';
import ReactPlayer from 'react-player';
import FriendData  from '../App';

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
            mediaComments: [],
            writer: "",
            hashTag: [],
            isMine: false
        }        
    }

    wrap = (s, w) => s.replace(
        new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n'
    );

    static contextType = FriendData;

    componentDidMount() {
        const url = "https://aiscstudents.com/api/getArticle/" + this.props.articleId.toString();
        function sortInOrder(list) {
            let tempDict = {};
            for (let i = 0; i < list.length; i++) {
                tempDict[parseInt(list[i].split(":::")[0])] = list[i].split(":::")[1]
            }
            let tempList = [];
            let key = 0;
            while (Object.keys(tempDict).length > 0) {
                if (key in tempDict) {
                    tempList.push(tempDict[key]);
                    delete tempDict[key]
                    
                }
                key++;
            }
            return tempList;
        } 
        fetch(url, {
            method: 'GET',
            credentials: "include",
            keepalive: false,
            headers: {
                "cache-control": 'no-cache'
            }
        }).then((response) => {
            if (response.status === 301) {
                window.location.href = "https://aiscstudents.com/login"
                return;
            }
            response.json().then((json) => {
                if (json[0]['likedList'] !== null) {
                    const likedList = json[0]['likedList'].split('`~`');
                    for (let i = 0; i < likedList.length; i++) {
                        if (likedList[i] === this.props.hashID) {
                            this.setState({
                                liked: true
                            })
                            break;
                        }
                    } this.setState({ numLikes: likedList.length })
                }
                else this.setState({ numLikes: 0 })
                if (json[0]['mediaLink'] != null) {
                    const mediaList = sortInOrder(json[0]['mediaLink'].split("`~`"));
                    this.setState({ media: mediaList })
                }
                let writer = json[0]['writer'] 
                let isMyArticle = false
                if (writer == this.props.hashID || writer == this.props.preferredName) {
                    if (this.props.usePrefName) {
                        writer = this.props.preferredName
                    }
                    else {
                        writer = this.props.hashID
                    }
                    isMyArticle=true
                }
                else {
                    for (let i = 0; i < this.props.friendList.length; i++) {
                        if (this.props.friendList[i]['preferredName'] == json[0]['writer'] || this.props.friendList[i]['hashID'] == json[0]['writer']) {
                            writer = this.props.friendList[i]['nickName'] == null ? (this.props.friendList[i]['preferredName'] == null ? this.props.friendList[i]['hashID'] : this.props.friendList[i]['preferredName']) : this.props.friendList[i]['nickName']
                        }
                    }
                }
                let commentNeedsOpened=false
                const paramString = window.location.search.replace("?", "")
                let searchParams = new URLSearchParams(paramString)
                if (searchParams.has("comment") && parseInt(searchParams.get('article'))==json[0]['id'] && searchParams.get('comment') == 'true') {
                    commentNeedsOpened=true
                }
                this.setState({
                    articleId: json[0]['id'],
                    contents: json[0]['content'],
                    writer: writer,
                    hashTag: json[0]['hashTag'],
                    isMine: isMyArticle,
                    commentOpen: commentNeedsOpened 
                })  
            }).catch((err) => {
                window.alert("An error has occurred: "+err.toString())
            })
        })
    }

    handleLike = function (e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("articleId", this.state.articleId);
        formData.append("passcode", 'testPasscode');
        const prevLiked = this.state.numLikes;
        this.setState({ numLikes: prevLiked+1 });
        if (!this.state.liked) {
            this.setState({
                liked: true
            })
            fetch("https://aiscstudents.com/api/likeArticle/", {
                method: "POST",
                credentials: "include",
                body: formData,
                headers: {
                    "Access-Control-Allow-Origin": "localhost:3030",
                    "cache-control": 'no-cache'
                }
            }).then((response) => {
                if (response.status === 200) {
                    this.setState({
                        liked: true
                    })
                }
                else if (response.status === 301) {
                    window.location.href = "https://aiscstudents.com/login";
                    return;
                }
                else {
                    this.setState({
                        liked: false,
                        numLikes: prevLiked
                    })
                    alert("Liking article" + this.state.articleId.toString() + "has been unsuccessful. Please try again, and if error continues, please report us via 'Contact' tab");
                }
            })
        }
        else {
            this.setState({
                liked: true,
                numLikes: prevLiked-1
            });
            fetch("https://aiscstudents.com/api/unlikeArticle/", {
                method: "POST",
                credentials: "include",
                body: formData,
                headers: {
                    "Access-Control-Allow-Origin": "localhost:3030",
                    "cache-control": 'no-cache'
                }
            }).then((response) => {
                if (response.status === 200) {
                    this.setState({
                        liked: false
                    })
                }
                else if (response.status === 301) {
                    window.location.href = "https://aiscstudents.com/login"
                    return;
                }
                else {
                    this.setState({
                        liked: true,
                        numLikes: prevLiked
                    })
                    alert("Unliking article " + this.state.articleId.toString() + "has been unsuccessful. Please try again, and if error continues, please report us via 'Contact' tab");
                }
            })
        }
    }

    handleMouseEnter = function (e) {
        e.preventDefault()
        const target = e.target;
        target.style.backgroundColor = 'darkgray'
    }

    handleMouseLeave = function (e) {
        e.preventDefault()
        const target = e.target;
        target.style.backgroundColor = 'white'
    }

    handleDelete = function (e) {
        if (window.confirm("Are you sure you want to delete article " + this.state.articleId + "?")) {
            fetch('https://aiscstudents.com/api/deleteArticle/' + this.state.articleId.toString(), {
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
                else if (response.status === 500) {
                    window.alert("An error has occurred. Please try again, and if the error continues, please contact us via Contact page.")
                    return;
                }
                else if (response.status === 200) {
                    window.alert("The article has been deleted. Please refresh to see the changes.")
                    window.location.reload()
                }
            })
        }
    }.bind(this)

    handleEdit = function (e) {
        this.props.editOpen(this.state.articleId, this.state.contents, this.state.media, this.state.hashTag)
    }.bind(this)

    render() {
        const screenWidth = window.innerWidth;
        const buttonWidth = ((screenWidth * 0.4)) / 2;
        const leftMargin = screenWidth * 0.25;
        const containerStyle = {
            backgroundColor: "white",
            color: "black",
            padding: "10px",
            paddingTop: "10px",
            marginTop: "10px",
            marginBottom: this.state.commentOpen ? "0px" : "10px",
            width: `${screenWidth * 0.4}px`,
            position: "relative",
            left: `${leftMargin+8}px`,
            zIndex: "2",
            borderRadius: "5px",
            whiteSpace: 'pre-wrap'
        }
        const contentStyle = {
            paddingLeft: "10px",
            minHeight: "35px",
            marginBottom: '30px',
            whiteSpace: 'pre-wrap',
            color: 'black'
            //fontFamile: 'Calibri'
        }
        const contentWithMediaStyle = {
            paddingLeft: "10px",
            minHeight: "35px",
            marginBottom: '5px',
            color: 'black'
            //fontFamily: 'Calibri'
        }
        const hrStyle = {
            borderTop: "1px solid #8a8a8a",
        }
        let likeStyle = {
            position: "absolute",
            left: "10px",
            borderRight: "1px solid black",
            borderTop: "1px solid black",
            borderBottom: "none",
            borderLeft: "none",
            backgroundColor: this.state.liked ? '#4742A8':`white`,
            width: `${buttonWidth}px`,
            height: "35px",
            bottom: "0px",
            zIndex: 3,
            color: this.state.liked? 'white':'black'
        }
        let commentButtonStyle = {
            position: "absolute",
            right: "10px",
            bottom: "0px",
            borderLeft: "1px solid black",
            borderTop: "1px solid black",
            borderBottom: "none",
            borderRight: "none",
            backgroundColor: "white",
            width: `${buttonWidth}px`,
            height: "35px",
            zIndex: 3,
            color: 'black'
        }
        const idStyle = {
            border: "2px solid #8a8a8a",
            padding: "3px",
            borderRadius: "6px",
            color: 'black'
        }
        const likeNumStyle = {
            border: "2px solid #8a8a8a",
            padding: "3px",
            paddingRight: '5px',
            borderRadius: "6px",
            position: 'absolute',
            right: "10px",
            top: 5,
            color: 'black'
        }
        const commentStyle = {
            width: `${screenWidth * 0.4}px`,
            position: "relative",
            left: 0,
            backgroundColor: "white",
            padding: 2,
            borderRadius: 2,
            zIndex: 1,
            marginBottom: 20,
        }
        const separatorHrStyle = {
            width: (screenWidth * 0.4) - 10,
            position: "absolute",
            left: 3,
        }
        const separatorDivStyle = {
            height: 7
        }
        const writerStyle = {
            color: 'black',
        }
        const deleteButtonStyle = {
            backgroundColor: 'white',
            border: 'none',
            color: 'black',
            borderRadius: '5px',
        }
        const hashTagStyle = {
            paddingLeft: "10px",
            minHeight: "35px",
            marginBottom: '30px',
            whiteSpace: 'pre-wrap',
            color: 'blue',
            textDecoration: 'underline'
        }
        if (this.state.media.length === 0) {
            return (
                <div className="container" style={containerStyle}>
                    <span style={idStyle}># {this.state.articleId}</span>
                    <span style={writerStyle}> by: {this.state.writer.length > 16 ? this.state.writer.substring(0, 16) + "..." : this.state.writer}</span>
                    {this.state.isMine ? <span><span> | </span><button style={deleteButtonStyle} onClick={this.handleDelete} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>Delete</button><span> | </span><button style={deleteButtonStyle} onClick={this.handleEdit} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>Edit</button></span>: <span/>}
                    <span style={likeNumStyle}> {this.state.numLikes} Likes</span>
                    <hr style={hrStyle} />
                    <p style={contentStyle}>{this.state.contents}</p>
                    <p style={hashTagStyle}>{this.state.hashTag}</p>
                    <div>
                        <button style={likeStyle} onMouseEnter={function (e) {
                            e.preventDefault();
                            if (this.state.liked === true) {
                                e.target.style.backgroundColor = "#4742A8";
                            }
                            else { e.target.style.backgroundColor = "darkgray"; }
                        }.bind(this)} onMouseLeave={function (e) {
                            e.preventDefault();
                            if (this.state.liked === false) {
                                e.target.style.backgroundColor = "white";
                            }
                            else { e.target.style.backgroundColor = "#4742A8" }
                        }.bind(this)} onClick={function (e) {
                            e.preventDefault();
                            this.handleLike(e)
                            if (this.state.liked === false) {
                                this.setState({
                                    liked: true
                                })
                                e.target.style.backgroundColor = "#4742A8";
                                e.target.style.color = 'white'
                                e.target.contents = "Liked"
                            }
                            else {
                                this.setState({
                                    liked: false
                                })
                                e.target.style.backgroundColor = "gray";
                                e.target.style.color = 'black'
                                e.target.contents = "Like"
                            }
                        }.bind(this)}> {this.state.liked ? 'Liked' : 'Like'}</button>
                        <button style={commentButtonStyle} onMouseEnter={function (e) {
                            e.preventDefault();
                            if (!this.state.commentOpen) {
                                e.target.style.backgroundColor = "darkgray";
                            }
                            e.target.contents = "Liked";
                        }.bind(this)} onMouseLeave={function (e) {
                            e.preventDefault();
                            if (this.state.commentOpen === false) {
                                e.target.style.backgroundColor = "white";

                            }
                            else {
                                e.target.style.backgroundColor = 'darkgray'
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
                    {this.state.commentOpen ? <div style={commentStyle}><CommentBox user={this.props.hashID} articleId={this.state.articleId}/></div> : null}
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
                    </div>);
            }
            else {
                let imageLink = "https://aiscstudents.com" + this.state.media[i];
                innerElement.push(
                    <div>
                        <img src={imageLink} key={this.state.media[i]} alt="" />
                    </div>)
            }
        }
        const carouselStyle = {
            paddingtop: 0,
            paddingBottom: 0,
            marginTop: 0,
            marginBottom: 0
        }
        const spaceDivStyle = {
            height: `${this.state.commentOpen ? 0 : 37}px`,
        }
        
        return (
            <div className="container" style={containerStyle}>
                <span style={idStyle}># {this.state.articleId}</span>
                <span style={writerStyle}> by: {this.state.writer.length > 16 ? this.state.writer.substring(0, 16) + "..." : this.state.writer}</span>
                {this.state.isMine ? <span><span> | </span><button style={deleteButtonStyle} onClick={this.handleDelete} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>Delete</button><span> | </span><button style={deleteButtonStyle} onClick={this.handleEdit} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>Edit</button></span> : <span />}
                <span style={likeNumStyle}> {this.state.numLikes} Likes</span>
                <hr style={hrStyle} />
                <p style={contentWithMediaStyle}>{this.state.contents}</p>
                <p style={hashTagStyle}>{this.state.hashTag}</p>
                <Carousel dynamicHeight={true} style={carouselStyle} showThumbs={false} showIndicators={false} useKeyboardArrows>
                    {innerElement}
                </Carousel>
                <div style={spaceDivStyle}/>
                <div>
                    <button style={likeStyle} onMouseEnter={function (e) {
                        e.preventDefault();
                        if (this.state.liked === true) {
                            e.target.style.backgroundColor = "#4742A8";
                        }
                        else { e.target.style.backgroundColor = "darkgray"; }
                    }.bind(this)} onMouseLeave={function (e) {
                        e.preventDefault();
                        if (this.state.liked === false) {
                            e.target.style.backgroundColor = "white";
                        }
                        else { e.target.style.backgroundColor = "#4742A8" }
                    }.bind(this)} onClick={function (e) {
                        e.preventDefault();
                        this.handleLike(e)
                        if (this.state.liked === false) {
                            this.setState({
                                liked: true

                            })
                            e.target.style.backgroundColor = "#4742A8";
                            e.target.style.color = 'white'
                            e.target.contents = "Liked"
                        }
                        else {
                            this.setState({
                                liked: false
                            })
                            e.target.style.backgroundColor = "gray";
                            e.target.style.color='black'
                            e.target.contents = "Like"
                        }
                    }.bind(this)}> {this.state.liked ? 'Liked' : 'Like'}</button>
                    <button style={commentButtonStyle} onMouseEnter={function (e) {
                        e.preventDefault();
                        if (! this.state.commentOpen) {
                            e.target.style.backgroundColor = "darkgray";
                        }
                        e.target.contents = "Liked";
                    }.bind(this)} onMouseLeave={function (e) {
                        e.preventDefault();
                        if (this.state.commentOpen === false) {
                            e.target.style.backgroundColor = "white";

                        }
                        else {
                            e.target.style.backgroundColor='darkgray'
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
                {this.state.commentOpen ? <div style={commentStyle}><div style={separatorDivStyle} ></div><CommentBox user={this.props.hashID} articleId={this.state.articleId} /></div> : null}
            </div>
        );
    }
}

export default Container;