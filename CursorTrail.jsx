import React, { useEffect, useRef } from 'react';

const CursorTrail = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Canvas size adjustment
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse coordinates
    const mouse = { x: 0, y: 0, lastX: 0, lastY: 0 };
    let hasMoved = false;

    // Cursor trail queue
    const trailPoints = [];
    const maxPoints = 20;

    // Active particles (bursts)
    let particles = [];

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.color = color;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.05; // light gravity
        this.alpha -= this.decay;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    const handleMouseMove = (e) => {
      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      hasMoved = true;

      // Add to cursor trail queue
      trailPoints.push({ x: mouse.x, y: mouse.y, age: 0 });
      if (trailPoints.length > maxPoints) {
        trailPoints.shift();
      }
    };

    const handleMouseDown = (e) => {
      // Color matching active theme
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#8b5cf6';
      const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim() || '#ec4899';
      
      // Emit burst of particles
      const count = 25;
      for (let i = 0; i < count; i++) {
        const color = i % 2 === 0 ? primaryColor : secondaryColor;
        particles.push(new Particle(e.clientX, e.clientY, color));
      }
    };

    const handleKeyPress = () => {
      // Key press sparks at current mouse position
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#8b5cf6';
      const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim() || '#ec4899';

      const count = 4;
      for (let i = 0; i < count; i++) {
        const color = i % 2 === 0 ? primaryColor : secondaryColor;
        const spark = new Particle(mouse.x + (Math.random() * 20 - 10), mouse.y + (Math.random() * 20 - 10), color);
        spark.speedY = Math.random() * -3 - 1; // shoot upwards
        particles.push(spark);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyPress);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#8b5cf6';
      const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim() || '#ec4899';

      // 1. Draw smooth cursor ribbon/trail
      if (trailPoints.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trailPoints[0].x, trailPoints[0].y);

        for (let i = 1; i < trailPoints.length; i++) {
          const xc = (trailPoints[i].x + trailPoints[i - 1].x) / 2;
          const yc = (trailPoints[i].y + trailPoints[i - 1].y) / 2;
          ctx.quadraticCurveTo(trailPoints[i - 1].x, trailPoints[i - 1].y, xc, yc);
        }

        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Layer an inner glowing trail
        ctx.beginPath();
        ctx.moveTo(trailPoints[0].x, trailPoints[0].y);
        for (let i = 1; i < trailPoints.length; i++) {
          const xc = (trailPoints[i].x + trailPoints[i - 1].x) / 2;
          const yc = (trailPoints[i].y + trailPoints[i - 1].y) / 2;
          ctx.quadraticCurveTo(trailPoints[i - 1].x, trailPoints[i - 1].y, xc, yc);
        }
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Age points and remove dead points
      trailPoints.forEach(p => p.age++);
      if (trailPoints.length > 0 && trailPoints[0].age > maxPoints) {
        trailPoints.shift();
      }

      // 2. Draw and update active particles
      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyPress);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="cursor-canvas" ref={canvasRef} />;
};

export default CursorTrail;
