const rowsContainer = document.getElementById('rows');
const rowTemplate = document.getElementById('row-template');
const message = document.getElementById('message');

function setMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle('error', isError);
}

async function openIssue(domain, projectName, issueNumber) {
  await chrome.tabs.create({
    url: `https://${domain}/view/${projectName}-${issueNumber}`,
  });
}

function createRow(entry) {
  const fragment = rowTemplate.content.cloneNode(true);
  const form = fragment.querySelector('[data-role="issue-form"]');
  const labelElement = fragment.querySelector('[data-role="label"]');
  const issueInput = fragment.querySelector('[data-role="issue-input"]');
  const { label, domain, projectName } = entry;

  labelElement.textContent = label;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const issueNumber = issueInput.value.trim();
    if (!/^\d+$/.test(issueNumber)) {
      setMessage(`「${label}」の課題番号は数字のみで入力してください。`, true);
      issueInput.focus();
      return;
    }

    await openIssue(domain, projectName, issueNumber);
    setMessage(`「${label}」で ${projectName}-${issueNumber} を開きました。`);
    issueInput.select();
  });

  return fragment;
}

async function populateRows() {
  const projects = await getProjects();

  rowsContainer.innerHTML = '';
  if (projects.length === 0) {
    setMessage('先に設定画面で「ラベル名,ドメイン名,プロジェクト名」を登録してください。', true);
    return;
  }

  const rows = document.createDocumentFragment();
  projects.forEach((entry) => {
    rows.appendChild(createRow(entry));
  });

  rowsContainer.appendChild(rows);
  setMessage('開きたいラベルの行に課題番号を入力してください。');
}

populateRows();
