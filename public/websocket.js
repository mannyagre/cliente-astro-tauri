import { updatePage, createAgentDiv } from './dom.js';
import { restartTimer, clearAndDisplayConsole } from './console.js';

export const receivedMessages = {};
export const timers = {};

export function initWebSocket() {
  const ws = new WebSocket('ws://10.1.2.7:5000/ws');

  ws.addEventListener('open', () => {
    console.log('Conectado al servidor');
  });

  ws.addEventListener('message', function (event) {
    const json_data = JSON.parse(event.data);
    const hostname = json_data['Info general']['Hostname'];

    manageReceivedMessages(hostname, json_data);
    updatePage(hostname, json_data);
    restartTimer(hostname);
    clearAndDisplayConsole();
  });
}

function manageReceivedMessages(hostname, json_data) {
  if (!receivedMessages[hostname]) {
    receivedMessages[hostname] = [];
    createAgentDiv(hostname);
  }

  receivedMessages[hostname].push(json_data);

  if (receivedMessages[hostname].length > 30) {
    receivedMessages[hostname].shift();
  }
}

window.addEventListener('load', initWebSocket);
