/**
 * SudhaarSetu — Department & Admin Dashboard Script
 */

let adminComplaints = [];
let activeEditingId = null;

document.addEventListener('DOMContentLoaded', async () => {
  adminComplaints = await fetchAllComplaints();
  renderAdminStats();
  renderDistributionBars();
  renderAdminTable();
  initAdminFilters();
  initModalListeners();
});

function renderAdminStats() {
  const total = adminComplaints.length;
  const newCount = adminComplaints.filter(c => c.status === 'Registered').length;
  const progressCount = adminComplaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolvedCount = adminComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
  const highCount = adminComplaints.filter(c => c.priority === 'High' && c.status !== 'Resolved').length;
  const rate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

  document.getElementById('adminTotalCount').textContent = total;
  document.getElementById('adminNewCount').textContent = newCount;
  document.getElementById('adminProgressCount').textContent = progressCount;
  document.getElementById('adminResolvedCount').textContent = resolvedCount;
  document.getElementById('adminHighPriorityCount').textContent = highCount;
  document.getElementById('adminResolutionRate').textContent = `${rate}%`;
}

function renderDistributionBars() {
  const catContainer = document.getElementById('adminCategoryBars');
  const zoneContainer = document.getElementById('adminZoneBars');

  if (catContainer) {
    const counts = {};
    adminComplaints.forEach(c => counts[c.deptCode] = (counts[c.deptCode] || 0) + 1);
    const maxVal = Math.max(...Object.values(counts), 1);

    catContainer.innerHTML = Object.entries(counts).map(([code, count]) => {
      const pct = Math.round((count / maxVal) * 100);
      return `
        <div style="margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; margin-bottom: 2px;">
            <span style="font-weight: 600; color: #1e293b;">${code}</span>
            <span style="color: #64748b;">${count} complaints</span>
          </div>
          <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
            <div style="height: 100%; width: ${pct}%; background: #0f3e6d; border-radius: 4px;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  if (zoneContainer) {
    const zCounts = {};
    adminComplaints.forEach(c => zCounts[c.zone] = (zCounts[c.zone] || 0) + 1);
    const maxVal = Math.max(...Object.values(zCounts), 1);

    zoneContainer.innerHTML = Object.entries(zCounts).map(([zone, count]) => {
      const pct = Math.round((count / maxVal) * 100);
      return `
        <div style="margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; margin-bottom: 2px;">
            <span style="font-weight: 600; color: #1e293b;">${zone}</span>
            <span style="color: #64748b;">${count} complaints</span>
          </div>
          <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
            <div style="height: 100%; width: ${pct}%; background: #ea580c; border-radius: 4px;"></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function renderAdminTable() {
  const tbody = document.getElementById('adminComplaintsTbody');
  if (!tbody) return;

  const deptF = document.getElementById('adminDeptFilter')?.value || 'all';
  const statusF = document.getElementById('adminStatusFilter')?.value || 'all';
  const priorityF = document.getElementById('adminPriorityFilter')?.value || 'all';
  const searchF = (document.getElementById('adminSearchInput')?.value || '').toLowerCase().trim();

  let filtered = adminComplaints.filter(c => {
    const matchDept = deptF === 'all' || c.deptCode === deptF;
    const matchStatus = statusF === 'all' || c.status.toLowerCase() === statusF.toLowerCase();
    const matchPriority = priorityF === 'all' || c.priority.toLowerCase() === priorityF.toLowerCase();
    const matchSearch = !searchF || 
      c.id.toLowerCase().includes(searchF) ||
      c.location.toLowerCase().includes(searchF) ||
      (c.citizenName && c.citizenName.toLowerCase().includes(searchF));
    return matchDept && matchStatus && matchPriority && matchSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #94a3b8;">No matching complaints in Kanpur departmental queue.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(c => {
    const sSlug = c.status.toLowerCase().replace(' ', '-');
    const pSlug = (c.priority || 'Medium').toLowerCase();
    const dateFormatted = new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    return `
      <tr>
        <td>
          <strong style="color: #0f3e6d; display: block;">${c.id}</strong>
          <span style="font-size: 0.75rem; color: #64748b;">${dateFormatted}</span>
        </td>
        <td>
          <div style="font-weight: 600; color: #0f172a;">${c.categoryTitle || c.category}</div>
          <span style="font-size: 0.725rem; color: #0369a1; font-weight: 600;">${c.deptCode}</span>
        </td>
        <td>
          <div style="font-size: 0.8125rem; color: #334155;">${c.location}</div>
          <span style="font-size: 0.725rem; color: #64748b;">${c.ward} • ${c.zone}</span>
        </td>
        <td>
          <span class="priority-badge priority-${pSlug}">${c.priority}</span>
        </td>
        <td>
          <span class="status-badge status-${sSlug}" style="font-size: 0.7rem; padding: 2px 8px;">${c.status}</span>
        </td>
        <td>
          <div style="font-size: 0.8125rem; color: #0f172a;">${c.citizenName || 'Citizen'}</div>
          <span style="font-size: 0.725rem; color: #64748b;">${c.citizenPhone || 'N/A'}</span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-navy" onclick="openAdminEditModal('${c.id}')">
            <i class="fa-solid fa-pen-to-square"></i> Action
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function initAdminFilters() {
  ['adminDeptFilter', 'adminStatusFilter', 'adminPriorityFilter'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', renderAdminTable);
  });
  document.getElementById('adminSearchInput')?.addEventListener('input', renderAdminTable);

  const resetDataBtn = document.getElementById('resetDemoDataBtn');
  if (resetDataBtn) {
    resetDataBtn.addEventListener('click', async () => {
      if (confirm('Reset all demo complaints back to Kanpur initial data?')) {
        try {
          await fetch('/api/complaints/reset', { method: 'POST' });
        } catch (e) {}
        localStorage.removeItem('sudhaarsetu_complaints');
        adminComplaints = getStoredComplaints();
        renderAdminStats();
        renderDistributionBars();
        renderAdminTable();
        alert('Data successfully reset!');
      }
    });
  }
}

function openAdminEditModal(id) {
  const c = adminComplaints.find(item => item.id === id);
  if (!c) return;

  activeEditingId = id;
  const modal = document.getElementById('actionModal');
  if (!modal) return;

  document.getElementById('modalComplaintId').textContent = c.id;
  document.getElementById('modalIssueTitle').textContent = c.categoryTitle || c.category;
  document.getElementById('modalLocation').textContent = `${c.location} (${c.ward})`;
  document.getElementById('modalLandmark').textContent = c.landmark || 'Not provided';
  document.getElementById('modalDescription').textContent = c.description;
  document.getElementById('modalCitizen').textContent = `${c.citizenName || 'Citizen'} (${c.citizenPhone || 'No phone'})`;

  document.getElementById('modalStatusSelect').value = c.status;
  document.getElementById('modalPrioritySelect').value = c.priority;
  document.getElementById('modalAssignedInput').value = c.assignedTo || '';
  document.getElementById('modalRemarksInput').value = c.officialRemarks || '';

  // Show/Hide resolution photo picker
  const resRow = document.getElementById('modalResolutionEvidenceRow');
  if (resRow) {
    resRow.style.display = c.status === 'Resolved' ? 'block' : 'none';
  }

  modal.classList.add('open');
}

function initModalListeners() {
  const closeBtn = document.getElementById('actionModalClose');
  const modal = document.getElementById('actionModal');
  const saveBtn = document.getElementById('saveAdminChangesBtn');
  const statusSelect = document.getElementById('modalStatusSelect');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  }

  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      const resRow = document.getElementById('modalResolutionEvidenceRow');
      if (resRow) {
        resRow.style.display = e.target.value === 'Resolved' ? 'block' : 'none';
      }
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      if (!activeEditingId) return;

      const newStatus = document.getElementById('modalStatusSelect').value;
      const newPriority = document.getElementById('modalPrioritySelect').value;
      const assignedTo = document.getElementById('modalAssignedInput').value.trim();
      const remarks = document.getElementById('modalRemarksInput').value.trim();
      const resEvidence = document.getElementById('modalResEvidenceSelect').value;

      const payload = {
        status: newStatus,
        priority: newPriority,
        assignedTo,
        officialRemarks: remarks,
        resolutionPhotoUrl: newStatus === 'Resolved' ? resEvidence : undefined
      };

      try {
        await fetch(`/api/complaints/${activeEditingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {}

      // Update local array
      const idx = adminComplaints.findIndex(c => c.id === activeEditingId);
      if (idx !== -1) {
        adminComplaints[idx] = {
          ...adminComplaints[idx],
          ...payload,
          updatedAt: new Date().toISOString()
        };
        saveComplaintsToStorage(adminComplaints);
      }

      modal.classList.remove('open');
      renderAdminStats();
      renderDistributionBars();
      renderAdminTable();
      alert(`Complaint ${activeEditingId} updated successfully.`);
    });
  }
}
