  require('dotenv').config();
  const express = require('express');
  const routes = require('./routes');
  const logger = require('./utils/logger');
  const errorHandler = require('./middlewares/errorHandler');
  const cors = require('cors');
  
  const app = express();
  const PORT = process.env.PORT || 3000;
  
  app.use(express.json());
  app.use(cors());
  app.use('/api/v1', routes);
  app.use(errorHandler);
  
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
  
  module.exports = app;