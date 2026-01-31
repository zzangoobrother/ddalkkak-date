"use client";

import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * 별점 입력/표시 컴포넌트
 */
export default function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const handleClick = (value: number) => {
    if (!readonly) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const getStarClass = (index: number) => {
    const displayRating = hoverRating || rating;
    const isFilled = index <= displayRating;
    const isHalf = index - 0.5 === displayRating;

    if (readonly) {
      return isFilled ? "text-yellow-500" : "text-gray-300";
    }

    return isFilled
      ? "text-yellow-500 cursor-pointer hover:scale-110"
      : "text-gray-300 cursor-pointer hover:scale-110";
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          onMouseEnter={() => handleMouseEnter(value)}
          onMouseLeave={handleMouseLeave}
          disabled={readonly}
          className={`${sizeClasses[size]} ${getStarClass(value)} transition-all`}
          aria-label={`${value}점`}
        >
          ★
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-sm font-semibold text-text-primary">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
