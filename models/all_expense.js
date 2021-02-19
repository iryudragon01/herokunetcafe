const mongoose = require('mongoose')

const ExpenseSchema = mongoose.Schema({
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

module.exports =mongoose.model('expense',ExpenseSchema)