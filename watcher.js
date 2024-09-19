const WebSocket = require('ws');
const chokidar = require('chokidar');

const wss = new WebSocket.Server({ port: 8081 });

//watcher
chokidar
.watch(['./public', './images', './front'], console.log('Watching for changes...'))
.on('change', (path) => {
    wss.clients.forEach((client) => {
        client.send('refresh');
    });
});