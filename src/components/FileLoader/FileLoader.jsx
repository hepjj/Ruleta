import { useRef, useState } from 'react';
import { parseFile } from '../../parsers';
import { useParticipants } from '../../hooks/useParticipants';

export default function FileLoader() {
  const inputRef = useRef(null);
  const { addParticipants } = useParticipants();
  const [message, setMessage] = useState('');

  async function handleFiles(event) {
    const files = [...event.target.files];
    event.target.value = '';
    if (files.length === 0) return;

    try {
      const lists = await Promise.all(
        files.map(async (file) => {
          if (/following/i.test(file.name)) {
            throw new Error(`"${file.name}" es de seguidos. Carga el de seguidores.`);
          }
          return parseFile(JSON.parse(await file.text()));
        })
      );

      const all = lists.flat();
      if (all.length === 0) throw new Error('No encontré usuarios en el archivo.');

      addParticipants(all);
      setMessage(`${all.length.toLocaleString('es-CL')} usuarios leídos`);
    } catch (err) {
      setMessage(
        err instanceof SyntaxError ? 'El archivo no es un JSON válido.' : err.message
      );
    }
  }

  return (
    <div className="loader">
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        multiple
        hidden
        onChange={handleFiles}
      />
      <button className="tab" onClick={() => inputRef.current.click()}>
        Cargar seguidores (JSON)
      </button>
      {message && <p role="status">{message}</p>}
    </div>
  );
}