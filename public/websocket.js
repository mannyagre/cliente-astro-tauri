// Inicializa la conexión WebSocket cuando se carga la página
window.addEventListener('load', () => {
  initWebSocket();
});

// Inicializa la conexión WebSocket
export function initWebSocket() {
  const ws = new WebSocket('ws://10.1.2.7:5000/ws');
  const receivedMessages = {};
  const timers = {};

  ws.addEventListener('open', function (event) {
    console.log('Conectado al servidor');
  });

  ws.addEventListener('message', function (event) {
    const json_data = JSON.parse(event.data);
    const hostname = json_data['Info general']['Hostname'];

    if (!receivedMessages[hostname]) {
      receivedMessages[hostname] = [];
      createAgentDiv(hostname); // Crear el div solo la primera vez
    }

    receivedMessages[hostname].push(json_data);

    // Mantener solo los últimos 30 mensajes para cada agente
    if (receivedMessages[hostname].length > 30) {
      receivedMessages[hostname].shift();
    }

    // Reiniciar el temporizador para este agente
    clearTimeout(timers[hostname]);
    timers[hostname] = setTimeout(() => {
      lostConnection(hostname);
    }, 5000); // 5 segundos

    // Limpiar la consola
    console.clear();

    // Mostrar los mensajes en la consola
    console.log('Datos recibidos:', receivedMessages);

    // Actualizar la información en la página
    updatePage(hostname, json_data);
  });
}

// Código para manejar la pérdida de conexión con un agente
function lostConnection(hostname) {
  console.log(`El agente ${hostname} perdió la conexión`);
  updatePage(hostname, {
    'Procesador': {'Nombre': 'Desconocido', 'Uso de CPU': '0', 'Temperatura': '0'},
    'Tarjeta Madre': {'Nombre': 'Desconocido'},
    'Memoria RAM': {'Nombre': 'Desconocido', 'Usada': '0', 'Disponible': '0', 'Total': '0'},
    'Almacenamiento': {'Nombre': 'Desconocido', 'Usado': '0'},
    'Info general': {'Hostname': hostname, 'IP': 'Desconocido', 'MAC address': 'Desconocido'}
  });
}

// Crea un nuevo div para un agente
function createAgentDiv(hostname) {
  const container = document.getElementById('agent-info-container');
  const agentDiv = document.createElement('div');
  agentDiv.id = `agent-${hostname}`;
  agentDiv.className = 'container';
  agentDiv.innerHTML = `
    <div class="Foco">
      <div class="Info-en-texto-foco">
        <div class="Info-General" id="info-general-${hostname}"></div>
        <div class="Info-del-componente" id="info-componente-${hostname}"></div>
      </div>
      <div class="AreaChart-foco"></div>
    </div>
    <div class="Menu">
      <div class="Procesador" id="prevtextprocesador-${hostname}"></div>
      <div class="Almacenamiento" id="prevtextalmacenamiento-${hostname}"></div>
      <div class="Memoria" id="prevtextmemoria-${hostname}"></div>
      <div class="Tarjeta-madre" id="prevtextmadre-${hostname}"></div>
    </div>
  `;
  container.appendChild(agentDiv);
}

// Actualiza la información del agente en la página
function updatePage(hostname, latestMessage) {
  // Redondear los números a enteros
  const cpuUsage = Math.round(parseFloat(latestMessage['Procesador']['Uso de CPU']));
  const cpuTemp = Math.round(parseFloat(latestMessage['Procesador']['Temperatura']));
  const storageUsed = Math.round(parseFloat(latestMessage['Almacenamiento']['Usado']));
  const ramUsed = parseFloat(latestMessage['Memoria RAM']['Usada']).toFixed(2);
  const ramTotal = parseFloat(latestMessage['Memoria RAM']['Total']).toFixed(2);
  const motherboardTemp = Math.round(parseFloat(latestMessage['Tarjeta Madre']['Temperatura']));

  document.getElementById(`info-general-${hostname}`).textContent = `IP: ${latestMessage['Info general']['IP']}, MAC: ${latestMessage['Info general']['MAC address']}, Hostname: ${latestMessage['Info general']['Hostname']}`;
  document.getElementById(`info-componente-${hostname}`).textContent = `Nombre: ${latestMessage['Procesador']['Nombre']}, Uso: ${cpuUsage}%, Temp: ${cpuTemp}°`;
  document.getElementById(`prevtextprocesador-${hostname}`).textContent = `${cpuTemp}° ${cpuUsage}%`;
  document.getElementById(`prevtextalmacenamiento-${hostname}`).textContent = `${storageUsed}%`;
  document.getElementById(`prevtextmemoria-${hostname}`).textContent = `${ramUsed}/${ramTotal} GB`;
  document.getElementById(`prevtextmadre-${hostname}`).textContent = `${motherboardTemp}°`;
}