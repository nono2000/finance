var express = require('express'),
 mongoose = require('mongoose'),
 app = express(),
 port = 8000,
 Finance = require('./collection');
 
mongoose.connect('mongodb://localhost:27017/finance');

app.configure(function(){
	app.use(express.bodyParser());
	app.use(app.router);
	app.use("/", express.static(__dirname));
});

app.get('/finance',function(req,res){
	res.sendfile(__dirname + '/index.html');
});

app.get('/getdata',function(req,res)
	{
Finance.find(function(err, moneys){
	if(err){
	 res.send(err);
	}
	res.send(moneys);
	});
});

app.post('/new',function(req,res)
{
	Finance.create(req.body, function(err, money){
		if(err){
			res.send(err);
			}
		res.send(money);			
		});
	});

app.listen(port);