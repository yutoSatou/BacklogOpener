const domainsForm = document.getElementById('domains-form');
const domainsTextarea = document.getElementById('domains');
const saveMessage = document.getElementById('save-message');

function setSaveMessage(text, isError = false) {
  saveMessage.textContent = text;
  saveMessage.classList.toggle('error', isError);
}

function formatEntry(entry) {
  return `${entry.domain},${entry.projectName}`;
}

async function populateProjects() {
  const projects = await getProjects();
  domainsTextarea.value = projects.map(formatEntry).join('\n');
}

domainsForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const lines = domainsTextarea.value.split(/\r?\n/);
  const normalizedEntries = await saveProjects(lines);

  if (normalizedEntries.length === 0) {
    setSaveMessage('有効な「ドメイン名,プロジェクト名」を1件以上入力してください。', true);
    return;
  }

  domainsTextarea.value = normalizedEntries.map(formatEntry).join('\n');
  setSaveMessage(`${normalizedEntries.length} 件のドメイン/プロジェクト設定を保存しました。`);
});

populateProjects();
