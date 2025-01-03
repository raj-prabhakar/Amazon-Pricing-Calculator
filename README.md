# Amazon Marketplace Fee Calculator API

A robust Node.js backend API for calculating various Amazon marketplace fees based on product specifications and shipping details. This API integrates with Google Sheets to maintain dynamic fee structures and provides accurate calculations for referral fees, weight handling charges, closing fees, and pick & pack fees.

## Features

- **Dynamic Fee Structure**: Integrates with Google Sheets for real-time fee updates
- **Comprehensive Fee Calculations**:
  - Referral Fee calculation based on product category
  - Weight Handling Fee based on shipping mode, service level, and location
  - Closing Fee calculation
  - Pick & Pack Fee for FBA/non-FBA modes
- **Caching System**: Implements efficient caching to minimize API calls to Google Sheets
- **Error Handling**: Robust error handling with detailed error messages
- **Input Validation**: Comprehensive input validation using Joi
- **Logging**: Detailed logging system using Winston

## Prerequisites

- Node.js (v14 or higher)
- npm
- Google Cloud Project with Sheets API enabled
- Google Service Account credentials

## Setup

1. **Clone the repository**
```bash
git clone [repository-url]
cd pricing-calculator-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**

Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
SPREADSHEET_ID=your_spreadsheet_id
NODE_ENV=development
```

4. **Google Sheets Setup**
- Create a service account in Google Cloud Console
- Share your fee structure spreadsheet with the service account email
- Download the credentials JSON file and save it securely
- Update the GOOGLE_APPLICATION_CREDENTIALS path in .env

## Running the Application

### Development Mode
```bash
npm run dev
```

## API Endpoints

### Calculate Fees
```http
POST /api/v1/calculate-fees
```

**Request Body**:
```json
{
  "category": "string",
  "sellingPrice": number,
  "weight": number,
  "shippingMode": "Easy Ship (Standard)" | "FBA",
  "serviceLevel": "Standard" | "Express",
  "productSize": "Standard" | "Heavy & Bulky",
  "location": "Local" | "National"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "referralFee": number,
    "weightHandlingFee": number,
    "closingFee": number,
    "pickAndPackFee": number,
    "totalFees": number,
    "netEarnings": number
  }
}
```

## Fee Structure

The fee calculation is based on the following components:

1. **Referral Fee**:
   - Category-based percentage of selling price
   - Different rates for different price ranges

2. **Weight Handling Fee**:
   - Based on actual weight
   - Varies by shipping mode and service level
   - Different rates for local vs national delivery

3. **Closing Fee**:
   - Fixed fee based on price ranges
   - Different for Easy Ship and FBA

4. **Pick & Pack Fee**:
   - Varies by product size
   - Different rates for Standard and Heavy & Bulky items

## Error Handling

The API implements comprehensive error handling:
- Input validation errors
- Google Sheets API errors
- Calculation errors
- Invalid fee structure errors

All errors return a consistent format:
```json
{
  "success": false,
  "error": "Error message"
}
```