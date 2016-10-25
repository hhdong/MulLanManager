var mysql = require('./mysql/mysql');
var lanRes = module.exports;

/**
 * Get userInfo by username
 * @param {String} username
 * @param {function} cb
 */
lanRes.getAllLanRes = function (cb){
    var sql = 'select * from  LanRes';
    var args = [];
    mysql.query(sql,args,function(err, res){
        if(err !== null){
            cb(err.message, null);
        } else {
            if (!!res) {
                var arrs=new Array();
                for(var i=0;i<res.length;i++)
                {
                    var rs = res[i];
                    var lan = {key: rs.key, ch: rs.ch, en: rs.en};
                    arrs.push(lan)
                }

                cb(null, arrs);
            } else {
                cb('err query lan ', null);
            }
        }
    });
};

lanRes.removeLanResByKey=function(key,cb)
{
    var sql = 'delete from LanRes where LanRes.key=?';
    var args = [key];
    mysql.query(sql,args,function(err, res){
        if(err !== null){
            cb(err.message, null);
        } else {
           cb(null,null)
        }
    });
}


lanRes.getLanResByKey=function(key,cb)
{
    var sql = 'select * from  LanRes where LanRes.key=?';
    var args = [key];
    mysql.query(sql,args,function(err, res){
        if(err !== null){
            cb(err.message, null);
        } else {
            if (!!res) {
               if(res.length==1)
               {
                   var rs=res[0]
                   cb(null,{key: rs.key, ch: rs.ch, en: rs.en});
               }
               else {
                   cb(null,null)
               }


            } else {
                cb('err query lan ', null);
            }
        }
    });
}

lanRes.updateLanResByKey=function(data,cb)
{
    var res=data;
    lanRes.getLanResByKey(data.key,function (err,data) {

        if((!err) && data)
        {
            var sql = ' update LanRes set en=?,ch=? where LanRes.key=?';
            var args = [res.en,res.ch,data.key];
            mysql.query(sql,args,function(err, res){
                if(err !== null){
                    cb(err.message, null);
                } else {
                    cb(null,null)
                }
            });
        }else if((!err)&(!data)) {
            var sql = ' insert into  LanRes values (?,?,?)';
            var args = [res.key,res.en,res.ch];
            mysql.query(sql,args,function(err, res){
                if(err !== null){
                    cb(err.message, null);
                } else {
                   cb(null,null)
                }
            });
        }
    })
}


function  updateStack(array,index,cb) {
    var length=array.length;
    lanRes.updateLanResByKey(array[index],function () {
        index=index+1;
        if(index<length)
        {
            updateStack(array,index,cb)
        }
        else {
            if(cb)
            {
                cb();
            }


        }

    })
}
lanRes.updateLanResByArrays=function(array,cb)
{
    var index=0;
    var pre=-1;
    var bexit=false;
    var length=array.length
    updateStack(array,0,function () {
        cb(null,null);
    })



}


