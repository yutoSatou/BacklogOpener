const rowsContainer = document.getElementById('rows');
const rowTemplate = document.getElementById('row-template');
const message = document.getElementById('message');

function setMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle('error', isError);
}

async function openIssue(domain, issueNumber) {
  await chrome.tabs.create({
    url: `https://${domain}/view/${issueNumber}`,
  });
}

function createRow(domain) {
  const fragment = rowTemplate.content.cloneNode(true);
  const form = fragment.querySelector('[data-role="issue-form"]');
  const domainLabel = fragment.querySelector('[data-role="domain-label"]');
  const issueInput = fragment.querySelector('[data-role="issue-input"]');

  domainLabel.textContent = domain;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const issueNumber = issueInput.value.trim();
    if (!/^\d+$/.test(issueNumber)) {
      setMessage(`「${domain}」の課題番号は数字のみで入力してください。`, true);
      issueInput.focus();
      return;
    }

    await openIssue(domain, issueNumber);
    setMessage(`「${domain}」の課題 ${issueNumber} を開きました。`);
    issueInput.select();
  });

  return fragment;
}

async function populateRows() {
  const domains = await getDomains();

  rowsContainer.innerHTML = '';
  if (domains.length === 0) {
    setMessage('先にドメイン設定でBacklogドメインを登録してください。', true);
    return;
  }

  const rows = document.createDocumentFragment();
  domains.forEach((domain) => {
    rows.appendChild(createRow(domain));
  });

  rowsContainer.appendChild(rows);
  setMessage('開きたいドメインの行に課題番号を入力してください。');
}

populateRows();
