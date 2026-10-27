# SudhaarSetu - Backend API Service 🏛️

This is the standalone **Backend Service** for the SudhaarSetu Kanpur Municipal Grievance Redressal platform.

It is built with **Node.js, Express, TypeScript, and Google Gemini AI API** for intelligent civic complaint triage, tracking, and department dispatching.

---

## 📁 Folder Contents
```
backend/
├── package.json              # Backend-only dependencies (Express, CORS, Dotenv, Gemini)
├── tsconfig.json             # TypeScript configuration for Node.js
├── server.ts                 # Express Server entry point
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules for backend
├── src/
│   ├── types.ts              # Complaint, Department, and Timeline interfaces
│   ├── data.ts               # Kanpur municipal seed data & localities
│   └── routes/
│       ├── complaints.ts     # CRUD, statistics, and triage operations
│       └── ai.ts             # Gemini AI visual & text problem triage
└── README.md                 # Backend documentation & Git instructions
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
*(Optional: Add your `GEMINI_API_KEY` for AI features)*

### 3. Start the Server (Development Mode)
```bash
npm run dev
```
The server starts at `http://localhost:5000`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `GET` | `/api/complaints` | Fetch complaints (filters: `category`, `status`, `priority`, `zone`, `search`) |
| `GET` | `/api/complaints/:id` | Fetch complaint by ID (e.g. `SS-KNP-2026-001245`) |
| `POST` | `/api/complaints` | Register a new citizen complaint |
| `PATCH` | `/api/complaints/:id` | Update status, assign squad, or add resolution proof |
| `POST` | `/api/complaints/reset` | Reset demo complaints to Kanpur baseline |
| `GET` | `/api/stats` | Kanpur municipal statistics (totals, resolution %, departments) |
| `GET` | `/api/departments` | Kanpur department listings and SLAs |
| `GET` | `/api/localities` | Kanpur wards and geographic coordinates |
| `POST` | `/api/ai/analyze-issue` | AI classification & priority triage |

---

## 🤝 GitHub Collaboration Workflow (for Backend Developer)

If you are pushing this folder from your machine to the shared repository:
1. Make sure you only make changes inside the `backend/` directory.
2. Commit your changes:
   ```bash
   git add backend/
   git commit -m "feat(backend): update API routes and Kanpur department logic"
   ```
3. Pull and push:
   ```bash
   git pull origin main --rebase
   git push origin main
   ```
Since the Frontend developer only works inside `frontend/`, there will be **zero git merge conflicts**!
