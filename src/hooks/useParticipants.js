import { useContext } from 'react';
import { ParticipantsContext } from '../context/ParticipantsContext';

export const useParticipants = () => useContext(ParticipantsContext);