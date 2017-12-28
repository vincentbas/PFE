var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';
module.exports = function(router){
  /*---------------------------------*/
  /*-------------ROUTES--------------*/
  /*---------------------------------*/

  //USER REGISTRATION
  router.post('/users', function(req, res){
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == ''){
      res.json({success:false, message:'Ensure that username, password and email are provided'});
    }else{
      user.save(function(err){
        if(err){
          res.json({success:false, message:'Username or Email already exist'});
        }else{
          res.json({success:true, message:'User created'});
        }
      });
    }
  });

  //USER LOGIN
  router.post('/authenticate', function(req, res){
    User.findOne({ username : req.body.username}).select('email username password').exec(function(err,user){
      if(err) throw err;
      if(!user){
        res.json({success:false, message:'Could not authenticate user'});
      }else if(user){
        var validPassword;
        if(req.body.password){
          validPassword = user.comparePassword(req.body.password);
        }else{
          res.json({success:false, message:'No password provided'});
        }
        if(!validPassword){
          res.json({success:false, message:'Wrong password'});
        }else{
          var token = jwt.sign({
            username: user.username,
            email: user.email
          }, secret, { expiresIn: '24h' });
          res.json({success:true, message:'User authenticated', token: token});
        }
      }
    });
  });
  router.use(function(req, res, next){
    var token = req.body.token || req.body.query || req.headers['x-access-token'];
    if (token){
      jwt.verify(token, secret, function(err, decoded){
        if(err){
          res.json({success:false, message:'Token invalid'});
        }else{
          req.decoded = decoded;
          next();
        }
      });
    }else{
      res.json({success:false, message:'No token provided'});
    }
  });
  //USER LOGIN
  router.post('/me', function(req, res){
    res.send(req.decoded);
  });
  return router;
};
