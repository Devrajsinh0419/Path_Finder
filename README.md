# 🎯 Path Finder (SPA – Student Performance Analyzer)

Path Finder is a **full-stack web platform** that analyzes a student’s academic performance and provides **career domain recommendations** using **rule-based logic + ML-assisted scoring**.

It supports **PDF grade sheet uploads**, **manual marks entry**, semester-wise analytics, CGPA/SGPA calculation, and domain prediction — all deployed **live on free-tier infrastructure**.

---

## 🚀 Live Demo

- **Frontend (Vercel)**: https://path-finder-five-eta.vercel.app  
- **Backend (Render)**: https://path-finder-p6ws.onrender.com  

---

## 🧩 Core Features

### 📄 PDF Grade Sheet Upload
- Upload semester-wise **official grade sheet PDFs**
- Automatically extracts:
  - Subject names
  - Grades
  - Converts grades → marks
- **PDF file is discarded** after processing (no cloud storage bloat)
- Robust table-based parsing using `pdfplumber`

### ✍️ Manual Marks Entry
- Alternative for users without PDFs
- Semester-wise subject + marks input
- Backend validation to avoid inconsistent data

### 📊 Academic Analysis
- Semester-wise:
  - Subject list
  - Marks
  - Grades
  - SGPA
- Overall CGPA calculation
- Weak & strong subject identification

### 🧠 Career Domain Recommendation
- Domains include:
  - Frontend Development
  - Backend Development
  - AI / ML
  - Data Science
  - Cybersecurity
  - DevOps
  - Mobile Development
  - IoT
  - Blockchain
  - Game Development
- Uses:
  - Subject keyword classification
  - Weighted averaging
  - ML-assisted predictor (with safe fallback logic)

### 🔐 Authentication
- JWT-based authentication
- Secure access to user-specific academic data

### 🩺 Health Check Endpoint
- Lightweight `/health/` endpoint
- Used to keep free-tier backend awake

---

## 🏗️ Tech Stack

### Backend
- **Django 4.2**
- **Django REST Framework**
- **JWT Authentication**
- **PostgreSQL (Neon)**
- **Gunicorn**
- **pdfplumber** (PDF table extraction)
- **scikit-learn** (ML support)

### Frontend
- **React + TypeScript**
- **Vite**
- **Axios**
- **Tailwind CSS**
- **ShadCN UI**

### Hosting (Free Tier)
- **Backend**: Render
- **Frontend**: Vercel
- **Database**: Neon (PostgreSQL)

---

## 📁 Project Structure (Simplified)
Path_Finder/
│
├── SPA_Backend/
│ ├── apps/
│ │ ├── academics/
│ │ │ ├── views.py
│ │ │ ├── pdf_extractor.py
│ │ │ ├── models.py
│ │ │ └── urls.py
│ │ └── ml_engine/
│ │ ├── predictor.py
│ │ └── model.pkl
│ └── spa_backend/
│ └── settings.py
│
└── front_end/
├── src/
│ ├── pages/
│ ├── lib/api.ts
│ └── components/


---

## 🧪 PDF Parsing Strategy (Important)

- Uses **table extraction**, not OCR
- Does **not assume fixed column positions**
- Dynamically detects:
  - Subject codes
  - Subject names
  - Grades
- Designed to handle real-world university PDFs with merged cells and layout inconsistencies

---

## ⚠️ Known Limitations (Accepted by Design)

- Backend may **sleep after inactivity** (free-tier constraint)
- ML model falls back to rule-based logic if model file is unavailable
- PDF parsing depends on table structure (scanned PDFs not supported yet)

All limitations are **gracefully handled** — no crashes, no broken UX.

---

## 🧠 Why This Project Matters

Path Finder solves **real academic problems**:
- Prevents fake mark entry
- Avoids unnecessary cloud storage costs
- Converts raw academic data into **actionable career insights**
- Built with **production-like architecture** despite free-tier constraints

---

## 👥 Team

Built with grit, debugging, and zero sleep by a passionate team of developers.

Special shoutout to the backend & systems work that made this rock-solid 💪

---

## 📜 License

This project is for **academic and demonstration purposes**.  
Feel free to fork, learn, and extend.

---

## ✅ Status

**🟢 LIVE | 🟢 STABLE | 🟢 EVALUATION-READY**

All major issues resolved.  
PDF upload, manual entry, analysis, and deployment are working as intended.

---


