import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Profile from './components/profile';
import NavBar from './components/navBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Articles from './components/articles';
import Comments from './components/comments';
import Liked from './components/liked';
import Tags from './components/tags';
import Friends from './components/friends';

ReactDOM.render(
    <React.StrictMode>
        <NavBar />
        <Profile />
        <Articles />
        <Comments />
        <Liked />
        <Tags />
        <Friends />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
