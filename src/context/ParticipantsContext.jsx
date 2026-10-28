import { createContext, useMemo, useState } from 'react';
import { generateMock } from '../data/mockParticipants';

export const ParticipantsContext = createContext(null);

export function ParticipantsProvider({ children }) {
  const [participants, setParticipants] = useState(() => generateMock());
  const [winners, setWinners] = useState([]);

  const value = useMemo(
    () => ({ participants, setParticipants, winners, setWinners }),
    [participants, winners]
  );

  return (
    <ParticipantsContext.Provider value={value}>
      {children}
    </ParticipantsContext.Provider>
  );
}