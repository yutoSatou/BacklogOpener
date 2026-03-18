const domainsForm = document.getElementById('domains-form');
const domainsTextarea = document.getElementById('domains');
const saveMessage = document.getElementById('save-message');

function setSaveMessage(text, isError = false) {
  saveMessage.textContent = text;
  saveMessage.classList.toggle('error', isError);
}

async function populateDomains() {
  const domains = await getDomains();
  domainsTextarea.value = domains.join('\n');
}

domainsForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const lines = domainsTextarea.value.split(/\r?\n/);
  const normalizedDomains = await saveDomains(lines);

  if (normalizedDomains.length === 0) {
    setSaveMessage('有効なドメインを1件以上入力してください。', true);
    return;
  }

  domainsTextarea.value = normalizedDomains.join('\n');
  setSaveMessage(`${normalizedDomains.length} 件のドメインを保存しました。`);
});

populateDomains();
