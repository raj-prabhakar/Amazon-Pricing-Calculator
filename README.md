# Amazon Marketplace Fee Calculator
A full-stack application for calculating various Amazon marketplace fees based on product specifications and shipping details. The frontend provides an intuitive interface for fee calculations while the backend API integrates with Google Sheets to maintain dynamic fee structures.

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

## Project Structure
```
project-root/
  ├── frontend/         # React frontend application
  │   ├── src/
  │   └── package.json
  └── backend/          # Node.js backend API
      ├── src/
      └── package.json
```

## Prerequisites
- Node.js (v14 or higher)
- npm
- Google Cloud Project with Sheets API enabled
- Google Service Account credentials

## Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:3000/api/v1
```

4. **Run development server**
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`

## Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the backend directory:
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

5. **Run development server**
```bash
npm run dev
```
The backend API will be available at `http://localhost:3000`

## Running the Full Application

1. **Start Backend Server**
```bash
# In the backend directory
cd backend
npm run dev
```

2. **Start Frontend Development Server**
```bash
# In the frontend directory (new terminal)
cd frontend
npm run dev
```

3. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

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
  "shippingMode": "Easy Ship (Standard)" | "FBA Normal" | "FBA Exception" | "Self Ship" | "Seller Flex",
  "serviceLevel": "Premium" | "Advanced" | "Standard" | "Basic",
  "productSize": "Standard" | "Heavy & Bulky",
  "location": "Local" | "Regional" | "National" | "IXD"
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

