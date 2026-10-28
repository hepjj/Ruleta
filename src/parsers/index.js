import { parseInstagram } from './instagram';

// Cuando llegue TikTok, el detector de formato se agrega aquí
export function parseFile(json) {
  return parseInstagram(json);
}