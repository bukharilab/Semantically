import './App.css';

import React, { useState, useEffect } from 'react';
import {BrowserRouter, Switch, Route, useParams} from 'react-router-dom';

import $ from 'jquery';

import {checkLoggedIn} from './pages/authentication/hooks/authenticate';

import Editor from './pages/editor/editor';
import Dashboard from './pages/dashboard/dashboard';
import Forum from './pages/forum/forum';
import Post from './pages/forum/post';
import Login from './pages/authentication/login';
import Logout from './pages/authentication/logout';
import Register from './pages/authentication/register';
import Survey from './pages/authentication/survey';
import Account from './pages/account/account';

import AlertMessage from './components/Alert';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [alert, setAlert] = useState({});
  const appProps = {
    loggedIn: loggedIn,
    setLoggedIn: setLoggedIn,
    alert: alert,
    setAlert: setAlert,
  };

  // Check if session still active
  if (!loggedIn) checkLoggedIn(setLoggedIn);

  return (
    <>
    {!$.isEmptyObject(alert) ? <AlertMessage {...appProps} /> : null}
    <BrowserRouter><Switch>
      <Route path="/login" render={() => <Login {...appProps} />} />
      <Route path="/logout" render={() => <Logout {...appProps} />} />
      <Route path="/register" render={() => <Register {...appProps} />} />
      <Route path="/survey" component={Survey} />
      <Route path="/myaccount" component={Account} />
      <Route path="/posts" component={Forum} />
      <Route path="/post/:postId" component={Post} />
      <Route path="/document/:documentId" component={Editor} />
      <Route path="/" render={() => <Dashboard {...appProps} />} />
    </Switch></BrowserRouter>
    </>
  );
}

export default App;
