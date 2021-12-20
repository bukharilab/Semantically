import React from "react";
import {
  Link
} from "react-router-dom";

import Login from './login';
import Register from './register';

import SemanticallyDemo from '../semantically-1080p.mov';

export default function Home() {
  return (
    <div>
    <video className="rounded" playsinline controls>
      <source src={SemanticallyDemo} type="video/mp4" />
    </video>
    <div className="buttons text-center is-block pt-4">
      <a className="button is-primary is-large is-inline-block" href="https://demo.semantically.risonstudio.com" target="_blank">
        <strong>Demo</strong>
      </a>
      <Link className="button is-link is-large is-inline-block" to={'/register'}>
        Get Started
      </Link>
    </div>
    </div>
  );

}
