var mysql = require('./mysql/mysql');
var userDao = module.exports;

/**
 * Get userInfo by username
 * @param {String} username
 * @param {function} cb
 */
userDao.getUserByUID = function (uid, cb){
  var sql = 'select * from  User where id = ?';
  var args = [uid];
  mysql.query(sql,args,function(err, res){
    if(err !== null){
      cb(err.message, null);
    } else {
      if (!!res && res.length === 1) {
        var rs = res[0];
        var user = {id: rs.id, name: rs.name, password: rs.password};
        cb(null, user);
      } else {
        cb(' user not exist ', null);
      }
    }
  });
};


