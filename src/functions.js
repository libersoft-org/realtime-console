var ws;
var connected = false;

window.onload = () => {
 qs('#address').value = (window.location.protocol == 'https:' ? 'wss://' : 'ws://') + window.location.host + (window.location.port != '' ? ':' + window.location.port : '') + '/';
 if (localStorage.getItem('autoconnect') == 'true') {
  qs('#autoconnect').innerHTML = 'Disable autoconnect';
  connect();
 }
 qs('#command').focus();
};

function connect() {
 if (connected) {
  ws.close();
  ws = null;
 } else {
  ws = new WebSocket(qs('#address').value);
  ws.onopen = e => {
   onConnect();
  };
  ws.onclose = e => {
   onDisconnect();
  };
  ws.onmessage = async e => {
   addLog('<span class="text-yellow bold">RECEIVED:</span> ' + syntaxHighlight(JSON.stringify(JSON.parse(e.data), undefined, 4)));
  };
  ws.onerror = e => {
   addLog('<span class="text-red bold">ERROR:</span> ' + syntaxHighlight(JSON.stringify(JSON.parse(e.data), undefined, 4)));
  };
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
 var command = qs('#command');
 addLog('<span class="text-blue bold">SENT:</span> ' + syntaxHighlight(JSON.stringify(JSON.parse(command.value), undefined, 4)));
 ws.send(command.value);
 command.value = '';
 command.focus();
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
 await getModal('Add a quick command', 'Test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test<br />Test<br />Test<br />Test');
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
 if (event.key === 'Enter') send();
}

function addLog(message) {
 var console = qs('#console');
 console.innerHTML += new Date().toLocaleString() + ' - ' + message + '<br />';
 console.scrollTop = console.scrollHeight;
}

function syntaxHighlight(data) {
 data = data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
 return data.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
  var cls = 'number';
  if (/^"/.test(match)) {
   if (/:$/.test(match)) cls = 'key';
   else cls = 'string';
  } else if (/true|false/.test(match)) cls = 'boolean';
  else if (/null/.test(match)) cls = 'null';
  return '<span class="' + cls + '">' + match + '</span>';
 });
}

async function getFileContent(file) {
 return (await fetch(file, { headers: { 'cache-control': 'no-cache' } })).text();
}

function translate(template, dictionary) {
 for (const key in dictionary) template = template.replaceAll(key, dictionary[key]);
 return template;
}

function qs(name) {
 return document.querySelector(name);
}

function qsa(name) {
 return document.querySelectorAll(name);
}
