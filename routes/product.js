var express = require('express');
var router = express.Router();
var moment = require('moment');

var db = require('../mysql/mysql.js');


router.post('/getProductList', function(req, res, next) {
	var page=req.body.page||1;
	var pageSize=req.body.pageSize||10;
	var title=req.body.title;
	
	var sqlAll=`select count(1) as total from cb_product`;
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

	var sql=`select * from cb_product order by create_time desc limit `+ (page-1)*pageSize+`,`+pageSize;
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

// 添加商品
router.post('/add',(req,res,next)=>{
	var product_id=(moment().format('YYYYMMDD')).toString() + Date.now().toString().substr(0,10)
	var sql=`insert into cb_product(product_id,product_name,product_quantity
	,price,market_price,keywords,product_image,product_weight,new_flag,promote_flag,
	promote_price,promote_start_time,promote_end_time,isEnabled,create_time,update_time,content) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
	db.query(sql,[
			product_id,
		    req.body.product_name,
	        req.body.product_quantity,
	        req.body.price,
	        req.body.market_price,
	        req.body.keywords,
	        req.body.product_image,
	        req.body.product_weight,
	        req.body.new_flag,
	        req.body.promote_flag,
	        req.body.promote_price,
	        req.body.promote_start_time||null,
	        req.body.promote_end_time||null,
	        1,
	        moment().format('YYYY-MM-DD HH:mm:ss'),
	        moment().format('YYYY-MM-DD HH:mm:ss'),
	        req.body.content,
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


// 上下架
router.post('/enabledProduct',(req,res,next)=>{
	var sql=`update cb_product set isEnabled=?,update_time=? where product_id=`+req.body.product_id;
	db.query(sql,[
		    req.body.isEnabled,
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

// 修改库存
router.post('/editQuantity',(req,res,next)=>{
	var sql=`update cb_product set product_quantity=?,update_time=? where product_id=`+req.body.product_id;
	db.query(sql,[
		    req.body.product_quantity,
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

// 删除产品
router.post('/delete',(req,res,next)=>{
	var sql=`delete from cb_product where product_id in (`+req.body.product_id+`)`;
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



module.exports = router;
