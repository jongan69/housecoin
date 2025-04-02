'use client';

import { useEffect, useRef } from 'react';

export default function GridPattern() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Grid properties
    const gridSize = 100; // Larger grid size for real estate feel
    let time = 0;

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'; // Increased line opacity
      ctx.lineWidth = 1; // Slightly thicker lines

      // Draw vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        const offset = Math.sin(time + x * 0.005) * 1;
        ctx.beginPath();
        ctx.moveTo(x + offset, 0);
        ctx.lineTo(x + offset, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        const offset = Math.cos(time + y * 0.005) * 1;
        ctx.beginPath();
        ctx.moveTo(0, y + offset);
        ctx.lineTo(canvas.width, y + offset);
        ctx.stroke();
      }

      // Draw glow effect at intersections
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const xOffset = Math.sin(time + x * 0.005) * 1;
          const yOffset = Math.cos(time + y * 0.005) * 1;
          
          const distance = Math.sqrt(
            Math.pow(x + xOffset - canvas.width / 2, 2) + 
            Math.pow(y + yOffset - canvas.height / 2, 2)
          );
          
          const maxDistance = Math.sqrt(
            Math.pow(canvas.width / 2, 2) + 
            Math.pow(canvas.height / 2, 2)
          );
          
          const opacity = Math.max(0, 1 - distance / maxDistance) * 0.3; // Increased glow opacity
          
          ctx.beginPath();
          ctx.arc(x + xOffset, y + yOffset, 2, 0, Math.PI * 2); // Larger dots
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
        }
      }

      time += 0.01; // Slower animation speed
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ opacity: 0.8 }} // Increased overall opacity
    />
  );
} 