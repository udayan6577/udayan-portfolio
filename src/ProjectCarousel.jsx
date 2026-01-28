import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

const ProjectCarousel = ({ items }) => {
  const [currdeg, setCurrdeg] = useState(0);
  const [activeItem, setActiveItem] = useState(0);
  const carouselRef = useRef(null);

  // Configuration
  const width = 300; // Card width
  const gap = 40;    // Gap between cards
  
  // Calculate geometry based on item count
  // We arrange items in a circle. The radius depends on width/count.
  // For a flatter "carousel" feel, we limit the effective count in geometry math
  const count = items.length;
  const theta = 360 / count;
  const radius = Math.round((width / 2) / Math.tan(Math.PI / count));

  const rotate = (direction) => {
    const newDeg = direction === 'next' ? currdeg - theta : currdeg + theta;
    const newItem = direction === 'next' 
      ? (activeItem + 1) % count 
      : (activeItem - 1 + count) % count;
      
    setCurrdeg(newDeg);
    setActiveItem(newItem);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-20 overflow-hidden">
      
      {/* 3D Scene Container */}
      <div 
        className="relative w-full h-[400px] flex justify-center items-center perspective-1000"
        style={{ perspective: '1000px' }}
      >
        {/* Rotating Carousel */}
        <div
          className="absolute transform-style-3d transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
          style={{
            transform: `rotateY(${currdeg}deg)`,
            transformStyle: 'preserve-3d',
            width: `${width}px`,
            height: '100%'
          }}
        >
          {items.map((item, index) => {
            // Calculate each card's rotation in the circle
            const rotation = index * theta;
            
            return (
              <div
                key={index}
                className="absolute inset-0 backface-hidden"
                style={{
                  transform: `rotateY(${rotation}deg) translateZ(${radius + gap + 100}px)`, // Added extra Z depth for spacing
                  width: '100%',
                  height: '100%'
                }}
              >
                {/* Card Content */}
                <div className="w-full h-full p-4">
                  <div className="relative w-full h-full bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden group hover:border-purple-500/50 transition-colors duration-500">
                    
                    {/* Image */}
                    <div className="absolute inset-0">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    </div>

                    {/* Text Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <span className="text-purple-400 text-xs font-bold tracking-wider uppercase mb-2">
                        {item.category}
                      </span>
                      <h3 className="text-2xl font-medium text-white mb-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-xs line-clamp-3">
                        {item.description}
                      </p>
                      
                      {/* Hover Action */}
                      <div className="mt-4 flex items-center text-white text-xs font-bold opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <span>View Case Study</span>
                        <ArrowUpRight size={14} className="ml-1" />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-6 mt-12 z-10">
        <button 
          onClick={() => rotate('prev')}
          className="group flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <button 
          onClick={() => rotate('next')}
          className="group flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
        >
          <ArrowRight size={20} />
        </button>
      </div>

    </div>
  );
};

export default ProjectCarousel;