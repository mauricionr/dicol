

$('#btnCancelar').on('click', function(event) {
	carregarPagina("/imoveis");
});


var uploadButton  = $('<button/>').addClass('btn btn-primary upload').prop('disabled',true).text('Processando...').on('click',function() {
	var $this = $(this),
	data = $this.data();

	$this.off('click').text('Cancelar').on('click',function() {
		$this.remove();
		data.abort();
	});

	data.submit().always(function() {
		$this.remove();
	});

});

var excluirButton = $('<button/>').addClass('btn btn-primary excluir').prop('disabled',false).text('Excluir').on('click',function() {
	var $this = $(this);
	data = $this.data();

	$this.off('click').text('Excluir').on('click',function() {
		$this.remove();
		data.abort();
	});
});

$('#fileUpload').fileupload({
	url : '/file-upload/<%- produto.idProduto %>',
	dataType: 'json',
	autoUpload: false,
	acceptFileType : /(\.|\/)(gif|jpe?g|png)$/i,
	maxFileSize : 5000000,
	disableImageResize : /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
	previewMaxWidth : 100,
	previewMaxHeigth : 100,
	previewCrop: true}).
on('fileuploadadd',function(e,data) {
	//data.context = $('<div/>').append('#files');
	data.context = $('#files');
	$.each(data.files, function(index,file) {
		var node = $('<p/>').append($('<span/>').text(file.name));
		if(!index) {
			node.append('<br>').append(uploadButton.clone(true).data(data));
			node.append('<br>').append(excluirButton.clone(true).data(data));
		}
		node.appendTo(data.context);
	});
}).
on('fileuploadprocessalways', function(e,data) {
	var index = data.index,
	file = data.files[index],
	node = $(data.context.children()[index]);

	if(file.preview) {
		node.prepend('<br/>').prepend(file.preview);
	}

	if(file.error) {
		node.append('<br>').append($('<span class="text-danger"/>').text(file.error));
	}

	if(index + 1 === data.files.length) {
		data.context.find('.upload').text('Upload').prop('disabled', !!data.files.error);
	}
}).
on('fileuploadprogressall',function(e,data) {
	var progress = parseInt(data.loaded / data.total * 100, 10);
	$('#progress .progress-bar').css('width', progress + '%');
}).on('fileuploaddone', function(e,data) {
	$.each(data.result.files, function(index,file) {
		if(file.url) {
			var link = $('<a>').attr('target','_blank').prop('href',file.url);

			$(data.context.children()[index]).wrap(link);
		} else if(file.error) {
			var error = $('<span class="text-danger"/>').text(file.error);
			$(data.context.children()[index]).append('<br>').append(error);
		}
	});
}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');

//Carregando dados do upload
$('#fileupload').addClass('fileupload-processing');
        $.ajax({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            url: $('#fileupload').fileupload('option', 'url'),
            dataType: 'json',
            context: $('#fileupload')[0]
        }).always(function () {
            $(this).removeClass('fileupload-processing');
        }).done(function (result) {
            $(this).fileupload('option', 'done')
                .call(this, $.Event('done'), {result: result});
        });

//@ sourceURL=upload.js