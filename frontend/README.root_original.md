# 🏛️ SudhaarSetu (सुधार सेतु) — Kanpur Civic Issue Portal

> **“Your Issue. Our Responsibility. Better Kanpur.”**  
> Civic grievance reporting, automated department routing, and live resolution tracking for the citizens and municipal divisions of **Kanpur Nagar, Uttar Pradesh**.

---

## 📂 Project Architecture (Clean Monorepo Separation)

As requested, this project is cleanly separated into two independent folders (**`frontend/`** and **`backend/`**) with isolated package management, configurations, and Git boundaries so that two different developers can work on their respective parts and push to the same GitHub repository without any merge conflicts.

```
sudhaarsetu/
│
├── 🎨 frontend/                     # FRONTEND FOLDER (Assigned to Developer 1)
│   ├── package.json                 # Only Frontend packages (React 19, Tailwind, Vite, Lucide)
│   ├── vite.config.ts               # Vite configuration + API Proxy to Backend (port 5000)
│   ├── tsconfig.json                # Frontend TypeScript config
│   ├── .env.example                 # Frontend environment template
│   ├── .gitignore                   # Frontend gitignore rules
│   ├── index.html                   # Public Portal Home Page
│   ├── report.html                  # 5-Step Civic Grievance Wizard
│   ├── track.html                   # Real-time Status Tracker & Timeline
│   ├── map.html                     # Kanpur GIS Issues Map (Interactive Leaflet)
│   ├── dashboard.html               # Citizen Complaints History Dashboard
│   ├── admin.html                   # Department Nodal Officer Console
│   ├── css/style.css                # Official Government Design System
│   ├── js/                          # Client Scripts (script.js, report.js, track.js, map.js, admin.js)
│   ├── src/                         # React 19 SPA source (App.tsx, main.tsx, index.css)
│   └── README.md                    # Developer 1 Guide
│
├── ⚙️ backend/                      # BACKEND FOLDER (Assigned to Developer 2)
│   ├── package.json                 # Only Backend packages (Express, CORS, Dotenv, Gemini AI)
│   ├── tsconfig.json                # Backend TypeScript config for Node.js
│   ├── server.ts                    # Express REST API Server Entry Point
│   ├── .env.example                 # Backend environment template (PORT=5000)
│   ├── .gitignore                   # Backend gitignore rules
│   ├── src/
│   │   ├── types.ts                 # TypeScript types (Complaint, Department, Timeline)
│   │   ├── data.ts                  # Kanpur local municipal seed data & localities
│   │   └── routes/
│   │       ├── complaints.ts        # REST CRUD endpoints & Kanpur statistics
│   │       └── ai.ts                # Gemini AI visual & text problem triage
│   └── README.md                    # Developer 2 Guide
│
├── .gitignore                       # Root Git ignore covering all folders & node_modules
├── package.json                     # Monorepo Orchestration Scripts
├── vite.config.ts                   # Root Dev configuration
├── README.md                        # Master Project Documentation & Collaboration Guide
└── metadata.json                    # Google AI Studio build metadata
```

---

## 👥 Two-Developer GitHub Collaboration Guide (बिना किसी Conflict के Push कैसे करें)

This project is specifically architected so that **Developer A (Frontend)** and **Developer B (Backend)** can work on two separate laptops and push to the same GitHub repository smoothly.

### 🌟 Why Won't There Be Any Merge Conflicts?
1. **Isolated Directories**: Developer A only edits files inside `frontend/`. Developer B only edits files inside `backend/`. Git merges non-overlapping files automatically with zero conflicts.
2. **Independent Dependencies**: `frontend/package.json` and `backend/package.json` are completely separate. There is no shared lockfile collision.
3. **Independent `.gitignore`**: Build outputs (`dist/`) and `node_modules` inside both folders are strictly ignored.

---

### 💻 Step-by-Step for Developer 1 (Frontend Developer)

1. Clone or open the repository on your laptop:
   ```bash
   git clone <REPO_URL>
   cd sudhaarsetu
   ```
2. Navigate into the `frontend` folder:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. When you make changes to UI, HTML, CSS, or JS, commit and push only the `frontend/` directory:
   ```bash
   git add frontend/
   git commit -m "feat(frontend): updated reporting wizard and department badges"
   git pull origin main --rebase
   git push origin main
   ```

---

### 💻 Step-by-Step for Developer 2 (Backend Developer)

1. Clone or open the repository on your laptop:
   ```bash
   git clone <REPO_URL>
   cd sudhaarsetu
   ```
2. Navigate into the `backend` folder:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. When you make changes to API routes, database, or server logic, commit and push only the `backend/` directory:
   ```bash
   git add backend/
   git commit -m "feat(backend): added new complaint triage route and Kanpur ward filters"
   git pull origin main --rebase
   git push origin main
   ```

---

## 🚀 Running the Whole Project (Single Developer / Evaluator)

If someone evaluates the full repository on their machine:

### Option A: Run Both Together from Root
```bash
# 1. Install dependencies in both folders
npm run install:all

# 2. Run backend (Port 5000) & frontend (Port 3000)
npm run dev
```

### Option B: Run Individually in Separate Terminals
- **Terminal 1 (Backend):**
  ```bash
  cd backend
  npm install
  npm run dev
  ```
- **Terminal 2 (Frontend):**
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

---

## 🏛️ Kanpur Department Routing Rules
Every civic issue is automatically classified and routed to the corresponding department:
- **Potholes / Road Cracks** ➔ Road / Public Works Department (`PWD-ROAD`)
- **Garbage Piles / Dumped Waste** ➔ Sanitation & Solid Waste Management (`SWM-SAN`)
- **Dark Streets / Damaged Poles** ➔ Streetlight & Electrical Department (`ELEC-LIGHT`)
- **Water Pipeline Bursts / Leakage** ➔ Kanpur Jal Sansthan (`KJS-WATER`)
- **Blocked Drains / Waterlogging** ➔ Drainage & Sewerage Division (`DRAIN-SEWER`)
- **General Hazards** ➔ General Public Works Cell (`GEN-CIVIC`)

---

## 📄 License & Civic Notice
SudhaarSetu is a civic-technology prototype developed for Kanpur Nagar, Uttar Pradesh. Open source under Apache-2.0.
