import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import Modal from './editModal';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

/*if (img.width !== img.height) {
	if (window.confirm("One of your image doesn't seem to be rectangular, in which case, the article won't be uploaded on instagram. Continue?")) {
		formData.append("imgInput", this.state.imgInput[i]);
		if (i === this.state.imgInput.length - 1) {
			resolve(true)
        }
	}
	else { reject(false) }
}
else {
	formData.append("imgInput", this.state.imgInput[i]);
	if (i === this.state.imgInput.length - 1) {
		resolve(true)
	}
};*/

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
		width: `${(window.innerWidth * 0.5) - 45}px`,
		overflowX: 'scroll',
		backgroundColor: '#383838'
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

class Writer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showSpan: true,
			vrTop: "30px",
			otherTop: 35,
			scroll: 0,
			imgInput: null,
			vidInput: null,
			editOpen: false,
			editMediaRawData: [],
			editMediaNode: [],
			editMediaName: [],
			currentMedia: false,
			beforeButtonDisable: true,
			afterButtonDisable: true,
			deleteButton: [],
			handleChange: false,
			hashTag: "Enter hash tags that begins with # and separated with ,"
		};
		this.editMediaNameRef = React.createRef();
	}
	componentDidMount() {
		this.setState({
			vrTop:"30px"
		})
		window.addEventListener("scroll", this.handleScroll, { passive: true });
	}

	classes = this.props;

    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("")

    deleteButtonStyle = {
        backgroundColor: '#cccccc',
        border: 'none',
        borderRadius: '5px',
        fontFamily: 'Calibri',
        padding: '0px 10px',
		marginBottom: '17px',
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

	handleScroll = function () {
		if (window.pageYOffset < 30) {
			this.setState({
				otherTop: (35 - window.pageYOffset),
				vrTop: `${30 - window.pageYOffset}px`,
				scroll: window.pageYOffset
			})
		}
		if (window.pageYOffset > 30) {
			this.setState({
				vrTop: '0px',
				scroll: 30,
				otherTop: '0px'
            })
        }
	}.bind(this)

	handleSubmitForm = e => {
		e.preventDefault();
		let formData = new FormData();
		const mediaData = this.state.editMediaRawData.slice()
		if (this.state.imgInput === null && this.state.vidInput === null && this.state.textBody === "") {
			alert("Please enter content");
			return false;
		}
		if (mediaData.length > 10) {
			window.alert("You cannot upload more than 10 images and videos")
		}
		formData.append('writer', this.props.writer.toString())
		let hashTags = ""
		for (let i = 0; i < this.state.hashTag.length; i++) {
			hashTags+=this.state.hashTag[i]
		}
		if (this.state.hashTag == "#") {
			hashTags = ""
		}
		for (let i = 0; i < hashTags.length - 1; i++) {
			if (hashTags[i] == '#') {
				if (hashTags[i + 1] == ' ' || hashTags[i + 1] == ",") {
					hashTags = hashTags.substring(0, i) + hashTags.substring(i + 2)
				}
				else if (hashTags[i + 1] == '#') {
					hashTags=hashTags.substring(0,i)+hashTags.substring(i+1)
                }
			}
		}
		return;
		formData.append('hashTag', this.state.hashTag =='Enter hash tags that begins with # and separated with ,'? "":hashTags)
		formData.append('textBody', this.state.editContent)
		let orderList = []
		for (let i = 0; i < mediaData.length; i++) {
			formData.append('newMedia', mediaData[i].getSource())
			if (orderList.includes(mediaData[i].getName())) {
				window.alert("You cannot have 2 or more medias with same name")
				return;
			}
			if ((! mediaData[i].getIsImage()) && mediaData[i].getSource().size / 1024 / 1024 > 50) {
				window.alert("You cannot upload video bigger than 50MB");
				return;
            }
			orderList.push(mediaData[i].getName())
		}
		formData.append('orderList', JSON.stringify(orderList))
		window.alert("Your request is being processed. We'll let you know when it is complete. It may take up to 1 - 2 minutes")
		fetch('https://aiscstudents.com/api/submitArticle/', {
			method: 'POST',
			body: formData,
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
	};

	handleChange = e => {
		e.preventDefault();
		const target = e.target;
		if (this.state.editMediaName.length + target.files.length > 10) {
			window.alert("You can add maximum 10 images/videos")
			return;
		}
		if (target.name === "imgInput" && target.files !== null) {
			let finalData = this.state.editMediaRawData.slice()
			for (let i = 0; i < target.files.length; i++) {
				if (this.state.editMediaName.includes(target.files[i].name)) {
					window.alert("One of your image you selected has same name as one of images/video uploaded.")
					return
				}
				if (target.files[i].name.includes('https://youtu.be/' || target.files[i].name.includes("/home/kjaehyeok21/media/image"))) {
					window.alert("Invalid title")
					return
				}
				let newImg = new Media(target.files[i], target.files[i].name, this.alphabet.shift(), true, true)
				finalData.push(newImg)
			}
			this.setState(current => ({
				...current,
				editMediaRawData: finalData,
				handleChange: true
			}));
		}
		else if (target.name === "vidInput" && target.files !== null) {
			let finalData = this.state.editMediaRawData.slice()
			for (let i = 0; i < target.files.length; i++) {
				if (this.state.editMediaName.includes(target.files[i].name)) {
					window.alert("One of your video has same name as one of images/videos uploaded/selected.")
					return
				}
				if (target.files[i].name.includes("https://youtu.be/") || target.files[i].name.includes("/home/kjaehyeok21/media/image")) {
					window.alert("Invalid title")
				}
				const newVid = new Media(target.files[i], target.files[i].name, this.alphabet.shift(), false, true)
				finalData.push(newVid)
			}
			this.setState(current => ({
				...current,
				editMediaRawData: finalData,
				handleChange: true
			}));
		}
	}

	handleEditContentChange = function (e) {
		e.preventDefault();
		const target = e.target;
		if (target.value == "") {
			this.setState({
				editContent: e.target.value,
				showSpan: true
			})
		}
		else {
			this.setState({
				editContent: e.target.value,
				showSpan: false
            })
        }
	}.bind(this)

	editHandleChange = function (e) {
		e.preventDefault()
		const target = e.target;
		const windowWidth = window.innerWidth;
		if (this.state.editMediaName.length + target.files.length > 10) {
			window.alert("You can add maximum 10 images/videos")
			return;
		}
		if (target.name == "imgInput" && target.files != null) {
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
			let deleteButtonList = this.state.deleteButton.slice()
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

	handleOpenModal = function (e) {
		//e.preventDefault();
		let mediaNodeList = []
		let mediaNameList = [];
		let mediaRawList = this.state.editMediaRawData.slice()
		let deleteButtonList = [];
		const windowWidth = window.innerWidth;
		for (let i = 0; i < mediaRawList.length; i++) {
			if (mediaRawList[i].getIsImage()) {
				if (this.state.editMediaName.includes(mediaRawList[i].getSource().name)) {
					window.alert("One of your video has same name as one of images/videos uploaded/selected.")
					return
				}
				if (mediaRawList[i].getSource().name.includes('https://youtu.be/' || mediaRawList[i].getSource().name.includes("/home/kjaehyeok21/media/image"))) {
					window.alert("Invalid title")
					return
				}
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
				image.src = mediaRawList[i].getSource().name;
				mediaNameList.push(<li onClick={this.handleMediaSelect} style={this.listIndexStyle}><p id={i} style={this.mediaNameStyle}>{mediaRawList[i].getLetter()} - {mediaRawList[i].getSource().name}</p> </li>)
				mediaNodeList.push(<GridListTile key={mediaRawList[i].getLetter()}>
					<img src={window.URL.createObjectURL(mediaRawList[i].getSource())} style={imgStyle} alt={mediaRawList[i].getLetter()} />
					<GridListTileBar
						title={mediaRawList[i].getLetter()}
						classes={{
							root: this.classes.titleBar,
							title: this.classes.title,
						}}
					/></GridListTile>)
				deleteButtonList.push(<button name={i} style={this.deleteButtonStyle} onClick={this.deleteImage}>Delete</button>)
			}
			else {
				if (this.state.editMediaName.includes(mediaRawList[i].getSource().name)) {
					window.alert("One of your video has same name as one of images/videos uploaded/selected.")
					return
				}
				if (mediaRawList[i].getSource().name.includes("https://youtu.be/") || mediaRawList[i].getSource().name.includes("/home/kjaehyeok21/media/image")) {
					window.alert("Invalid title")
				}
				let vidStyle = {
					height: '184px'
				}
				let newVidURL = window.URL.createObjectURL(mediaRawList[i].getSource());
				mediaNameList.push(<li onClick={this.handleMediaSelect} style={this.listIndexStyle}><p id={i} style={this.mediaNameStyle}>{mediaRawList[i].getLetter()} - {mediaRawList[i].getName()}</p></li>)
				mediaNodeList.push(< GridListTile key={mediaRawList[i].getLetter()} >
					<video style={vidStyle} alt={mediaRawList[i].getLetter}>
						<source src={newVidURL} type="video/mp4" />
						<source src={newVidURL} type="video/ogg" />
						<source src={newVidURL} type="video/webm" />
                    Your video should be either .mp4, .ogg, or .webm file format and on Chrome for preview.
                </video>
					<GridListTileBar
						title={mediaRawList[i].getLetter()}
						classes={{
							root: this.classes.titleBar,
							title: this.classes.title,
						}}
					/></GridListTile >)
				deleteButtonList.push(<button name={i} style={this.deleteButtonStyle} onClick={this.deleteImage}>Delete</button>)
            }
        }
		this.setState({
			editOpen: true,
			editMediaName: mediaNameList,
			editMediaNode: mediaNodeList,
			deleteButton: deleteButtonList,
			handleChange: false
        })
	}.bind(this)

	deleteImage = function (e) {
		e.preventDefault();
		const target = e.target;
		const mediaNameList = this.state.editMediaName.slice();
		const mediaNodeList = this.state.editMediaNode.slice();
		const mediaRawList = this.state.editMediaRawData.slice();
		const deleteButtonList = this.state.deleteButton.slice();
		let current = this.state.currentMedia
		if ((typeof current !== 'boolean') && (parseInt(current) >= parseInt(target.name)) && (parseInt(current) > 0)) {
			current--;
		}
		mediaNameList.splice(parseInt(target.name), 1);
		mediaNodeList.splice(parseInt(target.name), 1);
		mediaRawList.splice(parseInt(target.name), 1);
		for (let i = parseInt(target.name); i < mediaNameList.length; i++) {
			mediaNameList[i] = <li onClick={this.handleMediaSelect} style={this.listIndexStyle}><p id={i} style={this.mediaNameStyle}>{mediaRawList[i].getLetter()} - {mediaRawList[i].getName()}</p></li>
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


	handleMediaSelect = function (e) {
		const target = e.target
		e.preventDefault();
		const mediaData = this.state.editMediaRawData.slice();
		const mediaNameCopy = [];
		for (let i = 0; i < mediaData.length; i++) {
			let content = ""
			if (mediaData[i].getIsNew()) {
				content = mediaData[i].getLetter().toString() + ' - ' + mediaData[i].getSource().name.toString()
			}
			else {
				content = mediaData[i].getLetter().toString() + ' - ' + mediaData[i].getName()
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
			let contentNow = ""
			if (mediaData[current].getIsNew()) {
				contentNow = mediaData[current].getLetter().toString() + ' - ' + mediaData[current].getSource().name.toString()
			}
			else {
				contentNow = mediaData[current].getLetter().toString() + ' - ' + mediaData[current].getName()
			}
			let contentBefore = ""
			if (mediaData[current - 1].getIsNew()) {
				contentBefore = mediaData[current - 1].getLetter().toString() + ' - ' + mediaData[current - 1].getSource().name.toString()
			}
			else {
				contentBefore = mediaData[current - 1].getLetter().toString() + ' - ' + mediaData[current - 1].getName()
			}
			mediaNameCopy[current] = <li onClick={this.handleMediaSelect} style={this.listIndexStyle}><p id={current} style={this.mediaNameStyle}>{contentBefore}</p></li>
			mediaNodeCopy[current] = mediaNodeCopy[current - 1]
			mediaData[current] = mediaData[current - 1]
			mediaNameCopy[current - 1] = <li onClick={this.handleMediaSelect} style={this.listSelectedIndexStyle}><p id={current - 1} style={this.mediaNameStyle}>{contentNow}</p></li>
			mediaNodeCopy[current - 1] = tempNode
			mediaData[current - 1] = tempData
			this.setState({
				editMediaName: mediaNameCopy,
				editMediaNode: mediaNodeCopy,
				editMediaRawData: mediaData,
				currentMedia: (current - 1).toString()
			})
		}
	}.bind(this)

	handlePutAfter = function (e) {
		e.preventDefault()
		const current = parseInt(this.state.currentMedia)
		if (current >= 0 && current <= this.state.editMediaNode.length - 2) {
			const mediaNameCopy = this.state.editMediaName.slice()
			const mediaNodeCopy = this.state.editMediaNode.slice()
			const mediaData = this.state.editMediaRawData.slice()
			let contentNow = ""
			if (mediaData[current].getIsNew()) {
				contentNow = mediaData[current].getLetter().toString() + ' - ' + mediaData[current].getSource().name.toString()
			}
			else {
				contentNow = mediaData[current].getLetter().toString() + ' - ' + mediaData[current].getName()
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
			mediaData[current] = mediaData[current + 1]
			mediaNameCopy[current + 1] = <li onClick={this.handleMediaSelect} style={this.listSelectedIndexStyle}><p id={current + 1} style={this.mediaNameStyle}>{contentNow}</p></li>
			mediaNodeCopy[current + 1] = tempNode
			mediaData[current + 1] = tempData;
			this.setState({
				editMediaName: mediaNameCopy,
				editMediaNode: mediaNodeCopy,
				editMediaRawData: mediaData,
				currentMedia: (current + 1).toString()
			})
		}
	}.bind(this)

	handleEditClose = function () {
		this.setState({
			editOpen: false
		})
	}.bind(this)

	handleDeleteScroll = function (e) {
		e.preventDefault();
		this.editMediaNameRef.current.scrollTop = e.target.scrollTop;
    }.bind(this)

	componentDidUpdate() {
		if (this.state.handleChange) {
			this.handleOpenModal(true)
        }
	}

	handleHashTagChange = (e) => {
		e.preventDefault();
		const target = e.target;
		let hashTags = ""
		for (let i = 0; i < target.value.length; i++) {
			hashTags+=target.value[i]
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
		if (hashTags[hashTags.length-1] == ",") {
			hashTags = hashTags.substring(0, hashTags.length-1) + ',#'
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
		for (let i = 0; i < hashTags.length-1; i++) {
			if (hashTags[i] == ',' && hashTags[i + 1] != '#') {
				hashTags = hashTags.substring(0, i) + ',#' + hashTags.substring(i+1)
			}
			if (hashTags[i] == "#" && hashTags[i - 1] != ',' && i>1) {
				hashTags=hashTags.substring(0,i)+',#'+ hashTags.substring(i+1)
            }
		}
		if (hashTags[0] != '#') {
			hashTags='#'+hashTags
        }
		this.setState({
			hashTag: hashTags
        })
    }

	render() {
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		const containerWidth = (windowWidth * 0.35) -56 ;
		const containerStyle = {
			position: "fixed",
			top: "50px",
			right: "0px",
			height: `${windowHeight-50}px`,
			width: `${containerWidth}px`,
			zIndex: 999
		}
		const linkStyle = {
			color: "white",
			position: 'absolute',
			top: `${2}px`,
			right: `${(containerWidth - 58)/2}px`,
			backgroundColor: "#888888",
			paddingTop: "2px",
			paddingBottom: "2px",
			paddingLeft: "3px",
			paddingRight: "3px",
			borderRadius: "5px",
			marginTop: "25px",
			fontSize: "14px",
			overflow: 'hidden'
		}
		const vrStyle = {
			borderLeft: "1px solid #8a8a8a",
			height: `${windowHeight-50}px`,
			width: '1px',
			position: 'absolute',
			right: `${containerWidth}px`,
			top: 0,
			zIndex: "998"
		}
		const textInputStyle = {
			fontSize: "18px",
			width: `${containerWidth - 25}px`,
			position: "absolute",
			right: "10px",
			top: `${50}px`,
			height: `${(windowHeight-240)}px`,
			backgroundColor: "white",
			color: "black",
			resize: "none",
			zIndex: -1,
			borderRadius: "5px",
			fontFamily: 'Calibri'
		}
		const spanStyle = {
			position: "absolute",
			top: `${((windowHeight-150)/2)}px`,
			right: `${((containerWidth - 150) / 2) - 15}px`,
			height: '15px',
			width: "150px",
			color: "black",
			zIndex: 2
		}
		const imgUpLabelStyle = {
			position: 'absolute',
			bottom: `${60}px`,
			right: `${containerWidth-210}px`,
			width: "200px",
			color: 'white',
			fontSize: "15px",
			zIndex: 98,
			color: 'black'
		}
		const vidUpLabelStyle = {
			position: 'absolute',
			bottom: `${35}px`,
			right: `${containerWidth - 210}px`,
			width: "200px",
			color: 'white',
			fontSize: "15px",
			zIndex: 98,
			color: 'black',
		}
		const submitStyle = {
			position: "absolute",
			bottom: 0,//`${windowHeight*0.91}px`,
			right: '10px',
			backgroundColor: "#4742A8",
			width: `${ containerWidth - 20 }px`,
			height: "30px",
			border: "none",
			color: "white",
			borderRadius: "5px",
			fontSize: "15px"
		}
		const openModalStyle = {
			border: 'none',
			borderRadius: '5px',
			padding: '5px',
			position: 'absolute',
			right: '10px',
			height: '50px',
			width: `${(containerWidth - 20) * 0.4}px`,
			bottom: '35px',
			backgroundColor: "#6870C4",
			color: 'white',
			cursor: 'pointer'
		}
		const h2Style = {
			textAlign: 'center',
			color: 'black'
		}
		const textAreaStyle = {
			width: `${(windowWidth * 0.5) - 45}px`,
			height: `${windowHeight * 0.15}px`,
			fontSize: '15px',
			resize: 'none',
			backgroundColor: '#cccccc',
			border: '1px solid black',
			borderRadius: '5px'
		}
		const { classes } = this.props;
		const listStyle = {
			listStyle: 'none',
			padding: '0px 0px',
			width: windowWidth * 0.35,
			margin: '5px 0px',
			height: `${(windowHeight*0.75)-315}px`,
			overflowY: 'hidden',
			overflowX: 'hidden',
			color: 'black'
		}
		const imgInputWrapperStyle = {
			height: '23px',
			width: `${ (containerWidth - 20)*0.35}px`,
			overflow: 'hidden',
			position: 'absolute',
			right: `${(containerWidth - 20) * 0.45}px`,
			bottom: '62px',
			cursor: 'pointer',
			/*Using a background color, but you can use a background image to represent a button*/
			backgroundColor: '#6870C4',
			textAlign: 'center',
			zIndex: '99',
			borderRadius: '5px',
			color: 'white'
		}
		const vidInputWrapperStyle = {
			height: '23px',
			width: `${(containerWidth - 20) * 0.35}px`,
			overflow: 'hidden',
			position: 'absolute',
			right: `${(containerWidth - 20) * 0.45}px`,
			bottom: '35px',
			cursor: 'pointer',
			/*Using a background color, but you can use a background image to represent a button*/
			backgroundColor: '#6870C4',
			textAlign: 'center',
			zIndex: '99',
			borderRadius: '5px',
			color: 'white'
        }
		const imgUpStyle = {
			cursor: 'pointer',
			height: '100%',
			position: 'absolute',
			right: `0px`,
			top: '0px',
			zIndex: '100',
			/*This makes the button huge. If you want a bigger button, increase the font size*/
			fontSize: '15px',
			/*Opacity settings for all browsers*/
			opacity: '0',
			MozOpacity: '0',
			filter: `progid:DXImageTransform.Microsoft.Alpha(opacity = 0)`,
			width: '100%',
			color: 'white'
		}
		const vidUpStyle = {
			cursor: 'pointer',
			height: '100%',
			position: 'absolute',
			right: `0px`,
			top: '0px',
			zIndex: '100',
			/*This makes the button huge. If you want a bigger button, increase the font size*/
			fontSize: '15px',
			/*Opacity settings for all browsers*/
			opacity: '0',
			MozOpacity: '0',
			filter: `progid:DXImageTransform.Microsoft.Alpha(opacity = 0)`,
			width: '100%',
			color: 'white'
		}
		const imgLabelStyle = {
			position: 'absolute',
			right: '105px',
			bottom: '32px',
			color: 'black',
		}
		const vidLabelStyle = {
			position: 'absolute',
			right: '105px',
			bottom: '8px',
			color: 'black',
		}
		const formStyle = {
			display: 'inline',
			whiteSpace: 'nowrap',
		}
		const controllerStyle = {
			width: '30%',
			height: '28.7%',
			position: 'absolute',
			right: '2%',
			bottom: '6.5%',
			overflow: 'hidden',
			border: '2px solid black',
			borderRadius: '5px',
			backgroundColor: 'white'
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
			height: '20px',
			backgroundColor: 'silver',
			color: 'black'
		}
		const putAfterStyle = {
			width: '80%',
			border: 'none',
			borderRadius: '5px',
			position: 'absolute',
			top: '80px',
			right: '10%',
			height: '20px',
			backgroundColor: 'silver',
			color: 'black'
		}
		const deleteButtonListStyle = {
			position: 'absolute',
			right: '35%',
			top: `${348 + (windowHeight*0.15)}px`,
			width: '14%',
			height: `${(windowHeight * 0.75) - 315}px`,
			overflowY: 'auto',
			overflowX: 'hidden',
			backgroundColor: 'transparent',
		}
		const imgInputStyle = {
			color: 'transparent',
			position: 'absolute',
			right: '0px',
			bottom: '30px',
			width: 100,
			color: 'white'
		}
		const vidInputStyle = {
			color: 'transparent',
			position: 'absolute',
			right: '0px',
			bottom: '5px',
			width: 100,
			color: 'white'
		}
		const submitButtonStyle = {
			position: 'absolute',
			top: '20px',
			right: '20px',
			border: 'none',
			borderRadius: '5px',
			backgroundColor: '#4742A8',
			color: 'white',
			padding: '10px'
		}

		const removeSpan = function (e) {
			this.setState({
				showSpan: false
			})
		}.bind(this)

		const checkSpanOn = function (e) {
			if (e.target.value === "") {
				this.setState({
					showSpan: true
				})
			}
		}.bind(this)

		const hashTagInputStyle = {
			position: 'absolute',
			top: `${window.innerHeight - 178}px`,
			height: '30px',
			fontSize: '15px',
			width: `${containerWidth - 25}px`,
			right: "10px",
			border: '1px solid black',
			borderRadius: '5px',
			color: this.state.hashTag =='Enter hash tags that begins with # and separated with ,'? 'gray':'black'
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
						<h2 style={h2Style}>New Article</h2>
						<button style={submitButtonStyle} type='submit' form='form1'>Submit</button>
						<hr />
						<form id='form1' onSubmit={this.handleSubmitForm}>
							<textarea style={textAreaStyle} onChange={this.handleEditContentChange}>{this.state.editContent}</textarea>
							<input style={modalHashTagInputStyle} onChange={this.handleHashTagChange} onFocus={this.handleHashTagFocus} onBlur={this.handleHashTagBlur} value={this.state.hashTag}/>
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
								<p style={selectedMediaStyle}>{this.state.currentMedia ? this.state.editMediaRawData[this.state.currentMedia].getLetter() : <span />}</p>
								<button onClick={this.handlePutAfter} style={putAfterStyle} disabled={((typeof this.state.currentMedia) == "boolean") || this.state.currentMedia < 0 || this.state.currentMedia >= this.state.editMediaNode.length - 1}>Put After</button>
								<label htmlFor="imgInput" style={imgLabelStyle}>New image: </label>
								<input type="file" style={imgInputStyle} accept="image/*" multiple={true} id="imgInput" name="imgInput" onChange={this.editHandleChange} />
								<label htmlFor="vidInput" style={vidLabelStyle}>New video: </label>
								<input type="file" style={vidInputStyle} accept='video/*' multiple={true} id="vidInput" name="vidInput" onChange={this.editHandleChange} />
							</div>
						</form>
					</Modal> : <span></span>}
			<div id="container" style={containerStyle}>
				<div style={vrStyle}/>
				<a data-tip data-for="tooltip" style={linkStyle}>Read me!</a>
				<ReactTooltip id="tooltip" place="bottom" type="light" effect="solid" wrapper="div">
						<p><strong>Your anonimity is perfectly ensured</strong> in this page, and no outsider except<br />the students can access this website with their id. You will be never required to<br />enter your name or reveal identity in the website. None of your activity will be <br />accessed by outsiders unless you opt to and no information will be provided to <br /> any other authorities whatsoever. <strong>Complete freedom</strong> is guaranteed, if<br /> you keep the following 4 rules:<br />
						<ol>
							<li><strong>No defamation</strong>: Any criticism of specific figure is welcomed but should<br /> be supported with fact or logic, or the figure shouldn't be specified. If any<br />intention to 1. spread false information or 2. groundlessly blame of <br />specific figure is detected, the comment or article will be taken down.</li>
							<li><strong>No discrimination</strong>: Any comments and articles that has discriminative<br />intention, regardless it is sexual, racial, religious, or ethnic, is prohibited. <br />#allLivesMatter</li>
							<li><strong>No criminal activity</strong>: Any illegal contents or trade of illegal drugs or<br/> substances are prohibited and will be taken down when detected.</li>
							<li><strong>No spamming.</strong> If an attempt to upload more than 3 of the same article or<br />comment is found, only 1 of them will be preserved.</li>
						</ol>
					</p>
				</ReactTooltip>
					<form onSubmit={this.handleSubmitForm}>
						<textarea id='textBody' name='textBody' style={textInputStyle} onFocus={removeSpan} onBlur={checkSpanOn} onChange={this.handleEditContentChange} value={this.state.editContent} />
						<input type='text' style={hashTagInputStyle} onChange={this.handleHashTagChange} onKeyPress={this.handleHashTagKey}value={this.state.hashTag} onFocus={this.handleHashTagFocus} onBlur={this.handleHashTagBlur} />
					{this.state.showSpan ? <span style={spanStyle}>Share your story!</span> : null}
					<label htmlFor="imgInput" style={imgUpLabelStyle}>Upload image: </label>
					<div style={imgInputWrapperStyle}>New Image<input type="file" id="imgInput" name="imgInput" accept="image/*" style={imgUpStyle} multiple={true} onChange={this.handleChange} /></div>
					<label htmlFor="vidInput" style={vidUpLabelStyle}>Upload video:</label>
					<div style={vidInputWrapperStyle}>New Video<input type="file" id="vidInput" name="vidInput" accept="video/*" multiple={true} style={vidUpStyle} onChange={this.handleChange} /></div>
					<input type="submit" id="submitButton" name="submitButton" style={submitStyle} formEncType="multipart/form-data" />
				</form>
				<button onClick={this.handleOpenModal} style={openModalStyle}>More drafting options</button>
			</div></div>
        );
	}
}

export default withStyles(useStyles)(Writer);