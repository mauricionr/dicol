module.exports = function(app) {
	var imoveis = app.controllers.imoveis;
	app.get('/imoveis',imoveis.index);
	app.get('/imoveis/new',imoveis.novo);
	app.get('/imoveis/:id',imoveis.show);
	app.post('/imoveis',imoveis.create);
	app.get('/imoveis/editar/:id',imoveis.edit);
	app.put('/imoveis/:id',imoveis.edit);
	app.del('/imoveis/:id',imoveis.destroy);
	app.get('/imoveis/upload/:id',imoveis.showUpload);	
	//app.post('/file-upload/:id', imoveis.upload);
	app.post('/upload_images/:id', imoveis.upload_images);
	app.get('/upload_images/tornar_principal/:id_produto/:id', imoveis.tornar_principal);
	app.get('/upload_images/slideshow/:id_produto/:id', imoveis.slideshow);
	app.get('/upload_images/slides/:id_produto/:flag', imoveis.checkSlideShow);
	app.get('/upload_images/excluir_imagem/:id', imoveis.excluir_imagem);
	//app.get('/file-upload/:id', imoveis.load_images);
};


