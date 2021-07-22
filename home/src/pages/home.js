import React from "react";
import {
  Link
} from "react-router-dom";

export default function Home() {
  return (
    <div>
    <video className="rounded" id="player" playsinline controls data-poster="/path/to/poster.jpg">
      <source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4" type="video/mp4" />
      <track kind="captions" label="English captions" src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt" srclang="en" default />
    </video>
    <div className="buttons text-center is-block pt-4">
      <Link className="button is-primary is-large is-inline-block" to="/demo">
        <strong>Demo</strong>
      </Link>
      <Link className="button is-link is-large is-inline-block" to="/register">
        Get Started
      </Link>
    </div>
    </div>
  );

}
