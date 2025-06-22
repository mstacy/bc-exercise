
# Express Mock Backend for Certification Request App

This project simulates a backend using Express to help frontend developers test features like:

- User login
- Viewing certification requests
- Creating and updating request status

## 📁 Files

- `server.js` — Main Express server
- `data.js` — Mock data module for users and certification requests

## ▶️ How to Run

1. Ensure Node.js is installed.
2. In the project folder, run:

```bash
npm install express cors
node server.js
```

3. The server will be available at: [http://localhost:3000](http://localhost:3000)

## 🧪 Example Requests

### Login

```bash
POST /login
{
  "username": "alice",
  "password": "password123"
}
```

### Get All Requests

```bash
GET /requests
```

### Create New Request

```bash
POST /requests
{
  "employeeId": 1,
  "employeeName": "Alice",
  "description": "React Cert",
  "estimatedBudget": 250,
  "expectedDate": "2025-09-01",
  "status": "submitted"
}
```

### Update Status

```bash
PATCH /requests/1
{
  "status": "approved"
}
```
