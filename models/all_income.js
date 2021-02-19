const mongoose = require('mongoose')

const IncomeSchema = mongoose.Schema({
    local_time:{
        type:String,
        required:true },
    name:{
        type:String,
        required: true    },
    quantity:{
        type:Number,
        required: true}

})

module.exports =mongoose.model('income',IncomeSchema)