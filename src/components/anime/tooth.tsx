import { useEffect, useRef, useState } from 'react';
import { animate, createTimeline, stagger, svg } from 'animejs';

interface SparklePosition {
  top: number;
  left: number;
}

interface AnimatedLettersProps {
  text?: string;
  className?: string;
}

function AnimatedLetters({ text = "REP PLUS", className = "" }: AnimatedLettersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!svgRef.current) return;
    const letterPaths = svgRef.current.querySelectorAll('.line');
    if (letterPaths.length === 0) return;
    const drawables = svg.createDrawable(letterPaths);
    const animation = animate(drawables, {
      draw: ['0 0', '1 0', '1 1'], // Inicia desde la parte superior izquierda
      ease: 'inOutQuad',
      duration: 2000,
      delay: stagger(100),
      loop: true
    });
    if (containerRef.current) {
      animate(containerRef.current, {
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 800,
        delay: 200,
        ease: 'outBack'
      });
    }
    return () => {
      animation.pause();
    };
  }, []);

  // Función mejorada para generar paths SVG más juntos
  const getLetterPath = (letter: string, index: number): string => {
    const baseX = index * 28; // Reducido de 42 a 28 para letras más juntas
    
    switch (letter.toUpperCase()) {
      case 'R':
        return `M${baseX + 4},4 L${baseX + 4},40 M${baseX + 4},4 L${baseX + 20},4 Q${baseX + 26},4 ${baseX + 26},12 Q${baseX + 26},20 ${baseX + 20},20 L${baseX + 4},20 M${baseX + 18},20 L${baseX + 26},40`;
      case 'E':
        return `M${baseX + 4},4 L${baseX + 4},40 M${baseX + 4},4 L${baseX + 24},4 M${baseX + 4},22 L${baseX + 20},22 M${baseX + 4},40 L${baseX + 24},40`;
      case 'P':
        return `M${baseX + 4},4 L${baseX + 4},40 M${baseX + 4},4 L${baseX + 20},4 Q${baseX + 26},4 ${baseX + 26},12 Q${baseX + 26},20 ${baseX + 20},20 L${baseX + 4},20`;
      case 'L':
        return `M${baseX + 4},4 L${baseX + 4},40 L${baseX + 24},40`;
      case 'U':
        return `M${baseX + 4},4 L${baseX + 4},30 Q${baseX + 4},40 ${baseX + 12},40 Q${baseX + 20},40 ${baseX + 20},30 L${baseX + 20},4`;
      case 'S':
        return `M${baseX + 24},8 Q${baseX + 24},4 ${baseX + 16},4 L${baseX + 8},4 Q${baseX + 4},4 ${baseX + 4},8 Q${baseX + 4},12 ${baseX + 8},12 L${baseX + 16},12 Q${baseX + 24},12 ${baseX + 24},16 L${baseX + 24},28 Q${baseX + 24},40 ${baseX + 16},40 L${baseX + 8},40 Q${baseX + 4},40 ${baseX + 4},36`;
      case 'O':
        return `M${baseX + 12},4 Q${baseX + 4},4 ${baseX + 4},12 L${baseX + 4},28 Q${baseX + 4},40 ${baseX + 12},40 L${baseX + 16},40 Q${baseX + 24},40 ${baseX + 24},28 L${baseX + 24},12 Q${baseX + 24},4 ${baseX + 16},4 Z`;
      case ' ':
        return '';
      default:
        return `M${baseX + 4},4 L${baseX + 20},40 M${baseX + 20},4 L${baseX + 4},40`;
    }
  };

  const letters = text.split('');
  const totalWidth = letters.length * 28; // Ajustado para letras más juntas

  return (
    <div 
      ref={containerRef}
      className={`flex items-center justify-center ${className}`}
      style={{ opacity: 0 }}
    >
      <svg
        ref={svgRef}
        width={totalWidth}
        height="60"
        viewBox={`0 0 ${totalWidth} 60`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="letterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          
          <filter id="letterGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {letters.map((letter, index) => {
          const path = getLetterPath(letter, index);
          if (!path) return null;
          
          return (
            <g key={`${letter}-${index}`}>
              <path
                d={path}
                stroke="rgba(42, 99, 192, 0.2)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(1, 1)"
              />
              
              <path
                className="line"
                d={path}
                stroke="url(#letterGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#letterGlow)"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function AnimatedTooth() {
  const toothRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);
  const [sparklePositions, setSparklePositions] = useState<SparklePosition[]>([]);

  useEffect(() => {
    setSparklePositions(
      Array.from({ length: 8 }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100
      }))
    );
  }, []);

  useEffect(() => {
    if (!toothRef.current || !glowRef.current || !sparklesRef.current) return;

    // Animación principal del diente
    const toothAnimation = animate(toothRef.current, {
      y: [-12, 12, -12],
      rotate: [-2, 2, -2],
      scale: [1, 1.05, 1],
      duration: 4500,
      easing: 'inOut(2)',
      loop: true,
      autoplay: true
    });

    // Animación del brillo de fondo - corregida
    const glowAnimation = animate(glowRef.current, {
      opacity: [0.2, 0.8, 0.2],
      scale: [0.9, 1.2, 0.9],
      duration: 3500,
      easing: 'inOut(3)',
      loop: true,
      autoplay: true
    });

    // Animación de partículas mejorada
    const sparkleAnimation = animate('.sparkle', {
      translateY: [0, -80, 0],
      translateX: () => Math.random() * 60 - 30,
      opacity: [0, 0.9, 0],
      scale: [0.4, 1.5, 0.4],
      rotate: [0, 360],
      duration: () => 2500 + Math.random() * 1500,
      delay: stagger(300, { start: 800 }),
      easing: 'easeInOutSine',
      loop: true,
      autoplay: true
    });

    // Animaciones específicas del diente
    const crownAnimation = animate('.tooth-crown', {
      scale: [1, 1.02, 1],
      duration: 3200,
      easing: 'inOut(2)',
      loop: true,
      autoplay: true
    });

    const rootsAnimation = animate('.tooth-roots', {
      scaleY: [1, 0.98, 1],
      y: [0, 2, 0],
      duration: 4200,
      easing: 'inOut(1)',
      loop: true,
      autoplay: true
    });

    const highlightAnimation = animate('.tooth-highlight', {
      opacity: [0.5, 1, 0.5],
      scale: [0.95, 1.08, 0.95],
      duration: 2500,
      delay: 600,
      easing: 'inOut(2)',
      loop: true,
      autoplay: true
    });

    return () => {
      toothAnimation.pause();
      glowAnimation.pause();
      sparkleAnimation.pause();
      crownAnimation.pause();
      rootsAnimation.pause();
      highlightAnimation.pause();
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center w-80 h-96">
      <div 
        ref={glowRef}
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(173,216,230,0.5) 40%, rgba(59,130,246,0.2) 70%, transparent 85%)',
          filter: 'blur(25px)',
          opacity: 0.2
        }}
      />
      
      <div ref={toothRef} className="relative z-10">
        <svg
          width="200"
          height="240"
          viewBox="0 0 200 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="toothGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#f8f9fa" />
              <stop offset="75%" stopColor="#e9ecef" />
              <stop offset="100%" stopColor="#dee2e6" />
            </linearGradient>
            <linearGradient id="rootGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f1f3f4" />
              <stop offset="50%" stopColor="#e8eaed" />
              <stop offset="100%" stopColor="#dadce0" />
            </linearGradient>
            <filter id="toothShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="3" dy="4" stdDeviation="2" floodColor="#000" floodOpacity="0.15"/>
            </filter>
          </defs>

          <g className="tooth-crown">
            <path
              d="
              M117 40
              C120 25, 160 20, 160 50 
              C160 55, 155 60, 150 75
              C145 95, 140 120, 122 105
              C140 110, 108 110, 100 110
              C92 110,78 120, 75 100
              C75 98, 70 85, 64 72
              C55 60, 55 50, 60 40
              C70 30, 85 25, 90 50
              C80 50, 100 05, 130 50
              Z
              "
              fill="url(#toothGradient)"
              stroke="rgba(100, 100, 100, 0.1)"
              strokeWidth="1"
              filter="url(#toothShadow)"
            />
          </g>

          <g className="tooth-roots">
            <path
              d="
                M90 110
                C85 130, 85 160, 95 190
                C99 200, 103 210, 105 215
                C107 210, 111 200, 115 190
                C125 160, 125 130, 120 110
                Z
              "
              fill="url(#rootGradient)"
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="1"
            />
            <path
              d="
                M75 105
                C70 120, 71 140, 75 165
                C77 170, 80 178, 83 185
                C85 180, 88 172, 90 165
                C93 140, 92 120, 87 105
                Z 
              "
              fill="url(#rootGradient)"
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="1"
            />
            <path
              d="
                M135 105
                C140 120, 139 140, 135 165
                C132 172, 129 180, 127 185
                C125 178, 122 170, 120 165
                C117 140, 118 120, 123 105
                Z
              "
              fill="url(#rootGradient)"
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="1"
            />
          </g>

          <path
            d="M70 45 Q100 40 130 45"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M72 55 Q100 50 128 55"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          
          <ellipse
            className="tooth-highlight"
            cx="85"
            cy="50"
            rx="15"
            ry="25"
            fill="rgba(255,255,255,0.8)"
            transform="rotate(-15 85 50)"
          />
          
          <ellipse
            className="tooth-highlight"
            cx="90"
            cy="65"
            rx="8"
            ry="12"
            fill="rgba(255,255,255,0.5)"
            transform="rotate(-10 90 65)"
          />
        </svg>
      </div>
      
      <div ref={sparklesRef} className="absolute inset-0 pointer-events-none">
        {sparklePositions.map((position, i) => (
          <div
            key={i}
            className="sparkle absolute w-2 h-2 rounded-full"
            style={{
              background: 'radial-gradient(circle, #fff 0%, #60a5fa 100%)',
              top: `${position.top}%`,
              left: `${position.left}%`,
              opacity: 0,
            }}
          />
        ))}
      </div>
      
      <div className="absolute -bottom-12 text-center">
        <AnimatedLetters 
          text="OREP PLUS" 
          className="mb-2"
        />
      
      </div>
    </div>
  );
}