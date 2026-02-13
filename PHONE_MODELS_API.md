# 📱 Phone Models API Documentation

## Overview

This document describes the API endpoints needed for the Phone Case Customizer to load phone models dynamically and handle model requests.

## Base URL

```
https://your-api-domain.com/api
```

## Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer <your-token>
```

---

## Endpoints

### 1. Get All Phone Models

**GET** `/phone-models`

Retrieves all available phone models with their specifications.

#### Request Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Response (200 OK)

```json
{
  "success": true,
  "models": [
    {
      "id": "iphone-14",
      "name": "iPhone 14",
      "brand": "Apple",
      "frameWidth": 350,
      "frameHeight": 700,
      "printArea": {
        "x": 25,
        "y": 120,
        "width": 300,
        "height": 500
      },
      "camera": {
        "type": "dual-diagonal",
        "x": 30,
        "y": 30,
        "width": 80,
        "height": 80,
        "borderRadius": "20px"
      },
      "available": true,
      "releaseYear": 2022,
      "popularity": 95
    },
    {
      "id": "samsung-s24",
      "name": "Samsung Galaxy S24",
      "brand": "Samsung",
      "frameWidth": 350,
      "frameHeight": 720,
      "printArea": {
        "x": 25,
        "y": 125,
        "width": 300,
        "height": 510
      },
      "camera": {
        "type": "triple-vertical",
        "x": 30,
        "y": 30,
        "width": 70,
        "height": 110,
        "borderRadius": "35px"
      },
      "available": true,
      "releaseYear": 2024,
      "popularity": 88
    }
  ],
  "total": 50,
  "brands": ["Apple", "Samsung", "OnePlus", "Google", "Xiaomi"]
}
```

#### Error Response (401 Unauthorized)

```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

---

### 2. Request New Phone Model

**POST** `/phone-models/request`

Submit a request for a phone model that's not currently available.

#### Request Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body

```json
{
  "brand": "Samsung",
  "model": "Galaxy S24 Ultra",
  "email": "user@example.com"
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Model request submitted successfully",
  "requestId": "req_abc123",
  "estimatedAddDate": "2024-03-15"
}
```

#### Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Brand and model are required"
}
```

---

## Camera Types

The `camera.type` field can have the following values:

- `dual-diagonal` - Two camera lenses in diagonal arrangement (e.g., iPhone 14)
- `triple-square` - Three lenses in square module (e.g., iPhone 14 Pro)
- `triple-vertical` - Three lenses stacked vertically (e.g., Samsung S23)
- `quad-vertical` - Four lenses in vertical arrangement (e.g., Samsung S23 Ultra)
- `circular-module` - Circular camera module (e.g., OnePlus 11)

---

## Sample Backend Implementation (Node.js/Express)

### Install Dependencies

```bash
npm install express cors jsonwebtoken
```

### Server Code (`server.js`)

```javascript
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Sample phone models database
const phoneModels = [
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    brand: 'Apple',
    frameWidth: 350,
    frameHeight: 700,
    printArea: { x: 25, y: 120, width: 300, height: 500 },
    camera: {
      type: 'dual-diagonal',
      x: 30,
      y: 30,
      width: 80,
      height: 80,
      borderRadius: '20px'
    },
    available: true,
    releaseYear: 2022,
    popularity: 95
  },
  {
    id: 'iphone-14-pro',
    name: 'iPhone 14 Pro',
    brand: 'Apple',
    frameWidth: 350,
    frameHeight: 700,
    printArea: { x: 25, y: 120, width: 300, height: 500 },
    camera: {
      type: 'triple-square',
      x: 30,
      y: 30,
      width: 90,
      height: 90,
      borderRadius: '22px'
    },
    available: true,
    releaseYear: 2022,
    popularity: 92
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    brand: 'Apple',
    frameWidth: 350,
    frameHeight: 700,
    printArea: { x: 25, y: 120, width: 300, height: 500 },
    camera: {
      type: 'dual-diagonal',
      x: 30,
      y: 30,
      width: 85,
      height: 85,
      borderRadius: '22px'
    },
    available: true,
    releaseYear: 2023,
    popularity: 98
  },
  {
    id: 'samsung-s23',
    name: 'Samsung Galaxy S23',
    brand: 'Samsung',
    frameWidth: 350,
    frameHeight: 720,
    printArea: { x: 25, y: 125, width: 300, height: 510 },
    camera: {
      type: 'triple-vertical',
      x: 30,
      y: 30,
      width: 70,
      height: 110,
      borderRadius: '35px'
    },
    available: true,
    releaseYear: 2023,
    popularity: 88
  },
  {
    id: 'samsung-s24',
    name: 'Samsung Galaxy S24',
    brand: 'Samsung',
    frameWidth: 350,
    frameHeight: 720,
    printArea: { x: 25, y: 125, width: 300, height: 510 },
    camera: {
      type: 'triple-vertical',
      x: 30,
      y: 30,
      width: 72,
      height: 112,
      borderRadius: '36px'
    },
    available: true,
    releaseYear: 2024,
    popularity: 90
  },
  {
    id: 'pixel-8',
    name: 'Google Pixel 8',
    brand: 'Google',
    frameWidth: 350,
    frameHeight: 710,
    printArea: { x: 25, y: 125, width: 300, height: 500 },
    camera: {
      type: 'dual-diagonal',
      x: 30,
      y: 30,
      width: 90,
      height: 75,
      borderRadius: '38px'
    },
    available: true,
    releaseYear: 2023,
    popularity: 85
  },
  {
    id: 'oneplus-11',
    name: 'OnePlus 11',
    brand: 'OnePlus',
    frameWidth: 350,
    frameHeight: 710,
    printArea: { x: 25, y: 125, width: 300, height: 500 },
    camera: {
      type: 'circular-module',
      x: 30,
      y: 30,
      width: 95,
      height: 95,
      borderRadius: '50%'
    },
    available: true,
    releaseYear: 2023,
    popularity: 82
  }
];

// Model requests storage (in production, use a database)
const modelRequests = [];

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  // In production, verify the token properly
  // For demo, we'll accept any token
  next();
};

// GET /api/phone-models
app.get('/api/phone-models', authenticateToken, (req, res) => {
  const brands = [...new Set(phoneModels.map(m => m.brand))];
  
  res.json({
    success: true,
    models: phoneModels,
    total: phoneModels.length,
    brands: brands
  });
});

// POST /api/phone-models/request
app.post('/api/phone-models/request', authenticateToken, (req, res) => {
  const { brand, model, email } = req.body;

  if (!brand || !model) {
    return res.status(400).json({
      success: false,
      error: 'Brand and model are required'
    });
  }

  const requestId = `req_${Date.now()}`;
  const request = {
    id: requestId,
    brand,
    model,
    email,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };

  modelRequests.push(request);

  res.json({
    success: true,
    message: 'Model request submitted successfully',
    requestId: requestId,
    estimatedAddDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
});

// GET /api/phone-models/requests (admin endpoint)
app.get('/api/phone-models/requests', authenticateToken, (req, res) => {
  res.json({
    success: true,
    requests: modelRequests,
    total: modelRequests.length
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Phone Models API running on port ${PORT}`);
  console.log(`Total models available: ${phoneModels.length}`);
});
```

### Run the Server

```bash
node server.js
```

---

## Frontend Integration

The frontend automatically calls these endpoints:

1. **On component mount**: Fetches all phone models via `GET /api/phone-models`
2. **On model request**: Submits request via `POST /api/phone-models/request`

### Update API URL

In `PhoneCaseCustomizer.tsx`, update the API base URL:

```typescript
const API_BASE_URL = 'https://your-api-domain.com/api';

// In fetchPhoneModels()
const response = await fetch(`${API_BASE_URL}/phone-models`, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

// In handleRequestModel()
const response = await fetch(`${API_BASE_URL}/phone-models/request`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    brand: requestBrand,
    model: requestModel,
    email: requestEmail
  })
});
```

---

## Database Schema (MongoDB Example)

```javascript
// PhoneModel Schema
{
  _id: ObjectId,
  id: String,           // unique identifier (e.g., "iphone-14")
  name: String,         // display name
  brand: String,        // manufacturer
  frameWidth: Number,
  frameHeight: Number,
  printArea: {
    x: Number,
    y: Number,
    width: Number,
    height: Number
  },
  camera: {
    type: String,       // camera module type
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    borderRadius: String
  },
  available: Boolean,   // is this model available for orders
  releaseYear: Number,
  popularity: Number,   // for sorting
  createdAt: Date,
  updatedAt: Date
}

// ModelRequest Schema
{
  _id: ObjectId,
  brand: String,
  model: String,
  email: String,
  status: String,       // 'pending', 'approved', 'added', 'rejected'
  createdAt: Date,
  processedAt: Date
}
```

---

## Testing

### Test with cURL

```bash
# Get all models
curl -H "Authorization: Bearer test-token" \
     http://localhost:3000/api/phone-models

# Request new model
curl -X POST \
     -H "Authorization: Bearer test-token" \
     -H "Content-Type: application/json" \
     -d '{"brand":"Apple","model":"iPhone 15 Pro Max","email":"user@example.com"}' \
     http://localhost:3000/api/phone-models/request
```

---

## Features

✅ **Dynamic Model Loading** - Loads all phone models from API
✅ **Search & Filter** - Search by brand or model name
✅ **Grouped by Brand** - Models organized by manufacturer
✅ **Model Requests** - Users can request unavailable models
✅ **Fallback Support** - Uses generic template if model not found
✅ **Error Handling** - Graceful fallback to default models on API failure

---

## Next Steps

1. Set up your backend API with the endpoints above
2. Update the API URL in the frontend code
3. Implement proper authentication
4. Add database for persistent storage
5. Create admin panel to manage model requests
6. Add email notifications for model requests
