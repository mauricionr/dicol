// Arquivo para tratamento do arquivo contact.ejs

$(document).ready(function Contato(){
    
    /**************************************************
    * Recupera os dados do contato e envia via socket *
    * para o servidor.                                *
    * @since 15/04/2014                               *
    **************************************************/
    $('#contact-form').submit(function getDadosContato(e){
        var nome = $('input[name=nomeContato]').val();
        var email = $('input[name=emailContato]').val();
        var website = $('input[name=websiteContato]').val();
        var assunto = $('input[name=assuntoContato]').val();
        var mensagem = $('textarea[name=mensagemContato]').val();
    
        var contato = {
            'nome' : nome,
            'email' : email,
            'website' : website,
            'assunto' : assunto,
            'mensagem' : mensagem
        };
        $fn.dicol.client.emit("mensagem-contato",contato);
        
        $fn.dicol.client.on("sucesso-contato",function(data){
            
            $fn.dicol.message.containerId = 'mensagemContainerContatos';
            
            if(data.status == 0){
                $fn.dicol.message.processMessage($fn.dicol.message.successMessage(data.mensagem));
                return true;
            }
            $fn.dicol.message.processMessage($fn.dicol.message.errorMessage(data.mensagem));
         });
        e.preventDefault();
    });
    
});
// sourceURL = contact.js
