module.exports = function(app) {
	var usuario = app.controllers.usuario;
	app.get('/usuario',usuario.index);
	app.get('/usuario/new',usuario.novo);
	app.get('/usuario/:id',usuario.show);
	app.post('/usuario',usuario.create);
	app.get('/usuario/:id/editar',usuario.edit);
	app.put('/usuario/:id',usuario.update);
	app.delete('/usuario/:id',usuario.destroy);

}