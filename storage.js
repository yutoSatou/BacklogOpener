const STORAGE_KEY = 'backlogProjects';

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

function normalizeLabel(input) {
  const value = input.trim();
  return value || null;
}

function normalizeProjectName(input) {
  const value = input.trim();
  return value || null;
}

function normalizeEntry(input) {
  if (typeof input === 'string') {
    const [labelPart, domainPart, projectPart] = input.split(',');
    const label = normalizeLabel(labelPart ?? '');
    const domain = normalizeDomain(domainPart ?? '');
    const projectName = normalizeProjectName(projectPart ?? '');

    if (!label || !domain || !projectName) {
      return null;
    }

    return { label, domain, projectName };
  }

  if (!input || typeof input !== 'object') {
    return null;
  }

  const label = normalizeLabel(input.label ?? '');
  const domain = normalizeDomain(input.domain ?? '');
  const projectName = normalizeProjectName(input.projectName ?? '');
  if (!label || !domain || !projectName) {
    return null;
  }

  return { label, domain, projectName };
}

async function getProjects() {
  const data = await chrome.storage.sync.get(STORAGE_KEY);
  const entries = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];
  return entries.map(normalizeEntry).filter(Boolean);
}

async function saveProjects(rawEntries) {
  const normalizedEntries = [];
  const seen = new Set();

  rawEntries.forEach((entry) => {
    const normalizedEntry = normalizeEntry(entry);
    if (!normalizedEntry) {
      return;
    }

    const key = `${normalizedEntry.label}::${normalizedEntry.domain}::${normalizedEntry.projectName}`;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    normalizedEntries.push(normalizedEntry);
  });

  await chrome.storage.sync.set({ [STORAGE_KEY]: normalizedEntries });
  return normalizedEntries;
}
