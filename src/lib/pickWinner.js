import { randomInt } from './random';

export const keyOf = (p) => `${p.platform}:${p.user}`;

// Elige un ganador al azar, ignorando a quienes ya salieron
export function pickWinner(participants, excluded = new Set()) {
  const pool = participants.filter((p) => !excluded.has(keyOf(p)));
  if (pool.length === 0) return null;
  return pool[randomInt(pool.length)];
}