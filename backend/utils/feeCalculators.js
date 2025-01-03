const { google } = require("googleapis");

async function getReferralFeeData() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "A1:C406",
    });

    const feeStructure = {};
    response.data.values.forEach((row) => {
      if (row.length < 3) return;

      const [category, condition, percentage] = row;
      if (!category || !percentage) return;

      const percentValue = parseFloat(percentage.replace("%", ""));
      if (isNaN(percentValue)) return;

      if (!feeStructure[category]) {
        feeStructure[category] = [];
      }

      if (!condition || condition === "All") {
        feeStructure[category].push({
          condition: "all",
          percentage: percentValue,
        });
      } else if (condition.includes("and")) {
        const [minPart, maxPart] = condition
          .split("and")
          .map((part) => part.trim());
        const minPrice = parseFloat(minPart.replace(">", ""));
        const maxPrice = parseFloat(maxPart.replace("<=", ""));

        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
          feeStructure[category].push({
            condition: "range",
            minPrice,
            maxPrice,
            percentage: percentValue,
          });
        }
      } else if (condition.includes("<=")) {
        const maxPrice = parseFloat(condition.replace("<=", ""));
        if (!isNaN(maxPrice)) {
          feeStructure[category].push({
            condition: "<=",
            price: maxPrice,
            percentage: percentValue,
          });
        }
      } else if (condition.includes(">")) {
        const minPrice = parseFloat(condition.replace(">", ""));
        if (!isNaN(minPrice)) {
          feeStructure[category].push({
            condition: ">",
            price: minPrice,
            percentage: percentValue,
          });
        }
      }
    });

    return { success: true, data: feeStructure };
  } catch (error) {
    console.error("Error fetching referral fee data:", error);
    return { success: false, error: error.message };
  }
}

function helperCalculateReferralFee(category, price, feeStructure) {
  try {
    if (!category || typeof price !== "number" || price <= 0) {
      throw new Error("Invalid input parameters");
    }

    const categoryRules = feeStructure[category];
    if (!categoryRules) {
      throw new Error(`Category not found: ${category}`);
    }

    // Find the applicable rule
    const applicableRule = categoryRules.find((rule) => {
      switch (rule.condition) {
        case "all":
          return true;
        case "<=":
          return price <= rule.price;
        case ">":
          return price > rule.price;
        case "range":
          return price > rule.minPrice && price <= rule.maxPrice;
        default:
          return false;
      }
    });

    if (!applicableRule) {
      throw new Error(`No applicable rule found for price: ${price}`);
    }

    return Number(((price * applicableRule.percentage) / 100).toFixed(2));
  } catch (error) {
    throw error;
  }
}

exports.calculateReferralFee = async (category, price) => {
  try {
    if (!category || !price) {
      return {
        success: false,
        error: "Missing required parameters",
      };
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return {
        success: false,
        error: "Invalid price value",
      };
    }

    const feeResponse = await getReferralFeeData();
    if (!feeResponse.success) {
      return feeResponse;
    }

    const referralFee = helperCalculateReferralFee(
      category,
      numericPrice,
      feeResponse.data
    );

    return referralFee;
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

async function getClosingFeeData() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Closing fees!A1:F5",
    });

    return { success: true, data: response.data.values };
  } catch (error) {
    console.error("Error fetching closing fee data:", error);
    return { success: false, error: error.message };
  }
}

exports.calculateClosingFee = async (price, shippingMode) => {
  try {
    if (!price || !shippingMode) {
      return { success: false, error: "Price and shipping mode are required" };
    }

    const feeResponse = await getClosingFeeData();
    if (!feeResponse.success) {
      return feeResponse;
    }

    const feeData = feeResponse.data;

    const headers = feeData[0];
    const columnIndex = headers.indexOf(shippingMode);

    if (columnIndex === -1) {
      return { success: false, error: "Invalid shipping mode" };
    }

    for (let i = 1; i < feeData.length; i++) {
      const range = feeData[i][0];
      let [min, max] = range.split("-");

      min = parseInt(min);
      max = max.includes("+") ? Infinity : parseInt(max);

      if (price >= min && price <= max) {
        const fee = parseFloat(feeData[i][columnIndex].replace("₹", ""));
        return fee;
      }
    }

    return { success: false, error: "No applicable fee found" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

async function getWeightHandlingFeeData() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Weight handling fees!A1:F20",
    });

    return { success: true, data: response.data.values };
  } catch (error) {
    console.error("Error fetching weight handling fee data:", error);
    return { success: false, error: error.message };
  }
}

exports.calculateWeightHandlingFee = async (
  weight,
  shippingMode,
  serviceLevel,
  productSize,
  location
) => {
  try {
    if (
      !weight ||
      !shippingMode ||
      !serviceLevel ||
      !productSize ||
      !location
    ) {
      return {
        success: false,
        error: "Missing required parameters",
      };
    }

    const feeResponse = await getWeightHandlingFeeData();
    if (!feeResponse.success) {
      return feeResponse;
    }

    const feeData = feeResponse.data;
    const headers = feeData[0];
    const locationIndex = headers.findIndex((header) => header === location);

    if (locationIndex === -1) {
      return { success: false, error: "Invalid location" };
    }

    const shippingModePrefix =
      shippingMode === "Easy Ship (Standard)" ? "Easy Ship" : "FBA";
    let totalFee = 0;

    if (productSize === "Standard") {
      const baseRateRow = feeData.find((row) => {
        const rowString = row[0] || "";
        return (
          rowString.includes(
            `${shippingModePrefix} Standard Size - ${serviceLevel}`
          ) && row[1].includes("First 500g")
        );
      });

      if (!baseRateRow) {
        return { success: false, error: "No applicable base rate found" };
      }

      totalFee = parseFloat(baseRateRow[locationIndex].replace("₹", ""));

      if (weight > 0.5) {
        if (weight <= 1) {
          const additional500gRow = feeData.find(
            (row) =>
              row[0].includes(
                `${shippingModePrefix} Standard Size - All Levels`
              ) && row[1].includes("Additional 500g up to 1kg")
          );
          if (additional500gRow) {
            totalFee += parseFloat(
              additional500gRow[locationIndex].replace("₹", "")
            );
          }
        } else {
          const additional500gRow = feeData.find(
            (row) =>
              row[0].includes(
                `${shippingModePrefix} Standard Size - All Levels`
              ) && row[1].includes("Additional 500g up to 1kg")
          );
          if (additional500gRow) {
            totalFee += parseFloat(
              additional500gRow[locationIndex].replace("₹", "")
            );
          }

          const remainingWeight = weight - 1;

          if (weight <= 5) {
            const after1kgRow = feeData.find(
              (row) =>
                row[0].includes(
                  `${shippingModePrefix} Standard Size - All Levels`
                ) && row[1].includes("Additional kg after 1kg")
            );
            if (after1kgRow) {
              totalFee +=
                Math.ceil(remainingWeight) *
                parseFloat(after1kgRow[locationIndex].replace("₹", ""));
            }
          } else {
            const after1kgRow = feeData.find(
              (row) =>
                row[0].includes(
                  `${shippingModePrefix} Standard Size - All Levels`
                ) && row[1].includes("Additional kg after 1kg")
            );
            if (after1kgRow) {
              totalFee +=
                4 * parseFloat(after1kgRow[locationIndex].replace("₹", ""));
            }

            const after5kgRow = feeData.find(
              (row) =>
                row[0].includes(
                  `${shippingModePrefix} Standard Size - All Levels`
                ) && row[1].includes("Additional kg after 5kg")
            );
            if (after5kgRow) {
              totalFee +=
                Math.ceil(weight - 5) *
                parseFloat(after5kgRow[locationIndex].replace("₹", ""));
            }
          }
        }
      }
    } else if (productSize === "Heavy & Bulky") {
      const baseRateRow = feeData.find((row) => {
        const rowString = row[0] || "";
        return (
          rowString.includes(
            `${shippingModePrefix} Heavy & Bulky - ${serviceLevel}`
          ) && row[1].includes("First 12kg")
        );
      });

      if (!baseRateRow) {
        return {
          success: false,
          error: "No applicable base rate found for Heavy & Bulky",
        };
      }

      totalFee = parseFloat(baseRateRow[locationIndex].replace("₹", ""));

      if (weight > 12) {
        const additionalKgRow = feeData.find(
          (row) =>
            row[0].includes(
              `${shippingModePrefix} Heavy & Bulky - All Levels`
            ) && row[1].includes("Each additional kg after 12kg")
        );
        if (additionalKgRow) {
          totalFee +=
            Math.ceil(weight - 12) *
            parseFloat(additionalKgRow[locationIndex].replace("₹", ""));
        }
      }
    }

    return totalFee;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

async function getPickAndPackFeeData() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Other Fees!A1:C3",
    });

    return { success: true, data: response.data.values };
  } catch (error) {
    console.error("Error fetching pick and pack fee data:", error);
    return { success: false, error: error.message };
  }
}

exports.calculatePickAndPackFee = async (productSize) => {
  try {
    if (!productSize) {
      return {
        success: false,
        error: "Product size is required",
      };
    }

    const feeResponse = await getPickAndPackFeeData();
    if (!feeResponse.success) {
      return feeResponse;
    }

    const feeData = feeResponse.data;

    const feeRow = feeData.find((row) => {
      if (productSize === "Standard") {
        return row[1] === "Standard Size";
      } else {
        return row[1] === "Oversize/Heavy & Bulky";
      }
    });

    if (!feeRow) {
      return {
        success: false,
        error: "Invalid product size",
      };
    }

    const fee = parseFloat(feeRow[2].replace("₹", ""));

    return fee;
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
