const product = require('../../models/product')
const router = require('express').Router()
const verify = require('../../helper/verifytoken')
const Validation = require('../../helper/validation')
const productRouter = require('./product/main')
const { render } = require('ejs')

router.use('/',verify, (req,res,next) =>{
    next()
})
router.use('/product',productRouter)

router.get('/',async (req,res)=>{
    const Product = await product.find()
    if (Product.length == 0) res.redirect('/authen/product')
    res.render('authen/index')
})

module.exports = router