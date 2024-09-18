const express = require('express');
const sitesRoutes = require('./routes/sites');

const app = express();

//create server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
    console.log('http://localhost:3001');
});

app.use('/api/sites', sitesRoutes);