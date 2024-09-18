const express = require('express');
const Router = express.Router();
const sitesController = require('../controllers/sites');

Router.get('/', sitesController.getAllSites);
Router.get('/:id', sitesController.getSiteById);
Router.get('/:name', sitesController.getSiteByName);
Router.put('/:id', sitesController.updateSite);
Router.delete('/:id', sitesController.deleteSite);
Router.post('/', sitesController.createSite);

module.exports = Router;