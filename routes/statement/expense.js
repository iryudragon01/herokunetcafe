const { query } = require("express-validator")
const mongoose= require('mongoose')
const Expense = require('../../models/expense')
module.exports = {
    formValidation:function(result,errors,req,res){        
        if(!result.isEmpty()){  //กรอกข้อมูลไม่ครบ
            res.render('expense', {title:'รายจ่าย',errors:errors})
          }else{        
            //save data to database

            var time = new Date()
            var datacollection = {   // เพิ่มข้อมูลเข้า ดาต้าเบส
                date:time,  
                local_time:time.toLocaleString("en-US", {timeZone: "Asia/Bangkok"}),
                name:req.body.name,
                quantity:parseInt(req.body.quantity)
                }
            var expense = new Expense(datacollection)
            expense.save()
            .then(result => {
                res.redirect('/expense')
                            
                           
            })
            .catch(err =>{
                res.render('expense',{title:'รายจ่าย',dbError:err})  
            })
            
          }
    },
    getexpense:async function(req,res){
        var expense = await  Expense.find()
        res.render('expense',{title:'รายจ่าย',expenses:expense})
    },
    delete:async function(req,res,next){
        var expense = await  Expense.deleteOne({"_id":req.body._id})
        res.redirect("/expense")
    },
    update:async function(req,res,next){
        var id = req.body._id
        var name = req.body.name
        var quantity = parseInt(req.body.quantity)
        Expense.findByIdAndUpdate({_id:id},{name:name,quantity:quantity},function(err,result){
            if(err){
                res.send(err)
            }else{
                res.redirect("/expense")
            }
        })
    }


}