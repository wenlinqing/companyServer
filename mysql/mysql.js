var db={}
var mysql=require('mysql')

var user={
	host:'localhost',
	user:'root',
	password:'123456',
	database:'company',
    multipleStatements: true //允许执行多条语句
}


//创建连接
var connection = mysql.createConnection(user);
 // console.log('连接成功')
//查询
db.query = function (sql,params,callback) { 
    connection.query(sql,params, function (err, rows, fields) {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        };
 
        callback(null, rows, fields);
    });
}

module.exports=db;

