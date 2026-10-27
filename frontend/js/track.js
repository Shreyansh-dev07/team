/**
 * SudhaarSetu — Track Complaint Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('trackSubmitBtn');
  const input = document.getElementById('trackComplaintInput');

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const id = input.value.trim();
      if (id) performTracking(id);
    });
  }

  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const id = input.value.trim();
        if (id) performTracking(id);
      }
    });
  }

  // Quick link demo pills
  document.querySelectorAll('.quick-id-link').forEach(link => {
    link.addEventListener('click', () => {
      const id = link.getAttribute('data-id');
      if (input) input.value = id;
      performTracking(id);
    });
  });

  // Check URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const qId = urlParams.get('id');
  if (qId) {
    if (input) input.value = qId;
    performTracking(qId);
  } else {
    // Default load first sample
    performTracking('SS-KNP-2026-001245');
  }

  const printBtn = document.getElementById('printReceiptBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }
});

async function performTracking(id) {
  const resultCard = document.getElementById('trackingResultContainer');
  const notFoundCard = document.getElementById('trackingNotFoundContainer');
  const searchedDisplay = document.getElementById('searchedIdDisplay');

  const complaint = await fetchComplaintById(id);

  if (!complaint) {
    if (resultCard) resultCard.style.display = 'none';
    if (notFoundCard) notFoundCard.style.display = 'block';
    if (searchedDisplay) searchedDisplay.textContent = id;
    return;
  }

  if (notFoundCard) notFoundCard.style.display = 'none';
  if (resultCard) resultCard.style.display = 'block';

  // Populate data
  document.getElementById('trackDispId').textContent = complaint.id;
  document.getElementById('trackDispDate').textContent = `Reported: ${new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  // Status Badge
  const statusEl = document.getElementById('trackStatusBadge');
  const statusSlug = complaint.status.toLowerCase().replace(' ', '-');
  statusEl.className = `status-badge status-${statusSlug}`;
  statusEl.innerHTML = `<i class="fa-solid fa-circle"></i> Status: ${complaint.status}`;

  // Fields
  document.getElementById('trackCategory').textContent = complaint.categoryTitle || complaint.category;
  document.getElementById('trackDept').textContent = `${complaint.deptName} (${complaint.deptCode})`;
  
  const priorityEl = document.getElementById('trackPriority');
  const pSlug = (complaint.priority || 'Medium').toLowerCase();
  priorityEl.innerHTML = `<span class="priority-badge priority-${pSlug}">${complaint.priority} Priority</span>`;

  document.getElementById('trackLocation').textContent = complaint.location;
  document.getElementById('trackLandmark').textContent = complaint.landmark || 'Not specified';
  document.getElementById('trackDescription').textContent = complaint.description;

  // Photo
  const photoBox = document.getElementById('trackPhotoBox');
  if (photoBox) {
    if (complaint.photoUrl) {
      photoBox.style.display = 'block';
      photoBox.innerHTML = `
        <div style="margin-top: 1.25rem;">
          <strong style="font-size: 0.8125rem; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 6px;">Citizen Uploaded Photo</strong>
          <img src="${complaint.photoUrl}" alt="Issue Evidence" style="max-width: 280px; height: 180px; object-fit: cover; border-radius: 8px; border: 1px solid #cbd5e1;">
        </div>
      `;
    } else {
      photoBox.style.display = 'none';
    }
  }

  // Resolution Evidence
  const resBox = document.getElementById('resolutionEvidenceBox');
  if (resBox) {
    if (complaint.status === 'Resolved' && complaint.resolutionPhotoUrl) {
      resBox.style.display = 'block';
      resBox.innerHTML = `
        <div style="margin-top: 1.5rem; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 1rem;">
          <strong style="color: #166534; display: block; margin-bottom: 6px;"><i class="fa-solid fa-check-circle"></i> Department Resolution Verification (After Repair)</strong>
          <img src="${complaint.resolutionPhotoUrl}" alt="Resolution Proof" style="max-width: 280px; height: 180px; object-fit: cover; border-radius: 6px; border: 1px solid #86efac;">
          <p style="font-size: 0.8125rem; color: #15803d; margin-top: 6px;">Inspected and verified by field engineering squad.</p>
        </div>
      `;
    } else {
      resBox.style.display = 'none';
    }
  }

  // Render Timeline
  renderTimeline(complaint.timeline);
}

function renderTimeline(timeline) {
  const container = document.getElementById('civicTimelineList');
  if (!container) return;

  container.innerHTML = (timeline || []).map((step) => {
    const cls = step.completed ? 'completed' : step.active ? 'active' : '';
    const icon = step.completed ? 'fa-check' : step.active ? 'fa-hourglass-half' : 'fa-circle';
    return `
      <li class="timeline-step ${cls}">
        <div class="timeline-dot"><i class="fa-solid ${icon}"></i></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <span class="timeline-step-title">${step.title}</span>
            <span class="timeline-step-date">${step.date}</span>
          </div>
          <div class="timeline-remarks">${step.remarks}</div>
        </div>
      </li>
    `;
  }).join('');
}
