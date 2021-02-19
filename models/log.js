const mongoose = require('mongoose')

const LogSchema = mongoose.Schema({
    title:String,
    value:String
})

module.exports = mongoose.model('log',LogSchema)