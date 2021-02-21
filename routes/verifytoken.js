const jwt = require('jsonwebtoken')
require('dotenv').config()
module.exports = function (req,res,next){
    const token = req.cookies['auth-token']
    if (!token) return res.redirect('/users/login')
    try {
        const verify = jwt.verify(token,process.env.SECRET_TOKEN)
        req.user = verify
        next()
    } catch (error) {
        res.redirect('/users/login')      
    }
}