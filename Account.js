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



//start

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
			response.status(200).send([{'response' : 'error'}]);
			response.end();
		}else if(docs == false){
			response.type('application/json');
			response.status(200).send([{'response': 'not_find'}]);
			response.end();
		}else{
			var p = docs[0].passwd;
			if(p == password){
				response.type('application/json');
				response.status(200).send(
					[
						{
							'response' : 'success',
						},
						{
							'account' : docs[0].account,
							'name' : docs[0].name,
							'number' : docs[0].tel,
							'email' : docs[0].email
						}
					]
				);
				response.end();
			}else{
				response.type('application/json');
				response.status(200).send([{'response' : 'failed'}]);
				response.end();
			}
		}
	});

});


app.post('/api/saveMyFavoriteRoute', function(request, response) {
	var items = database.collection('myFavoriteRoutes');
	var title = request.body.title;
	var account = request.body.account;

	var modeAry = new Array();
	var mode = request.body.mode;
	modeAry = mode.split(',');

	var nameAry = new Array();
	var name = request.body.busname;
	nameAry = name.split(',');

	var numAry = new Array();
	var num = request.body.busnum;
	numAry = num.split(',');

	var a_stopAry = new Array();
	var a_stop = request.body.a_stop
	a_stopAry = a_stop.split(',');

	var a_latAry = new Array();
	var a_lat = request.body.a_lat;
	a_latAry = a_lat.split(',');

	var a_lngAry = new Array();
	var a_lng = request.body.a_lng;
	a_lngAry = a_lng.split(',');

	var d_stopAry = new Array();
	var d_stop = request.body.d_stop;
	d_stopAry = d_stop.split(',');

	var d_latAry = new Array();
	var d_lat = request.body.d_lat;
	d_latAry = d_lat.split(',');

	var d_lngAry = new Array();
	var d_lng = request.body.d_lng;
	d_lngAry = d_lng.split(',');

	var instructionsAry = new Array();
	var instructions = request.body.instructions;
	instructionsAry = instructions.split(',');

	console.log(nameAry);
	console.log(a_lat);
	console.log(instructionsAry);


	var insert = {
		'account' : request.body.account,
		'title' : request.body.title,
		'mode_ary' : modeAry,
		'bus_inf' : {
			'name_ary' : nameAry,
			'num_ary' : numAry,
			'arrival_stop' : a_stopAry,
			'arrival_stop_location' : {
				'lat' : a_latAry,
				'lng' : a_lngAry
			},
			'departure_stop' : d_stopAry,
			'departure_stop_location' : {
				'lat' : d_latAry,
				'lng' : d_lngAry
			}
		},
		'instructions' : instructionsAry,
		'polyline' : request.body.polyline,
		'departure_time' : request.body.d_time,
		'arrival_time' : request.body.a_time,
		'distance' : request.body.distance,
		'duration' : request.body.duration
	};


	items.find({'account' : account}).toArray(function(err,docs){
		if(err){
			response.type('application/json');
			response.status(200).send({'response' : 'failed'});
			response.end;
		}else{
			if(docs != false){
				var res = new Array();
				res = docs[0];
				var used = false;
				for(var i =0; i < res.length; i++){
					var t = res[i].title;
					if( t == request.body.title){
						used = true;
						break;
					}
				}
				if(used){
					response.type('application/json');
					response.status(200).send({'response' : 'used'});
					response.end;
				}else{
					items.insert(insert, function(err, result){
						if(err){
							response.type('application/json');
							response.status(200).send({'response' : 'failed'});
							response.end;
						}else{
							response.type('application/json');
							response.status(200).send({'response' : 'success'});
							response.end;
						}
					});
				}
			}else{
				items.insert(insert, function(err, result){
						if(err){
							response.type('application/json');
							response.status(200).send({'response' : 'failed'});
							response.end;
						}else{
							response.type('application/json');
							response.status(200).send({'response' : 'success'});
							response.end;
						}
					});
			}
		}
	});
});

app.get('/api/getMyFavoriteRoute', function(request, response) {
	var items = database.collection('myFavoriteRoutes');
	var account = request.query.account;

	items.find({'account' : account},{'_id' : 0}).toArray(function(err,docs){
		if(err){
			response.type('application/json');
			response.status(200).send([{'response' : 'err'}]);
			response.end;
		}else{
			if(docs == false){
				response.type('application/json');
				response.status(200).send([{'response' : 'not_find'}]);
				response.end;
			}else{
				response.type('application/json');
				response.status(200).send(docs);
				response.end;
			}
		}
	});
});

//end


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
