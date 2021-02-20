const express = require('express')
const ticket = require('../models/ticket')
const income= require('../models/income')
const expense = require('../models/expense')
const log = require('../models/log')
const foodStock = require('../models/refill')
const verify = require('./verifytoken')
require('dotenv').config()

const router =express.Router()



// update amount and volume ticket collections with middleware
router.use('/',verify,async function(req,res,next){
    var food = await ticket.find({mode:-1})
     if (req.method == 'GET')
    {   for (i=0;i<food.length;i++){
            product = await foodStock.find({title:food[i].title})
            sum=0;
            product.forEach(element => {
                sum += element.volume ;
            })
            await ticket.updateOne({title:food[i].title},{initial:sum})
        }
        allTicket = await ticket.find()
        allTicket.forEach(async product => {
            await ticket.findOneAndUpdate({title:product.title},{
                volume:(-product.initial+product.lastest) * ((product.mode > 0) ? 1 : -1),
                amount:(-product.initial+product.lastest) * ((product.mode > 0) ? 1 : -1) * product.price
            })
        })
        
    }
    next()
})



router.get('/',async function(req,res,next){
    var account = await ticket.find()
    var incomes = await income.find()
    var expenses = await expense.find()
    var [totalAmountProduct,totalAmountIncome,totalAmountExpense ] = [0,0,0]
    
    account.forEach(product =>{
        totalAmountProduct += product.amount
    })
    incomes.forEach(item =>{
        totalAmountIncome += item.quantity
    })
    expenses.forEach(item =>{
        totalAmountExpense += item.quantity
    })

    // timestamp    
    const iniDay    = (await log.findOne({title:'initial_day'})).value
    const iniTime   = (await log.findOne({title:'initial_time'}  )).value
    const timestamp ={iniDay:iniDay,iniTime:iniTime}
    //workday
    const iniworkday = await log.findOne({title:'initial_workday'})
    const iniday = new Date(iniworkday.value)
    const nowday = new Date()
    const currentHour = nowday.getHours()
    var daydiff = Math.floor((nowday.getTime()-iniday.getTime())/(1000*3600*24))
    daydiff += (currentHour >= 14) 
    saturnday = Math.floor((iniday.getDay()+daydiff)/7)
    weekend = 2*saturnday + (iniday.getDay() == 0 )*(daydiff > 0) + (nowday.getDay()==6)*(daydiff > 0)
    salaries= (daydiff * 300) + (weekend * 100)

    netAmount = totalAmountProduct+totalAmountIncome-totalAmountExpense-salaries

    //render
    res.render('account/index',{
        accounts:account,totalAmountProduct:totalAmountProduct,
        incomes:incomes,totalAmountIncome:totalAmountIncome,
        expenses:expenses,totalAmountExpense:totalAmountExpense,
        timestamp:timestamp,daydiff:daydiff,weekend:weekend,
        salaries:salaries,netAmount:netAmount
    })
})

router.post('/',async function(req,res,next){
    var product = await ticket.find()
    
    await ticket.findOneAndUpdate({title:'บัตร 10 บาท'}  ,{lastest:parseInt(req.body.ticket0)})
    await ticket.findOneAndUpdate({title:'บัตร 20 บาท'}  ,{lastest:parseInt(req.body.ticket1)})
    await ticket.findOneAndUpdate({title:'บัตร 30 บาท'}  ,{lastest:parseInt(req.body.ticket2)})
    await ticket.findOneAndUpdate({title:'บัตร 50 บาท'}  ,{lastest:parseInt(req.body.ticket3)})
    await ticket.findOneAndUpdate({title:'Airpays'}     ,{lastest:parseInt(req.body.ticket4)})
    await ticket.findOneAndUpdate({title:'มาม่า'}        ,{lastest:parseInt(req.body.ticket5)})     
    await ticket.findOneAndUpdate({title:'ขนม'}         ,{lastest:parseInt(req.body.ticket6)})
    await ticket.findOneAndUpdate({title:'จับใจ'}        ,{lastest:parseInt(req.body.ticket7)})
    await ticket.findOneAndUpdate({title:'โออิชิ'}        ,{lastest:parseInt(req.body.ticket8)})
    await ticket.findOneAndUpdate({title:'น้ำเปล่า'}       ,{lastest:parseInt(req.body.ticket9)})
    await ticket.findOneAndUpdate({title:'เอส'}         ,{lastest:parseInt(req.body.ticket10)})
    
    res.redirect('/account')
})

module.exports = router