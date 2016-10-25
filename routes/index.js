var express = require('express');
var router = express.Router();
var lanRes=require('../lib/dao/lanRes')
var userDao=require('../lib/dao/userDao')
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user)
  {
     res.render('index', { title: 'Express' });
  }else
  {
      res.render("login",{title:"login"});
  }
});

router.get('/workspace', function(req, res, next) {
    if(req.session &&req.session.user)
    {
        res.render('workspace', { title: 'Express' });
    }else
    {
        res.render("login",{title:"login"})
    }


});

router.get("/logout",function (req,res,next) {
    req.session.user=null;
    req.session.err=null;
    res.redirect("/")
})

router.get("/login",function (req,res,next) {
  res.render("login",{title:"login"});
})

router.post("/login",function (req,res,next) {
  var msg=req.body;
  var pwd=msg.pwd;
  userDao.getUserByUID(msg.uid,function (err,user) {
    if (!err &&(pwd==user.password)) {
      req.session.user = user;
      res.send({code:200,user:{uid:user.id,name:user.name}});
    } else
    {
        req.session.user = null;
        res.send({code:501,user:{}});
    }
   });
})

router.post("/getallan",function (req,res,next) {
  var languages=lanRes.getAllLanRes(function (err,lans) {
    if(err ||! lans)
    {
      res.send([]);
      return
    }
    var msg=req.body;
      var page= parseInt(msg.page);
      var rows=parseInt(msg.rows);

    res.send( {total:lans.length, rows: lans.slice(rows*(page-1),rows*page-1)});
  })
})

router.post("/removelanresbykey",function (req,res,next) {
  var msg=req.body;
  var key=msg.key;
  lanRes.removeLanResByKey(key,function () {
      res.send({code:200});
  })
})

router.post("/updatelanbykey",function (req,res,next) {
  var msg=req.body;
  var data=msg.array;
  lanRes.updateLanResByKey(data,function () {
    res.send({code:200});
  })
})

router.post("/updatelanbyarray",function (req,res,next) {
  var msg=req.body;
  var array=JSON.parse(msg.jsonstr) ;
  lanRes.updateLanResByArrays(array,function () {
    res.send({code:200});
  })
})

router.post("/getlanfile",function (req,res,next) {
  var msg=req.body;
  var type=msg.type || "ch";
  {
    var file={};
    file.name="zh"
    var str="local lang={"+"\n";
    lanRes.getAllLanRes(function (err,arrs) {
      if(!err)
      {
          for(i=0;i<arrs.length;i++)
          {
            str=str+"    [\""+arrs[i].key+"\"]= \""+arrs[i][type]+"\",\n";
          }
          str=str+"}\n";
          str=str+"require("+"\""+ "app.lang.Base"+  "\")";
        res.send({code:200,str:str});
      }
    })
  }
})
router.post("/")
module.exports = router;
