const jwt = require('jsonwebtoken')
require('dotenv').config()
module.exports = function (req,res,next){
    const token = req.headers['auth-token']
    if (!token) return res.status(401).send("Access Denied!")
    try {
        const verify = jwt.verify(token,process.env.SECRET_TOKEN)
        req.user = verify
        next()
    } catch (error) {
        res.status(400).send('Invalid token')       
    }
}