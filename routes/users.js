var express = require('express');
var router = express.Router();
const User = require('../models/user')
const { registerValidation , loginValidation } = require('../validation')
/* GET users listing. */




router.get('/', function(req, res, next) {
  res.render('user/register')
});

router.post('/register', async (req,res,next) =>{  
  const {error} = registerValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

 /* var user = new User({
    name:"admin",
    password:"46503888"
  })
  await user.save() */
})
module.exports = router;
