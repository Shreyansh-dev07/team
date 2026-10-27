# SudhaarSetu - Frontend Web Application 🎨

This is the standalone **Frontend Client** for the SudhaarSetu Kanpur Municipal Grievance Redressal platform.

It is built with **Vite, React 19, Tailwind CSS, Leaflet GIS Maps, and Vanilla Web Standards** for high-performance citizen accessibility.

---

## 📁 Folder Contents
```
frontend/
├── package.json              # Frontend-only dependencies (React, Vite, Tailwind, Lucide, Motion)
├── tsconfig.json             # TypeScript configuration for Vite
├── vite.config.ts            # Vite config with /api proxy to backend (port 5000)
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules for frontend
├── index.html                # Public Landing Page & Civic Issue Categories
├── report.html               # 5-Step Civic Grievance Reporting Wizard
├── track.html                # Live Complaint Tracking & Progress Timeline
├── map.html                  # Interactive Kanpur GIS Issues Map (Leaflet)
├── dashboard.html            # Citizen Workspace & Complaints History
├── admin.html                # Kanpur Municipal Department Nodal Console
├── css/
│   └── style.css             # Government-grade stylesheet (Tricolor ribbon, responsive)
├── js/
│   ├── script.js             # Shared Kanpur wards, local storage fallback & Hindi/Eng translation
│   ├── report.js             # Wizard, camera upload, AI triage call, duplicate detection
│   ├── track.js              # Tracking search, timeline status steps, resolution proof
│   ├── map.js                # Leaflet OpenStreetMap canvas, colored markers, zone filter
│   ├── dashboard.js          # Citizen metrics and complaint cards
│   └── admin.js              # Department queue triage, status change modal & squad assignment
├── src/
│   ├── App.tsx               # React SPA component
│   ├── main.tsx              # React DOM entry point
│   └── index.css             # Tailwind CSS imports
└── README.md                 # Frontend documentation & Git instructions
```

---

## 🚀 Getting Started (Independent Run)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `VITE_BACKEND_URL` is set to `http://localhost:5000`.

### 3. Start Frontend Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 🔗 Connecting with Backend
During local development, `vite.config.ts` automatically proxies all requests starting with `/api` to `http://localhost:5000`.
Even if the backend server is not running, the frontend includes a transparent **client-side LocalStorage fallback** preloaded with Kanpur test tickets (`SS-KNP-2026-001245` to `001249`), so every page, form submission, and status update works without errors.

---

## 🤝 GitHub Collaboration Workflow (for Frontend Developer)

If you are pushing this folder from your machine to the shared repository:
1. Make sure you only make changes inside the `frontend/` directory.
2. Commit your changes:
   ```bash
   git add frontend/
   git commit -m "feat(frontend): improve Kanpur civic reporting wizard and styles"
   ```
3. Pull and push:
   ```bash
   git pull origin main --rebase
   git push origin main
   ```
Since the Backend developer only works inside `backend/`, there will be **zero git merge conflicts**!
