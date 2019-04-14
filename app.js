const fs = require('fs');
const {exec} = require('child_process');
const Client = require('socket.io-client');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const {messageSubscriptions, serverUri} = config;

console.log(`initializing home automation client with WSS uri ${serverUri}`);

const ws = Client(serverUri);

ws.on('connect', () => {
  console.log('websocket connected');
});

ws.on('reconnect', () => {
  console.log('websocket reconnected');
});

ws.on('disconnect', () => {
  console.warn('websocket disconnected');
});

if (messageSubscriptions.includes('SleepComputersRequest')) {
  console.log('subscribing to SleepComputersRequest')
  ws.on('SleepComputersRequest', () => {
    console.log('SleepComputersRequest');
    exec('sudo systemctl suspend');
  });
}