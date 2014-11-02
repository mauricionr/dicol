module.exports = function(app) {
	var UserController = {
		index: function(req, res) {
			//var usuario = req.session.usuario;
			var params = {tipoImoveis : []};
			var db = global.db.getDb();
			db.query('select * from usuario where status = "A"', function (err, results, fields) {

				if(results.length == 0) {
					params = {usuarios : []}
				} else {					
					params =  {usuarios : results};
				}
			
				res.render('usuario/index', params);
				
			});


		},
		novo : function(req,res) {
			var params = {usuario : []};
			res.render('usuario/cadastro',params);
		},
		create : function(req, res ) {
			var usuario = req.body.usuario;
			console.log(usuario);
			var login = usuario.login;
			var nome = usuario.nome;
			var senha = usuario.senha;

			var sql = 'insert into usuario(status,login,nome,senha) values ("A","' +
				login + '","' + nome + '","' + senha + '");';

			var db = global.db.getDb();
			db.query(sql,function(err, results,fields) {
				if(err) 
					throw "Erro ao inserir: " + err;
				res.send(200);
			});
		},
		show : function(req, res) {
			var id = req.params.id;			

			var db = global.db.getDb();

			var sql = 'select * from usuario where idUsuario = ' + id;
			db.query(sql, function(err,results, fields) {								
				var params = {usuario : results[0]};
				res.render('usuario/cadastro', params);
			});
		},
		edit : function(req, res) {
			var id = req.params.id;
			res.render('/usuario/edit', params);
		},
		update: function(req, res) {
			var usuario = req.body.usuario;
			var codigo = req.body._codigo;
			var login = usuario.login;
			var nome = usuario.nome;
			var senha = usuario.senha;

			var sql = "update usuario set " +
					  " login = '" + login + "'" +
					  " ,nome = '" + nome + "'" +
					  " ,senha = '" + senha + "'" +					  
					  " where idUsuario = " + codigo;

			var db = global.db.getDb();
			db.query(sql, function(err, results, fields) {
				if(err) {
					throw "Erro ao atualizar registro: " + err;  
				}
				res.send('OK');
			});
		},
		destroy: function(req,res) {			
			var idUsuario = req.params.id;
			var sql = "update usuario set status = 'I' where idUsuario = " + idUsuario;
			var db = global.db.getDb();
			db.query(sql, function(err, results, fields) {
				if(err) {
					throw "Erro ao excluir registro: " + err;
				}
				res.send(200);
			});
		}

	}

	return UserController;
};