import React from 'react';
import Sidebar from '../../components/Sidebar';
import {Jumbotron} from 'react-bootstrap';

const Account = () => {
  return (
    <div className="app">
      <Sidebar />
      <div id="home-panel">
      <Jumbotron>
        <h1>Page under development</h1>
        <p>
          Please return at a later time for updates!
        </p>

      </Jumbotron>
      </div>
    </div>
  )
}

export default Account;
