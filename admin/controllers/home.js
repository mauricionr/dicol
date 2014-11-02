module.exports = function(app) {
	var HomeController = {
		index: function(req, res) {
			res.render('home/index');
		},
		login : function(req, res) {			
			var nome = req.body.usuario.nome;
			var senha = req.body.usuario.senha;

			console.log(nome + "|" + senha);

			if(nome && senha) {

				if(nome=="admin" && senha=="admin123") {
					req.session.usuario = nome;
					req.session.idUsuario = 0;
					res.redirect('/dashboard');
				} else {
					sql = "select * from usuario where status = 'A' and login = '" + nome + "' and senha = '" +  senha + "'";					
					var db = global.db.getDb();					
					db.query(sql, function(err,results,fields) {
						console.log(results);
						if(results.length > 0) {
							req.session.usuario = results[0].nome;
							req.session.idUsuario = results[0].idUsuario;
							res.redirect('/dashboard');
						} else {
							res.render('home/senhaInvalida',[]);
						}
					});				

				}
			} else {
				res.redirect('/');
			}
		},
		logout : function(req, res) {
			req.session.destroy();
			res.redirect('/');
		}
	};

	//Retorna
	return HomeController;
};