# Lead Management System (CRM)

A robust Lead Management System built with the MERN stack (MongoDB, Express, React, Node.js). This system allows administrators to manage leads, track their status, upload documents/images, and send notifications.

##  Features

- **Authentication**: JWT-based secure admin registration and login.
- **Lead Management**:
  - Add leads with Name, Email, Phone, and Status.
  - CRUD operations (Create, Read, Update, Delete).
  - Search and filter leads by name, email, or status.
  - Update lead status (New, Contacted, Converted).
- **Image Upload**: Support for lead profile images or documents using **Multer**.
- **Validation**: Request data validation using **Joi**.
- **Email Notifications**: Automated email notifications to leads on status updates using **Nodemailer**.
- **Responsive Design**: Modern, glassmorphic UI built with **Tailwind CSS** and **Lucide Icons**.

##  Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Axios, Lucide React, React Hot Toast.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas.
- **Additional**: Multer (File Upload), Joi (Validation), JWT (Auth), Nodemailer (Email).

##  Project Structure

```text
lead-management-system/
├── client/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.tsx
├── server/          # Backend (Node + Express)
│   ├── config/      # DB connection
│   ├── controllers/ # Route handlers
│   ├── middleware/  # Auth & Upload
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API endpoints
│   └── validation/  # Joi schemas
└── README.md
```

##  Setup Instructions

### Prerequisites

- Node.js installed
- MongoDB Atlas account (for connection string)

### 1. Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the `server` directory and add:
   ```env
   PORT=5000
   MONGO_URL=your_mongodb_atlas_url
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```
4. Run the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   npm run dev
   ```

##  API Documentation

- `POST /api/admin/register`: Register a new admin account.
- `POST /api/admin/login`: Login to admin dashboard.
- `GET /api/leads`: Fetch all leads (Protected).
- `POST /api/leads`: Create a new lead (Protected, handles Multer upload).
- `PUT /api/leads/:id`: Update lead details or status (Protected).
- `DELETE /api/leads/:id`: Remove a lead (Protected).

##  Author

Implemented as an assignment task with high aesthetic standards.
