export function updateChart(hostname, cpuUsage, agentData) {
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
  
  export function createChart(hostname) {
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