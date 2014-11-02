module.exports = function(app) {
	var DashBoardController = {
		index: function(req, res) {
			var nome = req.session.usuario;
			var idUsuario = req.session.idUsuario;

			console.log(req.session);

			var usuario = [];

			usuario["nome"] = nome;
			usuario["idUsuario"] = idUsuario;

			console.log(usuario);
			res.render('dashboard/index', {usuario : usuario});
		}
	}

		return DashBoardController;
};