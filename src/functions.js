let quickButtons = [];
let ws;
let connected = false;

window.onload = () => {
 qs('#address').value = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + (window.location.port != '' ? ':' + window.location.port : '') + '/';
 if (localStorage.getItem('autoconnect') === 'true') {
  qs('#autoconnect').innerHTML = 'Disable autoconnect';
  connect();
 }
 loadQuickButtons();
 const command = qs('#command');
 command.addEventListener('input', () => resizeCommand());
 command.addEventListener('focus', () => resizeCommand());
 command.addEventListener('blur', () => resizeCommandReset());
 command.focus();
};

function resizeCommand() {
 const elCommand = qs('#command');
 elCommand.style.height = 'auto';
 elCommand.style.height = elCommand.scrollHeight - 20 + 'px';
}

function resizeCommandReset() {
 const elCommand = qs('#command');
 elCommand.style.height = '20px';
}

function connect() {
 if (connected) {
  ws.close();
  ws = null;
 } else {
  ws = new WebSocket(qs('#address').value);
  ws.onopen = e => onConnect();
  ws.onclose = e => onDisconnect();
  ws.onmessage = async e => addLog('<span class="received bold">RECEIVED:</span><div>' + (isValidJSON(e.data) ? prettify(JSON.stringify(JSON.parse(e.data), null, 2)) : e.data) + '</div>');
  ws.onerror = e => addLog('<span class="error bold">ERROR:</span><div>' + (isValidJSON(e.data) ? prettify(JSON.stringify(JSON.parse(e.data), null, 2)) : e.data) + '</div>');
 }
}

function onConnect() {
 connected = true;
 qs('#connect').innerHTML = 'Disconnect';
 addLog('<span class="connected bold">CONNECTED</span>');
}

function onDisconnect() {
 connected = false;
 qs('#connect').innerHTML = 'Connect';
 addLog('<span class="error bold">DISCONNECTED</span>');
}

function sendButton() {
 let elCommand = qs('#command');
 send(elCommand.value);
 elCommand.value = '';
 resizeCommand();
 elCommand.focus();
}

function sendQuick(id) {
 send(quickButtons[id].command);
}

function send(command) {
 if (ws?.readyState === 1) {
  ws.send(command);
  let parsedCommand = isValidJSON(command) ? JSON.stringify(JSON.parse(command), null, 2) : command;
  addLog('<span class="sent bold">SENT:</span><div>' + prettify(parsedCommand) + '</div>');
 } else {
  addLog('<span class="error bold">ERROR:</span> <span>Server is not connected</span>');
 }
}

function autoconnect() {
 if (localStorage.getItem('autoconnect') === 'true') {
  localStorage.removeItem('autoconnect');
  qs('#autoconnect').innerHTML = 'Enable autoconnect';
 } else {
  localStorage.setItem('autoconnect', true);
  qs('#autoconnect').innerHTML = 'Disable autoconnect';
 }
}

async function getModal(title, body) {
 closeModal();
 const html = translate(await getFileContent('html/modal.html'), { '{TITLE}': title, '{BODY}': body });
 const modal = document.createElement('div');
 modal.id = 'modal';
 modal.innerHTML = html;
 document.body.appendChild(modal);
}

function closeModal() {
 const modal = this.qs('#modal');
 if (modal) modal.remove();
}

async function addQuickModal() {
 const html = await getFileContent('html/quick-add-modal.html');
 await getModal('Add a quick command', html);
}

async function addQuick() {
 const title = qs('#quick-add-title').value;
 const command = qs('#quick-add-command').value;
 if (title !== '' && command !== '') {
  quickButtons.push({ title, command });
  localStorage.setItem('quickbuttons', JSON.stringify(quickButtons));
  closeModal();
  await loadQuickButtons();
 }
}

async function editQuickModal(id) {
 await getModal(
  'Edit the quick button',
  translate(await getFileContent('html/quick-edit-modal.html'), {
   '{ID}': id,
   '{TITLE}': quickButtons[id].title,
   '{COMMAND}': quickButtons[id].command
  })
 );
}

async function editQuick(id) {
 const title = qs('#quick-edit-title').value;
 const command = qs('#quick-edit-command').value;
 if (title !== '' && command !== '') {
  quickButtons[id].title = title;
  quickButtons[id].command = command;
  localStorage.setItem('quickbuttons', JSON.stringify(quickButtons));
  closeModal();
  await loadQuickButtons();
 }
}

async function delQuickModal(id) {
 await getModal(
  'Remove the quick button',
  translate(await getFileContent('html/quick-del-modal.html'), {
   '{ID}': id,
   '{TITLE}': quickButtons[id].title
  })
 );
}

async function delQuick(id) {
 quickButtons.splice(id, 1);
 localStorage.setItem('quickbuttons', JSON.stringify(quickButtons));
 closeModal();
 await loadQuickButtons();
}

async function moveQuick(id, direction = false) {
 if ((id === 0 && !direction) || (id === quickButtons.length - 1 && direction)) return;
 if (direction) [quickButtons[id], quickButtons[id + 1]] = [quickButtons[id + 1], quickButtons[id]];
 else [quickButtons[id], quickButtons[id - 1]] = [quickButtons[id - 1], quickButtons[id]];
 localStorage.setItem('quickbuttons', JSON.stringify(quickButtons));
 await loadQuickButtons();
}

async function loadQuickButtons() {
 lsButtons = localStorage.getItem('quickbuttons');
 if (lsButtons) {
  quickButtons = JSON.parse(lsButtons);
  const temp = await getFileContent('html/quick-item.html');
  let html = '';
  for (i = 0; i < quickButtons.length; i++) {
   html += translate(temp, {
    '{ID}': i,
    '{TITLE}': quickButtons[i].title
   });
  }
  const elItems = qs('#quick .items');
  elItems.innerHTML = html;
 }
}

function keypressAddress() {
 if (event.key === 'Enter') connect();
}

function keypressCommand() {
 if (event.ctrlKey && event.key === 'Enter') sendButton();
}

function addLog(message) {
 let console = qs('#console');
 console.innerHTML += new Date().toLocaleString() + ' - ' + message + '<br />';
 console.scrollTop = console.scrollHeight;
}

function prettify(json) {
 let highlightedJson = json
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|\b\d+\.?\d*\b)/g, function (match) {
   let cls = 'number';
   if (/^"/.test(match)) {
    if (/:$/.test(match)) cls = 'key';
    else cls = 'string';
   } else if (/true|false/.test(match)) cls = 'boolean';
   else if (/null/.test(match)) cls = 'null';
   return '<span class="' + cls + '">' + match + '</span>';
  });
 return highlightedJson.replace(/\n/g, '<br />').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/  /g, '&nbsp;&nbsp;');
}

async function getFileContent(file) {
 return (await fetch(file, { headers: { 'cache-control': 'no-cache' } })).text();
}

function translate(template, dictionary) {
 for (const key in dictionary) template = template.replaceAll(key, dictionary[key]);
 return template;
}

function isValidJSON(text) {
 try {
  JSON.parse(text);
  return true;
 } catch (e) {
  return false;
 }
}

function qs(name) {
 return document.querySelector(name);
}

function qsa(name) {
 return document.querySelectorAll(name);
}
