import { createContext, useCallback, useMemo, useState } from 'react';
import { dedupe } from '../lib/dedupe';

export const ParticipantsContext = createContext(null);

export function ParticipantsProvider({ children }) {
  // Empieza vacío: los participantes solo vienen de los archivos que se carguen
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState([]);

  const addParticipants = useCallback((list) => {
    setParticipants((prev) => dedupe([...prev, ...list]));
  }, []);

  const value = useMemo(
    () => ({ participants, addParticipants, winners, setWinners }),
    [participants, addParticipants, winners]
  );

  return (
    <ParticipantsContext.Provider value={value}>
      {children}
    </ParticipantsContext.Provider>
  );
}