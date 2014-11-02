module.exports = function(app) {
	var tipoImovel = app.controllers.tipoImovel;
	app.get('/tipoImovel',tipoImovel.index);
	app.get('/tipoImovel/new',tipoImovel.novo);
	app.get('/tipoImovel/:id',tipoImovel.show);
	app.post('/tipoImovel',tipoImovel.create);
	app.get('/tipoImovel/:id/editar',tipoImovel.edit);
	app.put('/tipoImovel/:id',tipoImovel.update);
	app.delete('/tipoImovel/:id',tipoImovel.destroy);
};


