/**
 * SudhaarSetu (सुधार सेतु) — Core Shared JavaScript
 * Kanpur Municipal Grievance Redressal System
 */

// Global Configuration
const API_BASE = '/api';

// Kanpur Municipal Localities & Wards
const KANPUR_AREAS = [
  { name: 'Kalyanpur', zone: 'Zone 2 (North-West)', ward: 'Ward 31', lat: 26.4952, lng: 80.2588 },
  { name: 'Civil Lines', zone: 'Zone 1 (Central)', ward: 'Ward 12', lat: 26.4715, lng: 80.3475 },
  { name: 'Kakadeo', zone: 'Zone 3 (Central-West)', ward: 'Ward 45', lat: 26.4795, lng: 80.3015 },
  { name: 'Swaroop Nagar', zone: 'Zone 3 (Central-West)', ward: 'Ward 18', lat: 26.4782, lng: 80.3168 },
  { name: 'Govind Nagar', zone: 'Zone 4 (South-Central)', ward: 'Ward 54', lat: 26.4421, lng: 80.3129 },
  { name: 'Parade & Bada Chauraha', zone: 'Zone 1 (Central)', ward: 'Ward 08', lat: 26.4632, lng: 80.3542 },
  { name: 'Kidwai Nagar', zone: 'Zone 5 (South)', ward: 'Ward 62', lat: 26.4312, lng: 80.3341 },
  { name: 'Chakeri & Shyam Nagar', zone: 'Zone 6 (East)', ward: 'Ward 71', lat: 26.4188, lng: 80.3921 },
  { name: 'Barra', zone: 'Zone 4 (South-Central)', ward: 'Ward 59', lat: 26.4385, lng: 80.2891 },
  { name: 'Panki', zone: 'Zone 2 (North-West)', ward: 'Ward 38', lat: 26.4862, lng: 80.2241 }
];

// Department Division Meta
const DEPARTMENTS = {
  pothole: {
    code: 'PWD-ROAD',
    name: 'Road / Public Works Department',
    officer: 'Executive Engineer (Roads & Highways, Zone 2)',
    sla: '3 business days'
  },
  road_crack: {
    code: 'PWD-ROAD',
    name: 'Road / Public Works Department',
    officer: 'Assistant Engineer (Civil Works, Zone 3)',
    sla: '3 business days'
  },
  garbage: {
    code: 'SWM-SAN',
    name: 'Sanitation & Solid Waste Management',
    officer: 'Chief City Health Officer (Sanitation Cell)',
    sla: '24 hours'
  },
  streetlight: {
    code: 'ELEC-LIGHT',
    name: 'Streetlight & Electrical Department',
    officer: 'Junior Engineer (Streetlight Division)',
    sla: '48 hours'
  },
  water: {
    code: 'KJS-WATER',
    name: 'Kanpur Jal Sansthan',
    officer: 'Divisional Engineer (Water Supply & Distribution)',
    sla: '24-48 hours'
  },
  drainage: {
    code: 'DRAIN-SEWER',
    name: 'Drainage & Sewerage Division',
    officer: 'Executive Engineer (Stormwater & Sewer Line Ops)',
    sla: '48 hours'
  },
  other: {
    code: 'GEN-CIVIC',
    name: 'General Public Works Cell',
    officer: 'Assistant Municipal Commissioner (Nodal Officer)',
    sla: '5 business days'
  }
};

// Initial Seed Data for Kanpur
const SEED_COMPLAINTS = [
  {
    id: 'SS-KNP-2026-001245',
    category: 'pothole',
    categoryTitle: 'Dangerous Pothole on GT Road',
    deptCode: 'PWD-ROAD',
    deptName: 'Road / Public Works Department',
    priority: 'High',
    status: 'In Progress',
    location: 'GT Road near Kalyanpur Crossing',
    ward: 'Ward 31',
    zone: 'Zone 2 (North-West)',
    lat: 26.4952,
    lng: 80.2588,
    landmark: 'Near Kalyanpur Railway Crossing',
    description: 'Deep road cavity causing severe two-wheeler skid hazards and morning congestion.',
    citizenName: 'Rakesh Verma',
    citizenPhone: '98390XXXXX',
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    assignedTo: 'PWD Squad 4 (Eng. Amit Saxena)',
    officialRemarks: 'Cold mix patch material dispatched; bituminous resurfacing scheduled tonight.',
    createdAt: '2026-10-24T09:30:00Z',
    updatedAt: '2026-10-26T14:15:00Z',
    timeline: [
      { step: '1', title: 'Complaint Registered', date: '24 Oct 2026, 09:30 AM', completed: true, active: false, remarks: 'Assigned unique ID SS-KNP-2026-001245.' },
      { step: '2', title: 'Under Review', date: '24 Oct 2026, 11:15 AM', completed: true, active: false, remarks: 'Verified by PWD Triage desk. Severity marked High.' },
      { step: '3', title: 'Assigned to Field Squad', date: '25 Oct 2026, 08:45 AM', completed: true, active: false, remarks: 'Assigned to PWD Road Squad 4 (Eng. Amit Saxena).' },
      { step: '4', title: 'Work in Progress', date: '26 Oct 2026, 02:15 PM', completed: false, active: true, remarks: 'Asphalt patching crew active on-site.' },
      { step: '5', title: 'Resolved & Verified', date: 'Pending completion', completed: false, active: false, remarks: 'Photographic proof will be uploaded upon inspection.' }
    ]
  },
  {
    id: 'SS-KNP-2026-001246',
    category: 'garbage',
    categoryTitle: 'Overflowing Community Waste Bin',
    deptCode: 'SWM-SAN',
    deptName: 'Sanitation & Solid Waste Management',
    priority: 'Medium',
    status: 'Registered',
    location: 'Near Parade Market, Naveen Market Road',
    ward: 'Ward 08',
    zone: 'Zone 1 (Central)',
    lat: 26.4632,
    lng: 80.3542,
    landmark: 'Opposite Plaza Shopping Complex',
    description: 'Waste overflowing onto pedestrian walkway; compactor truck has not cleared for 2 days.',
    citizenName: 'Pooja Tiwari',
    citizenPhone: '94150XXXXX',
    photoUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80',
    officialRemarks: 'Night compactor route scheduled.',
    createdAt: '2026-10-26T10:00:00Z',
    updatedAt: '2026-10-26T10:00:00Z',
    timeline: [
      { step: '1', title: 'Complaint Registered', date: '26 Oct 2026, 10:00 AM', completed: true, active: true, remarks: 'Logged into SWM sanitary dispatch queue.' },
      { step: '2', title: 'Under Review', date: 'Pending', completed: false, active: false, remarks: 'Sanitary Inspector reviewing route roster.' },
      { step: '3', title: 'Assigned to Field Squad', date: 'Pending', completed: false, active: false, remarks: 'Waiting for compactor assignment.' },
      { step: '4', title: 'Work in Progress', date: 'Pending', completed: false, active: false, remarks: 'Sanitation team dispatch pending.' },
      { step: '5', title: 'Resolved & Verified', date: 'Pending', completed: false, active: false, remarks: 'Disinfection proof required.' }
    ]
  },
  {
    id: 'SS-KNP-2026-001247',
    category: 'streetlight',
    categoryTitle: 'Dark Street - Non-working LED Lights',
    deptCode: 'ELEC-LIGHT',
    deptName: 'Streetlight & Electrical Department',
    priority: 'Low',
    status: 'Resolved',
    location: 'Swaroop Nagar, Lane 4 near Park',
    ward: 'Ward 18',
    zone: 'Zone 3 (Central-West)',
    lat: 26.4782,
    lng: 80.3168,
    landmark: 'Near Swaroop Nagar Community Park',
    description: 'Two pole-mounted LED luminaires flickered and went dark completely last Thursday.',
    citizenName: 'Mohd. Imran',
    citizenPhone: '97920XXXXX',
    photoUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    resolutionPhotoUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
    assignedTo: 'Lineman Ram Babu (Zone 3)',
    officialRemarks: 'Burnt driver replacement completed; both 90W LED fixtures tested and operational.',
    createdAt: '2026-10-22T14:20:00Z',
    updatedAt: '2026-10-25T16:45:00Z',
    timeline: [
      { step: '1', title: 'Complaint Registered', date: '22 Oct 2026, 02:20 PM', completed: true, active: false, remarks: 'Logged into Electrical Dept queue.' },
      { step: '2', title: 'Under Review', date: '22 Oct 2026, 04:00 PM', completed: true, active: false, remarks: 'Verified by JE Electrical.' },
      { step: '3', title: 'Assigned to Field Squad', date: '23 Oct 2026, 10:00 AM', completed: true, active: false, remarks: 'Assigned to Lineman Ram Babu.' },
      { step: '4', title: 'Work in Progress', date: '24 Oct 2026, 03:30 PM', completed: true, active: false, remarks: 'Driver replaced, wire tension adjusted.' },
      { step: '5', title: 'Resolved & Verified', date: '25 Oct 2026, 04:45 PM', completed: true, active: false, remarks: 'Illumination verified at 8:00 PM.' }
    ]
  },
  {
    id: 'SS-KNP-2026-001248',
    category: 'water',
    categoryTitle: 'Pipeline Leakage on Main Feeder',
    deptCode: 'KJS-WATER',
    deptName: 'Kanpur Jal Sansthan',
    priority: 'High',
    status: 'Under Review',
    location: 'Govind Nagar, Block 7',
    ward: 'Ward 54',
    zone: 'Zone 4 (South-Central)',
    lat: 26.4421,
    lng: 80.3129,
    landmark: 'Near Govind Nagar Water Tank',
    description: 'Water gushing from underground distribution joint, flooding road and reducing household pressure.',
    citizenName: 'Anil Gupta',
    citizenPhone: '98380XXXXX',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80',
    officialRemarks: 'Valve isolated temporarily. Excavation team dispatched.',
    createdAt: '2026-10-26T16:10:00Z',
    updatedAt: '2026-10-26T17:00:00Z',
    timeline: [
      { step: '1', title: 'Complaint Registered', date: '26 Oct 2026, 04:10 PM', completed: true, active: false, remarks: 'Forwarded to Jal Sansthan control room.' },
      { step: '2', title: 'Under Review', date: '26 Oct 2026, 05:00 PM', completed: true, active: true, remarks: 'Emergency valve operation ordered.' },
      { step: '3', title: 'Assigned to Field Squad', date: 'Pending', completed: false, active: false, remarks: 'Pipeline repair crew queue.' },
      { step: '4', title: 'Work in Progress', date: 'Pending', completed: false, active: false, remarks: 'Excavation pending.' },
      { step: '5', title: 'Resolved & Verified', date: 'Pending', completed: false, active: false, remarks: 'Pressure restoration test.' }
    ]
  },
  {
    id: 'SS-KNP-2026-001249',
    category: 'drainage',
    categoryTitle: 'Choked Drain & Road Waterlogging',
    deptCode: 'DRAIN-SEWER',
    deptName: 'Drainage & Sewerage Division',
    priority: 'High',
    status: 'Assigned',
    location: 'Kakadeo Coaching Hub, Main Road',
    ward: 'Ward 45',
    zone: 'Zone 3 (Central-West)',
    lat: 26.4795,
    lng: 80.3015,
    landmark: 'Near Chhapeda Pulia Chauraha',
    description: 'Stormwater drain completely blocked by plastic silt; foul water spilling onto road.',
    citizenName: 'Shalini Dixit',
    citizenPhone: '93350XXXXX',
    photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    assignedTo: 'Suction Machine Squad 2 (Jal Nigam)',
    officialRemarks: 'Desilting machine assigned for morning slot.',
    createdAt: '2026-10-25T11:45:00Z',
    updatedAt: '2026-10-26T09:00:00Z',
    timeline: [
      { step: '1', title: 'Complaint Registered', date: '25 Oct 2026, 11:45 AM', completed: true, active: false, remarks: 'Logged in Drainage Division portal.' },
      { step: '2', title: 'Under Review', date: '25 Oct 2026, 02:00 PM', completed: true, active: false, remarks: 'Ward sanitary inspector site verified.' },
      { step: '3', title: 'Assigned to Field Squad', date: '26 Oct 2026, 09:00 AM', completed: true, active: true, remarks: 'Desilting suction machine assigned.' },
      { step: '4', title: 'Work in Progress', date: 'Pending', completed: false, active: false, remarks: 'Desilting in progress.' },
      { step: '5', title: 'Resolved & Verified', date: 'Pending', completed: false, active: false, remarks: 'Flow test verification.' }
    ]
  }
];

// Local Storage Helper
function getStoredComplaints() {
  const local = localStorage.getItem('sudhaarsetu_complaints');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.warn('Could not parse localStorage, resetting:', e);
    }
  }
  localStorage.setItem('sudhaarsetu_complaints', JSON.stringify(SEED_COMPLAINTS));
  return SEED_COMPLAINTS;
}

function saveComplaintsToStorage(list) {
  localStorage.setItem('sudhaarsetu_complaints', JSON.stringify(list));
}

// Unified API / Storage fetcher
async function fetchAllComplaints(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/complaints?${query}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.data) {
        saveComplaintsToStorage(data.data);
        return data.data;
      }
    }
  } catch (err) {
    // Backend API not reachable; fallback to client localStorage
  }
  return getStoredComplaints();
}

async function fetchComplaintById(id) {
  try {
    const res = await fetch(`${API_BASE}/complaints/${id}`);
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (e) {}

  const all = getStoredComplaints();
  return all.find(c => c.id.toUpperCase() === id.toUpperCase()) || null;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.style.display = mainNav.style.display === 'flex' ? 'none' : 'flex';
      mainNav.style.flexDirection = 'column';
      mainNav.style.position = 'absolute';
      mainNav.style.top = '100%';
      mainNav.style.left = '0';
      mainNav.style.right = '0';
      mainNav.style.background = '#092746';
      mainNav.style.padding = '1rem';
      mainNav.style.borderTop = '1px solid rgba(255,255,255,0.1)';
    });
  }

  // Restore Font Size & Language preferences
  const savedFontSize = localStorage.getItem('sudhaarsetu_fontsize') || 'normal';
  setFontSize(savedFontSize);

  const savedLang = localStorage.getItem('sudhaarsetu_lang') || 'en';
  setLanguage(savedLang);
});

// Font size switcher
function setFontSize(size) {
  document.body.classList.remove('font-small', 'font-normal', 'font-large');
  document.body.classList.add(`font-${size}`);
  localStorage.setItem('sudhaarsetu_fontsize', size);

  document.querySelectorAll('.font-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-size') === size);
  });
}

// Bilingual Language Switcher Dictionary
const TRANSLATIONS = {
  en: {
    portalTagline: 'Civic Issue Management for Kanpur',
    home: 'Home',
    reportBtn: 'Report Issue',
    trackBtn: 'Track Status',
    map: 'Issues Map',
    dashboard: 'My Dashboard',
    howItWorks: 'How It Works',
    admin: 'Dept Login',
    heroTitle: "Together, Let's Build a Better Kanpur",
    heroSub: 'Report civic problems, share their location, and track their resolution — all in one place.',
    whatCanReport: 'What Can You Report?',
    potholeTitle: 'Road & Infrastructure',
    garbageTitle: 'Garbage & Sanitation',
    streetlightTitle: 'Streetlights & Electrical',
    waterTitle: 'Water Supply & Leakages',
    drainageTitle: 'Drainage & Sewerage',
    otherTitle: 'Other Civic Infrastructure'
  },
  hi: {
    portalTagline: 'कानपुर नागरिक समस्या निवारण पोर्टल',
    home: 'मुख्य पृष्ठ',
    reportBtn: 'समस्या दर्ज करें',
    trackBtn: 'स्थिति ट्रैक करें',
    map: 'समस्या मानचित्र',
    dashboard: 'मेरा डैशबोर्ड',
    howItWorks: 'यह कैसे कार्य करता है',
    admin: 'विभागीय लॉगिन',
    heroTitle: 'आइए मिलकर बनाएं एक बेहतर और स्वच्छ कानपुर',
    heroSub: 'नागरिक समस्याएं दर्ज करें, सटीक स्थान साझा करें और समाधान ट्रैक करें - सब एक ही मंच पर।',
    whatCanReport: 'आप कौन-सी समस्याएं दर्ज कर सकते हैं?',
    potholeTitle: 'सड़क एवं गड्ढे (PWD)',
    garbageTitle: 'कचरा एवं स्वच्छता (SWM)',
    streetlightTitle: 'मार्ग प्रकाश एवं विद्युत पोल',
    waterTitle: 'पेयजल आपूर्ति एवं पाइपलाइन लीकेज',
    drainageTitle: 'जलभराव एवं सीवर लाइन',
    otherTitle: 'अन्य सार्वजनिक नागरिक समस्याएं'
  }
};

function setLanguage(lang) {
  localStorage.setItem('sudhaarsetu_lang', lang);

  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-lang') === lang);
  });

  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
}
