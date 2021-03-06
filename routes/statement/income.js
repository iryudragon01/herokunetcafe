const { query } = require("express-validator")
const mongoose= require('mongoose')
const Income = require('../../models/income')
module.exports = {
    formValidation:function(result,errors,req,res){        
        if(!result.isEmpty()){  //กรอกข้อมูลไม่ครบ
            res.render('income', {title:'รายรับ',errors:errors})
          }else{        
            //save data to database

            var time = new Date()
            var datacollection = {   // เพิ่มข้อมูลเข้า ดาต้าเบส
                date:time,  
                local_time:time.toLocaleString("en-US", {timeZone: "Asia/Bangkok"}),
                name:req.body.name,
                quantity:parseInt(req.body.quantity)
                }
            var income = new Income(datacollection)
            income.save()
            .then(result => {
                res.redirect('/income')
                            
                           
            })
            .catch(err =>{
                res.render('income',{title:'รายรับ',dbError:err})  
            })
            
          }
    },
    getIncome:async function(req,res){
        var income = await Income.find()
        res.render('income',{title:'รายรับ',incomes:income})
    },
    delete:async function(req,res,next){
        var income = await Income.deleteOne({"_id":req.body._id})
        res.redirect("/income")
    },
    update:async function(req,res,next){
        var id = req.body._id
        var name = req.body.name
        var quantity = parseInt(req.body.quantity)
        Income.findByIdAndUpdate({_id:id},{name:name,quantity:quantity},function(err,result){
            if(err){
                res.send(err)
            }else{
                res.redirect("/income")
            }
        })
    }


}