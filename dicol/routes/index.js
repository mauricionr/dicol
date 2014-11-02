
/*
 * GET home page.
 */
 

 
 
exports.index = function(db){
    return function(req, res){
        db.query('SELECT a.*,b.nome,c.descricao FROM `produto` a LEFT JOIN `imagens` b ON b.idProduto = a.idProduto and b.principal = "S"' + 
        'INNER JOIN tipoImovel c on c.idTipoImovel = a.idTipoImovel WHERE a.status="A"',
        function(err, results, fields){
            if(err){
                throw 'Erro ao selecionar produtos! '+ err;
            }
            var produtos = results;
            
            db.query('SELECT * FROM `tipoImovel` WHERE status="a"',
            function(err, results, fields){
                if(err){
                    throw 'Erro ao requisitar imagens! '+ err;
                }
                var imoveis = results;
                
                db.query('SELECT a.titulo, a.slideshow AS flag, b.nome FROM  `produto` a LEFT JOIN `imagens` b ON b.idProduto = a.idProduto WHERE b.slideshow =  "s"',
                function(err, results, fields){
                    if(err){
                        throw 'Erro ao requisitar imagens! '+ err;
                    }
                    var slideshow = results;
                    
                    res.render('index',{
                        title : 'Dicol',
                        produtos : produtos,
                        imoveis : imoveis,
                        slides : slideshow
                    });
                });
            });
        });
    }
};



/*
 * GET contact page.
 */
exports.contact = function(req, res){
    res.render('contact');
};

/*
 * GET aboutus page.
 */
exports.aboutus = function(req, res){
    res.render('aboutus');
};




