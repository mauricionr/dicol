function carregarPagina(caminho) {
	$.get("" + caminho, function(data) {
		$('#page-wrapper').html(data)
	});
}

$("#btnImoveis").on('click', function(event) {
	carregarPagina('/imoveis');
	event.preventDefault();

});


$('#btnTipoImovel').on('click', function(event) {
	carregarPagina('/tipoImovel');
	event.preventDefault();
});

$('#btnUsuario').on('click', function(event) {
	carregarPagina('/usuario');
	event.preventDefault();
});

$('#alterarImovel').on('click', function(event) {
    var id = event.currentTarget.data('id');
    console.log(id);
	carregarPagina('/imovel/editar/'+ id);
	event.preventDefault();
});




function somenteNumero(event) {
	var tecla=(window.event)?event.keyCode:e.which;
	if( (tecla > 43 == tecla < 59) || tecla == 40 || tecla == 41 || tecla == 8 )
		return true; 
	else 
		return false;
}

function validarFormulario(formulario) {
	$('#' + formulario + ' [required]:valid').removeClass('error');
	var tamanho = $('#' + formulario + ' [required]:invalid:enabled').length;
	if(tamanho > 0) {
		$('#' + formulario + ' [required]:invalid:enabled').addClass('error');
		return false;
	} 

	return true;
}

//@ sourceURL=script.js