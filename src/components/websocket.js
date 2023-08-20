export function initWebSocket() {
    const ws = new WebSocket('ws://10.1.2.7:5000/ws');
  
    ws.addEventListener('open', function (event) {
      console.log('Conectado al servidor');
    });
  
    ws.addEventListener('message', function (event) {
      const json_data = JSON.parse(event.data);
      console.log('Datos recibidos:', json_data);
      // Aquí puedes actualizar tu estado o hacer lo que necesites con los datos recibidos
    });
  }
  