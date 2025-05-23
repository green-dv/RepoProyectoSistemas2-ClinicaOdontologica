import { useEffect, useRef, useState } from 'react';
import { animate, createTimeline, stagger } from 'animejs';

interface SparklePosition {
  top: number;
  left: number;
}

export default function AnimatedTooth() {
  const toothRef = useRef(null);
  const glowRef = useRef(null);
  const sparklesRef = useRef(null);
  const [sparklePositions, setSparklePositions] = useState<SparklePosition[]>([]);

  useEffect(() => {
    // Generar posiciones de partículas solo en el cliente
    setSparklePositions(
      Array.from({ length: 6 }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100
      }))
    );
  }, []);

  useEffect(() => {
    if (!toothRef.current || !glowRef.current || !sparklesRef.current) return;

    const mainTimeline = createTimeline({
      loop: true,
      autoplay: true
    });

    animate(toothRef.current, {
      y: [-15, 15, -15],
      rotate: [-3, 3, -3],
      scale: [1, 1.08, 1],
      duration: 4000,
      easing: 'inOut(2)',
      loop: true,
      autoplay: true
    });

    mainTimeline.add(glowRef.current, {
      opacity: [0.2, 0.9, 0.2],
      scale: [0.8, 1.3, 0.8],
      duration: 3000,
      easing: 'inOut(3)'
    });

    animate('.sparkle', {
      translateY: [0, -60, 0],
      translateX: () => Math.random() * 50 - 25,
      opacity: [0, 1, 0],
      scale: [0.5, 1.3, 0.5],
      duration: () => 2000 + Math.random() * 1000,
      delay: stagger(250, { start: 500 }),
      easing: 'easeInOutSine',
      loop: true,
      autoplay: true
    });

    animate('.tooth-crown', {
      scale: [1, 1.03, 1],
      duration: 2800,
      easing: 'inOut(2)',
      loop: true,
      autoplay: true
    });

    animate('.tooth-roots', {
      scaleY: [1, 0.96, 1],
      y: [0, 3, 0],
      duration: 3800,
      easing: 'inOut(1)',
      loop: true,
      autoplay: true
    });

    animate('.tooth-highlight', {
      opacity: [0.4, 0.9, 0.4],
      scale: [0.9, 1.1, 0.9],
      duration: 2200,
      delay: 500,
      easing: 'inOut(2)',
      loop: true,
      autoplay: true
    });

    return () => {
      mainTimeline.pause();
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center w-80 h-80">
      <div 
        ref={glowRef}
        className="absolute w-60 h-60 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(173,216,230,0.4) 50%, transparent 70%)',
          filter: 'blur(20px)'
        }}
      />
      
      {/* Diente principal */}
      <div ref={toothRef} className="relative z-10">
        <svg
          width="200"
          height="240"
          viewBox="0 0 200 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Definiciones de gradientes */}
          <defs>
            <linearGradient id="toothGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#f8f9fa" />
              <stop offset="70%" stopColor="#e9ecef" />
              <stop offset="100%" stopColor="#dee2e6" />
            </linearGradient>
            <linearGradient id="rootGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f1f3f4" />
              <stop offset="50%" stopColor="#e8eaed" />
              <stop offset="100%" stopColor="#dadce0" />
            </linearGradient>
            <filter id="specularLight" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
                <feSpecularLighting in="blur" surfaceScale="2" specularConstant="0.75" specularExponent="20" lightingColor="#ffffff" result="lightingColor">
                    <fePointLight x="60" y="20" z="200"/>
                </feSpecularLighting>
                <feComposite in="specOut" in2="SourceAlpha" operator="in" result="lightingColor"/>
                <feMerge>
                    <feMergeNode in="SourceGraphic"/>
                    <feMergeNode in="lightingColor"/>
                </feMerge>
            </filter>
          </defs>
          {/* Corona del diente */}
            <path
                d="
                M100 30
                C115 25, 130 30, 140 42
                C145 50, 148 60, 146 72
                C144 85, 135 98, 122 105
                C112 110, 108 110, 100 110
                C92 110, 88 110, 78 105
                C65 98, 56 85, 54 72
                C52 60, 55 50, 60 42
                C70 30, 85 25, 100 30
                Z
                "
                fill="url(#toothGradient)"
                stroke="rgba(100, 100, 100, 0.1)"
                strokeWidth="1"
                filter="url(#shadow)"
            />

            {/* Raíces  */}
            <g className="tooth-roots">
                <path
                d="
                    M85 110
                    C80 130, 80 160, 90 190
                    C94 200, 98 210, 100 215
                    C102 210, 106 200, 110 190
                    C120 160, 120 130, 115 110
                    Z
                "
                fill="url(#rootGradient)"
                stroke="rgba(0,0,0,0.05)"
                strokeWidth="1"
                />
                <path
                d="
                    M70 105
                    C65 120, 66 140, 70 165
                    C72 170, 75 178, 78 185
                    C80 180, 83 172, 85 165
                    C88 140, 87 120, 82 105
                    Z
                "
                fill="url(#rootGradient)"
                stroke="rgba(0,0,0,0.05)"
                strokeWidth="1"
                />
                <path
                d="
                    M130 105
                    C135 120, 134 140, 130 165
                    C127 172, 124 180, 122 185
                    C120 178, 117 170, 115 165
                    C112 140, 113 120, 118 105
                    Z
                "
                fill="url(#rootGradient)"
                stroke="rgba(0,0,0,0.05)"
                strokeWidth="1"
                />
            </g>

            {/* Líneas de esmalte - más naturales */}
            <path
                d="M70 45 Q100 40 130 45"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
            />
            <path
                d="M72 55 Q100 50 128 55"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
            />
          
          {/* Brillo principal con animación */}
          <ellipse
            className="tooth-highlight"
            cx="85"
            cy="50"
            rx="15"
            ry="25"
            fill="rgba(255,255,255,0.7)"
            transform="rotate(-15 85 50)"
          />
          
          {/* Brillo secundario con animación */}
          <ellipse
            className="tooth-highlight"
            cx="90"
            cy="65"
            rx="8"
            ry="12"
            fill="rgba(255,255,255,0.4)"
            transform="rotate(-10 90 65)"
          />
        </svg>
      </div>
      
        {/* Partículas de brillo */}
      <div ref={sparklesRef} className="absolute inset-0 pointer-events-none">
        {sparklePositions.map((position, i) => (
          <div
            key={i}
            className="sparkle absolute w-2 h-2 rounded-full"
            style={{
              background: 'radial-gradient(circle, #fff 0%, #ccf 100%)',
              top: `${position.top}%`,
              left: `${position.left}%`,
              opacity: 0,
            }}
          />
        ))}
      </div>
      
      {/* Texto decorativo opcional */}
      <div className="absolute -bottom-8 text-center">
        <div className="text-blue-600 font-bold text-lg tracking-wide">
          OREP PLUS
        </div>
        <div className="text-gray-500 text-sm">
          PABLA KISS POR FAVOR
        </div>
      </div>
    </div>
  );
}