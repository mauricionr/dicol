/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var path = require('path');
var http = require('http');
var mysql = require('mysql');
var email = require("./node_modules/emailjs/email.js");
var sendMail = require('./routes/mailer.js');

var app = exports.app = express();

// Configuration
app.configure(function(){
    app.set('port', process.env.PORT || 80);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    //app.enable('view cache');
});

// Objeto com a conexão mysql
var Connection  = require('./Conexao.js');
// Atribuindo a conexão a uma variável global
global.db = new Connection('','','',mysql);
// Iniciando conexão
global.db.getConnection();
// Selecionando o banco a ser usado
global.db.setDatabase('dicol');
var db = global.db.getDb();

// development only
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

//Rotas
app.get('/', routes.index(db));
app.get('/contact', routes.contact);
app.get('/aboutus', routes.aboutus);

app.get('/imovel/view/:id',function(req, res){
     db.query('SELECT p.*,i.nome,t.*,c.descricao as cidade,c.siglaUf FROM `produto` p LEFT JOIN  `imagens` i on i.idProduto = p.idProduto and i.principal = "S" LEFT JOIN `tipoImovel` t on t.idTipoImovel = p.idTipoImovel LEFT JOIN cidade c on c.idCidade = p.idCidade WHERE p.status="A" and p.idProduto = "'+ req.params.id +'"',
        function(err, results, fields){
            if(err){
                 throw 'Erro ao requisitar produto! '+ err;
            }
            var produto = results[0];
        
            db.query('SELECT * FROM `imagens` WHERE idProduto = "'+ req.params.id +'"',
                function(err, results, fields){
            if(err){
                throw 'Erro ao requisitar imagens! '+ err;
            }
            var imagem = results;

            res.render('stuff',{
                produto : produto,
                imagem : imagem,
            });
        });
    });
 });
 
 
app.get('/:name',function(req, res){
     
     var query = parseInt(req.params.id) == 9999 ?'SELECT a.*,b.nome,c.descricao FROM `produto` a LEFT JOIN  `imagens` b ON b.idProduto = a.idProduto and b.principal = "S" INNER JOIN tipoImovel c on c.idTipoImovel = a.idTipoImovel WHERE a.status = "A"' : 
        'SELECT p.*,i.nome,t.*,c.descricao as cidade,c.siglaUf FROM `produto` p LEFT JOIN  `imagens` i on i.idProduto = p.idProduto and i.principal = "S" LEFT JOIN `tipoImovel` t on t.idTipoImovel = p.idTipoImovel LEFT JOIN cidade c on c.idCidade = p.idCidade WHERE p.titulo LIKE "%'+ req.params.name +'%"';
     db.query(query,function(err, results, fields){
            if(err){
                 throw 'Erro ao consultar! '+ err;
            }
            res.render('search',{produtos:results});
        });
 });
 
 app.get('/tipo/:id',function(req, res){
     
     var query = parseInt(req.params.id) == 9999 ?'SELECT a.*,b.nome,c.descricao FROM `produto` a LEFT JOIN  `imagens` b ON b.idProduto = a.idProduto and b.principal = "S" INNER JOIN tipoImovel c on c.idTipoImovel = a.idTipoImovel  WHERE a.status = "A"' : 
        'SELECT p.*,i.nome,t.*,c.descricao as cidade,c.siglaUf FROM `produto` p LEFT JOIN  `imagens` i on i.idProduto = p.idProduto and i.principal = "S" LEFT JOIN `tipoImovel` t on t.idTipoImovel = p.idTipoImovel LEFT JOIN cidade c on c.idCidade = p.idCidade WHERE p.idTipoImovel = '+ req.params.id;
     
     db.query(query,function(err, results, fields){
            if(err){
                 throw 'Erro ao consultar! '+ err;
            }
            res.render('search',{produtos:results});
        });
 });
 
 app.get('/quartos/:id',function(req, res){
     
     var query = parseInt(req.params.id) == 9999 ?'SELECT a.*,b.nome,c.descricao FROM `produto` a LEFT JOIN  `imagens` b ON b.idProduto = a.idProduto and b.principal = "S" INNER JOIN tipoImovel c on c.idTipoImovel = a.idTipoImovel WHERE a.status = "A"' : 
        'SELECT p.*,i.nome,t.*,c.descricao as cidade,c.siglaUf FROM `produto` p LEFT JOIN  `imagens` i on i.idProduto = p.idProduto and i.principal = "S" LEFT JOIN `tipoImovel` t on t.idTipoImovel = p.idTipoImovel LEFT JOIN cidade c on c.idCidade = p.idCidade WHERE p.qtdComodos = '+ req.params.id;
     db.query(query,function(err, results, fields){
            if(err){
                 throw 'Erro ao consultar! '+ err;
            }
            res.render('search',{produtos:results});
        });
 });
 
 app.get('/comodos/:id',function(req, res){
     
     var query = parseInt(req.params.id) == 9999 ? 'SELECT a.*,b.nome,c.descricao FROM `produto` a LEFT JOIN  `imagens` b ON b.idProduto = a.idProduto and b.principal = "S" INNER JOIN tipoImovel c on c.idTipoImovel = a.idTipoImovel  WHERE a.status = "A"' : 
        'SELECT p.*,i.nome,t.*,c.descricao as cidade,c.siglaUf FROM `produto` p LEFT JOIN  `imagens` i on i.idProduto = p.idProduto and i.principal = "S" LEFT JOIN `tipoImovel` t on t.idTipoImovel = p.idTipoImovel LEFT JOIN cidade c on c.idCidade = p.idCidade WHERE p.qtdQuartos = '+ req.params.id;
     db.query(query ,function(err, results, fields){
            if(err){
                 throw 'Erro ao consultar! '+ err;
            }
            res.render('search',{produtos:results});
        });
 });
 
 
 
 
 
// Definindo servidor
var server = http.createServer(app);
// Instânciando socket
var io = require('socket.io').listen(server);
// Start no servidor
server.listen(app.get('port'),function(){
    console.log('Servidor inciado - OK');
});


// Configurações do socket
io.set('log level', 2);

// Colocando o servidor na escuta do client
// Toda chamada via socket fica dentro desse cara
io.on('connection', function (server) {
    console.log('Cliente conectado - OK');
    
    /************************************************************
    * Método responsável por enviar o contato do site via email *
    * @since 15/04/2014                                         *
    * @params cliente(socket) / email app                       *
    ************************************************************/
    sendMail.socket(server,email);
    
}); 



