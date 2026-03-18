const STORAGE_KEY = 'backlogDomains';

function normalizeDomain(input) {
  const value = input.trim();
  if (!value) {
    return null;
  }

  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const url = new URL(withScheme);
    return url.host;
  } catch (_error) {
    return null;
  }
}

async function getDomains() {
  const data = await chrome.storage.sync.get(STORAGE_KEY);
  return Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];
}

async function saveDomains(rawDomains) {
  const normalizedDomains = [...new Set(rawDomains.map(normalizeDomain).filter(Boolean))];
  await chrome.storage.sync.set({ [STORAGE_KEY]: normalizedDomains });
  return normalizedDomains;
}
