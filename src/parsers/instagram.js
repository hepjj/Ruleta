// Saca el usuario de una entrada de string_list_data
function userFromEntry(entry) {
  if (entry?.value) return entry.value;
  // Algunos exports traen el usuario solo dentro del enlace
  const match = entry?.href?.match(/instagram\.com\/(?:_u\/)?([^/?#]+)/i);
  return match ? match[1] : '';
}

export function parseInstagram(json) {
  // followers_1.json es una lista directa; los demás archivos vienen dentro de un objeto
  if (!Array.isArray(json)) {
    throw new Error('Ese archivo no es la lista de seguidores. Carga followers_1.json.');
  }

  const users = [];
  for (const item of json) {
    for (const entry of item?.string_list_data ?? []) {
      const user = userFromEntry(entry);
      if (user) users.push({ user, platform: 'instagram' });
    }
  }
  return users;
}