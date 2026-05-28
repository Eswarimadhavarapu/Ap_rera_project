import React from "react";

export default function ImageModal({ url, onClose }) {
  return (
    <div className="im-overlay" onClick={onClose}>
      <div className="im-content" onClick={e => e.stopPropagation()}>
         <button className="im-close" onClick={onClose}>&times;</button>
         <img src={url} alt="Expanded" className="im-expanded-img" />
      </div>
    </div>
  );
}