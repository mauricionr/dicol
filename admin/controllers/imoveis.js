module.exports = function(app) {


	var path = require('path'),
	fs = require('fs'),	
	_existsSync = fs.existsSync || path.existsSync,
	formidable = require('formidable'),
	nodeStatic = require('node-static'),
	imageMagick = require('imagemagick'),
	qs = require('querystring'),
	url = require('url');
	options = {
            maxPostSize: 11000000000, // 11 GB
            minFileSize: 1,
            maxFileSize: 10000000000, // 10 GB
            // Files not matched by this regular expression force a download dialog,
            // to prevent executing any scripts in the context of the service domain:
            inlineFileTypes: /\.(gif|jpe?g|png)$/i,
            imageTypes: /\.(gif|jpe?g|png)$/i,
            accessControl: {
            	allowOrigin: '*',
            	allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
            	allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
            }
        };
        
        var ImoveisController = {
        	index: function(req, res) {
			    //var usuario = req.session.usuario;
			    var db = global.db.getDb();
			    var sql = "select a.*,cidade.descricao as desc_cidade from produto a " +
			    " inner join cidade as cidade on cidade.idCidade = a.idCidade " +
			    " where a.status = 'A'";

			    db.query(sql, function (err, results, fields) {
				    var params;
				    if(results == undefined) {
					    params = {imoveis : []};		
				    } else {
					    params = {imoveis : results};					
				    }
                        res.render('imoveis/index',params);
			        });
            },
		converterEmFloat : function(a) {
		    if (a == '' || a == undefined || a == null || a == 0) {
		        return 0;
	        }
		    
			return a.replace('.','').replace(',','.');
		},
		novo : function(req,res) {
			var params = {
				"estados" : [],
				"cidades" : [],
				"bairros" : [],
				"produto" : []
			};
			var sqlTipo = "select * from tipoImovel where status = 'A'";
			var db = global.db.getDb();			

			db.query(sqlTipo, function(err, results, fields) {
				var params = {tipoImoveis : []};
				if(results != undefined) {
					params = {tipoImoveis : results};
				}

				db.query("select * from cidade where siglaUf = 'GO'",function(err2,results2, fields2) {
					params["cidades"] = [];
					if(results2 != undefined) {
						params["cidades"]  = results2;
					}

					db.query("select * from estado", function(err4,results4,fields4) {
						params["estados"] = [];
						if(results4 != undefined) {
							params["estados"] = results4;
						}

						params["produto"] = [];
						res.render('imoveis/cadastro',params);
					});
				});
			});
		},
		valCampos : function(valor) {
			if(valor == undefined)
				return '';
			return valor;
		},
		create : function(req, res ) {
			var paraAlugar = "N";
			var paraVenda = "N";
			var idTipoImovel = null;
			var idCidade = null;
			var idBairro = 1;
			var bairro = null;
			//var descricao = null;
			var observacao = "";
			var vlrImovel = 0.0;
			var vlrAlugar = 0.0;
			//console.log(req.body.produto);
			if(req.body.produto.paraAlugar != undefined) {
				paraAlugar = "S";
			}

			if(req.body.produto.paraVender != undefined) {
				paraVenda = "S";
			}
			
			if(req.body.produto.observacao != undefined) {
			    observacao = req.body.produto.observacao.trim();
			}

			if(req.body.produto.idTipoImovel != null || req.body.produto.idTipoImovel != undefined) {
				idTipoImovel = req.body.produto.idTipoImovel;
			}

			if(req.body.produto.idCidade != null || req.body.produto.idCidade != undefined) {
				idCidade = req.body.produto.idCidade;
			}

			if(req.body.produto.bairro != null || req.body.produto.bairro != undefined) {
				bairro = req.body.produto.bairro;
			}

			if(req.body.produto.observacao != null || req.body.produto.observacao != undefined ) {
				observacao = req.body.produto.observacao;
			}

			if(req.body.produto.vlrImovel != null || req.body.produto.vlrImovel != undefined ) {
				vlrImovel = req.body.produto.vlrImovel;
			}
			
			if(req.body.produto.vlrAlugar != null || req.body.produto.vlrAlugar != undefined) {
	           vlrAlugar = req.body.produto.vlrAlugar;
	        }
			
            var moeda =  ImoveisController;

			var sql = "insert into produto(idTipoImovel,idCidade,idBairro, " +
				"titulo,status,qtdQuartos,qtdGaragem,qtdComodos,vlrImovel,vlrAlugar," + 
				"paraAlugar,paraVenda,area,endereco,bairro,observacao) values (" +
				idTipoImovel + "," +
				idCidade + "," +
				idBairro + "," +
				"'" + req.body.produto.titulo + "'," +
				"'A'" + "," +
				req.body.produto.qtdQuartos + "," +
				req.body.produto.qtdGaragem + "," +
				req.body.produto.qtdComodos + "," +
				moeda.converterEmFloat(vlrImovel) + "," +
				moeda.converterEmFloat(vlrAlugar) + ",'" +
				paraAlugar + "','" + 
				paraVenda + "','" + 
				req.body.produto.area + "','" +
				req.body.produto.endereco + "','" +
				bairro +"','" +
				observacao +"');";
                
                console.log(sql);
var db = global.db.getDb();
db.query(sql, function(err, results, fields) {
	if(err) 
		throw "Erro ao cadastrar: " + err;
	res.send('OK');
});	

},
show : function(req, res) {
	var id = req.params.id;
	var params = {produto: []};			
	var sql = "select * from produto where idProduto = " + id;
	var db = global.db.getDb();


	var params = {
		"estados" : [],
		"cidades" : [],
		"bairros" : [],
		"produto" : []
	};
	var sqlTipo = "select * from tipoImovel where status = 'A'";
	var db = global.db.getDb();			

	db.query(sqlTipo, function(err, results, fields) {
		var params = {tipoImoveis : []};
		if(results != undefined) {
			params = {tipoImoveis : results};
		}

		db.query("select * from cidade where siglaUf = 'GO'",function(err2,results2, fields2) {
			params["cidades"] = [];
			if(results2 != undefined) {
				params["cidades"]  = results2;
			}

			db.query("select * from estado", function(err4,results4,fields4) {
				params["estados"] = [];
				if(results4 != undefined) {
					params["estados"] = results4;
				}

				db.query(sql, function(err,results,fields) {
					if(err)
						throw "Erro ao mostrar: " + err;
					if(results != undefined)
						params["produto"] = results[0];

					res.render('imoveis/cadastro',params);
				});

			});
		});
	});


	
},
showUpload : function(req,res) {
	var id = req.params.id;
	var sql = "select * from produto where idProduto = " + id;
	var db = global.db.getDb();

	var params = {};

	db.query(sql, function(err,results,fields) {
		
		if(results != undefined) {
			params.produto = results[0];

			var qr = "select * from imagens where idProduto = " + id;
			db.query(qr, function(err2,rows) {
				if(err2) console.log(err2);
				else params.imagens = rows;
				console.log(params);
				res.render('imoveis/upload2',params);
			});

		}

	});
},
edit : function(req, res) {
	var id = req.params.id;
	
	var paraAlugar = "N";
	var paraVenda = "N";
	var idTipoImovel = null;
	var idCidade = null;
	var idBairro = 1;
	var bairro = null;
	var descricao = null;
	var observacao = "";
	var vlrImovel = 0.0;
	var vlrAlugar = 0.0;
	console.log(req.body.produto);
	if(req.body.produto.paraAlugar != undefined) {
		paraAlugar = "S";
	}

	if(req.body.produto.paraVender != undefined) {
		paraVenda = "S";
	}

	if(req.body.produto.idTipoImovel != null || req.body.produto.idTipoImovel != undefined) {
		idTipoImovel = req.body.produto.idTipoImovel;
	}

	if(req.body.produto.idCidade != null || req.body.produto.idCidade != undefined) {
		idCidade = req.body.produto.idCidade;
	}

	if(req.body.produto.bairro != null || req.body.produto.bairro != undefined) {
		bairro = req.body.produto.bairro;
	}

	if(req.body.produto.observacao != null || req.body.produto.observacao != undefined ) {
		observacao = req.body.produto.observacao;
	}

	if(req.body.produto.vlrImovel != null || req.body.produto.vlrImovel != undefined ) {
		vlrImovel = req.body.produto.vlrImovel;
	}
	
	if(req.body.produto.vlrAlugar != null || req.body.produto.vlrAlugar != undefined) {
	    vlrAlugar = req.body.produto.vlrAlugar;
	}

    var moeda =  ImoveisController;

	var sql = "UPDATE produto SET idTipoImovel='"+idTipoImovel+
		"',idCidade='"+idCidade+
		"',idBairro='"+idBairro+"', " +
		"titulo='"+req.body.produto.titulo+
		"',status='A',qtdQuartos='"+req.body.produto.qtdQuartos+
		"',qtdGaragem='"+req.body.produto.qtdGaragem+
		"',qtdComodos='"+req.body.produto.qtdComodos+
		"',vlrImovel="+moeda.converterEmFloat(vlrImovel)+"," + 
		"',vlrAlugar="+moeda.converterEmFloat(vlrAlugar)+"," +
		"paraAlugar='"+paraAlugar+
		"',paraVenda='"+paraVenda+
		"',area='"+req.body.produto.area+
		"',endereco='"+req.body.produto.endereco+
		"',observacao='"+observacao+
		"',descricao='"+descricao+
		"',bairro='"+bairro+"'" +
		" where idProduto = " + id;

	var db = global.db.getDb();
	db.query(sql, function(err, results, fields) {
		if(err){ 
			throw "Erro ao cadastrar: " + err;
		}
		var params = results;
		res.render('/imoveis/editar', {produtos:params});
	});
},
update: function(req, res) {
	var imoveil = req.body.imovel;

	res.redirect('/imoveis');
},
destroy: function(req,res) {
	var id = req.params.id;
	var db = global.db.getDb();

	var sql = "update produto set status = 'D' where idProduto = " + id;
	console.log(sql);

	db.query(sql, function(err,results, fields) {
		if(err) {
			throw "Erro ao excluir registros: " + err;
		}
		res.send(200);
	});

},		
upload_images : function(req,res,next){

	res.setHeader(
		'Access-Control-Allow-Origin',
		options.accessControl.allowOrigin
		);

	res.setHeader(
		'Access-Control-Allow-Methods',
		options.accessControl.allowMethods
		);


	res.setHeader(
		'Access-Control-Allow-Headers',
		options.accessControl.allowHeaders
		);
	res.send(200);

	console.log("Fazendo upload das imagens");

	var image = req.files.Filedata;

	fs.readFile(image.path,function(err,data){
		var imageName = image.name;
		if(!imageName){
			console.log("Erro ao inserir imagem");
		}
		else{

			var newPath = __dirname + "/../public/files/" + imageName;
			fs.writeFile(newPath,data,function(err){
				if(err) {
					console.log("Ocorreu o erro: => " + err);
				}
				else{

					var post = {
						idProduto: req.params.id,
						nome : imageName,
						descricao: 'decricao',
						principal: 'n'
					};

					var sql = "INSERT INTO imagens (idProduto,nome,descricao,principal) VALUES ("
						+ "'" + post.idProduto + "',"
						+ "'" + post.nome + "',"
						+ "'" + post.descricao + "',"
						+ "'" + post.principal + "')";
			var db = global.db.getDb();
			db.query(sql, function (err, result) {
				if(err){
					console.log(err);
					console.log(result);
				}else{
					console.log("Imagem [" + imageName + "] inserida com sucesso!");
				}
			});     
		}
	});
		}
	});      
},
tornar_principal: function(req,res){

	res.setHeader(
		'Access-Control-Allow-Origin',
		options.accessControl.allowOrigin
		);

	res.setHeader(
		'Access-Control-Allow-Methods',
		options.accessControl.allowMethods
		);


	res.setHeader(
		'Access-Control-Allow-Headers',
		options.accessControl.allowHeaders
		);
	res.send(200);

	var db = global.db.getDb();

	var idImagem = req.params.id;
	var idProduto = req.params.id_produto;

	var sql = "UPDATE imagens SET principal='n' WHERE idProduto = " + idProduto;
	var sql2 = " UPDATE imagens SET principal = 's' WHERE idImagem = " + idImagem;
	db.query(sql, function (err, result) {
		if(err){
			console.log(err);
		}else{

			db.query(sql2, function (err2, result2) {
				if(err2){
					console.log(err2);
				}else{
					console.log("Imagem [" + idImagem + "] agora e principal!");
				}
			});
		}
	});

},
slideshow: function(req,res){

	res.setHeader(
		'Access-Control-Allow-Origin',
		options.accessControl.allowOrigin
		);

	res.setHeader(
		'Access-Control-Allow-Methods',
		options.accessControl.allowMethods
		);


	res.setHeader(
		'Access-Control-Allow-Headers',
		options.accessControl.allowHeaders
		);
	res.send(200);

	var db = global.db.getDb();

	var idImagem = req.params.id;
	var idProduto = req.params.id_produto;
	
	db.query("SELECT slideshow FROM imagens WHERE idImagem = " + idImagem, function (err, result) {
	    if(err){
		    console.log(err);
        }
        var status = result[0].slideshow;
        var sql = "UPDATE imagens SET slideshow = 's' WHERE idImagem = " + idImagem;
        var sqlProd = "UPDATE produto SET slideshow = 's' WHERE idProduto = " + idProduto;
        
        if(status == 's'){
            sql = "UPDATE imagens SET slideshow = 'n' WHERE idImagem = " + idImagem;
            sqlProd = "UPDATE produto SET slideshow = 'n' WHERE idProduto = " + idProduto;
        }
        
        db.query(sql, function (err, result) {
		    if(err){
			    throw 'Erro ao definir slideshow em imagens! '+ err;
		    }
		    db.query(sqlProd,function (err, result) {
		        if(err){
			        throw 'Erro ao definir slideshow em produto! '+ err;
		        }
		        console.log("Imagem [" + idImagem + "] foi definida no slideshow!");
		    });
	    });
	});
},

checkSlideShow : function(req,res){
    res.setHeader(
		'Access-Control-Allow-Origin',
		options.accessControl.allowOrigin
		);

	res.setHeader(
		'Access-Control-Allow-Methods',
		options.accessControl.allowMethods
		);


	res.setHeader(
		'Access-Control-Allow-Headers',
		options.accessControl.allowHeaders
		);
	res.send(200);

	var db = global.db.getDb();

	var flag = req.params.flag;
	var idProduto = req.params.id_produto;

	var sql = "UPDATE produto SET slideshow = '"+ flag +"' WHERE idProduto = " + idProduto;

	db.query(sql, function (err, result) {
		if(err){
			throw 'Erro ao alterar slideshow ' + err;
		}
		console.log('Alteração realizada!');
	});
},

excluir_imagem: function(req,res){
	res.setHeader(
		'Access-Control-Allow-Origin',
		options.accessControl.allowOrigin
		);

	res.setHeader(
		'Access-Control-Allow-Methods',
		options.accessControl.allowMethods
		);


	res.setHeader(
		'Access-Control-Allow-Headers',
		options.accessControl.allowHeaders
		);
	res.send(200);

	var db = global.db.getDb();
	var idImagem = req.params.id;

	var sql = "DELETE FROM imagens WHERE idImagem = " + idImagem;
	console.log(idImagem);
	db.query(sql, function (err, result) {
		if(err){
			console.log(err);
		}else{
			console.log("Imagem [" + idImagem + "] removida com sucesso!");
		}
	});


}

}

return  ImoveisController;
};