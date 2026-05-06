# ⚡ Quick Setup Guide

## Option 1: Local Setup (Recommended for Development)

### Step 1: Install MongoDB Locally

**Windows:**
1. Download: https://www.mongodb.com/try/download/community
2. Run installer and follow prompts
3. MongoDB will run as a service automatically

**Or use MongoDB Atlas (Cloud - No Installation Needed):**
1. Create account: https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string (looks like: `mongodb+srv://user:password@cluster.mongodb.net/database`)

### Step 2: Backend Setup

```bash
cd backend

# Create .env file
copy .env.example .env

# Edit .env and add your MongoDB connection
# For local: MONGODB_URI=mongodb://localhost:27017/review-automation
# For Atlas: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/review-automation?retryWrites=true&w=majority

# Install packages
npm install

# Start server (Ctrl+C to stop)
npm start

# You should see: "MongoDB Connected: localhost" and "Server running on port 5000"
```

### Step 3: Frontend Setup

**In a NEW terminal/command prompt:**

```bash
cd frontend

# Create .env file
copy .env.example .env

# Install packages
npm install

# Start development server (Ctrl+C to stop)
npm start

# Browser will open automatically at http://localhost:3000
```

✅ **You're done! The app should now be running.**

---

## Option 2: Docker Setup (If You Have Docker Installed)

```bash
# From project root
docker-compose up

# All services will start automatically:
# - MongoDB on port 27017
# - Backend on port 5000
# - Frontend on port 3000

# Open http://localhost:3000 in your browser
```

To stop:
```bash
docker-compose down
```

---

## 🎯 First Steps After Setup

1. **Open http://localhost:3000** in your browser
2. **Click "+ Add New Customer"**
3. **Fill in the form:**
   - Name: Your customer's name
   - Phone: +1234567890 (include country code)
   - Google Review Link: Paste your Google Business profile review link
   - Notes: (optional)
4. **Click "Add Customer"**
5. **Click "Details"** to expand the customer
6. **Click "💬 Send via WhatsApp"** or **"📱 Send via SMS"**
   - A new window will open with your message pre-filled
   - Review and send the message manually
7. **Status Updates:**
   - When you send = Status shows "Sent"
   - When customer clicks link = Status shows "Opened"

---

## 🔧 Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running (Windows)
# Services > MongoDB Community Server > Status

# Or restart it:
# Services > MongoDB Community Server > Restart

# For Mac/Linux:
brew services start mongodb-community
# or
brew services restart mongodb-community
```

### "Port 5000 already in use"
```bash
# Change port in backend/.env:
PORT=5001

# Then frontend/.env:
REACT_APP_API_URL=http://localhost:5001/api
```

### "Port 3000 already in use"
```bash
# On Windows (find process using port 3000):
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### "npm command not found"
- Install Node.js from https://nodejs.org
- Restart your terminal after installation

### Frontend shows "Cannot reach server"
1. Check backend is running on port 5000
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check browser console (F12) for errors

---

## 📱 Testing WhatsApp/SMS Links

### Desktop Testing:
1. **WhatsApp:** Must have WhatsApp Web open (web.whatsapp.com) or WhatsApp Desktop installed
2. **SMS:** Opens default SMS client on Windows 11

### Mobile Testing:
1. Copy tracking link from message preview
2. Send it to a test phone number
3. Click the link on mobile to see tracking in action
4. Customer status will change to "Opened"

---

## 🚀 Next Steps

- **Customize**: Edit the Google Review link template in `CustomerForm.jsx`
- **Deploy**: See README.md for Heroku/Vercel deployment
- **Add Features**: Implement email, scheduling, or bulk uploads
- **Security**: Add login/authentication before production use

---

## 📞 Support

**If something doesn't work:**
1. Check terminal/console for error messages
2. Verify MongoDB is running
3. Clear `.env` files and copy from `.env.example` again
4. Restart both servers
5. Clear browser cache and refresh

**Useful Commands:**
```bash
# Check if port is in use
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Kill a process on Windows
taskkill /PID <number> /F

# See MongoDB logs
mongod --logpath ~/mongodb.log

# Check Node.js version
node --version
npm --version
```

---

Good luck! 🎉
