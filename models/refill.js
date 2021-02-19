const mongoose = require('mongoose')
const RefillSchema = mongoose.Schema({
    time:Number,
    local_time:String,
    title:String,
    volume:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('temp_refill',RefillSchema)