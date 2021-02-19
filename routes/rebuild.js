// rebuild 
const router = require('express').Router()
const ticket = require('../models/ticket')
const foodStock= require('../models/refill')
const log = require('../models/log')
const tempincome = require('../models/income')
const tempexpense = require('../models/expense')
const all_income = require('../models/all_income')
const all_expense = require('../models/all_expense')

router.get('/' , async (req,res,next) =>{
    // update log DB
    now = new Date()
    var local_time=now.toString()
    local_time=local_time.replace('GMT+0700 (Indochina Time)','')
    time=now.getTime()
    tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate()+1)
    dd = now.getDate()
    mm = (now.getMonth() +1 )
    yy = now.getFullYear()
    Hour = now.getHours()
    Minute = now.getMinutes()
    Second = now.getSeconds()

    initial_day = mm.toString() + '/' + dd.toString() + '/' + yy.toString()
    initial_time = Hour.toString() + ':' + Minute.toString() + ':' + Second.toString()
    
    await log.findOneAndUpdate({ title:'initial_day'},{ value:initial_day })
    await log.findOneAndUpdate({ title:'initial_workday'},{ value:initial_day })
    await log.findOneAndUpdate({ title:'initial_time'},{ value:initial_time })

    if(Hour > 13){
        dd = tomorrow.getDate()
        mm = (tomorrow.getMonth() +1 )
        yy = tomorrow.getFullYear()
        initial_workday = mm.toString() + '/' + dd.toString() + '/' + yy.toString()
        await log.findOneAndUpdate({ title:'initial_workday'},{ value:initial_workday })
        
    }
    // update ticket DB
    rebuildTicket = await ticket.find()
    await foodStock.deleteMany({})        // clear refill2
    rebuildTicket.forEach(async element => {
        if(element.mode == 1 )  {await ticket.updateOne({title:element.title},{initial:element.lastest})}
        else if (element.mode == 2 ) {await ticket.updateOne({title:element.title},{lastest:0})}
        else if(element.mode == -1) {
            newitem = new foodStock({
                    time:time,
                    title:element.title,
                    local_time:local_time,
                    volume:parseInt(element.lastest)
            })
            if(newitem.volume > 0) await newitem.save()
        }
    });

// move temp statement to store in all statement permanently
let moveincome = await tempincome.find()
moveincome.forEach(async element =>{
    let newincome = all_income({
        local_time:element.local_time,
        name:element.name,
        quantity:element.quantity
    })
    await newincome.save()
})
let moveexpense = await tempexpense.find()
moveexpense.forEach(async element =>{
    let newexpense = all_expense({
        local_time:element.local_time,
        name:element.name,
        quantity:element.quantity
    })
    await newexpense.save()
    .then(result=>{
        console.log('pass ' + result)
    })
    .catch(err =>{
        console.log('error '+ err)
    })
})

await tempincome.deleteMany({})
await tempexpense.deleteMany({})

//








    res.redirect('/account')
})


module.exports = router