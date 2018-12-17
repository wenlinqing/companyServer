var express = require('express');
var router = express.Router();
var moment = require('moment');

const pathLib=require('path');
const fs=require('fs');

var db = require('../mysql/mysql.js');


router.post('/api/login',(req,res,next)=>{
	
	console.log(req.body.loginObj.openid)
	// res.json({
	// 	code:'200',
	// 	msg:'ok'
	// })
	// return;
	var sql=`select * from cb_user where open_id=?`;
	db.query(sql,req.body.loginObj.openid,(err,rows,fields)=>{
		if (err) {
			console.log(err)
			return res.json({
				code:'500',
				msg:'系统错误'
			})
			
		}
		if (rows.length!=0) {
			res.json({
				code:'200',
				data:{
					nickName:rows[0].nick_name,
					headePic:rows[0].head_pic,
				},
				msg:'ok'
			})
		}else{
			var iddd=(moment().format('YYYYMMDDHHmm')).toString() + ( Number(Math.random().toString().substr(3,12)) + Date.now() ).toString()
			var sql=`insert into cb_user(user_id,user_name,user_sex,open_id,nick_name,head_pic,create_time) values(?,?,?,?,?,?,?,?)`;
			db.query(sql,[
					iddd,
					req.body.loginObj.nickName,
					req.body.loginObj.gender,
					req.body.loginObj.openid,
				    req.body.loginObj.nickName,
			        req.body.loginObj.avatarUrl,
			        moment().format('YYYY-MM-DD HH:mm:ss'),
		      	],(err,rows,fields)=>{
				if (err) {
					console.log(err)
					return res.json({
						code:'500',
						msg:'系统错误'
					})
				}

				res.json({
					code:'200',
					data:{
						nickName:req.body.loginObj.nickName,
						headePic:req.body.loginObj.avatarUrl,
					},
					msg:'ok'
				})
			})
		}
	})
})



router.get('/api/administrators',(req,res,next)=>{
	var sql=`select * from cb_admin`;
	db.query(sql,(err,rows,fields)=>{
		if (err) {
			console.log(err)
			return res.json({
				code:'500',
				msg:'系统错误'
			})
			
		}
		// console.log('查询成功')
		// console.log(rows)
		/*res.status(200).send({
			code:'200',
			list:rows,
			msg:'ok'
		}).end();*/

		res.json({
			code:'200',
			list:rows,
			msg:'ok'
		})
	})
})

router.get('/api/queryAdmin',(req,res,next)=>{
	var userName = req.query.userName;
	var password = req.query.password;
	var sql=`select * from cb_admin where admin_name=?`;

	db.query(sql,userName,(err,rows,fields)=>{
		if (err) {
			console.log(err)
			return res.json({
				code:'500',
				msg:'系统错误'
			})
		}
		if (rows.length==0) {
			return res.json({
				code:'444',
				msg:'账号不存在'
			})
		}
		if (rows.length!=0 && rows[0].admin_password!=password) {
			return res.json({
				code:'444',
				msg:'账号或密码错误'
			})
		}
		res.json({
			code:'200',
			admin:rows[0].admin_name,
			msg:'ok'
		})
	})
})


router.post('/api/getArticleList',(req,res,next)=>{
	var page=req.body.page||1;
	var pageSize=req.body.pageSize||10;
	var title=req.body.title;

	var sqlAll=`select count(1) as total from cb_article`;
	var total = '';
	db.query(sqlAll,(err,rows,fields)=>{
		if (err) {
			console.log(err)
			return res.json({
				code:'500',
				msg:'系统错误'
			})
		}
		console.log(rows)
		total=rows[0].total;
	})

	var sql=`select * from cb_article order by create_time desc limit `+ (page-1)*pageSize+`,`+pageSize;
	db.query(sql,(err,rows,fields)=>{
		if (err) {
			console.log(err)
			return res.json({
				code:'500',
				msg:'系统错误'
			})
		}

		res.json({
			code:'200',
			page:page,
			pageSize:pageSize,
			totals:total,
			list:rows,
			msg:'ok'
		})
	})
})


router.post('/api/editArticle',(req,res,next)=>{
	var sql=`update cb_article set title=?,content=?,modify_time=? where id=`+req.body.id;
	db.query(sql,[
		    req.body.title,
	        req.body.content,
	        moment().format('YYYY-MM-DD HH:mm:ss'),
      	],(err,rows,fields)=>{
		if (err) {
			console.log(err)
			return res.json({
				code:'500',
				msg:'系统错误'
			})
		}

		res.json({
			code:'200',
			msg:'ok'
		})
	})
})

router.post('/api/addArticle',(req,res,next)=>{
	var sql=`insert into cb_article(title,content,isEnabled,hits,create_time,modify_time) values(?,?,?,?,?,?)`;
	db.query(sql,[
		    req.body.title,
	        req.body.content,
	        1,
	        0,
	        moment().format('YYYY-MM-DD HH:mm:ss'),
	        moment().format('YYYY-MM-DD HH:mm:ss')
      	],(err,rows,fields)=>{
		if (err) {
			console.log(err)
			return res.json({
				code:'500',
				msg:'系统错误'
			})
		}

		res.json({
			code:'200',
			msg:'ok'
		})
	})
})

router.post('/api/deleteArticle',(req,res,next)=>{
	var sql=`delete from cb_article where id in (`+req.body.id+`)`;
	db.query(sql,(err,rows,fields)=>{
		if (err) {
			console.log(err)
			return res.json({
				code:'500',
				msg:'系统错误'
			})
		}

		res.json({
			code:'200',
			msg:'ok'
		})
	})
})

router.post('/api/enabledArticle',(req,res,next)=>{
	var sql=`update cb_article set isEnabled=?,modify_time=? where id=`+req.body.id;
	db.query(sql,[
		    req.body.isEnabled,
	        moment().format('YYYY-MM-DD HH:mm:ss'),
      	],(err,rows,fields)=>{
		if (err) {
			console.log(err)
			return res.json({
				code:'500',
				msg:'系统错误'
			})
		}

		res.json({
			code:'200',
			msg:'ok'
		})
	})
})


router.post('/api/upLoads',(req,res,next)=>{

  var newFileName=null;
    if (req.files[0]) {
      var ext=pathLib.parse(req.files[0].originalname).ext;
      var oldPath=req.files[0].path;
      var newPath=req.files[0].path+ext;
      newFileName=req.files[0].filename+ext;
    }
  // console.log('newFileName',newFileName)
  // console.log(req.files.length)
  // console.log('jjjjjjjj')

  fs.rename(oldPath, newPath, function (err) {
        if(err) {
            res.json({
        code:'400',
        msg:'上传失败'
      })
        }else{
            res.json({
        code:'200',
        newFileName:newFileName,
        msg:'ok'
      })
        }
    })

  
})



router.get('/api/getProvince',(req,res,next)=>{

	var sql=`select * from cb_area where level=1`;
	db.query(sql,(err,rows,fields)=>{
		if (err) {
			console.log(err)
			return res.json({
				code:'500',
				msg:'系统错误'
			})
		}

		res.json({
			code:'200',
			list:rows,
			msg:'ok'
		})
	})
})


router.get('/api/getCity',(req,res,next)=>{
	var parent_code=req.query.parent_code;

	var sql=`select * from cb_area where level=2 and parent_code=`+parent_code;
	db.query(sql,(err,rows,fields)=>{
		if (err) {
			console.log(err)
			return res.json({
				code:'500',
				msg:'系统错误'
			})
		}

		res.json({
			code:'200',
			list:rows,
			msg:'ok'
		})
	})
})

router.get('/api/getArea',(req,res,next)=>{
	var parent_code=req.query.parent_code;

	var sql=`select * from cb_area where level=3 and parent_code=`+parent_code;
	db.query(sql,(err,rows,fields)=>{
		if (err) {
			console.log(err)
			return res.json({
				code:'500',
				msg:'系统错误'
			})
		}

		res.json({
			code:'200',
			list:rows,
			msg:'ok'
		})
	})
})





module.exports = router;
