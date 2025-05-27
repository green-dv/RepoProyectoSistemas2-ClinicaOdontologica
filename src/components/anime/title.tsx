'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, svg, utils } from 'animejs';

export default function AnimatedO() {
  const polygon1Ref = useRef<SVGPolygonElement | null>(null);
  const polygon2Ref = useRef<SVGPolygonElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !polygon1Ref.current || !polygon2Ref.current) return;

    function animateRandomPoints() {
      // Verificar que ambos elementos existan
      if (!polygon1Ref.current || !polygon2Ref.current) return;
      
      // Generar nuevos puntos aleatorios 
      const newPoints = generateOPoints();
      
      // Establecer los nuevos puntos
      utils.set(polygon2Ref.current, { points: newPoints });

      // Animacion del poligono
      animate(polygon1Ref.current, {
        points: svg.morphTo(polygon2Ref.current),
        ease: 'inOutCirc',
        duration: 500,
        onComplete: animateRandomPoints
      });
    }

    animateRandomPoints();
    return () => {
      //Se limpia solito  (empty)
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-transparent">
        <svg viewBox="0 0 304 112" width="300" height="110" className="bg-transparent">
          <polygon 
            fill="none" 
            stroke="#000" 
            strokeWidth="2" 
            points="" 
          />
        </svg>
      </div>
    );
  }

  const initialPoints = generateOPoints();

  return (
    <div className="flex items-center justify-center min-h-[200px] bg-transparent">
      <svg viewBox="0 0 304 112" width="300" height="110" className="bg-transparent">
        <polygon 
          ref={polygon1Ref} 
          fill="none"
          stroke="#000"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={initialPoints} 
        />
        
        <polygon
          ref={polygon2Ref}
          fill="none"
          points={initialPoints}
          style={{ 
            visibility: 'hidden',
            pointerEvents: 'none'
          }}
        />
      </svg>
    </div>
  );
}

// Función para generar puntos 
function generateOPoints(): string {
  const total = utils.random(8, 32);
  const r1 = utils.random(10, 55); 
  const r2 = utils.random(20, 60); 
  const isOdd = (n: number) => n % 2;
  let points = '';
  
  for (let i = 0, l = isOdd(total) ? total + 1 : total; i < l; i++) {
    const r = isOdd(i) ? r1 : r2;
    const a = (2 * Math.PI * i / l) - Math.PI / 2;
    const x = 152 + utils.round(r * Math.cos(a), 0);
    const y = 56 + utils.round(r * Math.sin(a), 0);
    points += `${x},${y} `;
  }
  
  return points;
}