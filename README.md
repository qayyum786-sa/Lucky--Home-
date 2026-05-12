# Lucky's Home Improvement Services
### Full-Stack Real Estate Web Application

---

## 🏗️ Project Structure

```
luckys-home/
├── backend/
│   ├── config/
│   │   ├── database.js       # Sequelize + MySQL connection
│   │   ├── email.js          # Nodemailer email templates
│   │   └── multer.js         # File upload configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── buyPropertyController.js
│   │   ├── rentPropertyController.js
│   │   ├── contactController.js
│   │   ├── userController.js
│   │   └── uploadController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT + role-based access
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── index.js          # DB sync + associations
│   │   ├── User.js
│   │   ├── BuyProperty.js
│   │   ├── RentProperty.js
│   │   └── ContactEnquiry.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── buyProperties.js
│   │   ├── rentProperties.js
│   │   ├── contact.js
│   │   ├── users.js
│   │   └── upload.js
│   ├── uploads/
│   │   ├── images/           # Property images
│   │   └── docs/             # PDF brochures
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   │   └── logo.jpeg
    │   ├── components/
    │   │   └── common/
    │   │       ├── Navbar.jsx
    │   │       ├── Footer.jsx
    │   │       ├── PropertyCard.jsx
    │   │       ├── ImageCarousel.jsx
    │   │       └── UI.jsx            # Shared UI components
    │   ├── hooks/
    │   │   └── useAuth.jsx           # Auth context
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── About.jsx
    │   │   ├── BuyProperties.jsx
    │   │   ├── RentProperties.jsx
    │   │   ├── PropertyDetail.jsx
    │   │   ├── Contact.jsx
    │   │   └── admin/
    │   │       ├── AdminLogin.jsx
    │   │       ├── AdminLayout.jsx
    │   │       ├── Dashboard.jsx
    │   │       ├── ManageProperties.jsx
    │   │       ├── PropertyForm.jsx
    │   │       ├── Enquiries.jsx
    │   │       └── Users.jsx
    │   ├── services/
    │   │   └── api.js               # Axios API service
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **MySQL** 8.0+
- **npm** v9+

---

## Step 1 — MySQL Database Setup

```sql
-- Open MySQL CLI or MySQL Workbench and run:
CREATE DATABASE luckys_home_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Step 2 — Backend Setup

```bash
cd backend

# Copy and configure environment variables
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=luckys_home_db
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=24h

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password     # Use Gmail App Password, not your main password
EMAIL_FROM=Lucky's Home <your_gmail@gmail.com>
ADMIN_EMAIL=admin@luckys-home.com

FRONTEND_URL=http://localhost:5173
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App passwords → Generate

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The backend will:
- Connect to MySQL and auto-create all tables
- Create default admin: `admin@luckys-home.com` / `Admin@123`
- Start on `http://localhost:5000`

---

## Step 3 — Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Step 4 — Verify Everything Works

| Page | URL |
|------|-----|
| Home | http://localhost:5173 |
| Buy Properties | http://localhost:5173/buy |
| Rent Properties | http://localhost:5173/rent |
| Contact | http://localhost:5173/contact |
| About | http://localhost:5173/about |
| Admin Login | http://localhost:5173/admin/login |
| Admin Dashboard | http://localhost:5173/admin |

**Default Admin Credentials:**
- Email: `admin@luckys-home.com`
- Password: `Admin@123`

> ⚠️ Change the admin password after first login!

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/login | Public | Login with email/password |
| POST | /api/auth/register | Public | Register new user |
| GET | /api/auth/me | Auth | Get current user |

### Buy Properties
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/buy-properties | Public | List all (supports ?search, ?location, ?propertyType, ?minPrice, ?maxPrice, ?featured, ?page, ?limit) |
| GET | /api/buy-properties/:id | Public | Get single property |
| POST | /api/buy-properties | Admin | Create property |
| PUT | /api/buy-properties/:id | Admin | Update property |
| DELETE | /api/buy-properties/:id | Admin | Delete property + files |

### Rent Properties
Same endpoints as Buy Properties at `/api/rent-properties`

### File Uploads
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/upload/images | Admin | Upload images (multipart, field: `images`) |
| POST | /api/upload/documents | Admin | Upload PDFs (multipart, field: `documents`) |

### Contact Enquiries
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/contact | Public | Submit enquiry + send emails |
| GET | /api/contact | Admin | List all enquiries |
| GET | /api/contact/:id | Admin | Get + mark as read |
| PATCH | /api/contact/:id/status | Admin | Update status |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/users/stats | Admin | Dashboard stats |
| GET | /api/users | Admin | List all users |
| POST | /api/users | Admin | Create user |
| PUT | /api/users/:id | Admin | Update user |
| DELETE | /api/users/:id | Admin | Delete user |

---

## 🔧 Production Build

```bash
# Backend: set NODE_ENV=production in .env

# Frontend: build for production
cd frontend
npm run build
# Output in frontend/dist/ — deploy to Nginx/Apache/Vercel/Netlify
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend | Node.js + Express.js |
| Database | MySQL 8 + Sequelize ORM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File Uploads | Multer |
| Email | Nodemailer |

---

## 🛡️ Security Features
- JWT authentication with 24h expiry
- bcrypt password hashing (12 rounds)
- Role-based access control (admin/user)
- Input validation via Sequelize validators
- SQL injection prevention via parameterized queries
- CORS configured for specific frontend URL
- File type + size validation on uploads
- Auto token invalidation on 401 responses
