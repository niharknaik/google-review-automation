# 📧 Google Review Automation Tool

A complete web-based system for sending personalized Google review requests to customers via WhatsApp and SMS, with tracking and analytics—**no external APIs required**.

## 🎯 Features

✅ **Admin Dashboard**
- Add, edit, and delete customers
- Store customer names, phone numbers, and Google review links
- Real-time status tracking (Pending, Sent, Opened)

✅ **Message Generation**
- Personalized messages: "Hi {Name}, thanks for visiting us! Please leave a review: {TrackingLink}"
- One-click message preview with copy-to-clipboard functionality

✅ **WhatsApp & SMS Integration (No API)**
- Direct links using standard protocols:
  - WhatsApp: `https://wa.me/{phone}?text={message}`
  - SMS: `sms:{phone}?body={message}`
- Works on desktop and mobile

✅ **Link Tracking System**
- Custom tracking links (`/r/:id`) that log clicks
- Automatic status updates when customers open links
- Analytics dashboard showing pending, sent, and opened counts

✅ **Statistics Dashboard**
- Real-time stats: Total customers, Pending, Sent, Opened
- Sortable customer list
- Quick send buttons for fast messaging

## 🧱 Tech Stack

**Backend:**
- Node.js with Express.js
- MongoDB for data storage
- CORS enabled for frontend communication

**Frontend:**
- React 18
- Axios for API calls
- CSS3 with responsive design

**Database:**
- MongoDB (local or Atlas)

## 📦 Project Structure

```
google-review-automation/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── Customer.js           # Customer schema
│   │   └── TrackingLink.js       # Tracking analytics
│   ├── controllers/
│   │   ├── customerController.js # Customer operations
│   │   └── trackingController.js # Link tracking
│   ├── routes/
│   │   ├── customers.js          # Customer endpoints
│   │   └── tracking.js           # Tracking endpoints
│   ├── server.js                 # Express app setup
│   ├── .env.example              # Environment template
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx     # Main dashboard
│   │   │   ├── CustomerForm.jsx  # Add/edit form
│   │   │   ├── CustomerList.jsx  # Customer table
│   │   │   └── MessagePreview.jsx # Message preview
│   │   ├── services/
│   │   │   └── api.js            # API calls & helpers
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm/yarn
- MongoDB running locally or connection string to Atlas
- Modern web browser

### 1️⃣ Install MongoDB (if running locally)

**Windows:**
Download from https://www.mongodb.com/try/download/community and run the installer.

**Or use MongoDB Atlas (Cloud):**
Create a free account at https://www.mongodb.com/cloud/atlas

### 2️⃣ Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/review-automation
# Or use MongoDB Atlas: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/review-automation

# Install dependencies
npm install

# Start the server
npm start
# or for development with auto-reload:
npm run dev
```

Backend will be running on `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
cd ../frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start the development server
npm start
```

Frontend will open automatically at `http://localhost:3000`

## 📖 API Endpoints

### Customer Management

**GET** `/api/customers`
- Get all customers

**POST** `/api/customers`
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "googleReviewLink": "https://www.google.com/maps/...",
  "notes": "Optional notes"
}
```

**PUT** `/api/customers/:id`
- Update customer details

**DELETE** `/api/customers/:id`
- Delete a customer

**PATCH** `/api/customers/:id/mark-sent`
- Mark message as sent

**GET** `/api/customers/stats/overview`
- Get dashboard statistics

### Link Tracking

**GET** `/api/tracking/r/:trackingId`
- Track link click, redirect to Google review link
- Automatically updates customer status to "opened"

**GET** `/api/tracking/stats/:trackingId`
- Get tracking statistics for a link

## 🎨 UI Overview

### Dashboard
- **Top Stats:** Total, Pending, Sent, Opened customers
- **Customer Table:** View all customers with sortable columns
- **Quick Actions:** Edit, Delete, Send via WhatsApp/SMS, Mark as Sent

### Customer Row (Expanded)
- **Message Preview:** Full personalized message with tracking link
- **Copy Buttons:** Copy message and link to clipboard
- **Send Buttons:** Direct WhatsApp/SMS send (opens in separate window)
- **Status Info:** When message was sent and link was clicked

### Add/Edit Form
- **Name:** Customer name
- **Phone:** Phone number (automatically cleaned for URLs)
- **Google Review Link:** Direct link to Google review page
- **Notes:** Optional customer notes

## 🔗 How Message Links Work

### WhatsApp Link Format
```
https://wa.me/{phone}?text={encoded_message}
```
- Opens WhatsApp (web or app depending on device)
- Pre-fills message with your customer's name and tracking link
- Customer clicks "Send" manually

### SMS Link Format
```
sms:{phone}?body={encoded_message}
```
- Opens SMS app on the device
- Pre-fills message
- Customer clicks "Send" manually

### Tracking Link Format
```
http://localhost:3000/r/{trackingId}
```
- When customer clicks the link, it's logged
- Customer status changes to "opened"
- Redirects to actual Google review page

## 💾 Database Schema

### Customer Document
```javascript
{
  _id: ObjectId,
  name: String,
  phone: String,
  googleReviewLink: String,
  trackingId: String (unique UUID),
  status: "pending" | "sent" | "opened",
  messageSentAt: Date,
  linkClickedAt: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### TrackingLink Document
```javascript
{
  _id: ObjectId,
  customerId: ObjectId (ref to Customer),
  trackingId: String (same as Customer.trackingId),
  clicks: Number,
  firstClickAt: Date,
  lastClickAt: Date,
  userAgent: String,
  ipAddress: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Notes

✅ **No External APIs** - All messaging is native browser protocol
✅ **Phone Number Validation** - Basic regex pattern matching
✅ **CORS Enabled** - Frontend and backend communication secured
✅ **Data Privacy** - Customer data stored locally in MongoDB
✅ **URL Encoding** - Messages properly encoded for URL transmission

⚠️ **Recommendations:**
- Use MongoDB Atlas with authentication in production
- Add authentication/authorization to dashboard
- Use HTTPS in production
- Set secure environment variables
- Implement rate limiting for API endpoints

## 🛠️ Development

### Running Both Servers

**Terminal 1 (Backend):**
```bash
cd backend && npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend && npm start
```

### Testing Message Links

1. Add a customer
2. Click "Details" to expand
3. Click "Send via WhatsApp" or "Send via SMS"
4. The message will appear in WhatsApp/SMS with pre-filled text
5. Manually send the message to test
6. Share the tracking link with a real customer to test full flow

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `mongod` (if local)
- Check connection string in `.env`
- For MongoDB Atlas, whitelist your IP

### "CORS Error"
- Ensure backend CORS is enabled
- Frontend proxy is set in `package.json`
- Both servers running on correct ports

### "WhatsApp/SMS link not opening"
- Phone number must include country code (+1, +91, etc.)
- Links work better on devices with WhatsApp/SMS installed
- Desktop may redirect to WhatsApp Web

### "Changes not reflecting in dashboard"
- Clear browser cache
- Restart frontend: `npm start`
- Check browser console for errors
- Verify backend is running

## 📝 Environment Variables

**Backend (.env)**
```
MONGODB_URI=mongodb://localhost:27017/review-automation
PORT=5000
NODE_ENV=development
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚢 Deployment

### Deploy Backend (Heroku)
```bash
cd backend
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Then deploy the 'build' folder to Vercel/Netlify
```

Update frontend `.env` with production API URL.

## 📜 License

MIT - Feel free to use for personal and commercial projects

## 🤝 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review browser console for errors
3. Verify MongoDB connection
4. Check API response in Network tab

---

**Built with ❤️ for businesses that want to grow with reviews!**
