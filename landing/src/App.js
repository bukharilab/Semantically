import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown
} from "react-bootstrap";

import Home from './pages/home';
// import Login from './pages/login';
// import Register from './pages/register';
import Survey from './pages/survey';

import Logo from './logo.png';

export default function App() {
  return (
    <div class="container is-max-desktop">
    <Router>
    <nav className="navbar mb-5" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <img src={Logo} width="200" height="50" />
        </Link>

        <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <Link className="navbar-item" to="/">
            Home
          </Link>

          <Link className="navbar-item" to="#">
            Documentation
          </Link>

          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">
              More
            </a>

            <div className="navbar-dropdown">
              <Link className="navbar-item" to="#">
                About
              </Link>
              <Link className="navbar-item" to="#">
                Contact
              </Link>
              <Link className="navbar-item" to="#">
                Report an issue
              </Link>
            </div>
          </div>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <a className="button is-medium" href="https://app.gosemantically.com/login">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
      </nav>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/survey">
            <Survey />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>

        <footer class="container py-6 px-3">

        </footer>
      </Router>
        </div>
  );
}
