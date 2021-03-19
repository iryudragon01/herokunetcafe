var express = require('express');
var router = express.Router();
const income = require('../models/income');
const income_module = require('./statement/income')
const expense = require('../models/expense');
const expense_module = require('./statement/expense')
const verify = require('./verifytoken')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// Income Page
router.get('/income',async function(req, res, next) {
  income_module.getIncome(req,res)
});
router.post('/income', function(req, res, next) {
  income_module.formValidation(req,res)  
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
router.post('/expense', function(req, res, next) {
  expense_module.formValidation(req,res)  
  });

  router.post('/expense/delete',function(req,res,next){
    expense_module.delete(req,res,next)
  })

  router.post('/expense/edit', async function(req,res,next) {
  expense_module.update(req,res,next)
  })

module.exports = router;
