import React from 'react';

// These are simplified SVG paths for demonstration.
// In a real application, you would use more detailed and anatomically correct SVGs.

export const BodyFront = () => (
  <g id="body-front" fill="#d1e1d1" stroke="#a8c8a8" strokeWidth="0.5">
    <title>Front View of Body</title>
    {/* Head */}
    <circle cx="100" cy="40" r="25" />
    {/* Neck */}
    <rect x="92" y="65" width="16" height="15" />
    {/* Torso */}
    <path d="M70 80 L130 80 L135 180 L65 180 Z" />
    {/* Left Arm */}
    <path d="M70 85 L50 90 L40 200 L55 205 Z" />
    {/* Right Arm */}
    <path d="M130 85 L150 90 L160 200 L145 205 Z" />
    {/* Left Leg */}
    <path d="M65 180 L60 350 L90 350 L90 180 Z" />
    {/* Right Leg */}
    <path d="M135 180 L140 350 L110 350 L110 180 Z" />
    {/* Left Hand */}
    <ellipse cx="45" cy="215" rx="10" ry="15" />
    {/* Right Hand */}
    <ellipse cx="155" cy="215" rx="10" ry="15" />
    {/* Left Foot */}
    <ellipse cx="75" cy="360" rx="20" ry="10" />
    {/* Right Foot */}
    <ellipse cx="125" cy="360" rx="20" ry="10" />
  </g>
);

export const BodyBack = () => (
  <g id="body-back" fill="#d1e1d1" stroke="#a8c8a8" strokeWidth="0.5">
    <title>Back View of Body</title>
    {/* Head */}
    <circle cx="100" cy="40" r="25" />
    {/* Neck */}
    <rect x="92" y="65" width="16" height="15" />
    {/* Torso */}
    <path d="M70 80 L130 80 L135 180 L65 180 Z" />
    {/* Left Arm */}
    <path d="M70 85 L50 90 L40 200 L55 205 Z" />
    {/* Right Arm */}
    <path d="M130 85 L150 90 L160 200 L145 205 Z" />
    {/* Left Leg */}
    <path d="M65 180 L60 350 L90 350 L90 180 Z" />
    {/* Right Leg */}
    <path d="M135 180 L140 350 L110 350 L110 180 Z" />
    {/* Left Hand */}
    <ellipse cx="45" cy="215" rx="10" ry="15" />
    {/* Right Hand */}
    <ellipse cx="155" cy="215" rx="10" ry="15" />
    {/* Left Foot */}
    <ellipse cx="75" cy="360" rx="20" ry="10" />
    {/* Right Foot */}
    <ellipse cx="125" cy="360" rx="20" ry="10" />
  </g>
);