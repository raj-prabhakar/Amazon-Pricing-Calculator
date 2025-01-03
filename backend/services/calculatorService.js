const {
  calculateReferralFee,
  calculateWeightHandlingFee,
  calculateClosingFee,
  calculatePickAndPackFee,
} = require("../utils/feeCalculators");

exports.calculateFeesService = async (data) => {
  const {
    productCategory,
    sellingPrice,
    weight,
    shippingMode,
    serviceLevel,
    productSize,
    location,
  } = data;

  const referralFee = await calculateReferralFee(productCategory, sellingPrice);

  const weightHandlingFee = await calculateWeightHandlingFee(
    weight,
    shippingMode,
    serviceLevel,
    productSize,
    location
  );
  const closingFee = await calculateClosingFee(sellingPrice, shippingMode);
  const pickAndPackFee = await calculatePickAndPackFee(productSize);

  const totalFees = referralFee
  + weightHandlingFee
  + closingFee
  + pickAndPackFee;
  
  const netEarnings = sellingPrice - totalFees;

  return {
    breakdown: {
      referralFee,
          weightHandlingFee,
          closingFee,
          pickAndPackFee,
    },
      totalFees,
      netEarnings,
  };
};
