import Logo from '../logo.png';

export default function Sidebar() {
  return (
    <div id="sidebar">
      <header id="sidebar-header">
        <img src={Logo} className="App-logo" alt="logo" />
      </header>
      <div id="sidebar-menu">
        <span>Home</span>
        <span>Forum</span>
        <span>Logout</span>
      </div>
    </div>
  );
}
