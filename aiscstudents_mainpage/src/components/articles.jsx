import React, { Component } from 'react';
import Container from './container';
import Modal from './editModal';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import SearchBar from './searchBar';
import DarkTheme from '../App'

const useStyles = (theme) => ({
    'root': {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: '#383838'//theme.palette.background.paper,
    },
    'gridList': {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
        overflowX: 'scroll',
        backgroundColor: '#383838',
        width: `${(window.innerWidth * 0.5) - 45}px`,
    },
    'title': {
        color: theme.palette.primary.light,
    },
    'titleBar': {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
});

class Media {
    constructor(source, name, letter, isImage, isNew) {
        this.source = source;
        this.name = name;
        this.letter = letter;
        this.isImage = isImage;
        this.isNew = isNew;
    }
    getSource() {
        return this.source
    }
    getName() {
        return this.name
    }
    getLetter() {
        return this.letter
    }
    getIsImage() {
        return this.isImage
    }
    getIsNew() {
        return this.isNew
    }

}

class Articles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            components: [],
            minArticleId: -1,
            rawData: [],
            editOpen: false,
            editContent: "",
            editArticleId: -1,
            editMediaRawData: [],
            editMediaNode: [],
            editMediaName: [],
            currentMedia: false,
            beforeButtonDisable: true,
            afterButtonDisable: true,
            deleteButton: [],
            hashTag: "Enter hash tags that begins with # and separated with ,"
        };
        this.editMediaNameRef = React.createRef();
    }

    static contextType=DarkTheme

    componentDidMount() {
        let url = 'https://aiscstudents.com/api/getMaxArticleId/'
        const paramString = window.location.search.replace("?", "")
        let searchParams = new URLSearchParams(paramString)
        if (searchParams.has("article")) {
            url=url+searchParams.get('article')
        }
        fetch(url, {
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
            response.json().then(json => {
                const nodesList = []
                let minArticleId = -1;
                for (let i = 0; i < json.length; i++) {
                    nodesList.push(<Container articleId={json[i]['id']} editOpen={this.handleEditOpen} hashID={this.props.hashID} preferredName={this.props.preferredName} usePrefName={this.props.usePrefName} friendList={this.props.friendList}/>)
                    if (i === (json.length - 1)) {
                        minArticleId = json[i]['id'];
                        this.setState({
                            minArticleId: minArticleId,
                            components: nodesList,
                            rawData: json
                        })
                    }
                }
            })
        })
    }

    classes = this.props;

    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("")

    deleteButtonStyle = {
        backgroundColor: '#cccccc',
        border: 'none',
        borderRadius: '5px',
        fontFamily: 'Calibri',
        padding: '0px 10px',
        marginBottom: '17px'
    }

    mediaNameStyle = {
        width: `${window.innerWidth * 0.25}px`,
        overflow: 'hidden',
        margin: 0
    }

    listIndexStyle = {
        marginBottom: '10px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '5px',
        paddingTop: '2px',
        paddingBottom: '4px',
        paddingRight: '3px',
        paddingLeft: '3px',
        backgroundColor: 'transparent',
        width: window.innerWidth * 0.3,
        height: 21.6
    }

    listSelectedIndexStyle = {
        marginBottom: '10px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '5px',
        paddingTop: '2px',
        paddingBottom: '4px',
        paddingRight: '3px',
        paddingLeft: '3px',
        backgroundColor: '#898989',
        width: window.innerWidth * 0.3,
        height: 21.6
    }

    getMoreArticles = function (e) {
        e.preventDefault();
        const prevComponents = this.state.components.slice();
        const prevRawData = this.state.rawData.slice();
        fetch('https://aiscstudents.com/api/getMaxArticleId/' + this.state.minArticleId.toString(), {
            method: 'GET',
            credentials: 'include',
            headers: {
                "cache-control": 'no-cache'
            }
        }).then((response) => {
            response.json().then((data) => {
                prevRawData.push(...data)
                const loopPromise = new Promise((resolve, reject) => {
                    for (let i = 0; i < data.length; i++) {
                        prevComponents.push(<Container articleId={data[i]['id']} editOpen={this.handleEditOpen} hashID={this.props.hashID} preferredName={this.props.preferredName} usePrefName={this.props.usePrefName} friendList={this.props.friendList} />);
                        if (i === (data.length - 1)) {
                            this.setState({
                                minArticleId: data[i]['id']
                            })
                            resolve(true)
                        }
                    }
                })
                loopPromise.then((result) => {
                    this.setState({
                        components: prevComponents,
                        rawData: prevRawData
                    })
                })
            })
        })
    }.bind(this)

    handleEditOpen = function (articleId, content, media, hashTag) {
        let mediaList = []
        let mediaNameList = []
        let mediaRawList = []
        let deleteButtonList = [];
        const windowWidth = window.innerWidth;
        this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("")
        if (media !== null) {
            for (let i = 0; i < media.length; i++) {
                const nowAlphabet=this.alphabet.shift()
                if (media[i].includes("youtu.be")) {
                    let mediaCopy = media[i].split('/')
                    let videoCode = mediaCopy[mediaCopy.length - 1]
                    let src = "https://www.youtube.com/embed/" + videoCode.toString()
                    let nodes = <GridListTile key={src}>
                        <iframe width={windowWidth * 0.1905} height={184} src={src} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        <GridListTileBar
                            title={nowAlphabet}
                            classes={{
                                root: this.classes.titleBar,
                                title: this.classes.title,
                            }}
                        />
                    </GridListTile>
                    mediaNameList.push(<li style={this.listIndexStyle} onClick={this.handleMediaSelect} ><p id={i} style={this.mediaNameStyle}>{nowAlphabet} - (Server stored video) {media[i].split("/")[(media[i].split("/").length) - 1]}</p></li>)
                    mediaList.push(nodes)
                    mediaRawList.push(new Media(media[i], media[i].split("/")[(media[i].split("/").length) - 1], nowAlphabet, false, false))
                    deleteButtonList.push(<button name={i} style={this.deleteButtonStyle} onClick={this.deleteImage}>Delete</button>)
                }
                else {
                    let src = 'https://aiscstudents.com' + media[i];
                    let imgStyle = {}
                    let image = new Image()
                    image.onload = function () {
                        if (this.width * 0.5625 > this.height) {
                            imgStyle = {
                                width: windowWidth * 0.1905
                            }
                        }
                        else if (this.width * 0.5625 < this.height) {
                            imgStyle = {
                                height: 184
                            }
                        }
                    }
                    image.src = src;
                    let nodes = <GridListTile key={nowAlphabet}>
                        <img src={src} /*style={imgStyle}*/ alt={nowAlphabet} />
                        <GridListTileBar
                            title={nowAlphabet}
                            classes={{
                                root: this.classes.titleBar,
                                title: this.classes.title,
                            }}
                        />
                    </GridListTile>
                    mediaNameList.push(<li style={this.listIndexStyle}><p id={i} onClick={this.handleMediaSelect} style={this.mediaNameStyle}>{nowAlphabet} - {media[i].split("/")[(media[i].split("/").length) - 1]}</p></li>)
                    mediaList.push(nodes)
                    mediaRawList.push(new Media(media[i], media[i].split("/")[(media[i].split("/").length) - 1], nowAlphabet, true, false))
                    deleteButtonList.push(<button name={i} style={this.deleteButtonStyle} onClick={this.deleteImage}>Delete</button>)
                }
            }
        }
        this.setState({
            editOpen: true,
            editMediaNode: mediaList,
            editMediaName: mediaNameList,
            editMediaRawData: mediaRawList,
            editContent: content,
            currentMedia: false,
            editArticleId: articleId,
            deleteButton: deleteButtonList,
            hashTag: hashTag
        })
    }.bind(this)

    handleMediaSelect = function (e) {
        const target = e.target
        e.preventDefault();
        const mediaData = this.state.editMediaRawData.slice();
        const mediaNameCopy = [];
        for (let i = 0; i < mediaData.length; i++) {
            let content=""
            if (mediaData[i].getIsNew()) {
                content = mediaData[i].getLetter().toString() + ' - ' + mediaData[i].getSource().name.toString()
            }
            else {
                if (mediaData[i].getIsImage()) {
                    content = mediaData[i].getLetter().toString() + ' - ' + mediaData[i].getName()
                }
                else {
                    content = mediaData[i].getLetter().toString() + ' - ' + "(Server stored video) "+mediaData[i].getName()
                }
            }
            
            if (i == target.id) {
                mediaNameCopy.push(<li onClick={this.handleMediaSelect} style={this.listSelectedIndexStyle}><p id={i} style={this.mediaNameStyle}>{content}</p></li>)
            }
            else { 
                mediaNameCopy.push(<li onClick={this.handleMediaSelect} style={this.listIndexStyle}><p id={i} style={this.mediaNameStyle}>{content}</p></li>)
            }
        }
        this.setState({
            editMediaName: mediaNameCopy,
            currentMedia: target.id.toString()
        })
    }.bind(this)

    handlePutBefore = function (e) {
        e.preventDefault()
        const current = this.state.currentMedia
        if (current > 0) {
            const mediaNameCopy = this.state.editMediaName.slice()
            const mediaNodeCopy = this.state.editMediaNode.slice()
            const mediaData = this.state.editMediaRawData.slice()
            let tempNode = mediaNodeCopy[current]
            let tempData = mediaData[current]
            let contentNow=""
            if (mediaData[current].getIsNew()) {
                contentNow = mediaData[current].getLetter().toString() + ' - ' + mediaData[current].getSource().name.toString()
            }
            else {
                if (mediaData[current].getIsImage()) {
                    contentNow = mediaData[current].getLetter().toString() + ' - ' + mediaData[current].getName()
                }
                else {
                    contentNow = mediaData[current].getLetter().toString() + ' - ' + "(Server stored video) " + mediaData[current].getName()
                }
            }
            let contentBefore = ""
            if (mediaData[current - 1].getIsNew()) {
                contentBefore = mediaData[current - 1].getLetter().toString() + ' - ' + mediaData[current - 1].getSource().name.toString()
            }
            else {
                contentBefore = mediaData[current-1].getLetter().toString() + ' - ' + mediaData[current-1].getName()
            }
            mediaNameCopy[current] = <li onClick={this.handleMediaSelect} style={this.listIndexStyle}><p id={current} style={this.mediaNameStyle}>{contentBefore}</p></li>
            mediaNodeCopy[current] = mediaNodeCopy[current - 1]
            mediaData[current] = mediaData[current-1]
            mediaNameCopy[current - 1] = <li onClick={this.handleMediaSelect} style={this.listSelectedIndexStyle}><p id={current - 1} style={this.mediaNameStyle}>{contentNow}</p></li>
            mediaNodeCopy[current - 1] = tempNode
            mediaData[current - 1] = tempData
            this.setState({
                editMediaName: mediaNameCopy,
                editMediaNode: mediaNodeCopy,
                editMediaRawData: mediaData,
                currentMedia: (current-1).toString()
            })
        }
    }.bind(this)

    handlePutAfter = function (e) {
        e.preventDefault()       
        const current = parseInt(this.state.currentMedia)
        if (current >= 0 && current <= this.state.editMediaNode.length-2) {
            const mediaNameCopy = this.state.editMediaName.slice()
            const mediaNodeCopy = this.state.editMediaNode.slice()
            const mediaData = this.state.editMediaRawData.slice()
            let contentNow = ""
            if (mediaData[current].getIsNew()) {
                contentNow = mediaData[current].getLetter().toString() + ' - ' + mediaData[current].getSource().name.toString()
            }
            else {
                if (mediaData[current].getIsImage()) {
                    contentNow = mediaData[current].getLetter().toString() + ' - ' + mediaData[current].getName()
                }
                else {
                    contentNow = mediaData[current].getLetter().toString() + ' - ' + "(Server stored video) " + mediaData[current].getName()
                }
            }
            let contentAfter = ""
            if (mediaData[current + 1].getIsNew()) {
                contentAfter = mediaData[current + 1].getLetter().toString() + ' - ' + mediaData[current + 1].getSource().name.toString()
            }
            else {
                contentAfter = mediaData[current + 1].getLetter().toString() + ' - ' + mediaData[current + 1].getName()
            }
            let tempNode = mediaNodeCopy[current]
            let tempData = mediaData[current];
            mediaNameCopy[current] = <li onClick={this.handleMediaSelect} style={this.listIndexStyle}><p id={current} style={this.mediaNameStyle}>{contentAfter}</p></li>
            mediaNodeCopy[current] = mediaNodeCopy[current + 1]
            mediaData[current]=mediaData[current+1]
            mediaNameCopy[current + 1] = <li onClick={this.handleMediaSelect} style={this.listSelectedIndexStyle}><p id={current + 1} style={this.mediaNameStyle}>{contentNow}</p></li>
            mediaNodeCopy[current + 1] = tempNode
            mediaData[current + 1] = tempData;
            this.setState({
                editMediaName: mediaNameCopy,
                editMediaNode: mediaNodeCopy,
                editMediaRawData: mediaData,
                currentMedia: (current+1).toString()
            })
        }
    }.bind(this)

    deleteImage = function (e) {
        e.preventDefault();
        const target = e.target;
        const mediaNameList = this.state.editMediaName.slice();
        const mediaNodeList = this.state.editMediaNode.slice();
        const mediaRawList = this.state.editMediaRawData.slice();
        const deleteButtonList = this.state.deleteButton.slice();
        let current = this.state.currentMedia
        if ((typeof current !== 'boolean') && (parseInt(current) >= parseInt(target.name)) && (parseInt(current)>0)) {
            current--;
        }
        mediaNameList.splice(parseInt(target.name), 1);
        mediaNodeList.splice(parseInt(target.name), 1);
        mediaRawList.splice(parseInt(target.name), 1);
        for (let i = parseInt(target.name); i < mediaNameList.length; i++) {
            mediaNameList[i]=<li onClick={this.handleMediaSelect} style={this.listIndexStyle}><p id={i} style={this.mediaNameStyle}>{mediaRawList[i].getLetter()} - {mediaRawList[i].getName()}</p></li>
        }
        deleteButtonList.splice(parseInt(target.name), 1);
        this.setState({
            editMediaNode: mediaNodeList,
            editMediaName: mediaNameList,
            editMediaRawData: mediaRawList,
            deleteButton: deleteButtonList,
            currentMedia: current
        })
    }.bind(this)

    handleEditClose = function () {
        this.setState({
            editOpen: false
        })
    }.bind(this)

    handleChange = function (e) {
        e.preventDefault();
        const target = e.target;
        const windowWidth = window.innerWidth;
        if (this.state.editMediaName.length + target.files.length > 10) {
            window.alert("You can add maximum 10 images/videos")
            return;
        }
        if (target.name === "imgInput" && target.files !== null) {
            let finalNames = this.state.editMediaName.slice()
            let finalNodes = this.state.editMediaNode.slice()
            let finalData = this.state.editMediaRawData.slice()
            let deleteButtonList = this.state.deleteButton.slice()
            let imgStyle = {}
            for (let i = 0; i < target.files.length; i++) {
                if (this.state.editMediaName.includes(target.files[i].name)) {
                    window.alert("One of your video has same name as one of images/videos uploaded/selected.")
                    return
                }
                if (target.files[i].name.includes('https://youtu.be/' || target.files[i].name.includes("/home/kjaehyeok21/media/image"))) {
                    window.alert("Invalid title")
                    return
                }
                let currentImgIndex = finalNames.length
                let newImg = new Media(target.files[i], target.files[i].name, this.alphabet.shift(), true, true)
                let image = new Image()
                image.onload = function () {
                    if (this.width * 0.5625 > this.height) {
                        imgStyle = {
                            width: windowWidth * 0.1905
                        }
                    }
                    else if (this.width * 0.5625 < this.height) {
                        imgStyle = {
                            height: 184
                        }
                    }
                }
                image.src = newImg.getSource().name;
                finalNames.push(<li onClick={this.handleMediaSelect} style={this.listIndexStyle}><p id={currentImgIndex} style={this.mediaNameStyle}>{newImg.getLetter()} - {newImg.getSource().name}</p> </li>)
                finalNodes.push(<GridListTile key={newImg.getLetter()}>
                    <img src={window.URL.createObjectURL(newImg.getSource())} style={imgStyle} alt={newImg.getLetter()} />
                    <GridListTileBar
                        title={newImg.getLetter()}
                        classes={{
                            root: this.classes.titleBar,
                            title: this.classes.title,
                        }}
                    /></GridListTile>)
                finalData.push(newImg)
                deleteButtonList.push(<button name={currentImgIndex} style={this.deleteButtonStyle} onClick={this.deleteImage}>Delete</button>)
            }
            this.setState(current => ({
                ...current,
                editMediaNode: finalNodes,
                editMediaName: finalNames,
                editMediaRawData: finalData,
                deleteButton: deleteButtonList
            }));
        }
        else if (target.name === "vidInput" && target.files !== null) {
            let finalNames = this.state.editMediaName.slice()
            let finalNodes = this.state.editMediaNode.slice()
            let finalData = this.state.editMediaRawData.slice()
            let deleteButtonList=this.state.deleteButton.slice()
            let vidStyle = {
                height: '184px'
            }
            for (let i = 0; i < target.files.length; i++) {
                if (this.state.editMediaName.includes(target.files[i].name)) {
                    window.alert("One of your video has same name as one of images/videos uploaded/selected.")
                    return
                }
                if (target.files[i].name.includes("https://youtu.be/") || target.files[i].name.includes("/home/kjaehyeok21/media/image")) {
                    window.alert("Invalid title")
                }
                let currentVidIndex = finalNames.length
                const newVid = new Media(target.files[i], target.files[i].name, this.alphabet.shift(), false, true)
                let newVidURL = window.URL.createObjectURL(newVid.getSource());
                finalNames.push(<li onClick={this.handleMediaSelect} style={this.listIndexStyle}><p id={currentVidIndex} style={this.mediaNameStyle}>{newVid.getLetter()} - {newVid.getName()}</p></li>)
                finalNodes.push(<GridListTile key={newVid.getLetter()}>
                    <video style={vidStyle} alt={newVid.getLetter}>
                        <source src={newVidURL} type="video/mp4" />
                        <source src={newVidURL} type="video/ogg" />
                        <source src={newVidURL} type="video/webm" />
                    Your video should be either .mp4, .ogg, or .webm file format and on Chrome for preview.
                </video>
                    <GridListTileBar
                        title={newVid.getLetter()}
                        classes={{
                            root: this.classes.titleBar,
                            title: this.classes.title,
                        }}
                    /></GridListTile>)
                finalData.push(newVid)
                deleteButtonList.push(<button name={currentVidIndex} style={this.deleteButtonStyle} onClick={this.deleteImage}>Delete</button>)
            }
            this.setState(current => ({
                ...current,
                editMediaNode: finalNodes,
                editMediaName: finalNames,
                editMediaRawData: finalData,
                deleteButton: deleteButtonList
            }));
        }
    }.bind(this)

    handleContentChange = function (e) {
        e.preventDefault()
        const target = e.target;
        this.setState({
            editContent: target.value
        })
    }.bind(this)

    handleSubmit = function (e) {
        e.preventDefault()
        const mediaData = this.state.editMediaRawData.slice()
        let updateFormData = new FormData()
        updateFormData.append('textBody', this.state.editContent)
        updateFormData.append('hashTag', this.state.hashTag)
        let orderList = []
        if (mediaData.length > 10) {
            window.alert("You cannot upload more than 10 images and videos")
        }
        for (let i = 0; i < mediaData.length; i++) {
            if (mediaData[i].getIsNew()) {
                updateFormData.append('newMedia', mediaData[i].getSource())
            }
            if (orderList.includes(mediaData[i].getName())) {
                window.alert("You cannot have 2 or more medias with same name")
                return;
            }
            if ((!mediaData[i].getIsImage()) && mediaData[i].getSource().size / 1024 / 1024 > 50) {
                window.alert("You cannot upload video bigger than 50MB");
                return;
            }
            orderList.push(mediaData[i].getName())
        }
        updateFormData.append('orderList', JSON.stringify(orderList))
        window.alert("Your request is being processed. We'll let you know when it is complete. It may take up to 1 - 2 minutes")
        fetch('https://aiscstudents.com/api/editArticle/' + this.state.editArticleId.toString(), {
            method: 'POST',
            body: updateFormData,
            credentials: 'include',
            headers: {
                'Access-Control-Allow-Origin': "localhost:3030",
                "cache-control": 'no-cache'
            }
        }).then((response) => {
            if (response.status === 200) {
                if (window.confirm("Article has been updated successfully. Refresh to see changes?")) {
                    window.location.reload()
                }
            }
            else if (response.status === 500) {
                window.alert("There has been error editing an article. Please retry and if the error continues, please contact us via 'Contact' tab")
            }
            else {
                window.alert("Unknown error. Please retry and if the error continues, please contact us via 'Contact' tab")
            }
        })
    }.bind(this)

    handleDeleteScroll = function (e) {
        e.preventDefault();
        this.editMediaNameRef.current.scrollTop = e.target.scrollTop;
    }.bind(this)

    handleSearchedValue = (data) => {
        const rawData = data;
        const components = [];
        this.setState({
            components: []
        })
        const loopPromise = new Promise((resolve, reject) => {
            for (let i = 0; i < data.length; i++) {
                components.push(<Container articleId={data[i]['id']} editOpen={this.handleEditOpen} hashID={this.props.hashID} preferredName={this.props.preferredName} usePrefName={this.props.usePrefName} friendList={this.props.friendList} />);
                if (i === (data.length - 1)) {
                    this.setState({
                        minArticleId: data[i]['id']
                    })
                    resolve(true)
                }
            }
        })
        loopPromise.then((result) => {
            this.setState({
                components: components,
                rawData: rawData
            })
        })
    }

    handleHashTagChange = (e) => {
        e.preventDefault();
        const target = e.target;
        let hashTags = ""
        for (let i = 0; i < target.value.length; i++) {
            hashTags += target.value[i]
        };
        if (hashTags.length == 1 && hashTags[0] != '#') {
            hashTags = '#' + hashTags
        }
        else if (hashTags[hashTags.length - 1] === " " && hashTags[hashTags.length - 2] == "#") {
            hashTags = hashTags.substring(0, hashTags.length - 1)
        }
        else if (hashTags[hashTags.length - 1] === " " && hashTags[hashTags.length - 2] != ",") {
            hashTags = hashTags.substring(0, hashTags.length - 1) + ',#'
        }
        else if (hashTags[hashTags.length - 1] === " " && hashTags[hashTags.length - 2] == ",") {
            hashTags = hashTags.substring(0, hashTags.length - 1) + '#'
        }
        if (hashTags[hashTags.length - 1] == ",") {
            hashTags = hashTags.substring(0, hashTags.length - 1) + ',#'
        }
        this.setState({
            hashTag: hashTags
        })
    }

    handleHashTagFocus = (e) => {
        e.preventDefault();
        if (this.state.hashTag == 'Enter hash tags that begins with # and separated with ,') {
            this.setState({
                hashTag: "#"
            })
        }
    }

    handleHashTagBlur = (e) => {
        e.preventDefault();
        const target = e.target;
        if (this.state.hashTag == '') {
            this.setState({
                hashTag: "Enter hash tags that begins with # and separated with ,"
            })
            return;
        }
        let hashTags = ""
        for (let i = 0; i < target.value.length; i++) {
            hashTags += target.value[i]
        };
        for (let i = 0; i < hashTags.length - 1; i++) {
            if (hashTags[i] == ',' && hashTags[i + 1] != '#') {
                hashTags = hashTags.substring(0, i) + ',#' + hashTags.substring(i + 1)
            }
            if (hashTags[i] == "#" && hashTags[i - 1] != ',' && i > 1) {
                hashTags = hashTags.substring(0, i) + ',#' + hashTags.substring(i + 1)
            }
        }
        if (hashTags[0] != '#') {
            hashTags = '#' + hashTags
        }
        this.setState({
            hashTag: hashTags
        })
    }

    render() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const leftMargin = window.innerWidth * 0.25;
        const containerStyle = {
            backgroundColor: '#525252',
            color: 'white'
        }
        const buttonStyle = {
            border: 'none',
            color: 'black',
            borderRadius: '5px',
            backgroundColor: 'DarkGray',
            fontSize: '20px',
            width: `${windowWidth * 0.4}px`,
            marginLeft: '5px',
            marginRight: '5px',
            marginTop: '20px',
            position: 'relative',
            left: `${leftMargin + 10}px`,
            fontFamily: 'Roboto, Calibri',
            height: '30px',
        }
        const h2Style = {
            textAlign: 'center',
        }
        const textAreaStyle = {
            width: `${(windowWidth * 0.5)-45}px`,
            height: `${windowHeight * 0.15}px`,
            fontFamily: 'Calibri',
            fontSize: '15px',
            resize: 'none',
            backgroundColor: '#cccccc'
        }
        const { classes } = this.props;
        const listStyle = {
            listStyle: 'none',
            padding: '0px 0px',
            width: windowWidth * 0.35,
            margin: '5px 0px',
            height: `${(windowHeight * 0.75) - 315}px`,
            overflowY: 'hidden',
            overflowX: 'hidden',
        }
        const imgInputStyle = {
            color: 'transparent',
            position: 'absolute',
            right: '0px',
            bottom: '30px',
            width: 100,
            fontFamily: 'Calibri'
        }
        const vidInputStyle = {
            color: 'transparent',
            position: 'absolute',
            right: '0px',
            bottom: '5px',
            width: 100,
            fontFamily: 'Calibri'
        }
        const imgLabelStyle = {
            position: 'absolute',
            right: '105px',
            bottom: '32px',
            color: 'black'
        }
        const vidLabelStyle = {
            position: 'absolute',
            right: '105px',
            bottom: '8px',
            color: 'black'
        }
        const formStyle = {
            display: 'inline',
            whiteSpace: 'nowrap'
        }
        const controllerStyle = {
            width: '30%',
            height: '28.7%',
            position: 'absolute',
            right: '2%',
            bottom: '6.5%',
            overflow: 'hidden',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#999999'
        }
        const selectedMediaStyle = {
            fontSize: '18px',
            textAlign: 'center',
            margin: '0px 0px',
            color: 'black',
            position: 'relative',
            top: '27px'
        }
        const selectedMediaHrStyle = {
            width: '80%',
            marginTop: '0px',
            marginBottom: '0px',
            position: 'relative',
            top: '27px'
        }
        const putBeforeStyle = {
            width: '80%',
            border: 'none',
            borderRadius: '5px',
            position: 'absolute',
            top: '5px',
            right: '10%',
            height: '20px'
        }
        const putAfterStyle = {
            width: '80%',
            border: 'none',
            borderRadius: '5px',
            position: 'absolute',
            top: '80px',
            right: '10%',
            height: '20px'
        }
        const deleteButtonListStyle = {
            position: 'absolute',
            right: '35%',
            top: `${313 + (windowHeight * 0.15)}px`,
            width: '14%',
            height: `${(windowHeight * 0.75) - 315}px`,
            backgroundColor: 'transparent',
            overflowY: 'auto'
        }
        const submitButtonStyle = {
            position: 'absolute',
            top: '20px',
            right: '20px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#aaaaaa',
            color: 'black',
            padding: '10px'
        }
        const modalHashTagInputStyle = {
            position: 'relative',
            height: '30px',
            fontSize: '15px',
            width: `${(windowWidth * 0.5) - 45}px`,
            border: '1px solid black',
            borderRadius: '5px',
            color: this.state.hashTag == 'Enter hash tags that begins with # and separated with ,' ? 'gray' : 'black'
        }
        return (
            <div>
                {this.state.editOpen ?
                    <Modal
                    visible={this.state.editOpen}
                    closable={true}
                    maskClosable={true}
                        onClose={this.handleEditClose}>
                        <h2 style={h2Style}>Edit Article</h2>
                        <button style={submitButtonStyle} type='submit' form='form1'>Submit</button>
                        <hr />
                        <form id='form1' onSubmit={this.handleSubmit}>
                            <textarea style={textAreaStyle} onChange={this.handleContentChange}>{this.state.editContent}</textarea>
                            <input style={modalHashTagInputStyle} onChange={this.handleHashTagChange} onFocus={this.handleHashTagFocus} onBlur={this.handleHashTagBlur} value={this.state.hashTag} />
                            <hr />
                            <div className={classes.root}>
                                <GridList className={classes.gridList} cols={2.5}>
                                    {this.state.editMediaNode}
                                </GridList>
                            </div>
                            <div style={formStyle}>
                                <ul style={listStyle} ref={this.editMediaNameRef}>
                                    {this.state.editMediaName}
                                </ul>
                            </div>
                            <div style={deleteButtonListStyle} onScroll={this.handleDeleteScroll}>
                                {this.state.deleteButton}
                            </div>
                            <div style={controllerStyle}>
                                <button onClick={this.handlePutBefore} style={putBeforeStyle} disabled={((typeof this.state.currentMedia) == "boolean") || this.state.currentMedia <= 0 || this.state.currentMedia > this.state.editMediaNode.length}>Put Before</button>
                                <p style={selectedMediaStyle}>Selected Media</p>
                                <hr style={selectedMediaHrStyle} />
                                <p style={selectedMediaStyle}>{this.state.currentMedia? this.state.editMediaRawData[this.state.currentMedia].getLetter(): <span/>}</p>
                                <button onClick={this.handlePutAfter} style={putAfterStyle} disabled={((typeof this.state.currentMedia) == "boolean") || this.state.currentMedia < 0 || this.state.currentMedia >= this.state.editMediaNode.length-1}>Put After</button>
                                <label htmlFor="imgInput" style={imgLabelStyle}>New image: </label>
                                <input type="file" style={imgInputStyle} accept="image/*" multiple={true} id="imgInput" name="imgInput" onChange={this.handleChange} />
                                <label htmlFor="vidInput" style={vidLabelStyle}>New video: </label>
                                <input type="file" style={vidInputStyle} accept='video/*' multiple={true} id="vidInput" name="vidInput" onChange={this.handleChange} />
                            </div>
                        </form>
                    </Modal> : <span></span>}
                <SearchBar searchHandler={this.handleSearchedValue} />
                {this.state.components}
                <button onClick={this.getMoreArticles} style={buttonStyle}>Load more articles</button>
            </div>
        )
    }
}

export default withStyles(useStyles)(Articles);