import { parseInstagram } from './instagram';
import { parseTikTok } from './tiktok';

// Detecta de qué red social viene el archivo según su estructura
function detectPlatform(json) {
  if (Array.isArray(json)) {
    const first = json.find((x) => x && typeof x === 'object');
    if (first && 'string_list_data' in first) return 'instagram';
    if (first && 'UserName' in first) return 'tiktok';
    return 'instagram'; // el parser de Instagram da un mensaje de error claro
  }
  // Objeto: el export completo de TikTok
  return 'tiktok';
}

export function parseFile(json) {
  return detectPlatform(json) === 'tiktok' ? parseTikTok(json) : parseInstagram(json);
}