
const router = require('express').Router()
const log = require('../models/log')

router.get('/' , async function(req,res,next){
    const inilog = await log.findOne({title:'initial_day'})
    const iniday = new Date(inilog.value)
    const nowday = new Date()
    const currentHour = nowday.getHours()
    daydiff = Math.floor((nowday.getTime()-iniday.getTime())/(1000*3600*24))
    daydiff += (currentHour >= 14) 
    saturnday = Math.floor((iniday.getDay()+daydiff)/7)
    weekend = 2*saturnday + (iniday.getDay() == 0 ) + (nowday.getDay()==6)
    res.send({daydiff:daydiff,weekend:weekend})
})

router.get('/update' , async function(req,res,rext){
    const nowday = new Date()
    iniday = (1+nowday.getMonth()).toString() + '/' + 
    (nowday.getDate()).toString() + '/' + 
    (nowday.getFullYear()).toString()

    await log.updateOne({
        title:'initial_day'  },{
            value:iniday
        })
        .then(result =>{
            res.send(result)
        })
        .catch(err =>{
            res.send(err)
        })
})
/*
router.get('/generate',async (req,res,next)=>{
    setIniHour = new log({
        title:'initial_hour',
        value:'8'
    })
    setIniMinute = new log({
        title:'initial_minute',
        value:'30'
    })
    setIniSecond= new log({
        title:'initial_second',
        value:'48'
    })

    await setIniHour.save()
    await setIniMinute.save()
    await setIniSecond.save()
}) */

module.exports = router