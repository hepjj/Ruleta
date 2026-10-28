const words = ['sol', 'luna', 'nacho', 'pizza', 'gamer', 'dark', 'mati', 'coni', 'pipe', 'fran', 'vale', 'jose', 'cami', 'tomi', 'lucho', 'kata'];
const seps = ['_', '.', ''];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function makeUsers(n, platform) {
  const set = new Set();
  while (set.size < n) {
    set.add(`${pick(words)}${pick(seps)}${pick(words)}${Math.floor(Math.random() * 9999)}`);
  }
  return [...set].map((user) => ({ user, platform }));
}

// Datos inventados, solo para desarrollo
export function generateMock(nIg = 1000, nTk = 20000) {
  return [...makeUsers(nIg, 'instagram'), ...makeUsers(nTk, 'tiktok')];
}