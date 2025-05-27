import { useEffect, useRef } from 'react';
import { animate, svg, stagger } from 'animejs';

interface AnimatedLettersProps {
  text?: string;
  className?: string;
}

export default function AnimatedLetters({ text = "OREP PLUS", className = "" }: AnimatedLettersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Crear drawables para todas las letras
    const letterPaths = svgRef.current.querySelectorAll('.letter-path');
    
    if (letterPaths.length === 0) return;

    const drawables = svg.createDrawable(letterPaths);

    // Animación principal de dibujo de letras
    const drawAnimation = animate(drawables, {
      draw: ['0 0', '0 1'],
      duration: 800,
      delay: stagger(150, { start: 300 }),
      ease: 'outCubic',
      complete: () => {
        // Después del dibujo inicial, hacer un efecto de brillo
        animate(drawables, {
          draw: ['0 1', '1 1', '0 1'],
          duration: 1200,
          delay: stagger(80),
          ease: 'inOutQuad',
          loop: true,
          direction: 'alternate'
        });
      }
    });

    // Animación de entrada del contenedor
    if (containerRef.current) {
      animate(containerRef.current, {
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 600,
        ease: 'outBack'
      });
    }

    return () => {
      drawAnimation.pause();
    };
  }, []);

  // Función para generar paths SVG para cada letra
  const getLetterPath = (letter: string, index: number): string => {
    const baseX = index * 45;
    
    switch (letter.toUpperCase()) {
        case 'O':
        return `M${baseX + 15},5 Q${baseX + 5},5 ${baseX + 5},15 L${baseX + 5},35 Q${baseX + 5},45 ${baseX + 15},45 L${baseX + 20},45 Q${baseX + 30},45 ${baseX + 30},35 L${baseX + 30},15 Q${baseX + 30},5 ${baseX + 20},5 Z`;
      case 'R':
        return `M${baseX + 5},5 L${baseX + 5},45 M${baseX + 5},5 L${baseX + 25},5 Q${baseX + 35},5 ${baseX + 35},15 Q${baseX + 35},25 ${baseX + 25},25 L${baseX + 5},25 M${baseX + 25},25 L${baseX + 35},45`;
      case 'E':
        return `M${baseX + 5},5 L${baseX + 5},45 M${baseX + 5},5 L${baseX + 30},5 M${baseX + 5},25 L${baseX + 25},25 M${baseX + 5},45 L${baseX + 30},45`;
      case 'P':
        return `M${baseX + 5},5 L${baseX + 5},45 M${baseX + 5},5 L${baseX + 25},5 Q${baseX + 35},5 ${baseX + 35},15 Q${baseX + 35},25 ${baseX + 25},25 L${baseX + 5},25`;
      case 'L':
        return `M${baseX + 5},5 L${baseX + 5},45 L${baseX + 30},45`;
      case 'U':
        return `M${baseX + 5},5 L${baseX + 5},35 Q${baseX + 5},45 ${baseX + 15},45 Q${baseX + 25},45 ${baseX + 25},35 L${baseX + 25},5`;
      case 'S':
        return `M${baseX + 30},10 Q${baseX + 30},5 ${baseX + 20},5 L${baseX + 10},5 Q${baseX + 5},5 ${baseX + 5},10 Q${baseX + 5},15 ${baseX + 10},15 L${baseX + 20},15 Q${baseX + 30},15 ${baseX + 30},20 L${baseX + 30},35 Q${baseX + 30},45 ${baseX + 20},45 L${baseX + 10},45 Q${baseX + 5},45 ${baseX + 5},40`;
      
      case ' ':
        return ''; // Espacio en blanco
      default:
        return `M${baseX + 5},5 L${baseX + 25},45 M${baseX + 25},5 L${baseX + 5},45`; // X por defecto
    }
  };

  const letters = text.split('');
  const totalWidth = letters.length * 45;

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
          {/* Gradiente para las letras */}
          <linearGradient id="letterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
          
          {/* Filtro de brillo */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Filtro de sombra */}
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="1" floodColor="#000" floodOpacity="0.2"/>
          </filter>
        </defs>
        
        {letters.map((letter, index) => {
          const path = getLetterPath(letter, index);
          if (!path) return null; // Para espacios en blanco
          
          return (
            <g key={`${letter}-${index}`}>
              {/* Sombra de la letra */}
              <path
                d={path}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(1, 1)"
              />
              
              {/* Letra principal */}
              <path
                className="letter-path"
                d={path}
                stroke="url(#letterGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                style={{
                  strokeDasharray: '1000',
                  strokeDashoffset: '1000'
                }}
              />
              
              {/* Brillo adicional */}
              <path
                className="letter-highlight"
                d={path}
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
                style={{
                  strokeDasharray: '1000',
                  strokeDashoffset: '1000'
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}