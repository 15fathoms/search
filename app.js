const express = require('express');
const sitesRoutes = require('./routes/sites');
const pagesRoutes = require('./routes/pages');
const http = require('http');


const app = express();

//create server
const server = http.createServer(app);
server.listen(3001, () => {
    console.log('Server running on port 3001 at : \nhttp://localhost:3001');
});

const clients = [];



//static files
app.use(express.static('public'));
app.use(express.static('images'));
app.use(express.static('front'));

//routes
app.use('/', pagesRoutes);
app.use('/api/sites', sitesRoutes);