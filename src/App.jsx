import { useState } from 'react';
import { useParticipants } from './hooks/useParticipants';
import FileLoader from './components/FileLoader/FileLoader';
import SlotMachine from './components/Slot/SlotMachine';

export default function App() {
  const [tab, setTab] = useState('cloud');
  const { participants, usingMock } = useParticipants();

  return (
    <main>
      <h1>{participants.length.toLocaleString('es-CL')} participantes</h1>
      {usingMock && <p className="aviso">Datos de prueba</p>}
      <FileLoader />
      <nav>
        <button
          className={`tab ${tab === 'cloud' ? 'is-active' : ''}`}
          onClick={() => setTab('cloud')}
        >
          Participantes
        </button>
        <button
          className={`tab ${tab === 'draw' ? 'is-active' : ''}`}
          onClick={() => setTab('draw')}
        >
          Sorteo
        </button>
      </nav>
      {tab === 'cloud' ? <p>Aquí irá la pizza con los nombres</p> : <SlotMachine />}
    </main>
  );
}