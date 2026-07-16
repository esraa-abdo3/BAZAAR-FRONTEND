import React from 'react';

/**
 * Displays a row of stars representing an average rating (0-5),
 * with optional review count text next to it.
 *
 * Renders nothing if there are no reviews yet (ratingCount is 0/undefined),
 * so products without reviews don't show a confusing "0 stars" row.
 */
export default function StarRating({ avgRating = 0, ratingCount = 0, size = 14, showCount = true }) {
  if (!ratingCount) return null;

  const rounded = Math.round(avgRating * 2) / 2; // supports half stars

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const diff = rounded - starIndex + 1;
          const fillPercent = diff >= 1 ? 100 : diff > 0 ? diff * 100 : 0;

          return (
            <span key={starIndex} className="relative inline-block" style={{ width: size, height: size }}>
              {/* Empty star (background) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d1d5db"
                strokeWidth="1.5"
                className="absolute inset-0"
              >
                <path
                  d="M12 2.5l2.81 6.63 7.19.62-5.46 4.73 1.64 7.02L12 17.77l-6.18 3.73 1.64-7.02-5.46-4.73 7.19-.62L12 2.5z"
                />
              </svg>
              {/* Filled star (clipped by percentage) */}
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={size}
                  height={size}
                  viewBox="0 0 24 24"
                  fill="#D4A853"
                  stroke="#D4A853"
                  strokeWidth="1.5"
                >
                  <path
                    d="M12 2.5l2.81 6.63 7.19.62-5.46 4.73 1.64 7.02L12 17.77l-6.18 3.73 1.64-7.02-5.46-4.73 7.19-.62L12 2.5z"
                  />
                </svg>
              </span>
            </span>
          );
        })}
      </div>
      {showCount && (
        <span className="text-xs text-gray-400 leading-none">
          {avgRating.toFixed(1)} ({ratingCount})
        </span>
      )}
    </div>
  );
}