const express = require('express');
const Router = express.Router();
const sitesController = require('../controllers/sites');

Router.get('/', sitesController.getAllSites);

module.exports = Router;