const path = require('path');
exports.renderPage = (req, res) => {
    let pageName = req.params.page;
    res.sendFile(path.join(__dirname, `../front/${pageName}.html`));
}