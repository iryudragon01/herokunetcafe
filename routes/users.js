var express = require('express');
var router = express.Router();
const User = require('../models/user')
const { registerValidation , loginValidation } = require('../validation')
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken')
require('dotenv').config()
/* GET users listing. */




router.get('/', function(req, res, next) {
  res.render('user/index')
});
router.get('/login', (req,res) =>{
  res.render('user/login')
})
//Create new User
router.post('/register', async (req,res,next) =>{  
  console.log('hello')
  //Validation
  const {error} = registerValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  //check if user is already in database
  const emailExist = await User.findOne({email:req.body.email})
  if (emailExist) return res.status(400).send('Email is already exist')

  //Hash passwords
  const salt = await bcryptjs.genSalt(10)
  const hashedPassword = await bcryptjs.hash(req.body.password,salt)
  //create new User
 var user = new User({
    name:req.body.name,
    email:req.body.email,
    password:hashedPassword,
    role:'member'
  })
  await user.save() 
  .then(result =>{
    res.send(result)
  })
  .catch(err =>{
    res.send(err)
  })
})


// Login
router.post('/login',async (req,res)=>{
  // Validation
  const { error} = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // checking if Email exist
  const user = await User.findOne({email:req.body.email})
  if( !user) return res.send(`email or password do not correct`)
  // password is correct
  const validPass = await bcryptjs.compare(req.body.password,user.password)
  if ( !validPass) return res.status(400).send('email or password do not correct')
  //create and assign token
  const token = jsonwebtoken.sign({_id:user._id,name:user.name,role:user.role},process.env.SECRET_TOKEN)
  res.cookie('auth-token',token)
  res.redirect('/account')

})
module.exports = router;
