const mongoose = require('mongoose')
const TicketSchema = mongoose.Schema({
title:String,
initial:Number,
lastest:Number,
price:{
    type:Number,
    defualt:0
},
volume:Number,
amount:Number,
mode:{
    type:Number,
    default:1}

})

module.exports = mongoose.model('temp_ticket',TicketSchema)