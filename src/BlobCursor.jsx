'use client';

import { useRef, useEffect } from 'react';

export default function BlobCursor({
  blobType = 'circle',
  fillColor = '#A855F7', // Purple to match theme
  trailCount = 3,
  sizes = [60, 125, 75],
  innerSizes = [20, 35, 25],
  innerColor = 'rgba(255,255,255,0.8)',
  opacities = [0.6, 0.6, 0.6],
  shadowColor = 'rgba(168, 85, 247, 0.4)', // Purple shadow
  shadowBlur = 5,
  shadowOffsetX = 10,
  shadowOffsetY = 10,
  filterId = 'blob',
  filterStdDeviation = 30,
  filterColorMatrixValues = '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10',
  useFilter = true,
  zIndex = 0 // Default changed to 0 to sit behind text
}) {
  const blobsRef = useRef([]);
  const requestRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  // Store current positions for each blob
  const blobCoords = useRef(Array.from({ length: trailCount }).map(() => ({ x: 0, y: 0 })));

  useEffect(() => {
    // 1. Track mouse position
    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      mouse.current = { x: touch.clientX, y: touch.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // 2. Animation Loop (replaces GSAP)
    const animate = () => {
      blobCoords.current.forEach((coord, index) => {
        // The first blob follows the mouse closely (fast), others follow slowly
        const isLead = index === 0;
        const speed = isLead ? 0.3 : 0.08; 
        
        // Linear interpolation (Lerp) for smooth following
        coord.x += (mouse.current.x - coord.x) * speed;
        coord.y += (mouse.current.y - coord.y) * speed;

        const el = blobsRef.current[index];
        if (el) {
          // Apply transform directly for performance
          el.style.transform = `translate3d(${coord.x}px, ${coord.y}px, 0) translate(-50%, -50%)`;
        }
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, [trailCount]);

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex, mixBlendMode: 'normal' }} // Added mix-blend-mode support if needed later
    >
      {/* SVG Filter for the gooey effect */}
      {useFilter && (
        <svg className="absolute w-0 h-0">
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={filterStdDeviation} />
            <feColorMatrix in="blur" values={filterColorMatrixValues} />
          </filter>
        </svg>
      )}

      {/* Blob Elements */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ filter: useFilter ? `url(#${filterId})` : undefined }}
      >
        {Array.from({ length: trailCount }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (blobsRef.current[i] = el)}
            className="absolute left-0 top-0 will-change-transform"
            style={{
              width: sizes[i],
              height: sizes[i],
              borderRadius: blobType === 'circle' ? '50%' : '0',
              backgroundColor: fillColor,
              opacity: opacities[i],
              boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`,
              // Initialize off-screen
              transform: 'translate3d(-100px, -100px, 0)' 
            }}
          >
            {/* Inner highlight/dot */}
            <div
              className="absolute"
              style={{
                width: innerSizes[i],
                height: innerSizes[i],
                top: (sizes[i] - innerSizes[i]) / 2,
                left: (sizes[i] - innerSizes[i]) / 2,
                backgroundColor: innerColor,
                borderRadius: blobType === 'circle' ? '50%' : '0'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}