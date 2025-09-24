import React from 'react';

const Confetti: React.FC = () => {
  const confettiCount = 50;
  const colors = ['#fde047', '#86efac', '#67e8f9', '#f9a8d4'];

  const createConfetti = () => {
    return Array.from({ length: confettiCount }).map((_, index) => {
      const style = {
        left: `${Math.random() * 100}vw`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        animationDelay: `${Math.random() * 3}s`,
        width: `${Math.floor(Math.random() * 10) + 5}px`,
        height: `${Math.floor(Math.random() * 10) + 5}px`,
        opacity: Math.random() + 0.5,
        transform: `rotate(${Math.random() * 360}deg)`,
      };
      return <div key={index} className="confetti" style={style}></div>;
    });
  };

  return <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">{createConfetti()}</div>;
};

export default Confetti;
