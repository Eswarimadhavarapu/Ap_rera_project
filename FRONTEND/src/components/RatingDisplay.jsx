import React from "react";

export default function RatingDisplay({ rating }) {
  if (!rating) return <div className="rating-display">No ratings yet</div>;
  
  const avg = parseFloat(rating.average || 0).toFixed(1);
  return (
    <div className="rating-display">
      <span className="rd-stars">{"⭐".repeat(Math.round(avg))}</span>
      <span className="rd-text">{avg} ({rating.total_reviews} reviews)</span>
    </div>
  );
}