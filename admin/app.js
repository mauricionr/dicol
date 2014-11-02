var express= require('express'),
load = require('express-load'),
app = express(),
mysql = require('mysql'),
fs = require('fs'),
cors = require('cors');



//Configuração do express
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');

//Configuração de login e sessão
app.use(express.cookieParser('dicol'));
app.use(express.session());
app.use(cors());
app.use(express.bodyParser({uploadDir: __dirname +"/public/files"})); //parse de objeto JSON vindo do formulário
app.use(express.methodOverride()); //permite utilizar api em forma de rest(/curso/1)
app.use(express.static(__dirname + '/public'));



//Carregando arquivos de modelo e controle
load("models").then('controllers').then('routes').into(app);


//Conexão ao servidor de banco de dados
var Connection = require('./Conexao.js');
//Cria classe de conexão
global.db = new Connection('','','',mysql);
//inicia conexão
global.db.getConnection();
//seta banco de dados
global.db.setDatabase('dicol');

global.db.getDb();

//Cria classe de conexão
/**
var db = global.db.getDb();

db.query('insert into teste(campo1) values("ubpapapa");');



db.query('select * from teste',function (err, results, fields) {
	console.log(results);
});

**/
module.exports = app;

app.listen(8080, function() {
	console.log("######## ADMINISTRAÇÃO DICOL ########");
	console.log("#######   www.coderup.com.br  #######");
});

