import React, { useState, useEffect } from 'react';
import { useParticipants } from '../../hooks/useParticipants';
import "../../styles/PizzaCloud.css";

const VISIBLE_BUBBLES = 36; // Cantidad ideal en pantalla para no saturar ni dar lag

export default function PizzaCloud({ pizzaImage }) {
  const { participants } = useParticipants();
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    if (!participants || participants.length === 0) return;

    // 1. Generar el anillo inicial de burbujas alrededor de la pizza
    const initial = Array.from({ length: VISIBLE_BUBBLES }, (_, index) =>
      createPolarBubble(index, VISIBLE_BUBBLES, participants)
    );
    setBubbles(initial);

    // 2. Ir relevando 6 burbujas al azar cada 1.4 segundos
    const interval = setInterval(() => {
      setBubbles((prev) => {
        const next = [...prev];
        for (let i = 0; i < 6; i++) {
          const slot = Math.floor(Math.random() * VISIBLE_BUBBLES);
          next[slot] = {
            ...createPolarBubble(slot, VISIBLE_BUBBLES, participants),
            // Cambiar la key fuerza a React a reiniciar la animación de aparición (fade-in)
            uid: `${slot}-${Date.now()}-${Math.random()}`
          };
        }
        return next;
      });
    }, 1400);

    return () => clearInterval(interval);
  }, [participants]);

  return (
    <div className="pizza-cloud-stage">
      {/* Burbujas flotantes alrededor */}
      <div className="bubbles-layer">
        {bubbles.map((b) => (
          <span
            key={b.uid}
            className={`user-bubble ${b.platform || ''}`}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              transform: `translate(-50%, -50%) scale(${b.scale})`,
              animationDelay: `${b.delay}s`
            }}
          >
            @{b.username}
          </span>
        ))}
      </div>

      {/* Pizza central giratoria */}
      <div className="pizza-center-wrapper">
        <img
          src={pizzaImage}
          alt="Pizza Sorteo"
          className="spinning-pizza"
        />
      </div>
    </div>
  );
}

// Calcula una posición en anillo (fuera de la pizza central)
function createPolarBubble(index, total, list) {
  const randomItem = list[Math.floor(Math.random() * list.length)];
  const username = typeof randomItem === 'string' 
    ? randomItem 
    : (randomItem?.username || randomItem?.user || 'seguidor');

  // Distribuir en 360 grados con una pequeña variación aleatoria
  const baseAngle = (index / total) * 2 * Math.PI;
  const angle = baseAngle + (Math.random() - 0.5) * 0.25;

  // Radio entre 27% y 46% del contenedor (deja el centro libre para la pizza)
  const radiusX = 28 + Math.random() * 19; // Horizontal un poco más ancho
  const radiusY = 26 + Math.random() * 18; // Vertical

  const x = 50 + Math.cos(angle) * radiusX;
  const y = 50 + Math.sin(angle) * radiusY;

  return {
    uid: `${index}-init`,
    username,
    platform: randomItem?.platform || randomItem?.source || '',
    x,
    y,
    scale: (0.85 + Math.random() * 0.3).toFixed(2),
    delay: (Math.random() * 1.5).toFixed(2)
  };
}