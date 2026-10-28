export function parseTikTok(data) {
  const results = [];

  // Ruta 1: Estructura estándar en inglés (Activity -> Follower List -> FansList)
  const fansList =
    data?.Activity?.['Follower List']?.FansList ||
    data?.[' Your Activity']?.['Follower List']?.FansList ||
    data?.Profile?.['Follower List']?.FansList ||
    data?.Follower?.FansList;

  if (Array.isArray(fansList)) {
    for (const item of fansList) {
      const username = item?.UserName || item?.username;
      if (username && username !== 'N/A') {
        results.push({ username: String(username).replace(/^@/, ''), platform: 'tiktok' });
      }
    }
    return results;
  }

  // Ruta 2: Búsqueda profunda automática (por si TikTok exporta las llaves en español u otro formato)
  function searchFans(obj) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      for (const el of obj) {
        if (el && typeof el === 'object' && ('UserName' in el) && ('Date' in el)) {
          const u = el.UserName;
          if (u && u !== 'N/A') {
            results.push({ username: String(u).replace(/^@/, ''), platform: 'tiktok' });
          }
        } else {
          searchFans(el);
        }
      }
      return;
    }
    for (const key of Object.keys(obj)) {
      searchFans(obj[key]);
    }
  }

  searchFans(data);
  return results;
}