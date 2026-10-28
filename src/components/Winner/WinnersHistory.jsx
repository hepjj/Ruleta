import { PLATFORM_NAME } from '../Slot/config';

export default function WinnersHistory({ winners }) {
  if (winners.length < 2) return null;

  return (
    <section className="history">
      <h3>Sorteados</h3>
      <ol>
        {winners.map((w) => (
          <li key={`${w.platform}:${w.user}`}>
            @{w.user}
            <span>{PLATFORM_NAME[w.platform]}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}