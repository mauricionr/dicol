module.exports = function(app) {
	var autenticar = require('./../middleware/autenticador.js');
	var dashboard = app.controllers.dashboard;
	app.get('/dashboard',autenticar,dashboard.index);
};