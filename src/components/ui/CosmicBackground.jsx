import React from 'react';

const CosmicBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#020617]">
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]"></div>
      
      {/* Animated Nebulae */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-blue-500/5 blur-[150px]"></div>

      {/* Stars Layer 1 - Tiny, Twinkling */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(100)].map((_, i) => (
          <div
            key={`star-1-${i}`}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDuration: Math.random() * 3 + 2 + 's',
              animationDelay: Math.random() * 5 + 's',
            }}
          ></div>
        ))}
      </div>

      {/* Stars Layer 2 - Larger, different colors */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-2-${i}`}
            className="absolute rounded-full bg-indigo-200"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.3,
            }}
          ></div>
        ))}
      </div>

      {/* Subtle Shooting Star */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute w-[2px] h-[2px] bg-white rounded-full animate-shooting-star" style={{ top: '20%', left: '-10%' }}></div>
        <div className="absolute w-[2px] h-[2px] bg-white rounded-full animate-shooting-star" style={{ top: '60%', left: '-10%', animationDelay: '8s' }}></div>
      </div>

      {/* Grid Pattern overlay for a "chart" feel */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
    </div>
  );
};

export default CosmicBackground;
