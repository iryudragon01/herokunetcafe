const { number } = require('joi')
const mongoose = require('mongoose')

const ItemSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    type:{
        type:Number,
        default:0
    }
})

module.exports = mongoose.model('item',ItemSchema)