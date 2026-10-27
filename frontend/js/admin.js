/**
 * SudhaarSetu - Government Department / Admin Controller (js/admin.js)
 * Triage complaints, update statuses, adjust priority, assign teams,
 * attach resolution evidence, and compute Kanpur civic statistics.
 */

document.addEventListener("DOMContentLoaded", () => {
  let activeComplaint = null;
  let filters = {
    dept: "all",
    status: "all",
    priority: "all",
    search: ""
  };

  const tbody = document.getElementById("adminComplaintsTbody");
  const modal = document.getElementById("actionModal");
  const modalCloseBtn = document.getElementById("actionModalClose");
  const saveChangesBtn = document.getElementById("saveAdminChangesBtn");

  function renderDashboard() {
    const all = window.getComplaints();

    // 1. Compute Statistics
    const total = all.length;
    const registered = all.filter(c => c.status === "Registered").length;
    const underReview = all.filter(c => c.status === "Under Review").length;
    const assigned = all.filter(c => c.status === "Assigned").length;
    const inProgress = all.filter(c => c.status === "In Progress").length;
    const resolved = all.filter(c => c.status === "Resolved" || c.status === "Closed").length;
    const pending = registered + underReview + assigned;
    const highPriority = all.filter(c => c.priority === "High").length;
    const resRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Update Stat Cards
    setCardVal("adminTotalCount", total);
    setCardVal("adminNewCount", registered);
    setCardVal("adminPendingCount", pending);
    setCardVal("adminProgressCount", inProgress);
    setCardVal("adminResolvedCount", resolved);
    setCardVal("adminHighPriorityCount", highPriority);
    setCardVal("adminResolutionRate", `${resRate}%`);

    // 2. Render Gov-style Progress Charts
    renderGovCharts(all, total, resolved);

    // 3. Render Table
    renderComplaintsTable(all);
  }

  function setCardVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function renderGovCharts(all, total, resolved) {
    // Breakdown by Category
    const catCounts = {
      pothole: 0,
      road_crack: 0,
      garbage: 0,
      streetlight: 0,
      water: 0,
      drainage: 0,
      other: 0
    };

    all.forEach(c => {
      if (catCounts[c.category] !== undefined) catCounts[c.category]++;
      else catCounts.other++;
    });

    const categoryChart = document.getElementById("adminCategoryBars");
    if (categoryChart) {
      const items = [
        { label: "Road & PWD", count: catCounts.pothole + catCounts.road_crack, color: "#ea580c" },
        { label: "Sanitation & SWM", count: catCounts.garbage, color: "#16a34a" },
        { label: "Streetlights", count: catCounts.streetlight, color: "#ca8a04" },
        { label: "Kanpur Jal Sansthan", count: catCounts.water, color: "#0284c7" },
        { label: "Drainage & Sewerage", count: catCounts.drainage, color: "#7c3aed" },
        { label: "General Civic", count: catCounts.other, color: "#64748b" }
      ];

      categoryChart.innerHTML = items.map(item => {
        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
        return `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; font-weight: 600; margin-bottom: 4px;">
              <span>${item.label}</span>
              <span>${item.count} (${pct}%)</span>
            </div>
            <div style="height: 10px; background: #e2e8f0; border-radius: 5px; overflow: hidden;">
              <div style="width: ${pct}%; height: 100%; background: ${item.color}; border-radius: 5px;"></div>
            </div>
          </div>
        `;
      }).join("");
    }

    // Breakdown by Kanpur Zones
    const zoneChart = document.getElementById("adminZoneBars");
    if (zoneChart) {
      const zoneCounts = {};
      all.forEach(c => {
        const area = c.location.area || "Central Kanpur";
        zoneCounts[area] = (zoneCounts[area] || 0) + 1;
      });

      const sortedZones = Object.entries(zoneCounts).sort((a,b) => b[1] - a[1]).slice(0, 5);
      zoneChart.innerHTML = sortedZones.map(([zone, count]) => {
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; font-weight: 600; margin-bottom: 4px;">
              <span>${zone}</span>
              <span>${count}</span>
            </div>
            <div style="height: 10px; background: #e2e8f0; border-radius: 5px; overflow: hidden;">
              <div style="width: ${pct}%; height: 100%; background: #0f3e6d; border-radius: 5px;"></div>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  function renderComplaintsTable(all) {
    if (!tbody) return;

    const filtered = all.filter(c => {
      if (filters.dept !== "all" && c.deptCode !== filters.dept) return false;
      if (filters.status !== "all" && c.status.toLowerCase() !== filters.status.toLowerCase()) return false;
      if (filters.priority !== "all" && c.priority.toLowerCase() !== filters.priority.toLowerCase()) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const str = `${c.id} ${c.categoryLabel} ${c.location.address} ${c.location.area} ${c.citizenName}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2rem; color: #94a3b8;">
            <i class="fa-solid fa-inbox" style="font-size: 2rem; margin-bottom: 8px;"></i>
            <p>No complaints match the specified department filters.</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(c => `
      <tr>
        <td>
          <a href="track.html?id=${c.id}" target="_blank" style="font-weight: 700; color: #0f3e6d;">
            ${c.id}
          </a>
          <span style="display: block; font-size: 0.725rem; color: #64748b;">${window.formatDate(c.reportedDate)}</span>
        </td>
        <td>
          <strong>${c.categoryLabel}</strong>
          <span style="display: block; font-size: 0.725rem; color: #64748b;">${c.deptCode}</span>
        </td>
        <td>
          <div style="max-width: 200px;">
            <div style="font-weight: 600; font-size: 0.8125rem;">${c.location.area || "Kanpur"}</div>
            <div style="font-size: 0.75rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.location.address}</div>
          </div>
        </td>
        <td>${window.getPriorityBadgeHtml(c.priority)}</td>
        <td>${window.getStatusBadgeHtml(c.status)}</td>
        <td>
          <div style="font-size: 0.8125rem;">${c.citizenName || "Citizen"}</div>
          <div style="font-size: 0.725rem; color: #64748b;">${c.citizenPhone || "N/A"}</div>
        </td>
        <td>
          <button class="btn btn-sm btn-gov-navy take-action-btn" data-id="${c.id}">
            <i class="fa-solid fa-pen-to-square"></i> Action
          </button>
        </td>
      </tr>
    `).join("");

    // Bind action buttons
    tbody.querySelectorAll(".take-action-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        openActionModal(btn.dataset.id);
      });
    });
  }

  // Open Action Modal
  function openActionModal(id) {
    const complaint = window.getComplaintById(id);
    if (!complaint) return;
    activeComplaint = complaint;

    document.getElementById("modalComplaintId").textContent = complaint.id;
    document.getElementById("modalIssueTitle").textContent = `${complaint.categoryLabel} - ${complaint.location.area}`;
    document.getElementById("modalLocation").textContent = `${complaint.location.address} (${complaint.location.ward || ""})`;
    document.getElementById("modalLandmark").textContent = complaint.location.landmark || "None specified";
    document.getElementById("modalDescription").textContent = complaint.description;
    document.getElementById("modalCitizen").textContent = `${complaint.citizenName} (${complaint.citizenPhone || "No phone"})`;

    // Photo preview
    const photoBox = document.getElementById("modalPhotoContainer");
    if (photoBox) {
      if (complaint.photoUrl) {
        photoBox.innerHTML = `
          <strong style="font-size: 0.8125rem; color: #475569; display: block; margin-bottom: 4px;">Incident Photo:</strong>
          <img src="${complaint.photoUrl}" style="max-height: 140px; border-radius: 6px; border: 1px solid #cbd5e1; object-fit: cover;">
        `;
      } else {
        photoBox.innerHTML = `<span style="font-size: 0.8125rem; color: #94a3b8;"><i class="fa-solid fa-image-slash"></i> No citizen photo attached</span>`;
      }
    }

    // Form inputs
    const statusSelect = document.getElementById("modalStatusSelect");
    const prioritySelect = document.getElementById("modalPrioritySelect");
    const remarksInput = document.getElementById("modalRemarksInput");
    const assignedInput = document.getElementById("modalAssignedInput");

    if (statusSelect) statusSelect.value = complaint.status;
    if (prioritySelect) prioritySelect.value = complaint.priority;
    if (remarksInput) remarksInput.value = complaint.remarks || "";
    
    // Find assigned officer if in timeline
    const assignedEntry = (complaint.timeline || []).find(e => e.status === "Assigned");
    if (assignedInput) {
      assignedInput.value = assignedEntry ? assignedEntry.remarks : "Squad 4 (Eng. Amit Saxena)";
    }

    // Resolution Evidence Section
    const resEvidenceRow = document.getElementById("modalResolutionEvidenceRow");
    if (resEvidenceRow) {
      toggleResolutionEvidence(statusSelect.value === "Resolved" || statusSelect.value === "Closed");
    }

    modal.classList.add("open");
  }

  function toggleResolutionEvidence(show) {
    const row = document.getElementById("modalResolutionEvidenceRow");
    if (row) row.style.display = show ? "block" : "none";
  }

  const statusSelect = document.getElementById("modalStatusSelect");
  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      toggleResolutionEvidence(e.target.value === "Resolved" || e.target.value === "Closed");
    });
  }

  // Close modal
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => modal.classList.remove("open"));
  }
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  }

  // Save changes
  if (saveChangesBtn) {
    saveChangesBtn.addEventListener("click", () => {
      if (!activeComplaint) return;

      const newStatus = document.getElementById("modalStatusSelect").value;
      const newPriority = document.getElementById("modalPrioritySelect").value;
      const newRemarks = document.getElementById("modalRemarksInput").value.trim();
      const assignedTo = document.getElementById("modalAssignedInput").value.trim();
      const resPhotoSelect = document.getElementById("modalResEvidenceSelect");

      // Build updated timeline
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }) + ", " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

      const updatedTimeline = [...(activeComplaint.timeline || [])];

      // Add timeline entry if status changed
      if (newStatus !== activeComplaint.status) {
        updatedTimeline.push({
          status: newStatus,
          title: `Status updated to ${newStatus}`,
          date: formattedDate,
          remarks: newRemarks || `Updated by authorized departmental nodal officer (${assignedTo})`
        });
      }

      // Resolution evidence
      let resolutionEvidence = activeComplaint.resolutionEvidence;
      if (newStatus === "Resolved" || newStatus === "Closed") {
        resolutionEvidence = {
          resolvedDate: formattedDate,
          officer: assignedTo || "Field Engineering Squad",
          photoUrl: resPhotoSelect ? resPhotoSelect.value : "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80"
        };
      }

      window.updateComplaint(activeComplaint.id, {
        status: newStatus,
        priority: newPriority,
        remarks: newRemarks,
        timeline: updatedTimeline,
        resolutionEvidence: resolutionEvidence
      });

      modal.classList.remove("open");
      renderDashboard();
      window.showToast(`Complaint ${activeComplaint.id} updated successfully to ${newStatus}`, "success");
    });
  }

  // Filter Listeners
  const deptFilter = document.getElementById("adminDeptFilter");
  const statusFilter = document.getElementById("adminStatusFilter");
  const priorityFilter = document.getElementById("adminPriorityFilter");
  const searchInput = document.getElementById("adminSearchInput");

  if (deptFilter) deptFilter.addEventListener("change", (e) => { filters.dept = e.target.value; renderDashboard(); });
  if (statusFilter) statusFilter.addEventListener("change", (e) => { filters.status = e.target.value; renderDashboard(); });
  if (priorityFilter) priorityFilter.addEventListener("change", (e) => { filters.priority = e.target.value; renderDashboard(); });
  if (searchInput) searchInput.addEventListener("input", (e) => { filters.search = e.target.value.trim(); renderDashboard(); });

  // Reset Demo Data button
  const resetDemoBtn = document.getElementById("resetDemoDataBtn");
  if (resetDemoBtn) {
    resetDemoBtn.addEventListener("click", () => {
      if (confirm("Reset all complaints back to default Kanpur seed records?")) {
        localStorage.removeItem("sudhaarsetu_complaints");
        localStorage.removeItem("sudhaarsetu_counter");
        window.initStorage();
        renderDashboard();
        window.showToast("Demo complaints reloaded", "info");
      }
    });
  }

  renderDashboard();
});
