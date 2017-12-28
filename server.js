var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');

var port = process.env.PORT || 9000;

/*---------------------------------*/
/*-----------MIDDLEWARES-----------*/
/*---------------------------------*/
app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);

mongoose.connect('mongodb://localhost:27017/missiongate', function(err){
  if (err){
    console.log('Not connected to the database: ' + err);
  }else{
    console.log('Successfully connected to the database');
  }
});

app.get('*',function(req,res){
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function(){
  console.log("Server listening on port: " + port);
});
