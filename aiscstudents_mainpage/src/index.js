import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './App';


fetch('https://aiscstudents.com/api/whoami/', {
    method: 'GET',
    credentials: "include",
    headers: {
        'Access-Control-Allow-Origin': "aiscstudents.com",
        "cache-control": 'no-cache'
    }
}).then((response2) => {
    if (response2.status === 301) {
        window.location.href = "https://aiscstudents.com/login";
        return;
    }
    fetch('https://aiscstudents.com/api/getMyFriends/', {
        method: 'GET',
        credentials: "include",
        headers: {
            'Access-Control-Allow-Origin': "aiscstudents.com",
            "cache-control": 'no-cache'
        }
    }).then((response1) => {
        response1.json().then((friendJSON) => {
            response2.json().then((hashJSON) => {
                let hashID = "";
                hashID = hashJSON[0]['hashID'];
                ReactDOM.render(<React.StrictMode><App hashID={hashID} darkTheme={hashJSON[0]['darkTheme'] == 0 ? false : true} usePrefName={hashJSON[0]['usePrefName']} preferredName={hashJSON[0]['preferredName']} friendList={friendJSON} /></React.StrictMode>, document.getElementById('root'));
            })    
        })
    })

    
})
//ReactDOM.render(<React.StrictMode><App hashID={hashID} friendList={friendJSON}/></React.StrictMode>, document.getElementById('root'));
serviceWorker.unregister();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//<FriendData.Provider value={friendJSON}></FriendData.Provider>
//ReactDOM.render(<React.StrictMode><DarkTheme.Provider value={hashJSON[0]['darkTheme'] == 0 ? false : true}><NavBar /><Articles hashID={hashID} /> <Writer writer={hashID} /><SocialBox hashID={hashID} /></DarkTheme.Provider></React.StrictMode>, document.getElementById('root'));