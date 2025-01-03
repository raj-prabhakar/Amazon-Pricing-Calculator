const { calculateFeesService } = require('../services/calculatorService');
  const logger = require('../utils/logger');
  
  exports.calculateFees = async (req, res, next) => {
    try {
      const result = await calculateFeesService(req.body);
      res.json(result);
    } catch (error) {
      logger.error('Error in fee calculation:', error);
      next(error);
    }
  };