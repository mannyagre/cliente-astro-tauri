import { receivedMessages, timers } from './websocket.js';
import { lostConnection } from './dom.js';

export function clearAndDisplayConsole() {
  console.clear();
  console.log('Datos recibidos:', receivedMessages);
}

export function restartTimer(hostname) {
  clearTimeout(timers[hostname]);
  timers[hostname] = setTimeout(() => lostConnection(hostname), 5000);
}
