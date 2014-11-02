
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.userlist = function(db,table) {
  return function(req, res){
    db.query('SELECT * FROM '+ table,function(err, results, fields){
        if(err){
            throw 'Erro ao selecionar dados no banco! ' + err;
        }
        res.render('userlist',{resultado : results });
    });
  }
};

/*************** 
* GET contatos 
***************/
exports.contact = function(req, res){
  res.render('contact');
};




    
    
  
