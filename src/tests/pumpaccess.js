const ws = new WebSocket("wss://pumpportal.fun/api/data");

ws.onopen = () => {
  console.log("Connected to Pump Portal WS ✅");
};

ws.onmessage = (msg) => {
  console.log("Pump Portal Message:", msg.data);
};
