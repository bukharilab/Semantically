import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import React, { useState, useEffect } from 'react';
import {BrowserRouter, Switch, Route, useParams} from 'react-router-dom';

import $ from 'jquery';

import Editor from './pages/editor/editor';

function App() {
  return (
    <BrowserRouter><Switch>
      <Route path="/document/:documentId" component={Editor} />
    </Switch></BrowserRouter>
  );
}

export default App;
