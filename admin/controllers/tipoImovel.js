module.exports = function(app) {
	var TipoImovelController = {
		index: function(req, res) {
			//var usuario = req.session.usuario;
			var params = {tipoImoveis : []};
			var db = global.db.getDb();
			db.query('select * from tipoImovel where status = "A"', function (err, results, fields) {

				if(results.length == 0) {
					params = {tipoImovel : []}
				} else {					
					params = results.tipoImovel;;
				}
			
				res.render('tipoImovel/index', {tipoImovel : results} );
				
			});


		},
		novo : function(req,res) {
			var params = {tipoImovel : []};
			res.render('tipoImovel/cadastro',params);
		},
		create : function(req, res ) {

			var tipoImovel = req.body.tipoImovel;

			var sql = 'insert into tipoImovel(descricao,status) values ("' +
				tipoImovel.descricao + 
				'","A");';

			var db = global.db.getDb();
			db.query(sql,function(err, results,fields) {
				if(err) 
					throw "Erro ao inserir: " + err;
				res.send('OK');
			});
		},
		show : function(req, res) {
			var id = req.params.id;			

			var db = global.db.getDb();

			var sql = 'select * from tipoImovel where idTipoImovel = ' + id;
			db.query(sql, function(err,results, fields) {								
				var params = {tipoImovel : results[0]};
				res.render('tipoImovel/cadastro', params);
			});
		},
		edit : function(req, res) {
			var id = req.params.id;
			res.render('/tipoImovel/edit', params);
		},
		update: function(req, res) {
			var tipoImovel = req.body.tipoImovel;
			var codigo = req.body._codigo;
			var status = tipoImovel.status;

			var sql = "update tipoImovel set descricao = '" + tipoImovel.descricao +  
					  "' where idTipoImovel = " + codigo;

			var db = global.db.getDb();
			db.query(sql, function(err, results, fields) {
				if(err) {
					throw "Erro ao atualizar registro: " + err;  
				}
				res.send('OK');
			});
		},
		destroy: function(req,res) {			
			var idTipoImovel = req.params.id;
			var sql = "update tipoImovel set status = 'I' where idTipoImovel = " + idTipoImovel;
			var db = global.db.getDb();
			db.query(sql, function(err, results, fields) {
				if(err) {
					throw "Erro ao excluir registro: " + err;
				}
				res.send('OK');
			});
		}

	}

	return  TipoImovelController;
};