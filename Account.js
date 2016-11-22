var express = require('express');
var mongodb = require('mongodb');
var moment = require('moment');
var app = express();
var bodyParser = require('body-parser')


var uri = 'mongodb://038353256:b05210523@ds023105.mlab.com:23105/db_iremind';
var database;

mongodb.MongoClient.connect(uri, function(err, db) {
	if (err) {
		console.log('connect mongo db error ' + err);
	} else {
		console.log('connect mongo db success');
		database = db;
	}
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



//add from Samue1Wang

app.post('/api/createFirst', function(request, response) {
	console.log(request.body);
	/*if (!request.body.value) {
		__sendErrorResponse(response, 403, 'No query parameters value');
		return;
	}*/


    var account = request.body.account;
	var passwd = request.body.passwd;
	var name = request.body.name;
	var tel = request.body.tel;
	var email = request.body.email;
	//var timeMillis = moment();
	//var time = timeMillis.format('MM/DD hh:mm:ss');
	//var endString
	// var str = request.body.value;
	//var AccountArray = new Array();
	

	var insert = {
		account:account,
		passwd:passwd,
		name:name,
		tel:tel,
		email:email
	};


	
	var items = database.collection('dbforaccount');

	items.insert(insert, function(err, result) {
					if (err) {
						response.type('application/json');
						response.status(200).send({"description": "failed"});
						response.end();
					}else {
						response.type('application/json');
						response.status(200).send({"description": "success"});
						response.end();
					}
				});
	
});

app.post('/api/checkLoginAccount', function(request, response) {
	
	var items = database.collection('dbforaccount');
	var account = request.body.account;
	var password = request.body.password;

	items.find({'account' : account},{'_id' : 0}).toArray(function(err,docs){
		if(err){
			response.type('application/json');
			response.status(200).send({"response": "error"});
			response.end();
		}else if(docs == false){
			response.type('application/json');
			response.status(200).send({"response": "not_find"});
			response.end();
		}else{
			var p = docs[0].passwd;
			if(p == passwd){
				response.type('application/json');
				response.status(200).send({"response": "success"}+docs);
				response.end();
			}else{
				response.type('application/json');
				response.status(200).send({"response": "failed"});
				response.end();
			}
		}
	});

});

//end of Samue1Wang


app.get('/api/queryAccountDataPoint', function(request, response) {
	var items = database.collection('dbforaccount');

	var str = request.query.value;
	var id;
	var passwd;
	var AccountArray = new Array();
	var AccountArray = str.split(",");


	id = AccountArray[0];
	passwd = AccountArray[1];

	var limit = parseInt(request.query.limit, 10) || 100;

	items.find().sort({$natural: -1}).limit(limit).toArray(function (err, docs) {
		if (err) {
			console.log(err);
			__sendErrorResponse(response, 406, err);
		} else {
			var jsArray = new Array();
			var jsArray = docs;
			for(var i = 0; i < jsArray.length; i++){
				var jsObj = Object();
				var jsObj = jsArray[i];
				response.type('application/json');
				if(id == jsObj.account){
					if(passwd == jsObj.passwd){
						response.status(200).send("succeedLogIn");
						response.end();
						break;
					}
					else if(passwd != jsObj.passwd){
						response.status(200).send("WarnPassword");
						response.end();
						break;
					}
				}
				else if(id != jsObj.account && i == jsArray.length -1){
					response.status(200).send("WarnId");
					response.end();
				}

			}

		}
	});
});


app.get('/api/queryTelDataPoint', function(request, response) {
	var items = database.collection('dbforaccount');

	var tel = request.query.tel;

	var limit = parseInt(request.query.limit, 10) || 100;

	items.find().sort({$natural: -1}).limit(limit).toArray(function (err, docs) {
		if (err) {
			console.log(err);
			__sendErrorResponse(response, 406, err);
		} else {
			var jsArray = new Array();
			var jsArray = docs;
			for(var i = 0; i < jsArray.length; i++){
				var jsObj = Object();
				var jsObj = jsArray[i];
				response.type('application/json');
				if(tel == jsObj.tel){
					response.status(200).send("TelExisted" + "," + "username"+":"+  jsObj.name);
					response.end();
					break;
				}
				else if(tel != jsObj.tel && i == jsArray.length -1){
					response.status(200).send("TelUsefully");
					response.end();
				}

			}

		}
	});
});


app.get('/api/queryAccountData', function(request, response) {
	var items = database.collection('dbforaccount');

	var account = request.query.account;

	var limit = parseInt(request.query.limit, 10) || 100;

	items.find().sort({$natural: -1}).limit(limit).toArray(function (err, docs) {
		if (err) {
			console.log(err);
			__sendErrorResponse(response, 406, err);
		} else {
			var jsArray = new Array();
			var jsArray = docs;
			for(var i = 0; i < jsArray.length; i++){
				var jsObj = Object();
				var jsObj = jsArray[i];
				response.type('application/json');
				if(account == jsObj.account){
					response.status(200).send("AccountExisted" + "," + "username"+":"+ jsObj.name);
					response.end();
					break;
				}
				else if(account != jsObj.account && i == jsArray.length -1){
					response.status(200).send("AccountUsefully");
					response.end();
				}

			}

		}
	});
});




app.get('/api/queryAccountInfo', function(request, response) {
	var items = database.collection('dbforaccount');

	var name = request.query.name;

	var limit = parseInt(request.query.limit, 10) || 100;

	items.find().sort({$natural: -1}).limit(limit).toArray(function (err, docs) {
		if (err) {
			console.log(err);
			__sendErrorResponse(response, 406, err);
		} else {
			var jsArray = new Array();
			var jsArray = docs;
			for(var i = 0; i < jsArray.length; i++){
				var jsObj = Object();
				var jsObj = jsArray[i];
				response.type('application/json');
				if(name == jsObj.name){
					response.status(200).send("name"+":"+jsObj.name+","+"tel"+":"+jsObj.tel+","+"account"+":"+jsObj.account+","+"passwd"+":"+jsObj.passwd+","+"email"+":"+jsObj.email);
					response.end();
					break;
				}
				else if(name != jsObj.name && i == jsArray.length -1){
					response.status(200).send("wrong name");
					response.end();
				}

			}
		}
	});
});



app.get('/api/queryDataPoint', function(request, response) {
	var items = database.collection('dbforaccount');

	var limit = parseInt(request.query.limit, 10) || 100;

	items.find().sort({$natural: -1}).limit(limit).toArray(function (err, docs) {
		if (err) {
			console.log(err);
			__sendErrorResponse(response, 406, err);
		} else {
			response.type('application/json');
			response.status(200).send(docs);
			response.end();
		}
	});
});



app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.listen(process.env.PORT || 5000);
console.log('port ' + (process.env.PORT || 5000));

function __sendErrorResponse(response, code, content) {
	var ret = {
		err: code,
		desc : content 
	};
	response.status(code).send(ret);
	response.end();
}
