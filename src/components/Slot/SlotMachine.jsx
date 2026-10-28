import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import Reel from './Reel';
import { CENTER_ROW, VISIBLE_ROWS } from './config';
import WinnerCard from '../Winner/WinnerCard';
import WinnersHistory from '../Winner/WinnersHistory';
import { useParticipants } from '../../hooks/useParticipants';
import { keyOf, pickWinner } from '../../lib/pickWinner';
import { randomInt } from '../../lib/random';

const SPIN_MS = 6000;   // duración del giro
const SPIN_ROWS = 70;   // cuántos nombres pasan antes de frenar

const label = (user) => `@${user}`;
const randomLabel = (list) => label(list[randomInt(list.length)].user);

export default function SlotMachine() {
  const { participants, winners, setWinners } = useParticipants();
  const lastWinner = winners.at(-1);

  const [names, setNames] = useState(() =>
    Array.from({ length: VISIBLE_ROWS }, (_, i) =>
      i === CENTER_ROW ? (lastWinner ? label(lastWinner.user) : '¿Quién ganará?') : ''
    )
  );
  const [offset, setOffset] = useState(0);
  const [duration, setDuration] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [notice, setNotice] = useState('');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  function spin() {
    if (spinning || participants.length === 0) return;

    // 1) Se decide el ganador, sin repetir a los anteriores
    const excluded = new Set(winners.map(keyOf));
    const picked = pickWinner(participants, excluded);
    if (!picked) {
      setNotice('Ya salieron todos los participantes.');
      return;
    }
    setNotice('');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ms = reduceMotion ? 300 : SPIN_MS;

    // 2) La cinta parte con lo que se ve ahora (sin saltos),
    //    sigue con nombres al azar y el ganador queda al final
    const visibleNow = names.slice(offset, offset + VISIBLE_ROWS);
    const target = VISIBLE_ROWS + SPIN_ROWS;
    const strip = [
      ...visibleNow,
      ...Array.from({ length: SPIN_ROWS + VISIBLE_ROWS }, () => randomLabel(participants)),
    ];
    strip[target] = label(picked.user);

    setSpinning(true);
    setNames(strip);
    setDuration(0);
    setOffset(0);

    // 3) Dos cuadros después la cinta ya está colocada: se anima hasta el ganador
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setDuration(ms);
        setOffset(target - CENTER_ROW);
      })
    );

    // 4) Al frenar, se anuncia al ganador
    timer.current = setTimeout(() => {
      setWinners((prev) => [...prev, picked]);
      setSpinning(false);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2F6B3F', '#B8312A', '#1F4A2C', '#E3D6BA'],
        disableForReducedMotion: true,
      });
    }, ms + 250);
  }

  return (
    <section className="slot">
      <Reel
        names={names}
        offset={offset}
        durationMs={duration}
        highlight={!spinning && Boolean(lastWinner)}
      />
      <button className="btn-primary" onClick={spin} disabled={spinning}>
        {winners.length === 0 ? 'Sortear' : 'Sortear otro'}
      </button>
      {notice && <p role="status">{notice}</p>}
      <WinnerCard winner={spinning ? null : lastWinner} />
      <WinnersHistory winners={winners} />
    </section>
  );
}