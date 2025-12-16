# 🎓 Student Performance Analysis (SPA) – Backend

A **production-ready Django REST backend** for analyzing student academic performance, recommending career domains, and generating personalized learning roadmaps. This backend is designed to be consumed by a **React frontend** and is **Tech-Expo / Hackathon ready**.

---

## 🚀 Features

### 🔐 Authentication & Security

* JWT-based Authentication (Login / Refresh)
* Student & Admin roles
* Secure, stateless APIs
* PostgreSQL database

### 📊 Academic Analysis

* Semester-wise (up to 6) subject marks
* Subject-wise performance analysis
* Strength / Weakness identification

### 🤖 Career Recommendation (AI-ready)

* Feature extraction from academic data
* Explainable rule-based recommendation engine
* ML-ready pipeline (easy to plug trained models)

### 🗺️ Personalized Roadmap

* Career-specific learning roadmap
* Foundation → Core → Advanced stages
* Frontend-friendly structured JSON

---

## 🧱 Tech Stack

* **Backend:** Django 4.x, Django REST Framework
* **Auth:** JWT (SimpleJWT)
* **Database:** PostgreSQL
* **ML Stack:** NumPy, Pandas, Scikit-learn (pipeline-ready)
* **Frontend (separate):** React (to be built by frontend team)

---

## 📁 Project Structure

```
SPA_Backend/
│── manage.py
│── requirements.txt
│── .env               # NOT committed (create locally)
│── .gitignore
│
├── spa_backend/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── apps/
│   ├── accounts/      # Auth & User roles
│   ├── academics/     # Semester-wise marks
│   ├── analysis/      # Performance analysis
│   ├── ml_engine/     # Career recommendation logic
│   └── roadmap/       # Personalized roadmap generation
```

---

## ⚙️ Backend Setup Instructions (IMPORTANT)

Follow these steps **exactly** to get the backend running locally.

---

### 1️⃣ Clone the Repository

```bash
git clone <REPO_URL>
cd SPA_Backend
```

---

### 2️⃣ Create Virtual Environment (Recommended)

```bash
python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows
```

---

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 4️⃣ Create `.env` File

Create a file named `.env` in the root directory:

```env
SECRET_KEY=django-insecure-change-this
DEBUG=False

DB_NAME=spa_db
DB_USER=spa_user
DB_PASSWORD=strong_password
DB_HOST=localhost
DB_PORT=5432
```

⚠️ **Never commit `.env` to GitHub**.

---

### 5️⃣ PostgreSQL Setup

Ensure PostgreSQL is installed and running.

Create database & user:

```sql
CREATE USER spa_user WITH PASSWORD 'strong_password';
CREATE DATABASE spa_db OWNER spa_user;
GRANT ALL PRIVILEGES ON DATABASE spa_db TO spa_user;
```

---

### 6️⃣ Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

### 7️⃣ Create Admin User

```bash
python manage.py createsuperuser
```

---

### 8️⃣ Run Server

```bash
python manage.py runserver
```

Backend will be live at:

```
http://127.0.0.1:8000/
```

Admin Panel:

```
http://127.0.0.1:8000/admin/
```

---

## 🔑 API Endpoints (For React Frontend)

### 🔐 Authentication

* **Register**
  `POST /api/auth/register/`

* **Login (JWT)**
  `POST /api/auth/login/`

* **Refresh Token**
  `POST /api/auth/refresh/`

---

### 📊 Academics

* **Add Semester Result**
  `POST /api/academics/add/`

* **Get My Results**
  `GET /api/academics/my-results/`

---

### 📈 Performance Analysis

* **Get Performance Report**
  `GET /api/analysis/performance/`

---

### 🤖 Career Recommendation

* **Get Career Domains**
  `GET /api/career/recommend/`

---

### 🗺️ Personalized Roadmap

* **Generate Roadmap**
  `GET /api/roadmap/generate/`

---

## 🔐 Authentication Usage (React)

For protected APIs, send header:

```
Authorization: Bearer <ACCESS_TOKEN>
```

---

## 🧠 Notes for Frontend Developer

* Backend is **API-first** (no HTML views)
* All responses are **JSON**
* JWT is required for all non-auth endpoints
* Roadmap & recommendations are **dynamic per user**

---

## 🏆 Tech Expo Summary (Use This)

> This system analyzes semester-wise academic performance, recommends suitable career domains using explainable AI logic, and generates personalized learning roadmaps through secure REST APIs.

---

## 📌 Status

✅ Backend feature-complete
🚀 Ready for React integration
🧠 ML-ready architecture
🎯 Tech-Expo ready

---

**Built with ❤️ for performance analysis & smart career guidance.**
