import React, { useState } from "react";
import ImageModal from "./ImageModal";

export default function GalleryCarousel({ images }) {
  const [modalImg, setModalImg] = useState(null);

  if (!images || images.length === 0) {
    return <div className="gc-empty">No images available</div>;
  }

  return (
    <>
      <div className="gc-container">
        {images.map(img => (
          <img 
            key={img.id} 
            src={img.image_url} 
            alt={img.title || "Project Image"} 
            className="gc-image-thumb"
            onClick={() => setModalImg(img.image_url)}
          />
        ))}
      </div>
      {modalImg && <ImageModal url={modalImg} onClose={() => setModalImg(null)} />}
    </>
  );
}