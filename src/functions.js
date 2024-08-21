let ws;
let connected = false;

window.onload = () => {
 qs('#address').value = (window.location.protocol == 'https:' ? 'wss://' : 'ws://') + window.location.host + (window.location.port != '' ? ':' + window.location.port : '') + '/';
 if (localStorage.getItem('autoconnect') == 'true') {
  qs('#autoconnect').innerHTML = 'Disable autoconnect';
  connect();
 }
 qs('#command').addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
 });
 qs('#command').focus();
};

function connect() {
 if (connected) {
  ws.close();
  ws = null;
 } else {
  ws = new WebSocket(qs('#address').value);
  ws.onopen = e => onConnect();
  ws.onclose = e => onDisconnect();
  ws.onmessage = async e => addLog('<span class="text-yellow bold">RECEIVED:</span><div>' + (isValidJSON(e.data) ? prettify(JSON.stringify(JSON.parse(e.data), null, 2)) : e.data) + '</div>');
  ws.onerror = e => addLog('<span class="text-red bold">ERROR:</span><div>' + (isValidJSON(e.data) ? prettify(JSON.stringify(JSON.parse(e.data), null, 2)) : e.data) + '</div>');
 }
}

function onConnect() {
 connected = true;
 qs('#connect').innerHTML = 'Disconnect';
 addLog('<span class="text-green bold">CONNECTED</span>');
}

function onDisconnect() {
 connected = false;
 qs('#connect').innerHTML = 'Connect';
 addLog('<span class="text-red bold">DISCONNECTED</span>');
}

function send() {
 let elCommand = qs('#command');
 ws.send(elCommand.value);
 let parsedCommand = isValidJSON(elCommand.value) ? JSON.stringify(JSON.parse(elCommand.value), null, 2) : elCommand.value;
 addLog('<span class="text-blue bold">SENT:</span><div>' + prettify(parsedCommand) + '</div>');
 elCommand.value = '';
 elCommand.focus();
}

function autoconnect() {
 if (localStorage.getItem('autoconnect') == 'true') {
  localStorage.removeItem('autoconnect');
  qs('#autoconnect').innerHTML = 'Enable autoconnect';
 } else {
  localStorage.setItem('autoconnect', true);
  qs('#autoconnect').innerHTML = 'Disable autoconnect';
 }
}

async function getModal(title, body) {
 closeModals();
 const html = translate(await getFileContent('html/modal.html'), { '{TITLE}': title, '{BODY}': body });
 const modal = document.createElement('div');
 modal.className = 'modal';
 modal.innerHTML = html;
 document.body.appendChild(modal);
}

function closeModals() {
 const modals = this.qsa('.modal');
 for (m of modals) m.remove();
}

async function addQuickModal() {
 const html = await getFileContent('html/quick-add-modal.html');
 await getModal('Add a quick command', html);
}

async function delQuickModal(id) {
 await getModal('Remove a quick modal', 'Would you like to delete ... button?');
}

function delQuick(id) {
 qs('#quick-' + id).remove();
}

function keypressAddress() {
 if (event.key === 'Enter') connect();
}

function keypressCommand() {
 if (event.ctrlKey && event.key === 'Enter') send();
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
