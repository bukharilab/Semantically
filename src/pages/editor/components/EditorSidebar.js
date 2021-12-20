import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Semantically_Logo from '../img/semantically-logo.png';
import Home from '../img/home-1.svg';
import Forum from '../img/forum.svg';
import Account from '../img/account.svg';

const EditorSidebar = () => {
  const navItems = [
    {link: "/", img: Home},
    {link: "/posts", img: Forum},
    {link: "/myaccount", img: Account},
  ];

  return (
    <div id="editor-sidebar">
      <Link to="/">
        <img src={Semantically_Logo} className="editor-sidebar-icon mb-5 mt-0"/>
      </Link>
      {navItems.map(nav =>
        <Link to={nav.link}>
          <img src={nav.img} className="editor-sidebar-icon"/>
        </Link>
      )}
    </div>
  )
}

export default EditorSidebar;
