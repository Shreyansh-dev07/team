# SudhaarSetu (सुधार सेतु)
> **“Your Issue. Our Responsibility. Better Kanpur.”**  
> *Report civic problems. Track solutions. Build a better Kanpur.*

SudhaarSetu is a modern, responsive, citizen-first civic-tech portal designed specifically for the citizens and municipal administration of **Kanpur, Uttar Pradesh, India**.

---

## 🏛️ Project Purpose & Overview
Citizens of Kanpur can easily report civic infrastructure issues directly from their smartphones or desktops:
- **Road & Infrastructure**: Potholes, road cracks, damaged asphalt, sinking pavements, broken footpaths.
- **Garbage & Sanitation**: Overflowing garbage piles, missed waste compactor rounds, market refuse.
- **Streetlights & Electrical**: Non-working streetlights, dark streets, loose wiring.
- **Water Supply**: Potable water pipeline bursts, supply disruptions, contaminated water.
- **Drainage & Sewerage**: Blocked drains, street waterlogging, open sewer manholes.
- **Other Public Works**: Fallen trees, broken park facilities, public hazards.

---

## 🚀 Key Features

1. **Automatic Government Department Routing**  
   Intelligently routes complaints based on category to:
   - Road / Public Works Department (`PWD-ROAD`)
   - Sanitation / Solid Waste Management (`SWM-SAN`)
   - Streetlight / Electrical Department (`ELEC-LIGHT`)
   - Kanpur Jal Sansthan (`KJS-WATER`)
   - Drainage & Sewerage Management (`DRAIN-SEWER`)
   - General Civic Works (`GEN-CIVIC`)

2. **AI-Assisted Issue Analysis (AI Demo / Prototype)**  
   Simulated edge vision classification on photo upload providing confidence scoring (e.g. *92% Pothole / Road Damage*) and priority suggestions.

3. **Kanpur Interactive Location Picker & GIS Map**  
   - Built with Google Maps JavaScript API integration and OpenStreetMap / Leaflet fallback.
   - Automatically centered on Kanpur (`26.4499° N, 80.3319° E`).
   - One-click GPS location detection, draggable pin, and locality geocoding across Kanpur zones (Civil Lines, Kalyanpur, Kakadeo, Swaroop Nagar, Govind Nagar, Parade, Kidwai Nagar, etc.).

4. **Duplicate Report Detection**  
   Alerts citizens if an active complaint of the same category has already been reported nearby (~400m) to prevent duplicate backlogs.

5. **Live Complaint Tracking & Timeline**  
   Visual step progression:  
   `Registered` ➔ `Under Review` ➔ `Assigned to Squad` ➔ `In Progress` ➔ `Resolved` (with Before & After photographic evidence).

6. **Citizen Grievance Dashboard**  
   Personal dashboard displaying total, pending, in-progress, and resolved complaints with direct tracking links.

7. **Municipal Department / Admin Console**  
   Demonstration dashboard for authorized nodal officers to triage issues, adjust priorities, assign field squads (e.g., PWD Squad 4, Lineman Ram Babu), and upload resolution proof.

8. **Bilingual Support & Accessibility**  
   - Instant toggle between **English** and **हिंदी (Hindi)**.
   - Accessibility font-size adjustment controls (A-, A, A+).

---

## 🗺️ Google Maps API Configuration
In `js/script.js` and `report.html` / `map.html`:
```javascript
// Replace with your real Google Maps API Key
window.GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";
```
*Note: If no API key is set, the portal seamlessly falls back to the fully interactive OpenStreetMap/Leaflet engine centered on Kanpur, ensuring zero broken functionality during presentations or testing.*

---

## 💻 Tech Stack
- **HTML5 & CSS3** (Semantic markup, CSS variables, responsive grids)
- **Vanilla JavaScript** (Zero React/JSX/TSX as requested)
- **Font Awesome 6** (Government-grade icons)
- **Leaflet & OpenStreetMap** (GIS map visualization engine)
- **LocalStorage** (Persistent demo state across pages without requiring a database)

---

## ⚖️ Civic Disclaimer
SudhaarSetu is a civic-technology prototype and college / hackathon demonstration project. It is not officially owned or operated by Kanpur Nagar Nigam or the Government of Uttar Pradesh unless integrated with official municipal APIs.
