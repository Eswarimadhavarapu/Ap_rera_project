import React from "react";
import "../styles/AudioVisualGallery.css";

const audioFiles = [
  "/Audios/jingle1.mp3",
  "/Audios/jingle2.mp3",
  "/Audios/jingle3.mp3",
  "/Audios/jingle4.mp3",
  "/Audios/jingle5.mp3",
  "/Audios/jingle6.mp3",
];

export default function AudioVisualGallery() {
  return (
    <div className="avg-wrapper">
      <div className="avg-container">

        <div className="breadcrumb">
          You are here : <span>Home</span> / <span>Promotions</span> /{" "}
          <strong>Audio Visual Gallery</strong>
        </div>

        <h2 className="page-title">Audio Jingles</h2>
        <div className="title-underline"></div>

        <div className="audio-grid">
          {audioFiles.map((src, index) => (
            <div className="audio-box" key={index}>
              <audio
                controls
                preload="metadata"
                src={src}
              />
            </div>
          ))}
        </div>

        <h2 className="page-title">Videos</h2>
        <div className="title-underline"></div>
        <div className="accordion">
          <div className="accordion-header">+ Videos</div>
        </div>

        <h2 className="page-title">Photo Gallery</h2>
        <div className="title-underline"></div>
        <div className="accordion">
          <div className="accordion-header">+ Office Inauguration Photos</div>
          <div className="accordion-header">+ Website Launch Photos</div>
        </div>

      </div>
    </div>
  );
}