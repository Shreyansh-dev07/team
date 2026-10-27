import { Router, Request, Response } from 'express';
import { Complaint, ComplaintStatus, PriorityLevel } from '../types.js';
import { INITIAL_COMPLAINTS, DEPARTMENTS, KANPUR_LOCALITIES } from '../data.js';

const router = Router();

// In-memory persistent database for the running backend process
let complaints: Complaint[] = JSON.parse(JSON.stringify(INITIAL_COMPLAINTS));

// Format current date for timeline
function formatDateTime(d = new Date()): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
}

// Helper to calculate statistics
function calculateStats() {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Registered' || c.status === 'Under Review').length;
  const inProgress = complaints.filter(c => c.status === 'Assigned' || c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
  const highPriority = complaints.filter(c => c.priority === 'High' && c.status !== 'Resolved' && c.status !== 'Closed').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Department counts
  const byDept: Record<string, number> = {};
  complaints.forEach(c => {
    byDept[c.deptCode] = (byDept[c.deptCode] || 0) + 1;
  });

  // Zone counts
  const byZone: Record<string, number> = {};
  complaints.forEach(c => {
    byZone[c.zone] = (byZone[c.zone] || 0) + 1;
  });

  return {
    total,
    pending,
    inProgress,
    resolved,
    highPriority,
    resolutionRate: `${resolutionRate}%`,
    byDept,
    byZone,
  };
}

// GET /api/stats
router.get('/stats', (_req: Request, res: Response) => {
  res.json({ success: true, data: calculateStats() });
});

// GET /api/departments
router.get('/departments', (_req: Request, res: Response) => {
  res.json({ success: true, data: DEPARTMENTS });
});

// GET /api/localities
router.get('/localities', (_req: Request, res: Response) => {
  res.json({ success: true, data: KANPUR_LOCALITIES });
});

// GET /api/complaints
router.get('/complaints', (req: Request, res: Response) => {
  const { category, status, priority, zone, search } = req.query;

  let results = [...complaints];

  if (category && category !== 'all') {
    results = results.filter(c => c.category === category);
  }

  if (status && status !== 'all') {
    results = results.filter(c => c.status.toLowerCase() === String(status).toLowerCase());
  }

  if (priority && priority !== 'all') {
    results = results.filter(c => c.priority.toLowerCase() === String(priority).toLowerCase());
  }

  if (zone && zone !== 'all') {
    results = results.filter(c => c.zone.toLowerCase().includes(String(zone).toLowerCase()) || c.location.toLowerCase().includes(String(zone).toLowerCase()));
  }

  if (search && typeof search === 'string') {
    const q = search.trim().toLowerCase();
    results = results.filter(c => 
      c.id.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.categoryTitle.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      (c.citizenName && c.citizenName.toLowerCase().includes(q))
    );
  }

  // Sort descending by creation date
  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({
    success: true,
    total: results.length,
    data: results,
  });
});

// GET /api/complaints/:id
router.get('/complaints/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const complaint = complaints.find(c => c.id.toUpperCase() === id.toUpperCase());

  if (!complaint) {
    res.status(404).json({ success: false, error: `Complaint with ID ${id} was not found.` });
    return;
  }

  res.json({ success: true, data: complaint });
});

// POST /api/complaints
router.post('/complaints', (req: Request, res: Response) => {
  try {
    const {
      category = 'other',
      categoryTitle,
      priority = 'Medium',
      location = 'Kanpur Nagar',
      ward = 'Ward General',
      zone = 'Zone 1 (Central)',
      lat = 26.4499,
      lng = 80.3319,
      landmark,
      description,
      citizenName,
      citizenPhone,
      photoUrl,
    } = req.body;

    if (!description || description.trim().length < 5) {
      res.status(400).json({ success: false, error: 'Problem description must be at least 5 characters.' });
      return;
    }

    // Generate unique ID: SS-KNP-2026-XXXXXX
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newId = `SS-KNP-2026-${randomNum}`;

    const deptInfo = DEPARTMENTS[category] || DEPARTMENTS.other;
    const nowISO = new Date().toISOString();
    const nowFormatted = formatDateTime();

    const newComplaint: Complaint = {
      id: newId,
      category,
      categoryTitle: categoryTitle || `${category.toUpperCase().replace('_', ' ')} Incident`,
      deptCode: deptInfo.code,
      deptName: deptInfo.name,
      priority: (priority as PriorityLevel) || 'Medium',
      status: 'Registered',
      location,
      ward,
      zone,
      lat: Number(lat) || 26.4499,
      lng: Number(lng) || 80.3319,
      landmark: landmark || '',
      description: description.trim(),
      citizenName: citizenName || 'Kanpur Citizen',
      citizenPhone: citizenPhone || '',
      photoUrl: photoUrl || '',
      createdAt: nowISO,
      updatedAt: nowISO,
      timeline: [
        {
          step: '1',
          title: 'Complaint Registered',
          date: nowFormatted,
          completed: true,
          active: true,
          remarks: `Officially logged. Forwarded to ${deptInfo.name} (${deptInfo.code}).`,
        },
        {
          step: '2',
          title: 'Under Review',
          date: 'Pending',
          completed: false,
          active: false,
          remarks: 'Department desk triage pending.',
        },
        {
          step: '3',
          title: 'Assigned to Field Squad',
          date: 'Pending',
          completed: false,
          active: false,
          remarks: 'Engineering team allocation pending.',
        },
        {
          step: '4',
          title: 'Work in Progress',
          date: 'Pending',
          completed: false,
          active: false,
          remarks: 'On-site execution pending.',
        },
        {
          step: '5',
          title: 'Resolved & Verified',
          date: 'Pending',
          completed: false,
          active: false,
          remarks: 'Completion inspection pending.',
        },
      ],
    };

    complaints.unshift(newComplaint);

    res.status(201).json({
      success: true,
      message: 'Complaint successfully registered.',
      data: newComplaint,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// PATCH /api/complaints/:id
router.patch('/complaints/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = complaints.findIndex(c => c.id.toUpperCase() === id.toUpperCase());

  if (index === -1) {
    res.status(404).json({ success: false, error: `Complaint ${id} not found.` });
    return;
  }

  const existing = complaints[index];
  const { status, priority, assignedTo, officialRemarks, resolutionPhotoUrl } = req.body;

  const nowFormatted = formatDateTime();

  if (priority) existing.priority = priority as PriorityLevel;
  if (assignedTo !== undefined) existing.assignedTo = assignedTo;
  if (officialRemarks !== undefined) existing.officialRemarks = officialRemarks;
  if (resolutionPhotoUrl !== undefined) existing.resolutionPhotoUrl = resolutionPhotoUrl;

  if (status && status !== existing.status) {
    existing.status = status as ComplaintStatus;

    // Update timeline step based on status
    const stepNames: Record<string, number> = {
      'Registered': 1,
      'Under Review': 2,
      'Assigned': 3,
      'In Progress': 4,
      'Resolved': 5,
      'Closed': 5,
    };

    const targetStep = stepNames[status] || 1;

    existing.timeline.forEach((stepItem, idx) => {
      const stepNum = idx + 1;
      if (stepNum < targetStep) {
        stepItem.completed = true;
        stepItem.active = false;
        if (stepItem.date === 'Pending') stepItem.date = nowFormatted;
      } else if (stepNum === targetStep) {
        stepItem.completed = status === 'Resolved' || status === 'Closed';
        stepItem.active = status !== 'Resolved' && status !== 'Closed';
        stepItem.date = nowFormatted;
        if (officialRemarks) {
          stepItem.remarks = officialRemarks;
        }
      } else {
        stepItem.completed = false;
        stepItem.active = false;
      }
    });
  }

  existing.updatedAt = new Date().toISOString();
  complaints[index] = existing;

  res.json({
    success: true,
    message: 'Complaint updated successfully.',
    data: existing,
  });
});

// POST /api/complaints/reset
router.post('/complaints/reset', (_req: Request, res: Response) => {
  complaints = JSON.parse(JSON.stringify(INITIAL_COMPLAINTS));
  res.json({
    success: true,
    message: 'Complaints database reset to default Kanpur demo records.',
    count: complaints.length,
  });
});

export default router;
