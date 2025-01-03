  const express = require('express');
  const calculatorController = require('./controllers/calculatorController');
  const validateRequest = require('./middlewares/validateRequest');
  const { calculatorSchema } = require('./validators/calculatorSchema');
  
  const router = express.Router();
  
  router.post(
    '/profitability-calculator',
    validateRequest(calculatorSchema),
    calculatorController.calculateFees
  );
  
  module.exports = router;