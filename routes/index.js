var express = require('express');
var router = express.Router();
var { check ,validationResult} = require('express-validator')
const monk = require('monk');
const income = require('../models/income');
const income_module = require('./statement/income')
const expense = require('../models/expense');
const expense_module = require('./statement/expense')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// Income Page
router.get('/income',async function(req, res, next) {
  income_module.getIncome(req,res)
});
router.post('/income', [
  check('name','โปรดระบุขื่อรายการ').not().isEmpty(),
  check('quantity','โปรดระบุยอดเงิน').isFloat({min:1})
], function(req, res, next) {
  const result= validationResult(req)
  const errors = result.errors
  income_module.formValidation(result,errors,req,res)  
  });

  router.post('/income/delete',function(req,res,next){
    income_module.delete(req,res,next)
  })

  router.post('/income/edit', async function(req,res,next) {
  income_module.update(req,res,next)
  })

  
// Expense Page
router.get('/expense',async function(req, res, next) {
  expense_module.getexpense(req,res)
});
router.post('/expense', [
  check('name','โปรดระบุขื่อรายการ').not().isEmpty(),
  check('quantity','โปรดระบุยอดเงิน').isFloat({min:1})
], function(req, res, next) {
  const result= validationResult(req)
  const errors = result.errors
  expense_module.formValidation(result,errors,req,res)  
  });

  router.post('/expense/delete',function(req,res,next){
    expense_module.delete(req,res,next)
  })

  router.post('/expense/edit', async function(req,res,next) {
  expense_module.update(req,res,next)
  })

module.exports = router;
