import React, { useEffect, useRef } from 'react';

const WaveAnimation = ({ isActive = false, height = 60 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const drawWave = () => {
      const width = canvas.width;
      const h = canvas.height;
      const centerY = h / 2;

      // Clear canvas
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fillRect(0, 0, width, h);

      if (!isActive) {
        // Draw static line
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        return;
      }

      // Draw animated wave
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const wave1 = Math.sin((x + time) * 0.05) * 8;
        const wave2 = Math.sin((x + time) * 0.03) * 12;
        const y = centerY + wave1 + wave2 + (Math.random() - 0.5) * 4;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      time += 1;
      animationId = requestAnimationFrame(drawWave);
    };

    canvas.width = canvas.offsetWidth;
    canvas.height = height;
    drawWave();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isActive, height]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full border border-slate-200 rounded-lg bg-white"
      style={{ height: `${height}px` }}
    />
  );
};

export default WaveAnimation;
