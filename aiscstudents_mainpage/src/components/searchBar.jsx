import React, { Component } from 'react';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInput: "Search hash tag, article ID, or text",

        };
    }

    handleSearchValueChange = (e) => {
        e.preventDefault();
        const target = e.target;
        this.setState({
            searchInput: target.value
        })
    }

    handleSearchValueFocus = (e) => {
        e.preventDefault();
        const target = e.target;
        if (this.state.searchInput == 'Search hash tag, article ID, or text') {
            this.setState({
                searchInput: ""
            })
        }
    }

    handleSearchValueBlur = (e) => {
        e.preventDefault();
        const target = e.target;
        if (this.state.searchInput.trim() == "") {
            this.setState({
                searchInput: 'Search hash tag, article ID, or text'
            })
        }
    }

    handleSearchSubmit = (e) => {
        e.preventDefault();
        if (this.state.searchInput == '' || this.state.searchInput == "Search hash tag, article ID, or text") {
            window.location.href = "https://aiscstudents.com";
            return;
        }
        const formData = new FormData();
        const keywords = this.state.searchInput.slice().toString().split(/[\s,]+/)
        const hashTag = [];
        const text = [];
        for (let i = 0; i < keywords.length; i++) {
            keywords[i] = keywords[i].trim();
            if (keywords[i].substring(0, 1) == "#") {
                hashTag.push(keywords[i])
            }
            else {
                text.push(keywords[i])
            }
        }
        formData.append('hashTag', hashTag)
        formData.append('text', text)
        fetch('https://aiscstudents.com/api/searchByKeyword/', {
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: {
                'cache-control': 'no-cache',
            }
        }).then((response) => {
            if (response.status === 301) {
                window.location.href = "https://aiscstudents.com/login"
                window.alert('Not logged in')
                return;
            }
            else if (response.status === 500) {
                window.alert("An error has occurred. Please retry. If the error continues, please contact us via 'Contact' tab");
                return;
            }
            else if (response.status === 200) {
                response.json().then((json) => {
                    this.props.searchHandler(json)
                })
            }
        })
    }

    render() {
        const containerStyle = {
            position: 'relative',
            left: `${(window.innerWidth * 0.25)+7}px`,
            backgroundColor: 'white',
            width: `${window.innerWidth * 0.4}px`,
            padding: '10px',
            paddingTop: '5px',
            //height: '50px',
            marginTop: '10px',
            marginBottom: '10px',
            borderRadius: '5px'
        }

        const searchInputStyle = {
            position: 'relative',
            //top: '35px',
            width: `${(window.innerWidth * 0.385)-40}px`,
            left: `${window.innerWidth * 0.007}px`,
            height: '30px',
            fontSize: '18px',
            color: this.state.searchInput.trim() == "Search hash tag, article ID, or text" || this.state.searchInput.trim() == "" ? 'darkgray' : 'black',
            border: '2px solid silver',
            borderRadius: '5px'
        }

        const searchButtonStyle = {
            position: 'relative',
            right: '-20px',
            width: '30px',
            height: '30px',
            top: '8px',
            cursor: 'pointer'
        }

        return (
            <div style={containerStyle}>
                <input type='text' style={searchInputStyle} value={this.state.searchInput} onChange={this.handleSearchValueChange} onFocus={this.handleSearchValueFocus} onBlur={this.handleSearchValueBlur} />
                <img src='./images/search.png' alt='search' style={searchButtonStyle} onClick={this.handleSearchSubmit} />
            </div>
        );
    }
}

export default SearchBar;