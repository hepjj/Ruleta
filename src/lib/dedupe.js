export const normalize = (u) => u.trim().replace(/^@/, '').toLowerCase();

// Elimina duplicados dentro de cada plataforma
export function dedupe(list) {
  const seen = new Set();
  const out = [];
  for (const p of list) {
    const user = normalize(p.user);
    const key = `${p.platform}:${user}`;
    if (user && !seen.has(key)) {
      seen.add(key);
      out.push({ user, platform: p.platform });
    }
  }
  return out;
}