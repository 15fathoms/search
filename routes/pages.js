const express = require('express');
const Router = express.Router();

const pagesController = require('../controllers/pages');

Router.get('/:page', pagesController.renderPage);

module.exports = Router;