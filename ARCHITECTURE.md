# 🏗️ Architecture & Implementation Guide

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Dashboard   │  │    Form      │  │  Customer List   │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│         ↓                ↓                     ↓             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Message Preview & Link Generation             │  │
│  │  • Personalized messages                             │  │
│  │  • WhatsApp link (wa.me)                             │  │
│  │  • SMS link (sms:)                                   │  │
│  │  • Tracking links (/r/:id)                           │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                            ↓ (AXIOS/REST API)
┌──────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                       │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │  /api/         │  │  /api/tracking │  │   /health    │  │
│  │  customers     │  │  /r/:id        │  │              │  │
│  │  (CRUD)        │  │  (Click track) │  │              │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│         ↓                      ↓                  ↓          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Controllers & Business Logic                 │  │
│  │  • Validation                                        │  │
│  │  • Database operations                               │  │
│  │  • Status updates                                    │  │
│  │  • Tracking logic                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                            ↓ (Mongoose ODM)
┌──────────────────────────────────────────────────────────────┐
│                    MONGODB (Database)                         │
│  ┌──────────────────┐  ┌──────────────────────────────────┐ │
│  │  Customer        │  │  TrackingLink                    │ │
│  │  Collection      │  │  Collection                      │ │
│  │  ├─ _id          │  │  ├─ _id                          │ │
│  │  ├─ name         │  │  ├─ customerId (ref)             │ │
│  │  ├─ phone        │  │  ├─ trackingId                   │ │
│  │  ├─ googleReview │  │  ├─ clicks                       │ │
│  │  ├─ trackingId   │  │  ├─ firstClickAt                 │ │
│  │  ├─ status       │  │  ├─ lastClickAt                  │ │
│  │  ├─ messageSentAt│  │  ├─ userAgent                    │ │
│  │  ├─ linkClickedAt│  │  └─ ipAddress                    │ │
│  │  └─ notes        │  │                                  │ │
│  └──────────────────┘  └──────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Create Customer
```
User Input (Form)
    ↓
CustomerForm Component (validation)
    ↓
POST /api/customers (customerService.createCustomer)
    ↓
Backend: customerController.createCustomer
    ↓
Validate input
    ↓
Save to Customer collection + Create TrackingLink record
    ↓
Return customer with trackingId
    ↓
Frontend: Update customer list + Stats
```

### 2. Send Message
```
User clicks "Send via WhatsApp/SMS"
    ↓
Generate Message:
  "Hi {Name}, thanks for visiting us! Please leave a review: {TrackingLink}"
    ↓
Encode message for URL
    ↓
Generate link:
  - WhatsApp: https://wa.me/{phone}?text={encoded}
  - SMS: sms:{phone}?body={encoded}
    ↓
Open in new window (user manually sends)
    ↓
User clicks "Mark as Sent"
    ↓
PATCH /api/customers/:id/mark-sent
    ↓
Update: status = "sent", messageSentAt = now
```

### 3. Track Click
```
Customer receives message
    ↓
Customer clicks tracking link (/r/{trackingId})
    ↓
GET /api/tracking/r/:trackingId
    ↓
Backend: trackingController.trackClick
    ↓
Find Customer by trackingId
    ↓
Log click details:
  - Increment clicks counter
  - Save firstClickAt, lastClickAt
  - Record userAgent, ipAddress
    ↓
Update Customer:
  - status = "opened"
  - linkClickedAt = now
    ↓
HTTP 302 Redirect to googleReviewLink
    ↓
Customer lands on Google review page
    ↓
Frontend dashboard updates automatically
```

---

## Component Hierarchy

```
App
└── Dashboard
    ├── Stats Display
    │   ├── Total Count Card
    │   ├── Pending Count Card
    │   ├── Sent Count Card
    │   └── Opened Count Card
    │
    ├── CustomerForm
    │   ├── Name Input
    │   ├── Phone Input
    │   ├── Review Link Input
    │   └── Notes Textarea
    │
    └── CustomerList
        ├── Sort Controls
        └── Table (Expandable Rows)
            └── Expanded Row
                ├── MessagePreview
                │   ├── Full Message
                │   ├── Tracking Link
                │   ├── Copy Buttons
                │   └── Send Buttons
                └── Quick Actions
                    ├── Send WhatsApp
                    ├── Send SMS
                    └── Mark as Sent
```

---

## File Responsibilities

### Backend Files

**server.js**
- Express app initialization
- MongoDB connection
- Route mounting
- CORS setup
- Server startup

**config/db.js**
- MongoDB connection logic
- Connection error handling
- Connection pooling

**models/Customer.js**
- Customer schema definition
- Validation rules
- Default values
- Indexes

**models/TrackingLink.js**
- Tracking data schema
- Click counter
- Timestamp tracking
- Analytics fields

**controllers/customerController.js**
- CRUD operations
- Input validation
- Database queries
- Response formatting
- Error handling

**controllers/trackingController.js**
- Click tracking logic
- Status updates
- Redirect handling
- Analytics data collection

**routes/customers.js**
- Customer endpoint definitions
- Route method mapping

**routes/tracking.js**
- Tracking endpoint definitions
- Link click handler

### Frontend Files

**App.jsx**
- Root component
- CSS import

**components/Dashboard.jsx**
- Main container
- State management
- API call orchestration
- Stats display
- Form/List switching

**components/CustomerForm.jsx**
- Form UI
- Input handling
- Validation
- Submission

**components/CustomerList.jsx**
- Table rendering
- Row expansion
- Quick actions
- Sorting

**components/MessagePreview.jsx**
- Message generation
- Link formatting
- Copy functionality
- Send buttons

**services/api.js**
- API endpoint calls
- Link generation (WhatsApp, SMS, Tracking)
- Message encoding
- Base URL configuration

**index.css**
- Global styles
- Component styles
- Responsive design
- Color scheme

---

## Key Algorithms

### Message Generation
```javascript
1. Input: customer object
2. Generate tracking link: `/r/{trackingId}`
3. Create message: `Hi {name}, thanks for visiting us! Please leave a review: {trackingLink}`
4. Return message
```

### URL Encoding
```javascript
1. Input: plain text message
2. Encode special characters: 
   - Space → %20
   - Comma → %2C
   - Colon → %3A
   - Slash → %2F
3. Return encoded message
4. Append to protocol URL:
   - wa.me/{phone}?text={encoded}
   - sms:{phone}?body={encoded}
```

### Link Tracking
```javascript
1. Input: tracking ID from URL
2. Query: Find customer with matching trackingId
3. Increment: clicks++
4. Set: firstClickAt (if not set)
5. Update: lastClickAt = now
6. Store: userAgent, ipAddress
7. Update Customer:
   - status = "opened"
   - linkClickedAt = now
8. Output: HTTP 302 redirect to googleReviewLink
```

### Status Transitions
```
Created → Pending (initial state)
     ↓
Pending → Sent (user clicks "Send via WhatsApp/SMS" or "Mark as Sent")
     ↓
Sent → Opened (customer clicks tracking link)

Note: Transitions are one-way and permanent per message cycle
```

---

## Database Relationships

```
Customer (1) ──── (1) TrackingLink

Relationship:
- One customer has one tracking link
- Foreign key: Customer.trackingId = TrackingLink.trackingId
- Or: Customer._id reference in TrackingLink.customerId
```

---

## API Call Sequence (Example)

### Creating & Sending Message

```
1. POST /api/customers
   Input: {name, phone, googleReviewLink}
   Output: customer object with trackingId

2. Frontend generates message & links
   - Message: "Hi John, thanks for visiting us! Please leave a review: http://localhost:3000/r/abc123"
   - WhatsApp: "https://wa.me/1234567890?text=Hi%20John%2C%20thanks..."
   - SMS: "sms:1234567890?body=Hi%20John%2C%20thanks..."

3. User opens WhatsApp/SMS link
   - Browser handles protocol (wa.me, sms)
   - App opens with pre-filled message
   - User manually sends

4. User clicks "Mark as Sent"
   PATCH /api/customers/:id/mark-sent
   Output: customer with status="sent", messageSentAt=now

5. Customer clicks link in message
   GET /api/tracking/r/abc123
   - Backend increments clicks
   - Updates customer status="opened"
   - Redirects to Google review page

6. Frontend polls for updates
   GET /api/customers
   - Displays updated stats
   - Shows "opened" status
```

---

## Validation Rules

### Customer Creation
```javascript
{
  name: {
    required: true,
    type: string,
    minLength: 1,
    pattern: any
  },
  phone: {
    required: true,
    pattern: /^[\d\+\-\(\)\s]+$/,
    example: "+1 (234) 567-8900"
  },
  googleReviewLink: {
    required: true,
    type: url,
    pattern: starts with http/https
  },
  notes: {
    optional: true,
    type: string
  }
}
```

---

## Security Considerations

### Current Implementation (Development)
✅ Phone number validation (regex)
✅ URL parameter encoding (encodeURIComponent)
✅ No XSS: React escapes JSX content
✅ CORS enabled
✅ MongoDB injection prevention (Mongoose schema validation)

### Production Recommendations
⚠️ Add JWT authentication
⚠️ Implement rate limiting
⚠️ Use HTTPS/TLS
⚠️ Add input sanitization
⚠️ Implement CSRF protection
⚠️ Add request logging
⚠️ Set up error tracking (Sentry)
⚠️ Use environment variable validation
⚠️ Add API key authentication for external access

---

## Performance Considerations

### Current Optimizations
- Indexing on trackingId (unique)
- Indexing on customerId (foreign key)
- Pagination ready (sortable list)
- Lazy loading (expandable rows)

### Future Optimizations
- Add pagination to customer list
- Implement caching layer (Redis)
- Add database connection pooling
- Optimize query projections
- Add API response compression
- Implement lazy loading for images
- Add service worker for offline mode

---

## Error Handling

### Frontend
```javascript
try {
  API call
} catch (error) {
  Set error state
  Display error message
  Log to console
}
```

### Backend
```javascript
try {
  Business logic
  Database operation
} catch (error) {
  Log error
  Send appropriate HTTP status
  Return error message in JSON
}
```

---

## Testing Strategies

### Manual Testing
1. **Customer CRUD:** Add, edit, delete, list
2. **Message Generation:** Verify message formatting
3. **Link Generation:** Test WhatsApp/SMS links
4. **Tracking:** Click tracking link, verify redirect
5. **Status Updates:** Verify status changes

### Automated Testing
```javascript
// Unit tests for controllers
// Integration tests for API endpoints
// E2E tests for user workflows
// API contract tests
```

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB Atlas credentials set
- [ ] CORS updated for production domain
- [ ] API URL updated in frontend .env
- [ ] SSL certificate configured
- [ ] Database backups enabled
- [ ] Error logging configured
- [ ] Analytics configured
- [ ] Rate limiting enabled
- [ ] Authentication implemented
- [ ] Security headers added
- [ ] Database indexes verified

---

## Monitoring & Logging

### What to Monitor
- API response times
- Error rates
- Database connection status
- Server uptime
- Disk space
- Memory usage

### Logging Strategy
- API request/response logging
- Database operation logging
- Error stack traces
- User action logging
- Performance metrics

---

## Future Enhancement Ideas

1. **Bulk Operations**
   - CSV import
   - Bulk message sending
   - Scheduled campaigns

2. **Analytics**
   - Response rate analysis
   - Time-to-click metrics
   - Mobile vs desktop stats

3. **Communication**
   - Email templates
   - WhatsApp API integration (optional)
   - Reminder campaigns

4. **Team Management**
   - Multi-user support
   - Role-based access
   - Team performance stats

5. **Integration**
   - Google My Business API
   - Slack notifications
   - Webhook events
   - CRM integration

6. **AI Features**
   - Smart message suggestions
   - Optimal send time prediction
   - Sentiment analysis of reviews

---

This architecture provides a solid foundation for rapid development and easy scaling!
