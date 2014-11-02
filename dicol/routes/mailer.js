/******************************
* Envia emails                *
* @since 11/04/2014           *
* @params cliente / email App *
******************************/

exports.socket = function(server,email){
    /**************************************************************** 
    * Servidor socket aguardando o evento de contato do cliente     *
    * @since 15/04/2014                                             *
    * @params obj contato - > nome,email,website,assunto e mensagem *
    ****************************************************************/
    server.on("mensagem-contato", function enviarContato(contato){
        
        console.log("Tentando enviar uma nova mensagem de contato...");
        console.log(contato);
        
        var msgSucesso = {status : 0, mensagem: "Dados enviados com sucesso"};
        
        //Configurações smtp
        var serverSMTP  = email.server.connect({
            user:    "dicol@outlook.com.br", 
            password:"asdf1233212", 
            host:    "smtp-mail.outlook.com",
            port: 587,
            tls: {ciphers: "SSLv3"}
        });
        
        //Configurações da mensagem
        var mensagem  = {
            text: "Enviada por: " + contato.nome + "\nEmail: " + contato.email + '\nWebsite :' + contato.website + "\nMensagem: " + contato.mensagem, 
            from: "dicol@outlook.com.br",  
            to: "dicol@outlook.com.br",  
            cc:      "",
            subject: contato.assunto
            // attachment: 
            // [
            //     {data:"<html>i <i>hope</i> this works!</html>", alternative:true},
            //     {path:"path/to/file.zip", type:"application/zip", name:"renamed.zip"}
            // ]
        };
        //Enviando para o email
        serverSMTP.send(mensagem, function(err, message) {
            if(err){
                msgSucesso = {status : 1 ,mensagem : 'Problema na conexão, por favor tente novamente mais tarde '}
                console.log(msgSucesso + err);
            }
            
            server.emit("sucesso-contato",msgSucesso);
        });
    });
};