const Joi = require("joi");

exports.calculatorSchema = Joi.object({
  productCategory: Joi.string().required(),
  sellingPrice: Joi.number().positive().required(),
  weight: Joi.number().positive().required(),
  shippingMode: Joi.string()
    .valid("Easy Ship (Standard)", "FBA Normal", "FBA Exception" , "Self Ship", "Seller Flex")
    .required(),
  serviceLevel: Joi.string().valid("Premium", "Advanced", "Standard", "Basic").required(),
  productSize: Joi.string().valid("Standard", "Heavy & Bulky").required(),
  location: Joi.string().valid("Local", "Regional", "National", "IXD").required(),
});
