
import React, { useRef, useEffect } from 'react';

const NeuralNetworkCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let width, height;

    // Configuration
    const particleCount = 70; 
    const connectionDistance = 140;
    const mouseDistance = 200;
    const coreColor = '#0066FF';

    // Mouse state
    let mouse = { x: null, y: null };

    // Resize handling
    const handleResize = () => {
      if (containerRef.current) {
        width = containerRef.current.offsetWidth;
        height = containerRef.current.offsetHeight;
        
        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        initParticles();
      }
    };

    const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
        mouse.x = null;
        mouse.y = null;
    }

    // Particle Class
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 2 + 1;
        this.baseSize = this.size;
        this.angle = Math.random() * Math.PI * 2; // For oscillation
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Interactive: Mouse attraction/repulsion
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            
            if (distance < mouseDistance) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouseDistance - distance) / mouseDistance;
                
                // Attraction force
                const attractionStrength = 0.05;
                this.vx += forceDirectionX * force * attractionStrength;
                this.vy += forceDirectionY * force * attractionStrength;

                // Slightly increase size near mouse
                if (this.size < this.baseSize * 2) {
                    this.size += 0.1;
                }
            } else if (this.size > this.baseSize) {
                this.size -= 0.1;
            }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = coreColor;
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = coreColor;
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    // Data Packets (Simulating data flow)
    let packets = [];
    
    function spawnPacket(p1, p2) {
        if (Math.random() > 0.98) { // Rare spawn chance per frame per valid connection
             packets.push({
                 p1, 
                 p2, 
                 progress: 0, 
                 speed: 0.02 + Math.random() * 0.03
             });
        }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      // Update Particles
      particles.forEach(p => {
        p.update();
        p.draw();
        // Reset shadow for lines
        ctx.shadowBlur = 0; 
      });

      // Draw Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            // Draw Line
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 102, 255, ${0.4 * (1 - distance / connectionDistance)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();

            // Chance to spawn data packet on this connection
            spawnPacket(particles[i], particles[j]);
          }
        }
      }

      // Draw and Update Data Packets
      for (let i = packets.length - 1; i >= 0; i--) {
          const pkt = packets[i];
          pkt.progress += pkt.speed;
          
          if (pkt.progress >= 1) {
              packets.splice(i, 1);
              continue;
          }

          const curX = pkt.p1.x + (pkt.p2.x - pkt.p1.x) * pkt.progress;
          const curY = pkt.p1.y + (pkt.p2.y - pkt.p1.y) * pkt.progress;

          ctx.beginPath();
          ctx.arc(curX, curY, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF'; // White packet
          ctx.shadowBlur = 5;
          ctx.shadowColor = '#FFFFFF';
          ctx.fill();
          ctx.shadowBlur = 0;
      }

      // Draw Mouse Connections
      if (mouse.x != null) {
          particles.forEach(p => {
              let dx = mouse.x - p.x;
              let dy = mouse.y - p.y;
              let distance = Math.sqrt(dx*dx + dy*dy);
              if (distance < mouseDistance) {
                  ctx.beginPath();
                  ctx.strokeStyle = `rgba(0, 200, 255, ${0.6 * (1 - distance / mouseDistance)})`; 
                  ctx.lineWidth = 1.5;
                  ctx.moveTo(mouse.x, mouse.y);
                  ctx.lineTo(p.x, p.y);
                  ctx.stroke();
              }
          });
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    // Initial setup
    handleResize();
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-transparent" onMouseMove={(e) => e.stopPropagation()}>
      <canvas 
        ref={canvasRef} 
        className="block absolute top-0 left-0"
        onMouseMove={(e) => {
            // Forward mouse event manually if needed, or rely on canvas internal listener
            const canvas = canvasRef.current;
            if(!canvas) return;
            const rect = canvas.getBoundingClientRect();
            // We use the internal listener in useEffect, just binding events here to ensure capture
        }}
        onMouseLeave={() => {
            // Handled in useEffect
        }}
      />
    </div>
  );
};

export default NeuralNetworkCanvas;
