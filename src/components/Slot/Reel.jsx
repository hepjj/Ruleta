import { CENTER_ROW, ROW_HEIGHT, VISIBLE_ROWS } from './config';

export default function Reel({ names, offset, durationMs, highlight }) {
  return (
    <div
      className={`reel ${highlight ? 'is-winner' : ''}`}
      style={{ height: ROW_HEIGHT * VISIBLE_ROWS }}
      aria-hidden="true"
    >
      <div
        className="reel-strip"
        style={{
          transform: `translateY(${-offset * ROW_HEIGHT}px)`,
          transition: durationMs
            ? `transform ${durationMs}ms cubic-bezier(0.1, 0.6, 0.1, 1)`
            : 'none',
        }}
      >
        {names.map((name, i) => (
          <div className="reel-row" style={{ height: ROW_HEIGHT }} key={i}>
            {name}
          </div>
        ))}
      </div>
      <div
        className="reel-marker"
        style={{ top: ROW_HEIGHT * CENTER_ROW, height: ROW_HEIGHT }}
      />
    </div>
  );
}