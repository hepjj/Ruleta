import { PLATFORM_NAME } from '../Slot/config';

export default function WinnerCard({ winner }) {
  return (
    <div className="winner" aria-live="polite">
      {winner && (
        <>
          <h2>¡Tenemos ganador!</h2>
          <p className="winner-name">@{winner.user}</p>
          <p>Seguidor de {PLATFORM_NAME[winner.platform]}</p>
        </>
      )}
    </div>
  );
}