/**
	Classe para exebição de mensagens 
	Tipos de mensagens : error, info e alert
	Apresentação : #messageContainer
	Dependências : jquery , prototype
	@returns mensagem

**/
var Message = Class.create({

	/**
	 * Construtor.
	 * 
	 * @returns {$fn.Message}
	 */
	initialize: function() {
		this.containerId = 'messageContainer';
		this.countId = 0;
	},
	
	/**
	 * Fecha mensagem.
	 */
	close: function() {
		$('#'+this.containerId).html('');
		
		return this;
	},
	
	/**
	 * Exibe mensagens (ou mensagem).
	 * 
	 * @param msg Objeto de mensagem.
	 */
	processMessage: function(msg) {
		this.countId = 0;
		
		if (msg.messages) {
			$('#'+this.containerId).html('');
			for (var i = 0; i < msg.messages.length; i++) {
				console.log("mensagem de erro: " + msg.messages[i]);
				if(msg.messages[i].origemErro != null){
					this.multipleMessage(msg.messages[i]);
				}else{
					this.singleMessage(msg.messages[i], true);
				}
			}
		}
		else {
			this.singleMessage(msg, false);
		}
		
		return this;
	},
	
	/**
	 * Exibe uma unica mensagem.
	 * 
	 * @param msg Objeto de mensagem
	 * @param append false indica que a div de container para mensagens sera sobrescrita e true indica que sera adicionado 
	 * @returns {Message}
	 */
	singleMessage: function(msg, append) {
		this.countId++;
		var messageId = this.containerId + "_" + this.countId;
		
		if (msg.global) {
			var class_div = '';
			
			if (msg.severity == 'ERROR') {
				class_div = 'alert alert-danger';
			} else if (msg.severity == 'WARN') {
				class_div = 'alert alert-warning';
			} else if (msg.severity == 'INFO') {
				class_div = 'alert alert-info';
			} else if (msg.severity == 'SUCCESS') {
				class_div = 'alert alert-success';
			}
			
			if (append) {
				$('<div id="' + messageId + '" class="' + class_div + '" style="display:none"><button type="button" class="close" data-dismiss="alert">&times;</button>'+msg.summary+'</div>').appendTo('#'+this.containerId);
			} else {
				$('#'+this.containerId).html(
					'<div id="' + messageId + '" class="' + class_div + '" style="display:none"><button type="button" class="close" data-dismiss="alert">&times;</button>'+msg.summary+'</div>');
			}
			
			$('#'+messageId).fadeIn();
		} 

		return this;
	},

	/**
	 * Exibe uma várias mensagens.
	 * 
	 * @param msg Objeto de mensagemJSON
	 * @param append false indica que a div de container para mensagens sera sobrescrita e true indica que sera adicionado 
	 * @returns {Message}
	 */
	multipleMessage: function(msg) {

		this.countId++;
		var messageId = this.containerId + "_" + this.countId;
		var class_div = '';
		
		if (msg.severidade == '0' || msg.severidade == '1' || msg.severidade == '') {
			class_div = 'alert alert-danger';
			
			$('#'+this.containerId).html(
				'<div id="' + messageId + '" class="alert alert-block ' +  class_div + ' fade in" style="display:none">' +
					'<button type="button" class="close pull-right" data-dismiss="alert">&times;</button>' +
					'<h3 class="alert-heading">Sistema: '+ msg.sistema +'</h3>' +
					'<h3 class="alert-heading">Mensagens</h3><ul id="listaMsg"></ul>' +
					'<h3 class="alert-heading">Erros</h3>' +
					'<ul>' +
						'<li>Origem do erro: ' + msg.origemErro + '</li>' +
						'<li>Paragráfo do erro: ' + msg.paragrafoErro + '</li>' +
						'<li>Categoria do erro: ' + msg.categoriaErro + '</li>' +
						'<li>Código do erro: ' + msg.codigoErro + '</li>' +
						'<li>Informações Adicionais: ' + msg.informacoesAdicionais + '</li>' +
					'</ul>'+
				'</div>'
			);
							
			$(msg.mensagemErro).each(
				function(key, val) {
					var mark = '<li>' + val + '</li>'; 
					$(mark).appendTo('#listaMsg');
				}
			);

			$(msg.mensagemNegocial).each(
				function(key, val) {
					var markup = '<li>' + val + '</li>';
					$(markup).appendTo('#listaMsg');
				}
			);
		} else if (msg.severidade == '2') {
			class_div = 'alert alert-warning';
			
			$('#'+this.containerId).html(
				'<div id="' + messageId + '" class="' + class_div + '" style="display:none"><button type="button" class="close" data-dismiss="alert">&times;</button>'+msg.mensagemNegocial[0]+'</div>'
			);
		} else if (msg.severidade == '3') {
			class_div = 'alert alert-info';
			
			$('#'+this.containerId).html(
				'<div id="' + messageId + '" class="' + class_div + '" style="display:none"><button type="button" class="close" data-dismiss="alert">&times;</button>'+msg.mensagemNegocial[0]+'</div>'
			);
		} else if (msg.severidade == '4') {
			class_div = 'alert alert-success';
			
			$('#'+this.containerId).html(
				'<div id="' + messageId + '" class="' + class_div + '" style="display:none"><button type="button" class="close" data-dismiss="alert">&times;</button>'+msg.mensagemNegocial[0]+'</div>'
			);
		}
		
		$('#'+messageId).fadeIn();
				
		return this;
	},
	
	/**
	 * Cria mensagem de aviso.
	 * 
	 * @param summary Texto da mensagem
	 * @returns Objeto de mensagem
	 */
	warnMessage: function(summary) {
		var msg = {global:true, severity : "WARN", summary : summary};
		
		return msg;
	},
	
	/**
	 * Cria mensagem de erro.
	 * 
	 * @param summary Texto da mensagem
	 * @returns Objeto de mensagem
	 */
	errorMessage: function (summary) {
		var ret = {global: true, summary: summary, severity: "ERROR"};
		
		return ret;
	},
	
	/**
	 * Cria mensagem de informacao.
	 * 
	 * @param summary Texto da mensagem
	 * @returns Objeto de mensagem
	 */
	infoMessage: function (summary) {
		var ret = {global: true, summary: summary, severity: "INFO"};
		
		return ret;
	},
	
	/**
	 * Cria mensagem de sucesso.
	 * 
	 * @param summary Texto da mensagem
	 * @returns Objeto de mensagem
	 */
	successMessage: function (summary) {
		var ret = {global: true, summary: summary, severity: "SUCCESS"};
		
		return ret;
	},
	
	/**
		 * Cria animaçao com fade para fechar a mensagem.
		 * @params id , timout
	**/
	fadeAnimationClose: function fadeAnimationClose(id,timeout){
	    var that = this;
	    setTimeout(function(){
            $('#' + id).fadeOut(function(){
                that.processMessage(that.close());
            });
		},timeout);
	},
	/**
	 * Fechar mensagem com fadeOut
	**/
	fadeClose: function fadeClose(id){
	    var that = this;
	    $('#' + id).fadeOut(function(){
                that.processMessage(that.close());
        });
	}
	

});



//@ sourceURL=mensagens.js