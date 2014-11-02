// Classe responsável pela conexão mysql
 
function Connection(host,user,password,mysql) {
   
    // Define os atributos da conexão
    this.hosted = host
    this.user = user;
    this.password = password;
    this.mysql = mysql;
 
    // Instância objeto de conexão mysql
    this.db = mysql.createConnection({
        host : this.hosted,
        user : this.user,
        password : this.password,
        port : 3306
    },function(err){
        if(err){
            throw 'Dados de login inválidos!\n'+ err;
        }
    });
}
 
Connection.prototype = {
    // Faz a conexão com banco
    getConnection : function getConnection() {
        return this.db.connect(function(err){
            if(err){
                throw 'Erro ao conectar ao banco de dados!\n'+ err;
            }else{
                console.log('Servidor conectado ao banco de dados - OK');
            }
        });
    },
    // Define o banco a ser usado
    setDatabase : function setDatabase(database){
        !database || database == "undefined" ?
        console.log('Banco de dados "'+ database +'" inválido!') :
        this.db.query('USE '+database,function(err){
            if(err){
                throw 'Erro ao selecionar banco de dados!\n'+ err;
            }else{
                console.log('Banco de dados selecionado "'+ database +'" - OK');
            }
        });
    },
    // Get do objeto para fazer uso no projeto
    getDb : function getDb(){
        return this.db;
    }
};
module.exports = Connection;
 