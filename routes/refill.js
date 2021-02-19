const router = require('express').Router()
const ticket = require('../models/ticket')
const foodStock = require('../models/refill')
const { now } = require('mongoose')
const { id } = require('monk')
const { update } = require('../models/ticket')


// update ticket 
router.use('/' , async (req,res,next)=>{
var food = await ticket.find({mode:-1})
 if (req.method == 'GET')
{   for (i=0;i<food.length;i++){
        product = await foodStock.find({title:food[i].title})
        sum=0;
        product.forEach(element => {
            sum += element.volume ;
        })
        await ticket.updateOne({title:food[i].title},{initial:sum})
    }}
    next()
})


router.get('/', async (req,res,next) =>{
    var food = await ticket.find({mode:-1})
    var distinct = await foodStock.find().distinct('time')
    var foodgroup = []

    for(i=0;i<distinct.length;i++){
        result = await foodStock.find({time:parseInt(distinct[i])})
        foodgroup.push(result)
    }
    res.render('refill/index',{foods:food,foodgroup:foodgroup})
})  

router.post('/', async (req,res,next)=>{
    nowtime = new Date()
    time=nowtime.getTime()
    local_time = new Date().toString()
    local_time = local_time.replace('GMT+0700 (Indochina Time)','')
    var foods = await ticket.find({mode:-1})
    foods.forEach(async element =>{
        if( req.body[element._id] ) {
            newfood= foodStock({
                time:time,
                local_time:local_time,
                title:element.title,
                volume:parseInt(req.body[element._id])
            })
            await newfood.save()
        }
    })
    res.redirect('/refill')
})

router.get('/:time', async (req,res,next) =>{
    food = await ticket.find({mode:-1})
    stock = await foodStock.find({time:parseInt(req.params.time)})
    var refill = []
    for(i=0;i<food.length;i++){
            newitem =  {
                time:req.params.time,
                local_time:stock[0].local_time,
                title:food[i].title,
                volume:0,
                _id:"new"
            }
            stock.forEach(element =>{
                if(element.title == newitem.title){
                    newitem.volume=element.volume
                    newitem._id=element._id
                }
            })
            refill.push(newitem)

        }
    
    res.render('refill/detail',{refill:refill})
})

router.post('/detail' , async (req,res,next) =>{
    food = await ticket.find({mode:-1})
    time=parseInt(req.body['time'])
    group= await foodStock.find({time:time})
    local_time=group[0].local_time
    updatestock = [];
    var i=0
    food.forEach(async element =>{
        var title=req.body[`title${i}`]
        var volume=parseInt(req.body[`input${i}`])
        var id=req.body[`id_${i++}`]    
        if( id == 'new' && volume>0) {
            newitem = new foodStock({
                time:time,
                local_time:local_time,
                title:title,
                volume:volume })
            await newitem.save()
        }else if( id != 'new' && volume==0){
            await foodStock.remove({_id:id})
        }else if( id != 'new' && volume > 0){
            await foodStock.findByIdAndUpdate({_id:id},{volume:volume})
        }
    })
    


    res.redirect('/refill')
    
})
module.exports = router