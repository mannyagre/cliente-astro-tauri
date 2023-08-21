import { restartTimer, clearAndDisplayConsole } from './console.js';

const agentData = {};

export function updatePage(hostname, latestMessage) {
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
    const chart = ApexCharts.getChartByID(`agent-${hostname}`);
    
    if (chart) {
      if (!agentData[hostname]) {
        agentData[hostname] = [];
      }
  
      agentData[hostname].push({ x: new Date(), y: cpuUsage });
  
      if (agentData[hostname].length > 30) {
        agentData[hostname].shift();
      }
  
      chart.updateSeries([{ data: agentData[hostname] }]);
    } else {
      console.error(`No se pudo encontrar la gráfica para el agente ${hostname}`);
    }
  }

export function createAgentDiv(hostname) {
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
    const options = {
    chart: {
      id: `agent-${hostname}`,
      type: 'area',
      height: 350,
      width: '100%',
      animations: {
        enabled: false,
      },
    },
      series: [{
        name: 'Uso de CPU',
        data: []
      }],
      xaxis: {
        type: 'datetime'
      }
    };
  
    const chart = new ApexCharts(document.querySelector(`#agent-${hostname} .AreaChart-foco`), options);
    chart.render();
  }

export function lostConnection(hostname) {
    console.log(`El agente ${hostname} perdió la conexión`);
    updatePage(hostname, {
      'Procesador': {'Nombre': 'Desconocido', 'Uso de CPU': '0', 'Temperatura': '0'},
      'Tarjeta Madre': {'Nombre': 'Desconocido'},
      'Memoria RAM': {'Nombre': 'Desconocido', 'Usada': '0', 'Disponible': '0', 'Total': '0'},
      'Almacenamiento': {'Nombre': 'Desconocido', 'Usado': '0'},
      'Info general': {'Hostname': hostname, 'IP': 'Desconocido', 'MAC address': 'Desconocido'}
    });
    restartTimer(hostname);
    clearAndDisplayConsole();
  }
