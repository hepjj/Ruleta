// Acepta dos formatos de TikTok:
//  1) El export completo (user_data_tiktok.json): la lista está en
//     "Profile And Settings" -> "Follower" -> "FansList"
//  2) Un archivo ya recortado: una lista directa [{ UserName, Date }, ...]

const isFan = (el) => el && typeof el === 'object' && 'UserName' in el;

function toParticipants(list) {
  const out = [];
  for (const item of list) {
    const raw = item?.UserName ?? item?.username;
    if (!raw || raw === 'N/A') continue;
    // OJO: la clave debe ser "user" (igual que Instagram), no "username"
    out.push({ user: String(raw).replace(/^@/, ''), platform: 'tiktok' });
  }
  return out;
}

export function parseTikTok(data) {
  // Formato recortado: lista directa
  if (Array.isArray(data)) return toParticipants(data.filter(isFan));

  // Export completo: rutas conocidas
  const known =
    data?.['Profile And Settings']?.Follower?.FansList ||
    data?.Activity?.['Follower List']?.FansList ||
    data?.['Your Activity']?.['Follower List']?.FansList ||
    data?.Profile?.['Follower List']?.FansList ||
    data?.Follower?.FansList;
  if (Array.isArray(known)) return toParticipants(known);

  // Plan B: búsqueda recursiva de una lista "FansList"
  // (no usamos cualquier lista con UserName porque Block List y Following también la tienen)
  let found = null;
  (function walk(obj) {
    if (found || !obj || typeof obj !== 'object') return;
    if (Array.isArray(obj.FansList)) { found = obj.FansList; return; }
    for (const k of Object.keys(obj)) walk(obj[k]);
  })(data);

  return found ? toParticipants(found) : [];
}