const jsonwebtoken = require('jsonwebtoken')
require('dotenv').config()
module.exports = function (req,res,next){
    const token = req.cookies['auth-token']
    if (!token)  res.redirect('/users/login')
    try {
        var verify = jsonwebtoken.verify(token,process.env.SECRET_TOKEN)
        if (verify.exp < (Math.floor(Date.now() / 1000))) res.redirect('/users/login')
        verify.exp = Math.floor(Date.now() / 1000 ) + (60 *10 ) // expired within 10 minutes
        const newtoken = jsonwebtoken.sign(verify,process.env.SECRET_TOKEN)
        res.cookie('auth-token',newtoken)
        req.user = verify
        next()
    } catch (error) {
        console.log('error token verify')
        res.redirect('/users/login')      
    }
}