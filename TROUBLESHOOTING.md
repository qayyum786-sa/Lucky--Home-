# 🔧 Admin Panel Troubleshooting Guide

## The screenshot shows `localhost:5000` — that's the API, not the frontend.

---

## ✅ Quick Checklist

### Step 1 — Confirm both servers are running

Open **two separate terminal windows**:

**Terminal 1 — Backend:**
```bash
cd luckys-home/backend
npm run dev
```
You should see:
```
====================================================
  Lucky's Home Improvement Services — API Server
====================================================
  API       → http://localhost:5000
  Frontend  → http://localhost:5173
====================================================
```

**Terminal 2 — Frontend:**
```bash
cd luckys-home/frontend
npm run dev
```
You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

---

### Step 2 — Access the correct URLs

| What | URL |
|------|-----|
| 🖥️ **Frontend (your app)** | **http://localhost:5173** |
| 🔑 Admin Login | **http://localhost:5173/admin/login** |
| 📊 Admin Dashboard | **http://localhost:5173/admin** |
| 🔌 API (backend only) | http://localhost:5000 |

> **The admin panel is at `localhost:5173/admin/login`, NOT `localhost:5000`**

---

### Step 3 — Admin login credentials

```
Email:    admin@luckys-home.com
Password: Admin@123
```

---

## 🚨 Common Issues & Fixes

### Issue: "Cannot connect to database"
```bash
# Make sure MySQL is running
# macOS:
brew services start mysql

# Ubuntu/Linux:
sudo service mysql start

# Windows: Start MySQL from Services or XAMPP
```

Check your `.env` file has correct values:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=luckys_home_db
DB_USER=root
DB_PASSWORD=YOUR_ACTUAL_PASSWORD   ← this must be correct
```

---

### Issue: "Cannot GET /api/auth/login" (404 from frontend)
The frontend proxies `/api/*` to port 5000 via Vite config.
Make sure **backend is running on port 5000** before starting the frontend.

```bash
# Check if backend is running:
curl http://localhost:5000/api/health
# Should return: {"success":true,"status":"ok"}
```

---

### Issue: Frontend shows blank page / import errors
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

---

### Issue: Admin login says "Invalid credentials"
The default admin is created automatically on first run.
If you already ran the backend before, the admin exists.
Try these steps:

```bash
# Option 1: Check if admin exists in MySQL
mysql -u root -p luckys_home_db -e "SELECT email, role FROM users;"

# Option 2: Manually insert admin (password is hashed by the app)
# Just restart backend — it creates admin if no admin exists
```

---

### Issue: Images not showing
Make sure the `uploads/` folders exist:
```bash
mkdir -p backend/uploads/images
mkdir -p backend/uploads/docs
```

---

### Issue: Email not sending
This is non-blocking — the app still works without email.
To enable email, set these in `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx    ← Gmail App Password (not your login password)
```

**To get Gmail App Password:**
1. Go to myaccount.google.com
2. Security → 2-Step Verification (enable it)
3. Security → App passwords
4. Select "Mail" → Generate
5. Copy the 16-character password to EMAIL_PASS

---

## 🔄 Full Reset (if nothing works)

```bash
# 1. Drop and recreate database
mysql -u root -p -e "DROP DATABASE IF EXISTS luckys_home_db; CREATE DATABASE luckys_home_db;"

# 2. Reinstall backend
cd backend
rm -rf node_modules
npm install
npm run dev

# 3. Reinstall frontend (new terminal)
cd frontend
rm -rf node_modules
npm install
npm run dev

# 4. Open http://localhost:5173/admin/login
# 5. Login: admin@luckys-home.com / Admin@123
```
