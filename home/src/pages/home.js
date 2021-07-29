import React from "react";
import {
  Link
} from "react-router-dom";

export default function Home() {
  return (
    <div>
    <video className="rounded" id="player" playsinline controls data-poster="/path/to/poster.jpg">
      <source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4" type="video/mov" />
    </video>
    <div className="buttons text-center is-block pt-4">
      <a className="button is-primary is-large is-inline-block" href="https://demo.semantically.risonstudio.com" target="_blank">
        <strong>Demo</strong>
      </a>
      <Link className="button is-link is-large is-inline-block is-static" to="#">
        Get Started
      </Link>
    </div>
    </div>
  );

}
