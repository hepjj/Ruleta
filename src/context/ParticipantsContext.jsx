import { createContext, useCallback, useMemo, useState } from 'react';
import { generateMock } from '../data/mockParticipants';
import { dedupe } from '../lib/dedupe';

export const ParticipantsContext = createContext(null);

export function ParticipantsProvider({ children }) {
  const [participants, setParticipants] = useState(() => generateMock());
  const [usingMock, setUsingMock] = useState(true);
  const [winners, setWinners] = useState([]);

  const addParticipants = useCallback(
    (list) => {
      setParticipants((prev) => dedupe(usingMock ? list : [...prev, ...list]));
      if (usingMock) setWinners([]);
      setUsingMock(false);
    },
    [usingMock]
  );

  const value = useMemo(
    () => ({ participants, usingMock, addParticipants, winners, setWinners }),
    [participants, usingMock, addParticipants, winners]
  );

  return (
    <ParticipantsContext.Provider value={value}>
      {children}
    </ParticipantsContext.Provider>
  );
}