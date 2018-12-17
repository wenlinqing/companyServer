var express = require('express');
var router = express.Router();
var moment = require('moment');

var db = require('../mysql/mysql.js');


router.get('/getProductList', function(req, res, next) {
	var page=req.query.page||1;
	var pageSize=req.query.pageSize||10;
	
	var sqlAll=`select count(1) as total from cb_product where isEnabled=1`;
	var total = '';
	db.query(sqlAll,(err,rows,fields)=>{
		if (err) {
			console.log(err)
			return res.json({
				code:'500',
				msg:'系统错误'
			})
		}
		// console.log(rows)
		total=rows[0].total;
	})

	var sql=`select * from cb_product where isEnabled=1 order by create_time desc limit `+ (page-1)*pageSize+`,`+pageSize;
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
});













module.exports = router;
