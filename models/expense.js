const mongoose = require('mongoose')

const ExpenseSchema = mongoose.Schema({
    date: {
        type:Date,
        default:Date.now  },
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

module.exports =mongoose.model('temp_expense',ExpenseSchema)