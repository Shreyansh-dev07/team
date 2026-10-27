/**
 * SudhaarSetu — Citizen Grievance Dashboard
 */

let citizenComplaints = [];
let activeTab = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  citizenComplaints = await fetchAllComplaints();
  updateDashboardMetrics();
  initDashboardTabs();
  renderCitizenComplaints();
});

function updateDashboardMetrics() {
  const total = citizenComplaints.length;
  const pending = citizenComplaints.filter(c => c.status === 'Registered' || c.status === 'Under Review').length;
  const progress = citizenComplaints.filter(c => c.status === 'Assigned' || c.status === 'In Progress').length;
  const resolved = citizenComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

  document.getElementById('dashTotalCount').textContent = total;
  document.getElementById('dashPendingCount').textContent = pending;
  document.getElementById('dashProgressCount').textContent = progress;
  document.getElementById('dashResolvedCount').textContent = resolved;
}

function initDashboardTabs() {
  document.querySelectorAll('.dash-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.dash-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.getAttribute('data-tab');
      renderCitizenComplaints();
    });
  });
}

function renderCitizenComplaints() {
  const container = document.getElementById('dashComplaintsList');
  if (!container) return;

  let filtered = citizenComplaints;
  if (activeTab === 'pending') {
    filtered = citizenComplaints.filter(c => c.status === 'Registered' || c.status === 'Under Review');
  } else if (activeTab === 'progress') {
    filtered = citizenComplaints.filter(c => c.status === 'Assigned' || c.status === 'In Progress');
  } else if (activeTab === 'resolved') {
    filtered = citizenComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed');
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: #64748b;">
        <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; margin-bottom: 0.75rem; color: #cbd5e1;"></i>
        <p>No complaints found under this category.</p>
        <a href="report.html" class="btn btn-outline-navy btn-sm" style="margin-top: 8px;">
          <i class="fa-solid fa-bullhorn"></i> File a New Grievance
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(c => {
    const sSlug = c.status.toLowerCase().replace(' ', '-');
    const pSlug = (c.priority || 'Medium').toLowerCase();
    const dateFormatted = new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    return `
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; margin-bottom: 1rem; background: #ffffff; transition: box-shadow 0.2s;" onmouseover="this.style.boxShadow='var(--shadow-md)'" onmouseout="this.style.boxShadow='none'">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="font-size: 0.8125rem; font-weight: 700; color: #0f3e6d;">${c.id}</span>
              <span class="priority-badge priority-${pSlug}">${c.priority}</span>
              <span style="font-size: 0.75rem; color: #64748b;">• ${dateFormatted}</span>
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
              ${c.categoryTitle || c.category}
            </h3>
            <div style="font-size: 0.8125rem; color: #475569;">
              <i class="fa-solid fa-location-dot" style="color: #ea580c;"></i> ${c.location}
            </div>
          </div>
          <span class="status-badge status-${sSlug}">
            <i class="fa-solid fa-circle"></i> ${c.status}
          </span>
        </div>

        <p style="font-size: 0.875rem; color: #475569; margin: 8px 0 12px; line-height: 1.4;">
          ${c.description}
        </p>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 10px; flex-wrap: wrap; gap: 8px;">
          <div style="font-size: 0.775rem; color: #64748b;">
            Routed To: <strong style="color: #0369a1;">${c.deptName} (${c.deptCode})</strong>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="track.html?id=${c.id}" class="btn btn-sm btn-primary">
              <i class="fa-solid fa-magnifying-glass"></i> Track Progress
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
