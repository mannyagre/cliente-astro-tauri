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
        height: 230, // Changed height to 230
        foreColor: "#ccc", // Added foreColor
        toolbar: {
          autoSelected: "pan",
          show: false
        },
        animations: {
          enabled: false,
        },
      },
      colors: ["#00BAEC"], // Added colors
      stroke: {
        width: 3 // Added stroke width
      },
      grid: {
        borderColor: "#555", // Added grid borderColor
        clipMarkers: false,
        yaxis: {
          lines: {
            show: false
          }
        }
      },
      dataLabels: {
        enabled: false // Added dataLabels
      },
      fill: {
        gradient: {
          enabled: true, // Added gradient
          opacityFrom: 0.55,
          opacityTo: 0
        }
      },
      series: [{
        name: 'Uso de CPU',
        data: []
      }],
      tooltip: {
        theme: "dark" // Added tooltip theme
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        min: 0, // Added yaxis min
        tickAmount: 4 // Added yaxis tickAmount
      }
    };
    const chart = new ApexCharts(document.querySelector(`#agent-${hostname} .AreaChart-foco`), options);
    chart.render();
  }
  