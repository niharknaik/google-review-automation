# API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

---

## Customer Endpoints

### 1. Get All Customers

```
GET /customers
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "phone": "+1234567890",
    "googleReviewLink": "https://www.google.com/maps/place/...",
    "trackingId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "status": "pending",
    "messageSentAt": null,
    "linkClickedAt": null,
    "notes": "VIP Customer",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### 2. Create Customer

```
POST /customers
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "phone": "+19876543210",
  "googleReviewLink": "https://www.google.com/maps/place/YourBusiness",
  "notes": "Loyal customer"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Jane Smith",
  "phone": "+19876543210",
  "googleReviewLink": "https://www.google.com/maps/place/YourBusiness",
  "trackingId": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
  "status": "pending",
  "messageSentAt": null,
  "linkClickedAt": null,
  "notes": "Loyal customer",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

**Validation:**
- `name` (required): Non-empty string
- `phone` (required): Valid phone format with optional +
- `googleReviewLink` (required): Valid URL
- `notes` (optional): String

---

### 3. Update Customer

```
PUT /customers/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "phone": "+19876543210",
  "googleReviewLink": "https://www.google.com/maps/place/UpdatedLink",
  "notes": "Updated notes"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Jane Smith Updated",
  "phone": "+19876543210",
  "googleReviewLink": "https://www.google.com/maps/place/UpdatedLink",
  "trackingId": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
  "status": "pending",
  "messageSentAt": null,
  "linkClickedAt": null,
  "notes": "Updated notes",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:30:00.000Z"
}
```

---

### 4. Delete Customer

```
DELETE /customers/:id
```

**Response (200):**
```json
{
  "message": "Customer deleted"
}
```

**Response (404):**
```json
{
  "error": "Customer not found"
}
```

---

### 5. Mark Customer as Sent

```
PATCH /customers/:id/mark-sent
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Jane Smith",
  "phone": "+19876543210",
  "googleReviewLink": "https://www.google.com/maps/place/YourBusiness",
  "trackingId": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
  "status": "sent",
  "messageSentAt": "2024-01-15T11:45:00.000Z",
  "linkClickedAt": null,
  "notes": "Loyal customer",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:45:00.000Z"
}
```

---

### 6. Get Customer Statistics

```
GET /customers/stats/overview
```

**Response (200):**
```json
{
  "total": 150,
  "pending": 45,
  "sent": 78,
  "opened": 27
}
```

---

## Tracking Endpoints

### 1. Track Link Click

```
GET /tracking/r/:trackingId
```

**Behavior:**
1. Logs the click
2. Updates customer status to "opened"
3. Records timestamp and user agent
4. Redirects to customer's Google review link

**Response:**
- HTTP 302 Redirect to customer's googleReviewLink
- Sets up tracking data in database

**Example:**
```
GET /tracking/r/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

Tracking data saved:
```json
{
  "_id": "607g2g88cdg97de810540122",
  "customerId": "507f1f77bcf86cd799439011",
  "trackingId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "clicks": 1,
  "firstClickAt": "2024-01-15T12:00:00.000Z",
  "lastClickAt": "2024-01-15T12:00:00.000Z",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "ipAddress": "192.168.1.100",
  "createdAt": "2024-01-15T12:00:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

---

### 2. Get Tracking Statistics

```
GET /tracking/stats/:trackingId
```

**Response (200):**
```json
{
  "customer": "John Doe",
  "clicks": 3,
  "firstClickAt": "2024-01-15T12:00:00.000Z",
  "lastClickAt": "2024-01-15T14:30:00.000Z"
}
```

**Response (404):**
```json
{
  "error": "Tracking data not found"
}
```

---

## Health Check

```
GET /health
```

**Response (200):**
```json
{
  "status": "Backend is running"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 404 Not Found
```json
{
  "error": "Customer not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Message Link Generation (Frontend)

The frontend generates these links dynamically:

### WhatsApp Link
```javascript
const message = `Hi John, thanks for visiting us! Please leave a review: https://yoursite.com/r/a1b2c3d4-e5f6-7890-abcd-ef1234567890`;
const encodedMessage = encodeURIComponent(message);
const whatsappLink = `https://wa.me/11234567890?text=${encodedMessage}`;
```

**Output:**
```
https://wa.me/11234567890?text=Hi%20John%2C%20thanks%20for%20visiting%20us%21%20Please%20leave%20a%20review%3A%20https%3A%2F%2Fyoursite.com%2Fr%2Fa1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### SMS Link
```javascript
const smsLink = `sms:11234567890?body=${encodedMessage}`;
```

**Output:**
```
sms:11234567890?body=Hi%20John%2C%20thanks%20for%20visiting%20us%21%20Please%20leave%20a%20review%3A%20https%3A%2F%2Fyoursite.com%2Fr%2Fa1b2c3d4-e5f6-7890-abcd-ef1234567890
```

---

## Tracking Flow

```
1. Customer Added
   └─> trackingId generated (UUID)
   └─> Initial tracking record created

2. Message Sent
   └─> status → "sent"
   └─> messageSentAt = timestamp

3. Customer Clicks Link
   └─> GET /tracking/r/:trackingId
   └─> Tracking clicks incremented
   └─> status → "opened"
   └─> linkClickedAt = timestamp
   └─> Redirects to Google review link

4. Analytics
   └─> GET /tracking/stats/:trackingId
   └─> Returns click count and timestamps
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production:

**Recommended:**
- 100 requests per minute per IP
- 1000 requests per hour per user
- Implement using `express-rate-limit` package

---

## Authentication

Currently, no authentication is required. For production:

**Recommended:**
- JWT token-based authentication
- Store token in httpOnly cookies
- Validate token on protected routes

---

## CORS

Allowed origins:
- `http://localhost:3000` (development)
- Update in `server.js` for production domains

---

## Example cURL Commands

### Get All Customers
```bash
curl -X GET http://localhost:5000/api/customers
```

### Create Customer
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+1234567890",
    "googleReviewLink": "https://www.google.com/maps/place/..."
  }'
```

### Mark as Sent
```bash
curl -X PATCH http://localhost:5000/api/customers/507f1f77bcf86cd799439011/mark-sent
```

### Track Click
```bash
curl -X GET http://localhost:5000/api/tracking/r/a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -L  # Follow redirect
```

### Get Tracking Stats
```bash
curl -X GET http://localhost:5000/api/tracking/stats/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 302 | Redirect - Tracking link redirect |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## Version History

**v1.0.0** (Current)
- Customer CRUD operations
- Link tracking with click counting
- WhatsApp/SMS link generation
- Statistics dashboard

---

## Future Enhancements

- [ ] Bulk customer import (CSV)
- [ ] Email reminders
- [ ] Scheduled message sending
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Custom message templates
- [ ] Team management
- [ ] API key authentication
