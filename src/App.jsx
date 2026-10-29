import { useState, useEffect } from 'react';
import { useParticipants } from './hooks/useParticipants';
import FileLoader from './components/FileLoader/FileLoader';
import SlotMachine from './components/Slot/SlotMachine';
import PizzaCloud from './components/PizzaCloud/PizzaCloud';

export default function App() {
  const [tab, setTab] = useState('cloud');
  const [showAdmin, setShowAdmin] = useState(false);
  const { participants } = useParticipants();
  const isEmpty = participants.length === 0;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'l' && e.target.tagName !== 'INPUT') {
        setShowAdmin((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Al cargar participantes, se cierra el panel de carga
    if (!isEmpty) {
      setShowAdmin(false);
    }
  }, [isEmpty]);

  return (
    <main>
      <img
        src="/LogoPrincipal.jpeg"
        alt="El Chiquillo de las Pizzas"
        style={{
          width: '200px',
          display: 'block',
          margin: '0 auto 4px',
          mixBlendMode: 'multiply',
          filter: 'contrast(120%) brightness(105%)'
        }}
      />

      <h1
        onDoubleClick={() => setShowAdmin((prev) => !prev)}
        style={{ cursor: 'pointer', userSelect: 'none', marginTop: 0 }}
        title="Doble clic o presiona 'L' para cargar archivos"
      >
        {isEmpty
          ? 'Comenzando Sorteo ¡Perseverar es Ganar!'
          : `${participants.length.toLocaleString('es-CL')} participantes`}
      </h1>

      {showAdmin && (
        <div style={{ marginBottom: '15px' }}>
          <FileLoader />
        </div>
      )}

      {!isEmpty && (
        <>
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

          {tab === 'cloud' ? <PizzaCloud pizzaImage="/PizzaFoto.png" /> : <SlotMachine />}
        </>
      )}
    </main>
  );
}