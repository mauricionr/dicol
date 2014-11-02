
var $fn = $fn || {};
$fn.dicol = $fn.dicol || {};
$fn.dicol.message = $fn.message || new Message(); 
// Recuperando cliente (socket)
$fn.dicol.client = io.connect("http://www.dicol.com.br");
$fn.dicol.tipoPropriedade = "";
$fn.dicol.isHome = true;
$fn.dicol.isMobile = false;


$(document).ready(function(){
    getHomePage();
    getContato();
    getQuemSomos();
    getConstrucao();
    getProdutos();
    selecionaPropriedade();
    search();
    comboSearch();

    
});

/**
 * Função que formata um valor com a mascara de moeda no formato 999.999.999,99.
 * 
 * @param valor
 *            a ser formatado
 * @returns {String} valor mascarado
 * @see http://forum.imasters.com.br/topic/244057-mscara-moeda-com-expresso-regular/
 * @since 23/07/2013
 */
 
function mascararMoeda(valor) {
	var valorStr = new String(parseFloat(valor).toFixed(2));
	valorStr = valorStr.replace(/\D/g, "");
	valorStr = valorStr.replace(/[0-9]{19}/, "inválido");
	valorStr = valorStr.replace(/(\d{1})(\d{17})$/, "$1.$2");
	valorStr = valorStr.replace(/(\d{1})(\d{14})$/, "$1.$2");
	valorStr = valorStr.replace(/(\d{1})(\d{11})$/, "$1.$2");
	valorStr = valorStr.replace(/(\d{1})(\d{8})$/, "$1.$2");
	valorStr = valorStr.replace(/(\d{1})(\d{5})$/, "$1.$2");
	valorStr = valorStr.replace(/(\d{1})(\d{1,2})$/, "$1,$2");
	return valorStr;
}



/****************************************************
* Função responsável por selecionar a propriedade   *
* no meu principal
* @since 10/04/2014
*****************************************************/
function selecionaPropriedade(){
    $('.propriedades').click(function(e){
        $fn.dicol.tipoPropriedade = $('#' + e.target.id).data('codigo');
        
        if(!$fn.dicol.isHome){
            $fn.dicol.goHome();
            return;
        }
        getProdutos();
        search();
        comboSearch();
        $fn.dicol.scrollDown('body',1421);
        e.preventDefault();
    });
}

/****************************************************
* Função responsável por rolar a página para baixo
* @params #idAlvo, Altura
* @since 10/04/2014
*****************************************************/
$fn.dicol.scrollDown = function scrollDown(idAlvo,altura){
    $('body').animate({
    	scrollTop : $(idAlvo).height() - altura
	}, 1350);
};

/*****************************************
 * Carrega páginas
 * @params URL : o caminho do arquivo; 
 *         callback : função de retorno;
 * @since 23/04/2014
 *****************************************/
$fn.dicol.load = function carregarPagina(URL,callback){
    $.get(URL,callback).error(function loadError(e){
        $fn.dicol.message.processMessage($fn.dicol.message.errorMessage('Problema na conexão, por favor tente novamente mais tarde'));
    });
};

/*****************************************************************
 * Adiciona um efeito de transição entre os conteúdos.
 * @params seletor : STRING id,class
 *         dados : DATA
 * returns esconde seletor a esquerda e carrega denovo por cima.
 * @since 28/04/2014
 *****************************************************************/
$fn.dicol.transicaoConteudo = function hideLefShowUp(seletor,dados){
    $(seletor).fadeIn().html(dados);
}   

/******************************
 * Recupera página "quem somos"
 * @since 24/05/2014
 *****************************/
function getQuemSomos(){
   $("#quemsomos").on('click',function(e){
       var callback = function(data,status){
           if($('#slider-home').is(":visible")){
                $('#slider-home').hide( "slide", { direction: "left"});
           }
           $('#logo').hide();
           $fn.dicol.transicaoConteudo('.main-content',data);
           $('#ascrail2000-hr').hide( );
           $fn.dicol.isMobile ? 
           $('#logo').show('slide', { direction: 'up', easing: 'easeOutBounce' }, 2000) : 
           $('.fachada').show('slide', { direction: 'up', easing: 'easeOutBounce' }, 2000);
           $fn.dicol.isHome = false;
        };
        $fn.dicol.load('/aboutus',callback); 
        e.preventDefault();
    });
}

/******************************
 * Recupera página "contatos"
 * @since 24/05/2014
 *****************************/
function getContato(){
    $(".contato").on('click',function(e){
       var callback = function(data,status){
            if($('#slider-home').is(":visible")){
                $('#slider-home').hide( "slide", { direction: "left"});
           }
           $('#logo').hide();
           $fn.dicol.transicaoConteudo('.main-content',data);
           $('#ascrail2000-hr').hide( );
           $fn.dicol.isMobile ? 
           $('#logo').show('slide', { direction: 'up', easing: 'easeOutBounce' }, 2000) : 
           $('.fachada').show('slide', { direction: 'up', easing: 'easeOutBounce' }, 2000);
           $fn.dicol.isHome = false;
        };
        $fn.dicol.load('contact',callback);
        e.preventDefault();
    });
}

/******************************
 * Recupera página "em construção"
 * @since 01/05/2014
 *****************************/
function getConstrucao(){
    $("#construcao").click(function(e){
        $('#logo').show('slide', { direction: 'up', easing: 'easeOutBounce' }, 2000);
  
        $('.main-content').html('<center><div id="emconstrucao" style="height:400px;font-size:16px;margin-top:20px;">Não foi encontrado nenhum imóvel em construção!</div></center>');
        $('.main-content').animate({
    	    scrollTop : $('.main-content').height() - 1000
	    }, 1350);
	    $fn.dicol.isHome = false;
         e.preventDefault();
    });
}

/******************************
 * Recupera página "home"
 * @since 01/05/2014
 *****************************/
function getHomePage(){
 $(".home").on('click',function(e){
      var callback = function(data,status){
            $('#slider-home').show( "slide", { direction: "left"});
            $('.main-content').html($(data).filter('.main-content'));
            $('#ascrail2000-hr').hide( );
            $('#logo').show('slide', { direction: 'up', easing: 'easeOutBounce' }, 2000);
            getProdutos();
            selecionaPropriedade();
            search();
            comboSearch();
            tabberAutomatic(); 
            $fn.dicol.isHome = true;
            document.title = 'Dicol';
            $('a[title="Para Alugar"]').hide();
        };
        $fn.dicol.load('/',callback); 
        e.preventDefault();
    });
}

$fn.dicol.goHome = function goHome(){
    var callback = function(data,status){
        $('#slider-home').show( "slide", { direction: "left"});e.target.value;
        $('.main-content').html($(data).filter('.main-content'));
        $('#ascrail2000-hr').hide( );
        $('#logo').show('slide', { direction: 'up', easing: 'easeOutBounce' }, 2000);
        $fn.dicol.isHome = true;
        getProdutos();
        selecionaPropriedade();
        search();
        comboSearch();
        tabberAutomatic(); 
    };
    $fn.dicol.load('/',callback); 
};

function getProdutos(){
    $(".produtos").off('click').on('click',function(e){
       var id = $(e.target).closest('li').data('codigo'); 
       var callback = function(data,status){
            if($('#slider-home').is(":visible")){
                $('#slider-home').hide( "slide", { direction: "left"});
           }
           $('.main-content').html(data);
           $('#ascrail2000-hr').hide();
           $fn.dicol.isHome = false;
           
           (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v2.0";
            fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        };
        $fn.dicol.load('/imovel/view/' + id,callback);
        e.preventDefault();
    });
}

function search(){
    $('.keywordfind').on('keyup',function(e) {
       var name = e.target.value;
       
       if(!name){
           return false;
       }
        $.get('/' + name,function(data){
            $('.products').html(data);
        }).error(function() {
            console.log('erro!');
        });
        e.preventDefault();
    });
}

function comboSearch(){
    $('.comboSearchProp').on('change',function(e) {
       var id = e.target.value;
       
       if(!id){
           return false;
       }
        $.get('/tipo/' + id,function(data){
            $('.products').html(data);
        }).error(function() {
            console.log('erro!');
        });
        e.preventDefault();
    });
    
    $('.comboSearchQuartos').on('change',function(e) {
       var id = e.target.value;
       
       if(!id){
           return false;
       }
        $.get('/quartos/' + id,function(data){
            $('.products').html(data);
        }).error(function() {
            console.log('erro!');
        });
        e.preventDefault();
    });
    
    $('.comboSearchComodos').on('change',function(e) {
       var id = e.target.value;
       
       if(!id){
           return false;
       }
        $.get('/comodos/' + id,function(data){
            $('.products').html(data);
        }).error(function() {
            console.log('erro!');
        });
        e.preventDefault();
    });
    
     $('.tipo').on('click',function(e) {
       var id = $('#' + e.target.id).data('id'); 
       
       if(!id){
           return false;
       }
        $.get('/tipo/' + id,function(data){
            $('.products').html(data);
        }).error(function() {
            console.log('erro!');
        });
        e.preventDefault();
    });
}

function changeMobileMenu(){
    $('#tinynav1').change(function(e) {
        var view = e.target.value;

        switch (view) {
            
            case '#':
                $('.home').trigger('click');
                break;
                
            case '#quemsomos' : 
                $('#quemsomos').trigger('click');
                $('#logo').show('slide', { direction: 'up', easing: 'easeOutBounce' }, 2000);
                break;
                
            case '#contato' : 
                $('.contato').trigger('click');
                $('#logo').show('slide', { direction: 'up', easing: 'easeOutBounce' }, 2000);
                break;
            
            case '#emconstrucao' : 
                $('#construcao').trigger('click');
                break;
        }
        e.preventDefault();
    })
}


window.onresize = function (){
    var w = $(window).width();
    
    if(w <= 750){
        $fn.dicol.isMobile = true;
        changeMobileMenu();
    }else{
        $fn.dicol.isMobile = false;
    }
}










//@ sourceURL = dicolCommon.js