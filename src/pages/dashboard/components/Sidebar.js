import Logo from '../../../logo.png';
import {Link} from 'react-router-dom';
import React, {useState} from 'react';

export default function Sidebar() {
  const [active, updateActive] = useState(document.location.pathname);
  const navItems = [
    {name: "Home", link: "/"},
    {name: "Forum", link: "/posts"},
    {name: "Account", link: "/myaccount"},
    {name: "Logout", link: "/logout"}
  ];


  return (
    <div id="dashboard-sidebar">
      <header id="dashboard-sidebar-header" className="w-100">
        <img src={Logo} className="px-5 w-100" alt="logo" />
      </header>
      <div id="dashboard-sidebar-menu">
        {navItems.map(nav =>
          <Link to={nav.link}
            className={(active === nav.link ? "font-weight-normal" : "") + " nav-link"}
            onClick={() => updateActive(nav.link)}>
          {nav.name}
          </Link>
        )}
      </div>
    </div>
  );
}
