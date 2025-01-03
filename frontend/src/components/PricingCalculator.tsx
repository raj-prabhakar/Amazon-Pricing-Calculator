import React, { useState } from "react";
import { Calculator } from "lucide-react";
import axios from "axios";
import { LoadingSpinner } from "./LoadingSpinner";

interface PricingFormData {
  productCategory: string;
  sellingPrice: number;
  weight: number;
  shippingMode: string;
  serviceLevel: string;
  productSize: string;
  location: string;
}

interface PricingResults {
  breakdown: {
    referralFee: number;
    weightHandlingFee: number;
    closingFee: number;
    pickAndPackFee: number;
  };
  totalFees: number;
  netEarnings: number;
}

const categories = [
  "3D Printers",
  "Apparel - Accessories",
  "Apparel - Baby",
  "Apparel - Ethnic wear",
  "Apparel - Men's T-shirts",
  "Apparel - Other innerwear",
  "Apparel - Sarees and Dress Materials",
  "Apparel - Shorts",
  "Apparel - Sleepwear",
  "Apparel - Sweat Shirts and Jackets",
  "Apparel - Womens' Innerwear / Lingerie",
  "Automotive - Batteries and air fresheners",
  "Automotive - Helmets & Riding Gloves",
  "Automotive - Tyres & Rims",
  "Automotive Accessories",
  "Automotive Vehicles - 2-Wheelers 4-Wheelers and Electric Vehicles",
  "Automotive – Car and Bike parts",
  "Automotive – Cleaning kits",
  "Baby Hardlines",
  "Baby Strollers",
  "Baby diapers",
  "Backpacks",
  "Bean Bags & Inflatables",
  "Beauty - Fragrance",
  "Beauty - Haircare Bath and Shower",
  "Beauty - Makeup",
  "Bedsheets Blankets and covers",
  "Bicycles",
  "Books",
  "Business and Industrial Supplies - Electrical Testing",
  "Business and Industrial Supplies - Material Handling Equipment",
  "Business and Industrial Supplies - Power tools & accessories",
  "Business and Industrial Supplies - Scientific Supplies",
  "Cables and Adapters",
  "Camera Accessories",
  "Camera Lenses",
  "Camera and Camcorder",
  "Car Cradles Lens Kits and Tablet Cases",
  "Car Electronics Accessories",
  "Car Electronics Devices",
  "Cases Covers Skins Screen Guards",
  "Cleaning and Home Appliances",
  "Clocks",
  "Coin Collectibles",
  "Consumable Physical Gift Card",
  "Containers Boxes Bottles Kitchen Storage",
  "Craft materials",
  "Curtains and Curtain Accessories",
  "Cushion Covers",
  "Deodrants",
  "Desktops",
  "Doors and Windows",
  "Electronic Accessories",
  "Electronic Devices",
  "Entertainment Collectibles",
  "Eyewear",
  "Face Wash",
  "Facial steamers",
  "Fans and Robotic Vacuums",
  "Fashion Jewellery",
  "Fashion Smartwatches",
  "Fine Jewellery - Gold Coins",
  "Fine Jewellery - studded",
  "Fine Jewellery - unstudded and solitaire",
  "Flip Flops Fashion Sandals and Slippers",
  "Furniture - Other products",
  "GPS Devices",
  "Grocery & Gourmet - Oils",
  "Grocery - Dried fruits and nuts",
  "Grocery - Hampers and gifting",
  "Grocery - herbs and spices",
  "Handbags",
  "Hard Disks",
  "Headsets Headphones and Earphones",
  "Health & Household - Household Cleaning",
  "Health & Household - Sports Nutrition",
  "Health & Household - Vitamins & Supplements",
  "Health & Personal Care - Medical Equipment & Contact Lens",
  "Health and Personal Care - Ayurvedic products",
  "Health and Personal Care - Contact lens",
  "Home - Fragrance & Candles",
  "Home - Waste & Recycling",
  "Home Decor Products",
  "Home Safety & Security Systems",
  "Home Storage",
  "Home furnishing",
  "Home improvement - Accessories",
  "Home improvement - Kitchen & Bath",
  "Home improvement (excl. accessories)",
  "Indoor Lighting",
  "Inverter and Batteries",
  "Keyboard and Mouse",
  "Kids shoes",
  "Kitchen - Gas Stoves & Pressure Cookers",
  "Kitchen - Glassware & Ceramicware",
  "Kitchen - Non Appliances",
  "Ladders Kitchen and Bath fixtures",
  "Landline Phones",
  "Large Appliances - Accessories",
  "Large Appliances - Chimneys",
  "Large Appliances - Refrigerators",
  "Large Appliances (excl. specified)",
  "Laptop Bags & Sleeves",
  "Laptop and Camera Battery",
  "Laptops",
  "Lawn & Garden - Chemical Pest Control",
  "Lawn & Garden - Commercial Agricultural",
  "Lawn & Garden - Leaf blower",
  "Lawn & Garden - Outdoor equipments",
  "Lawn & Garden - Solar Devices",
  "Lawn & Garden - Solar Panels",
  "Lawn and Garden - Plants Seeds & Bulbs",
  "Lawn and Garden - Planters",
  "LED Bulbs and Battens",
  "Luggage - Suitcase & Trolleys",
  "Luggage - Travel Accessories",
  "Luxury Beauty",
  "Masks",
  "Mattresses",
  "Memory Cards",
  "Mobile phones",
  "Modems & Networking Devices",
  "Monitors",
  "Moisturizer cream",
  "Movies",
  "Music",
  "Musical Instruments - Guitars",
  "Musical Instruments - Keyboards",
  "Musical Instruments - Microphones",
  "Musical Instruments - Others",
  "OTC Medicine",
  "Occupational Safety Supplies",
  "Office products - Arts and Crafts",
  "Office products - Electronic Devices",
  "Office products - Office supplies",
  "Office products - Writing Instruments",
  "Oils Lubricants",
  "PC Components",
  "Packing materials",
  "Personal Care Appliances - Electric Massagers",
  "Personal Care Appliances - Glucometer",
  "Personal Care Appliances - Grooming & Styling",
  "Personal Care Appliances - Thermometers",
  "Pet Products",
  "Pet food",
  "Power & hand Tools and Water Dispenser",
  "Power Banks & Chargers",
  "Prescription Medicine",
  "Printers & Scanners",
  "Projectors Home Theatre Systems",
  "Rugs and Doormats",
  "Safes and Lockers",
  "Sanitaryware",
  "Shoes",
  "Shoes - Sandals & Floaters",
  "Silver Coins & Bars",
  "Silver Jewellery",
  "Slipcovers and Kitchen Linens",
  "Small Appliances",
  "Smart Watches & Accessories",
  "Software Products",
  "Speakers",
  "Sports & Outdoors - Footwear",
  "Stethoscopes",
  "Sunscreen",
  "Tablets",
  "Television",
  "Tiles & Flooring Accessories",
  "USB Flash Drives",
  "Vehicle Tools and Appliances",
  "Video Games",
  "Video Games - Accessories",
  "Video Games - Consoles",
  "Video Games - Online game services",
  "Wall Art",
  "Wall Paints and Tools",
  "Wallpapers & Wallpaper Accessories",
  "Wallets",
  "Warranty Services",
  "Watches",
  "Water Heater and Accessories",
  "Water Purifier and Accessories",
  "Weighing Scales & Fat Analyzers",
  "Wires",
];

const shippingModes = [
  "Easy Ship (Standard)",
  "FBA Normal",
  "FBA Exception",
  "Self Ship",
  "Seller Flex",
];
const serviceLevels = ["Premium", "Advanced", "Standard", "Basic"];
const productSizes = ["Standard", "Heavy & Bulky"];
const locations = ["Local", "Regional", "National", "IXD"];

export default function PricingCalculator(): JSX.Element {
  const [formData, setFormData] = useState<PricingFormData>({
    productCategory: categories[0],
    sellingPrice: 0,
    weight: 0.5,
    shippingMode: "FBA Exception",
    serviceLevel: "Basic",
    productSize: "Standard",
    location: "Local",
  });

  const [results, setResults] = useState<PricingResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {

    if(formData.sellingPrice <= 0 || formData.weight <= 0) {
      setError("Selling price and weight must be greater than 0");
      return;
    }

    setLoading(true);
    setError(null);

    const VITE_API_URL = import.meta.env.VITE_API_URL;

    try {
      const response = await axios.post(
       `${VITE_API_URL}/api/v1/profitability-calculator`,
        formData
      );
      setResults(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Failed to calculate fees");
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "sellingPrice" || name === "weight"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-8">
                <Calculator className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Amazon Pricing Calculator
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Category
                    </label>
                    <select
                      name="productCategory"
                      value={formData.productCategory}
                      onChange={handleInputChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shipping Mode
                      </label>
                      <select
                        name="shippingMode"
                        value={formData.shippingMode}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        {shippingModes.map((mode) => (
                          <option key={mode} value={mode}>
                            {mode}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Level
                      </label>
                      <select
                        name="serviceLevel"
                        value={formData.serviceLevel}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        {serviceLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Size
                      </label>
                      <select
                        name="productSize"
                        value={formData.productSize}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        {productSizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        {locations.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {error && <div className="text-red-600 text-sm">{error}</div>}

                  <button
                    onClick={handleCalculate}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  >
                    {loading ? "Calculating..." : "Calculate Fees"}
                  </button>
                </div>

                {results && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Fee Breakdown
                    </h2>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Referral Fee:</span>
                        <span className="font-medium">
                          ₹{results.breakdown.referralFee.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Weight Handling Fee:
                        </span>
                        <span className="font-medium">
                          ₹{results.breakdown.weightHandlingFee.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Closing Fee:</span>
                        <span className="font-medium">
                          ₹{results.breakdown.closingFee.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pick & Pack Fee:</span>
                        <span className="font-medium">
                          ₹{results.breakdown.pickAndPackFee.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-px bg-gray-200 my-4"></div>
                      <div className="flex justify-between text-lg font-semibold">
                        <span className="text-gray-900">Total Fees:</span>
                        <span className="text-blue-600">
                          ₹{results.totalFees.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold">
                        <span className="text-gray-900">Net Earnings:</span>
                        <span className="text-green-600">
                          ₹{results.netEarnings.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
