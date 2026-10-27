/**
 * SudhaarSetu - Kanpur Civic Issue Management Portal
 * Core Client Utilities & State Management (Vanilla JavaScript)
 */

// ==========================================
// 1. CONFIGURATION & GOOGLE MAPS API KEY
// ==========================================
// Replace 'YOUR_GOOGLE_MAPS_API_KEY' below with your valid Google Maps API Key.
// If left as 'YOUR_GOOGLE_MAPS_API_KEY' or if Google Maps fails to load,
// the system seamlessly activates the interactive OpenStreetMap/Leaflet fallback
// centered specifically on Kanpur, Uttar Pradesh.
window.GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

// Kanpur Center Coordinates (Nagar Nigam / Phool Bagh / Civil Lines area)
window.KANPUR_COORDS = {
  lat: 26.4499,
  lng: 80.3319,
  zoom: 13
};

// Kanpur Prominent Localities and Landmarks
window.KANPUR_LOCALITIES = [
  { name: "Civil Lines", ward: "Ward 12", lat: 26.4735, lng: 80.3478, landmark: "Near Green Park Stadium / Mall Road" },
  { name: "Swaroop Nagar", ward: "Ward 18", lat: 26.4812, lng: 80.3129, landmark: "Near Motijheel / Medical College Gate" },
  { name: "Kakadeo", ward: "Ward 24", lat: 26.4867, lng: 80.2985, landmark: "Coaching Hub / Deoki Cinema Crossing" },
  { name: "Kalyanpur", ward: "Ward 31", lat: 26.4945, lng: 80.2580, landmark: "Near Kalyanpur Railway Crossing / GT Road" },
  { name: "Govind Nagar", ward: "Ward 45", lat: 26.4418, lng: 80.3015, landmark: "Govind Nagar Market / Block 3" },
  { name: "Kidwai Nagar", ward: "Ward 52", lat: 26.4278, lng: 80.3294, landmark: "Deep Cinema Chauraha / H-Block" },
  { name: "Barra", ward: "Ward 60", lat: 26.4320, lng: 80.2789, landmark: "Barra Bypass / Meharban Singh Ka Purwa" },
  { name: "Parade / Naveen Market", ward: "Ward 08", lat: 26.4632, lng: 80.3524, landmark: "Opposite Bada Chauraha" },
  { name: "Gumti No. 5", ward: "Ward 22", lat: 26.4695, lng: 80.3182, landmark: "Near Gurudwara Road / Railway Crossing" },
  { name: "Chakeri", ward: "Ward 74", lat: 26.4021, lng: 80.4045, landmark: "Near Air Force Station / Sanigawan Road" },
  { name: "Panki", ward: "Ward 38", lat: 26.4789, lng: 80.2210, landmark: "Near Panki Mandir / Thermal Power Station Road" },
  { name: "Shyam Nagar", ward: "Ward 69", lat: 26.4215, lng: 80.3756, landmark: "Near PAC Ground / Bypass" }
];

// ==========================================
// 2. AUTOMATIC GOVERNMENT DEPARTMENT ROUTING
// ==========================================
window.DEPARTMENT_MAPPING = {
  pothole: {
    categoryKey: "pothole",
    name: "Road / Public Works Department",
    nameHi: "सड़क एवं लोक निर्माण विभाग (PWD / KNN Road Cell)",
    code: "PWD-ROAD",
    officer: "Executive Engineer (Roads & Highways)",
    estDays: 3,
    icon: "fa-road",
    phone: "0512-2540001",
    email: "pwd-roads.knp@civictech.demo"
  },
  road_crack: {
    categoryKey: "road_crack",
    name: "Road / Public Works Department",
    nameHi: "सड़क एवं लोक निर्माण विभाग (PWD / KNN Road Cell)",
    code: "PWD-ROAD",
    officer: "Assistant Engineer (Maintenance)",
    estDays: 4,
    icon: "fa-car-burst",
    phone: "0512-2540001",
    email: "pwd-roads.knp@civictech.demo"
  },
  garbage: {
    categoryKey: "garbage",
    name: "Sanitation / Solid Waste Management Department",
    nameHi: "नगर स्वास्थ्य एवं स्वच्छता प्रबंधन विभाग",
    code: "SWM-SAN",
    officer: "City Health Officer / Zonal Sanitary Inspector",
    estDays: 1,
    icon: "fa-trash-can",
    phone: "0512-2540002",
    email: "swm-sanitation.knp@civictech.demo"
  },
  streetlight: {
    categoryKey: "streetlight",
    name: "Streetlight / Electrical Department",
    nameHi: "मार्ग प्रकाश एवं विद्युत अभियांत्रिकी विभाग",
    code: "ELEC-LIGHT",
    officer: "Superintending Engineer (Streetlights)",
    estDays: 2,
    icon: "fa-lightbulb",
    phone: "0512-2540003",
    email: "electrical.knp@civictech.demo"
  },
  water: {
    categoryKey: "water",
    name: "Kanpur Jal Sansthan / Water Supply Department",
    nameHi: "कानपुर जल संस्थान (पेयजल एवं पाइपलाइन विंग)",
    code: "KJS-WATER",
    officer: "General Manager (Water Distribution)",
    estDays: 2,
    icon: "fa-faucet-drip",
    phone: "0512-2540004",
    email: "jalsansthan.knp@civictech.demo"
  },
  drainage: {
    categoryKey: "drainage",
    name: "Drainage / Sewerage Management Department",
    nameHi: "जल निकासी एवं सीवरेज प्रबंधन विभाग",
    code: "DRAIN-SEWER",
    officer: "Chief Engineer (Drainage & Sewerage Works)",
    estDays: 3,
    icon: "fa-water",
    phone: "0512-2540005",
    email: "drainage.knp@civictech.demo"
  },
  other: {
    categoryKey: "other",
    name: "General Civic & Public Works Department",
    nameHi: "सामान्य नागरिक एवं लोक निर्माण अनुभाग",
    code: "GEN-CIVIC",
    officer: "Nodal Grievance Redressal Officer",
    estDays: 5,
    icon: "fa-triangle-exclamation",
    phone: "0512-2540000",
    email: "grievance.knp@civictech.demo"
  }
};

// ==========================================
// 3. SEED DATA & LOCAL STORAGE
// ==========================================
const STORAGE_KEY = "sudhaarsetu_complaints";
const COUNTER_KEY = "sudhaarsetu_counter";

const INITIAL_DEMO_COMPLAINTS = [
  {
    id: "SS-KNP-2026-001245",
    category: "pothole",
    categoryLabel: "Pothole",
    department: "Road / Public Works Department",
    deptCode: "PWD-ROAD",
    priority: "High",
    status: "In Progress",
    reportedDate: "2026-10-24T09:30:00Z",
    updatedDate: "2026-10-25T14:20:00Z",
    location: {
      address: "GT Road near Kalyanpur Crossing, Kanpur, UP",
      area: "Kalyanpur",
      ward: "Ward 31",
      landmark: "Near Kalyanpur Railway Crossing",
      lat: 26.4945,
      lng: 80.2580
    },
    description: "Deep pothole spanning almost 2 feet on main carriage-way of GT Road. Causing severe traffic slowdowns and risk of two-wheeler skidding during night.",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    citizenName: "Rakesh Verma",
    citizenPhone: "98390XXXXX",
    timeline: [
      { status: "Registered", title: "Complaint Registered", date: "24 Oct 2026, 09:30 AM", remarks: "Filed by citizen via Mobile Web" },
      { status: "Under Review", title: "Forwarded to Concerned Department", date: "24 Oct 2026, 11:15 AM", remarks: "Routed to Road / PWD Kanpur Division" },
      { status: "Assigned", title: "Department Review & Team Assigned", date: "25 Oct 2026, 10:00 AM", remarks: "Assigned to PWD Field Squad 4 (Eng. Amit Saxena)" },
      { status: "In Progress", title: "Work in Progress", date: "25 Oct 2026, 02:20 PM", remarks: "Hot-mix asphalt filling crew deployed on site" }
    ],
    remarks: "Field crew on site. Expected completion by tomorrow morning.",
    resolutionEvidence: null
  },
  {
    id: "SS-KNP-2026-001246",
    category: "garbage",
    categoryLabel: "Garbage Pile",
    department: "Sanitation / Solid Waste Management Department",
    deptCode: "SWM-SAN",
    priority: "Medium",
    status: "Assigned",
    reportedDate: "2026-10-25T08:15:00Z",
    updatedDate: "2026-10-25T12:00:00Z",
    location: {
      address: "Behind Naveen Market Complex, Parade, Kanpur",
      area: "Parade / Naveen Market",
      ward: "Ward 08",
      landmark: "Opposite Gate 3 Vegetable Market",
      lat: 26.4632,
      lng: 80.3524
    },
    description: "Solid waste and organic market refuse piled up along the back lane. Garbage compactor vehicle has not cleared this spot for 2 consecutive days.",
    photoUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80",
    citizenName: "Pooja Gupta",
    citizenPhone: "94150XXXXX",
    timeline: [
      { status: "Registered", title: "Complaint Registered", date: "25 Oct 2026, 08:15 AM", remarks: "Registered on SudhaarSetu" },
      { status: "Under Review", title: "Forwarded to SWM", date: "25 Oct 2026, 09:40 AM", remarks: "Transmitted to Sanitation Zone 1" },
      { status: "Assigned", title: "Assigned to Sanitary Inspector", date: "25 Oct 2026, 12:00 PM", remarks: "Sanitary Inspector Dinesh Kumar alerted for compactor round" }
    ],
    remarks: "Compactor scheduled for evening clearance cycle.",
    resolutionEvidence: null
  },
  {
    id: "SS-KNP-2026-001247",
    category: "streetlight",
    categoryLabel: "Broken Streetlight",
    department: "Streetlight / Electrical Department",
    deptCode: "ELEC-LIGHT",
    priority: "Medium",
    status: "Resolved",
    reportedDate: "2026-10-22T19:40:00Z",
    updatedDate: "2026-10-24T16:30:00Z",
    location: {
      address: "Lane 4, Swaroop Nagar, Near Motijheel Gate, Kanpur",
      area: "Swaroop Nagar",
      ward: "Ward 18",
      landmark: "Near Medical College Girl's Hostel Turn",
      lat: 26.4812,
      lng: 80.3129
    },
    description: "3 LED street light fixtures on pole numbers SN-14, 15, 16 completely dark for the last 5 days. Creating safety risk for pedestrians.",
    photoUrl: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80",
    citizenName: "Alok Tiwari",
    citizenPhone: "98892XXXXX",
    timeline: [
      { status: "Registered", title: "Complaint Registered", date: "22 Oct 2026, 07:40 PM", remarks: "System acknowledged" },
      { status: "Under Review", title: "Forwarded to Electrical Dept", date: "23 Oct 2026, 09:10 AM", remarks: "Assigned to Zone 3 electrical team" },
      { status: "Assigned", title: "Technician Dispatched", date: "23 Oct 2026, 02:00 PM", remarks: "Lineman Ram Babu assigned" },
      { status: "In Progress", title: "LED Driver Replacement", date: "24 Oct 2026, 11:30 AM", remarks: "Faulty driver and burnt cable repaired" },
      { status: "Resolved", title: "Issue Resolved", date: "24 Oct 2026, 04:30 PM", remarks: "All 3 lights tested and verified glowing at night" }
    ],
    remarks: "New 90W LED drivers installed. Street illuminated.",
    resolutionEvidence: {
      resolvedDate: "24 Oct 2026",
      officer: "Lineman Ram Babu (Approved by AE Electrical)",
      photoUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80"
    }
  },
  {
    id: "SS-KNP-2026-001248",
    category: "water",
    categoryLabel: "Water Leakage",
    department: "Kanpur Jal Sansthan / Water Supply Department",
    deptCode: "KJS-WATER",
    priority: "High",
    status: "Under Review",
    reportedDate: "2026-10-26T07:10:00Z",
    updatedDate: "2026-10-26T08:30:00Z",
    location: {
      address: "Main Market Road, Block 3, Govind Nagar, Kanpur",
      area: "Govind Nagar",
      ward: "Ward 45",
      landmark: "Near Hanuman Mandir Water Kiosk",
      lat: 26.4418,
      lng: 80.3015
    },
    description: "Fresh potable water leaking with high pressure from underground main supply pipe line. Road getting waterlogged and drinking water being wasted.",
    photoUrl: "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80",
    citizenName: "Sunil Sachdeva",
    citizenPhone: "99351XXXXX",
    timeline: [
      { status: "Registered", title: "Complaint Registered", date: "26 Oct 2026, 07:10 AM", remarks: "Logged via citizen portal" },
      { status: "Under Review", title: "Under Review at Jal Sansthan", date: "26 Oct 2026, 08:30 AM", remarks: "Nodal pipeline engineer evaluating valve isolation" }
    ],
    remarks: "Inspection team heading to site with clamp repair kit.",
    resolutionEvidence: null
  },
  {
    id: "SS-KNP-2026-001249",
    category: "drainage",
    categoryLabel: "Drainage / Sewer Overflow",
    department: "Drainage / Sewerage Management Department",
    deptCode: "DRAIN-SEWER",
    priority: "High",
    status: "Registered",
    reportedDate: "2026-10-26T10:05:00Z",
    updatedDate: "2026-10-26T10:05:00Z",
    location: {
      address: "Near Gumti No. 5 Gurudwara Crossing, Kanpur",
      area: "Gumti No. 5",
      ward: "Ward 22",
      landmark: "Crossing No. 5 Rail Gate side",
      lat: 26.4695,
      lng: 80.3182
    },
    description: "Sewer line backed up causing dirty drain water to spill onto market pedestrian pathway. Foul odor and hygiene threat to nearby shops.",
    photoUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    citizenName: "Harpreet Singh",
    citizenPhone: "97920XXXXX",
    timeline: [
      { status: "Registered", title: "Complaint Registered", date: "26 Oct 2026, 10:05 AM", remarks: "Complaint ticket generated" }
    ],
    remarks: "Pending initial triage by drainage control room.",
    resolutionEvidence: null
  }
];

// Initialize LocalStorage with seed data if empty
window.initStorage = function () {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing || JSON.parse(existing).length === 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_COMPLAINTS));
    localStorage.setItem(COUNTER_KEY, "1250");
  }
};

window.getComplaints = function () {
  window.initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    console.error("Failed to parse complaints:", e);
    return INITIAL_DEMO_COMPLAINTS;
  }
};

window.saveComplaint = function (complaint) {
  const complaints = window.getComplaints();
  complaints.unshift(complaint);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  return complaint;
};

window.updateComplaint = function (id, updates) {
  const complaints = window.getComplaints();
  const index = complaints.findIndex(c => c.id === id);
  if (index !== -1) {
    complaints[index] = { ...complaints[index], ...updates, updatedDate: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    return complaints[index];
  }
  return null;
};

window.getComplaintById = function (id) {
  if (!id) return null;
  const cleanId = id.trim().toUpperCase();
  const complaints = window.getComplaints();
  return complaints.find(c => c.id.toUpperCase() === cleanId) || null;
};

window.generateNextComplaintId = function () {
  let counter = parseInt(localStorage.getItem(COUNTER_KEY) || "1250", 10);
  counter += 1;
  localStorage.setItem(COUNTER_KEY, counter.toString());
  const year = new Date().getFullYear();
  const padded = String(counter).padStart(6, "0");
  return `SS-KNP-${year}-${padded}`;
};

// ==========================================
// 4. BILINGUAL SUPPORT (English | हिंदी)
// ==========================================
window.TRANSLATIONS = {
  en: {
    portalName: "SudhaarSetu",
    portalTagline: "Civic Issue Management for Kanpur",
    heroTitle: "Together, Let's Build a Better Kanpur",
    heroSub: "Report civic problems, share their location, and track their resolution — all in one place.",
    reportBtn: "Report an Issue",
    trackBtn: "Track My Complaint",
    howItWorks: "How It Works",
    home: "Home",
    map: "Issues Map",
    dashboard: "My Dashboard",
    admin: "Dept Login",
    about: "About",
    help: "Help",
    whatCanReport: "What Can You Report?",
    potholeTitle: "Road Cracks & Potholes",
    garbageTitle: "Garbage & Sanitation",
    streetlightTitle: "Broken Streetlights",
    waterTitle: "Water Leakage & Supply",
    drainageTitle: "Drainage & Sewerage",
    otherTitle: "Other Public Infrastructure"
  },
  hi: {
    portalName: "सुधार सेतु",
    portalTagline: "कानपुर नागरिक समाधान पोर्टल",
    heroTitle: "साथ मिलकर बनाएं एक बेहतर और स्वच्छ कानपुर",
    heroSub: "नागरिक समस्याओं की शिकायत दर्ज करें, स्थान साझा करें और समाधान ट्रैक करें — सब कुछ एक स्थान पर।",
    reportBtn: "समस्या दर्ज करें",
    trackBtn: "शिकायत ट्रैक करें",
    howItWorks: "यह कैसे कार्य करता है",
    home: "मुख्य पृष्ठ",
    map: "समस्या मानचित्र",
    dashboard: "मेरा डैशबोर्ड",
    admin: "विभागीय लॉगिन",
    about: "के बारे में",
    help: "सहायता",
    whatCanReport: "आप किन समस्याओं की रिपोर्ट कर सकते हैं?",
    potholeTitle: "सड़क के गड्ढे एवं दरारें",
    garbageTitle: "कचरे का ढेर एवं सफाई",
    streetlightTitle: "खराब मार्ग प्रकाश (स्ट्रीटलाइट)",
    waterTitle: "पेयजल एवं पाइपलाइन लीकेज",
    drainageTitle: "नाली एवं सीवर की समस्या",
    otherTitle: "अन्य सार्वजनिक बुनियादी ढांचा"
  }
};

window.getCurrentLang = function () {
  return localStorage.getItem("sudhaarsetu_lang") || "en";
};

window.setLanguage = function (lang) {
  if (lang !== "en" && lang !== "hi") lang = "en";
  localStorage.setItem("sudhaarsetu_lang", lang);
  window.applyLanguage(lang);
};

window.applyLanguage = function (lang) {
  const currentLang = lang || window.getCurrentLang();
  document.documentElement.lang = currentLang;
  
  // Update active state on language buttons
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });

  // Translate elements with data-i18n attribute
  const dict = window.TRANSLATIONS[currentLang] || window.TRANSLATIONS.en;
  document.querySelectorAll("[data-i18n]").forEach(elem => {
    const key = elem.getAttribute("data-i18n");
    if (dict[key]) {
      elem.textContent = dict[key];
    }
  });
};

// ==========================================
// 5. ACCESSIBILITY FONT SIZE CONTROLS
// ==========================================
window.setFontSize = function (size) {
  document.body.classList.remove("font-small", "font-normal", "font-large");
  if (size === "small") document.body.classList.add("font-small");
  else if (size === "large") document.body.classList.add("font-large");
  else document.body.classList.add("font-normal");
  localStorage.setItem("sudhaarsetu_fontsize", size);
  
  document.querySelectorAll(".font-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.size === size);
  });
};

// ==========================================
// 6. TOAST NOTIFICATIONS
// ==========================================
window.showToast = function (message, type = "info") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast-msg ${type}`;
  
  let iconHtml = '<i class="fa-solid fa-circle-info toast-icon"></i>';
  if (type === "success") iconHtml = '<i class="fa-solid fa-circle-check toast-icon"></i>';
  if (type === "warning") iconHtml = '<i class="fa-solid fa-triangle-exclamation toast-icon"></i>';
  if (type === "danger") iconHtml = '<i class="fa-solid fa-circle-xmark toast-icon"></i>';

  toast.innerHTML = `
    ${iconHtml}
    <div style="flex: 1; font-size: 0.875rem; line-height: 1.4;">${message}</div>
    <button style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1rem;" onclick="this.parentElement.remove()">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s";
      setTimeout(() => toast.remove(), 300);
    }
  }, 4500);
};

// ==========================================
// 7. BADGES & FORMATTERS
// ==========================================
window.getStatusBadgeHtml = function (status) {
  const s = (status || "Registered").toLowerCase();
  let cssClass = "status-registered";
  let icon = "fa-clock";
  
  if (s.includes("review")) { cssClass = "status-review"; icon = "fa-magnifying-glass"; }
  else if (s.includes("assign")) { cssClass = "status-assigned"; icon = "fa-user-check"; }
  else if (s.includes("progress")) { cssClass = "status-progress"; icon = "fa-wrench"; }
  else if (s.includes("resolved")) { cssClass = "status-resolved"; icon = "fa-circle-check"; }
  else if (s.includes("closed")) { cssClass = "status-closed"; icon = "fa-lock"; }

  return `<span class="status-pill ${cssClass}"><i class="fa-solid ${icon}"></i> ${status}</span>`;
};

window.getPriorityBadgeHtml = function (priority) {
  const p = (priority || "Medium").toLowerCase();
  let cssClass = "priority-medium";
  if (p === "high") cssClass = "priority-high";
  if (p === "low") cssClass = "priority-low";
  return `<span class="priority-badge ${cssClass}"><i class="fa-solid fa-shield"></i> ${priority}</span>`;
};

window.formatDate = function (dateString) {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  } catch (e) {
    return dateString;
  }
};

// ==========================================
// 8. GLOBAL DOM INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  window.initStorage();

  // Apply saved language & font size
  const savedLang = localStorage.getItem("sudhaarsetu_lang") || "en";
  window.applyLanguage(savedLang);

  const savedFontSize = localStorage.getItem("sudhaarsetu_fontsize") || "normal";
  window.setFontSize(savedFontSize);

  // Mobile menu toggle
  const mobileToggle = document.getElementById("mobileToggle");
  const mainNav = document.getElementById("mainNav");
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener("click", () => {
      mainNav.classList.toggle("show");
    });
  }
});
