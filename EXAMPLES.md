# 📚 Complete Usage Examples

## Example 1: Adding a Customer

### Frontend - User Interaction
```
User navigates to http://localhost:3000
↓
Clicks "+ Add New Customer"
↓
Fills form:
  Name: "John Smith"
  Phone: "+1 (555) 123-4567"
  Google Review Link: "https://www.google.com/maps/place/My+Restaurant"
  Notes: "Great customer, always leaves feedback"
↓
Clicks "Add Customer"
```

### Frontend - Code Execution
```javascript
// CustomerForm.jsx - onSubmit handler
const formData = {
  name: "John Smith",
  phone: "+1 (555) 123-4567",
  googleReviewLink: "https://www.google.com/maps/place/My+Restaurant",
  notes: "Great customer, always leaves feedback"
};

// API call
customerService.createCustomer(formData);

// api.js
api.post("/customers", {
  name: "John Smith",
  phone: "+1 (555) 123-4567",
  googleReviewLink: "https://www.google.com/maps/place/My+Restaurant",
  notes: "Great customer, always leaves feedback"
});
```

### Backend - Processing
```javascript
// POST /api/customers
exports.createCustomer = async (req, res) => {
  const { name, phone, googleReviewLink, notes } = req.body;
  
  // Validation
  if (!name || !phone || !googleReviewLink) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  // Create customer document
  const customer = new Customer({
    name,
    phone: phone.trim(),
    googleReviewLink,
    notes,
    // trackingId: automatically generated UUID
    // status: "pending" by default
  });
  
  await customer.save();
  // customer.trackingId = "3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a"
  
  // Create tracking link record
  await TrackingLink.create({
    customerId: customer._id,
    trackingId: customer.trackingId,
    clicks: 0
  });
  
  res.status(201).json(customer);
};
```

### Response
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Smith",
  "phone": "+1 (555) 123-4567",
  "googleReviewLink": "https://www.google.com/maps/place/My+Restaurant",
  "trackingId": "3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a",
  "status": "pending",
  "messageSentAt": null,
  "linkClickedAt": null,
  "notes": "Great customer, always leaves feedback",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Frontend - UI Update
```javascript
// Dashboard.jsx receives response
const handleAddCustomer = async (formData) => {
  const response = await customerService.createCustomer(formData);
  // response.data = the customer object above
  
  // Refetch customers and stats
  fetchCustomers(); // Updates customer list
  fetchStats();     // Updates stats (total: 1, pending: 1)
  
  // Clear form
  setShowForm(false);
};
```

---

## Example 2: Sending a Message

### Frontend - User Interaction
```
User sees customer "John Smith" in table
↓
Clicks "Details" to expand row
↓
Sees message preview:
"Hi John Smith, thanks for visiting us! Please leave a review: http://localhost:3000/r/3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a"
↓
Clicks "💬 Send via WhatsApp"
```

### Frontend - Link Generation (MessagePreview.jsx)
```javascript
const trackingLink = generateTrackingLink(customer.trackingId);
// Output: "http://localhost:3000/r/3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a"

const message = `Hi ${customer.name}, thanks for visiting us! Please leave a review: ${trackingLink}`;
// Output: "Hi John Smith, thanks for visiting us! Please leave a review: http://localhost:3000/r/3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a"

const whatsappLink = generateWhatsAppLink(customer.phone, message);

// api.js
export const generateWhatsAppLink = (phone, message) => {
  const cleanPhone = phone.replace(/\D/g, "");
  // "+1 (555) 123-4567" → "15551234567"
  
  const encodedMessage = encodeURIComponent(message);
  // Encodes special characters for URL
  // "Hi John, thanks... review: http://..." 
  // → "Hi%20John%2C%20thanks...%20http%3A%2F%2F..."
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  // Output: "https://wa.me/15551234567?text=Hi%20John%20Smith%2C%20thanks..."
};
```

### Browser Behavior
```
WhatsApp Link Clicked
↓
Browser recognizes "https://wa.me/" protocol
↓
If WhatsApp Web is open in another tab:
  Opens WhatsApp Web with message pre-filled
↓
If WhatsApp Desktop is installed:
  Opens WhatsApp Desktop with message pre-filled
↓
If neither available:
  Redirects to WhatsApp Web (web.whatsapp.com)
↓
Message shows in chat composer:
"Hi John Smith, thanks for visiting us! Please leave a review: http://localhost:3000/r/3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a"
↓
User reviews message and clicks "Send"
```

### Frontend - Mark as Sent
```javascript
// CustomerList.jsx - handleQuickSend
const handleQuickSend = (customer, via) => {
  // Generate links and open
  const link = (via === "whatsapp") 
    ? generateWhatsAppLink(customer.phone, message)
    : generateSMSLink(customer.phone, message);
  
  window.open(link, "_blank");
  
  // After 500ms, mark as sent
  setTimeout(() => {
    onMarkSent(customer._id);
  }, 500);
};

// Dashboard.jsx
const handleMarkSent = async (id) => {
  await customerService.markAsSent(id);
  // Calls: PATCH /api/customers/:id/mark-sent
  fetchCustomers();
  fetchStats();
};
```

### Backend - Update Status
```javascript
// customerController.js
exports.markAsSent = async (req, res) => {
  const { id } = req.params;
  
  const customer = await Customer.findByIdAndUpdate(
    id,
    { 
      status: "sent", 
      messageSentAt: new Date()
    },
    { new: true }
  );
  
  res.json(customer);
};
```

### Database Update
```javascript
// Before
{
  _id: "507f1f77bcf86cd799439011",
  name: "John Smith",
  status: "pending",           // ← Changed
  messageSentAt: null,         // ← Changed
  // ...
}

// After
{
  _id: "507f1f77bcf86cd799439011",
  name: "John Smith",
  status: "sent",              // ← Now "sent"
  messageSentAt: ISODate("2024-01-15T10:45:00.000Z"),  // ← Timestamp added
  // ...
}
```

### Frontend - UI Update
```
Customer status badge changes:
"pending" (orange) → "sent" (blue)

Dashboard stats update:
pending: 1 → 0
sent: 0 → 1

Message appears:
"✓ Sent: 2024-01-15 at 10:45 AM"
```

---

## Example 3: Customer Clicks Link

### Customer Action
```
Customer receives WhatsApp message:
"Hi John Smith, thanks for visiting us! Please leave a review: http://localhost:3000/r/3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a"
↓
Customer clicks the link
```

### Frontend - Tracking Request
```
Click on: http://localhost:3000/r/3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a
↓
Browser sends:
GET /api/tracking/r/3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a
Headers:
  User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X)...
  Accept: text/html,application/xhtml+xml...
Request IP: 192.168.1.100
```

### Backend - Track Click (trackingController.js)
```javascript
exports.trackClick = async (req, res) => {
  const { id } = req.params; // "3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a"
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip; // "192.168.1.100"
  
  // Find customer
  const customer = await Customer.findOne({ trackingId: id });
  // customer._id = "507f1f77bcf86cd799439011"
  // customer.googleReviewLink = "https://www.google.com/maps/place/My+Restaurant"
  
  // Update tracking link
  const trackingLink = await TrackingLink.findOneAndUpdate(
    { trackingId: id },
    {
      $inc: { clicks: 1 },           // Increment clicks
      lastClickAt: new Date(),        // Update timestamp
      $setOnInsert: { firstClickAt: new Date() }, // Set on first click
      userAgent,                      // Store user agent
      ipAddress                       // Store IP address
    },
    { upsert: true, new: true }
  );
  
  // Update customer status
  await Customer.findByIdAndUpdate(customer._id, {
    status: "opened",
    linkClickedAt: new Date()
  });
  
  // Redirect to Google review link
  res.redirect(customer.googleReviewLink);
};
```

### Database Updates

**TrackingLink Document (First Click)**
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  customerId: ObjectId("507f1f77bcf86cd799439011"),
  trackingId: "3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a",
  clicks: 1,                           // ← Incremented
  firstClickAt: ISODate("2024-01-15T14:00:00.000Z"),  // ← Set on first
  lastClickAt: ISODate("2024-01-15T14:00:00.000Z"),   // ← Set on first
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2...",
  ipAddress: "192.168.1.100",
  createdAt: ISODate("2024-01-15T10:30:00.000Z"),
  updatedAt: ISODate("2024-01-15T14:00:00.000Z")
}
```

**Customer Document**
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "John Smith",
  phone: "+1 (555) 123-4567",
  googleReviewLink: "https://www.google.com/maps/place/My+Restaurant",
  trackingId: "3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a",
  status: "opened",                    // ← Changed from "sent"
  messageSentAt: ISODate("2024-01-15T10:45:00.000Z"),
  linkClickedAt: ISODate("2024-01-15T14:00:00.000Z"),  // ← New timestamp
  notes: "Great customer, always leaves feedback",
  createdAt: ISODate("2024-01-15T10:30:00.000Z"),
  updatedAt: ISODate("2024-01-15T14:00:00.000Z")
}
```

### Browser Behavior
```
HTTP 302 Redirect Response:
Location: https://www.google.com/maps/place/My+Restaurant
↓
Browser follows redirect
↓
Customer lands on Google Business profile
↓
Customer can now leave a review
```

### Frontend - Dashboard Update (Next Fetch)
```javascript
// Next time customer list is fetched (auto-refresh or manual)
const response = await customerService.getAllCustomers();

// The customer data now shows:
{
  name: "John Smith",
  status: "opened",  // ← Changed from "sent"
  linkClickedAt: ISODate("2024-01-15T14:00:00.000Z"),  // ← Now populated
  // ...
}

// Dashboard updates:
// ✓ Status badge changes to green "OPENED"
// ✓ "Link Clicked: 2024-01-15 at 2:00 PM" appears
// ✓ Stats update: opened: 0 → 1
```

---

## Example 4: Second Customer Clicks Link

### Database Update (Second Click)
```javascript
{
  customerId: ObjectId("507f1f77bcf86cd799439011"),
  trackingId: "3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a",
  clicks: 2,                           // ← Incremented (second click)
  firstClickAt: ISODate("2024-01-15T14:00:00.000Z"),  // ← Unchanged
  lastClickAt: ISODate("2024-01-15T14:05:30.000Z"),   // ← Updated
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...", // ← New UA
  ipAddress: "203.0.113.45",          // ← Different IP
  // ...
}
```

---

## Example 5: Dashboard Statistics

### Real-time Stats Display

```
After all operations:

┌─────────────────────────────────────────────┐
│  Total: 10  │  Pending: 3  │  Sent: 5  │  Opened: 2  │
└─────────────────────────────────────────────┘

Query results:
GET /api/customers/stats/overview

Response:
{
  total: 10,      // Count all customers
  pending: 3,     // Count where status = "pending"
  sent: 5,        // Count where status = "sent"
  opened: 2       // Count where status = "opened"
}
```

### Database Aggregation
```javascript
// customerController.js
exports.getCustomerStats = async (req, res) => {
  const total = await Customer.countDocuments();
  // SELECT COUNT(*) FROM customers;
  
  const pending = await Customer.countDocuments({ status: "pending" });
  // SELECT COUNT(*) FROM customers WHERE status = 'pending';
  
  const sent = await Customer.countDocuments({ status: "sent" });
  // SELECT COUNT(*) FROM customers WHERE status = 'sent';
  
  const opened = await Customer.countDocuments({ status: "opened" });
  // SELECT COUNT(*) FROM customers WHERE status = 'opened';
  
  res.json({ total, pending, sent, opened });
};
```

---

## Example 6: Get Tracking Analytics

### API Request
```
GET /api/tracking/stats/3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a
```

### Backend Processing
```javascript
exports.getTrackingStats = async (req, res) => {
  const { id } = req.params;
  
  const tracking = await TrackingLink.findOne({ trackingId: id });
  const customer = await Customer.findById(tracking.customerId);
  
  res.json({
    customer: customer.name,      // "John Smith"
    clicks: tracking.clicks,       // 2
    firstClickAt: tracking.firstClickAt,  // ISODate("2024-01-15T14:00:00Z")
    lastClickAt: tracking.lastClickAt     // ISODate("2024-01-15T14:05:30Z")
  });
};
```

### Response
```json
{
  "customer": "John Smith",
  "clicks": 2,
  "firstClickAt": "2024-01-15T14:00:00.000Z",
  "lastClickAt": "2024-01-15T14:05:30.000Z"
}
```

---

## Example 7: Bulk Operations

### Admin Actions - Edit Customer
```
User clicks "Edit" on customer row
↓
Form pre-fills with existing data:
{
  name: "John Smith",
  phone: "+1 (555) 123-4567",
  googleReviewLink: "https://www.google.com/maps/place/My+Restaurant"
}
↓
User changes:
  name: "John Smith Jr." (edited)
  phone: "+1 (555) 123-4567" (same)
  googleReviewLink: "https://www.google.com/maps/place/My+Restaurant" (same)
↓
Clicks "Update Customer"
```

### Backend - Update
```javascript
// PUT /api/customers/507f1f77bcf86cd799439011
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, phone, googleReviewLink, notes } = req.body;
  
  const customer = await Customer.findByIdAndUpdate(
    id,
    { name, phone, googleReviewLink, notes },
    { new: true }  // Return updated document
  );
  
  res.json(customer);
};
```

### Admin Actions - Delete Customer
```
User clicks "Delete" on customer row
↓
Confirmation dialog: "Delete John Smith Jr.?"
↓
User clicks "Confirm"
↓
Calls: DELETE /api/customers/507f1f77bcf86cd799439011
```

### Backend - Delete
```javascript
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  
  // Delete customer
  const customer = await Customer.findByIdAndDelete(id);
  
  // Clean up associated tracking data
  await TrackingLink.deleteOne({ customerId: id });
  
  res.json({ message: "Customer deleted" });
};
```

---

## Testing the Complete Workflow

### Step 1: Add Customer
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "phone": "+1234567890",
    "googleReviewLink": "https://www.google.com/maps/place/test"
  }'
```

### Step 2: Get Customer ID
```bash
curl http://localhost:5000/api/customers
# Copy the trackingId from response
```

### Step 3: Simulate Click
```bash
# This will redirect (add -L flag to follow)
curl -L http://localhost:5000/api/tracking/r/{trackingId}
```

### Step 4: Check Tracking Stats
```bash
curl http://localhost:5000/api/tracking/stats/{trackingId}
```

### Step 5: Verify Status Update
```bash
curl http://localhost:5000/api/customers
# Should show status="opened"
```

---

This covers the complete user journey from customer creation through review link tracking!
