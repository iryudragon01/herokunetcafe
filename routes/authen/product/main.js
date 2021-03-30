const product = require('../../../models/product')
const router = require('express').Router()
const verify = require('../../../helper/verifytoken')
const Validation = require('../../../helper/validation')

router.use('/',verify, (req,res,next) =>{
    next()
})

router.get('/',async (req,res)=>{
    const Product = await product.find()
    res.render('authen/product/index',{Product:Product})
})
router.get('/:name',async (req,res)=>{
    await product.find({name:req.params.name}, (err, Product)=>{
        if(Product.length){
            res.render('authen/product/detail',{Product:Product[0]})
        }else{
            res.send(`${req.params.name} don't Founded!`)
        }
    })
})

router.post('/:name', async (req,res) =>{
    const Product = await product.updateOne({name:req.body.oldname},{name:req.body.name})
    res.redirect('/authen/product')
})
router.get('/additem',async (req,res)=>{
    const Product = await product.find()
    res.render('authen/product/additem')
})

router.post('/additem', async (req,res)=>{
    var { error } = Validation.productValidation(req.body)
    if (error) res.send(error.details[0])
    const existproduct = await product.findOne({name:req.body.name})
    if (existproduct) res.send(req.body.name + '  is existed')
    const newproduct = product({name:req.body.name})
    await newproduct.save()
    res.redirect('/authen/product')

})

router.post('/delete/:name',async (req,res) =>{
    await product.deleteOne({name:req.params.name})
    res.redirect('/authen/product')
})
module.exports = router