import React, { Component } from 'react';
import NavBar from './components/navBar';
import Writer from './components/writer';
import SocialBox from './components/socialBox';
import Articles from './components/articles';
export const DarkTheme = React.createContext("DarkTheme")
export const FriendData = React.createContext("FriendData")

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hashID: "",
            friendList: []
        };
    }

    render() {
        return (
            <DarkTheme.Provider value={this.props.darkTheme}>
                <NavBar />
                <Articles hashID={this.props.hashID} preferredName={this.props.preferredName} usePrefName={this.props.usePrefName} friendList={this.props.friendList} />
                <Writer writer={this.props.hashID} />
                <SocialBox hashID={this.props.hashID} />
            </DarkTheme.Provider>
        );
    }
}

export default App;