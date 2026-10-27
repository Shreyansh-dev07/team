/**
 * SudhaarSetu - Citizen Dashboard Controller (js/dashboard.js)
 * Displays citizen grievance overview, personal statistics,
 * recent complaints list with status filters, and track action.
 */

document.addEventListener("DOMContentLoaded", () => {
  let activeTab = "all";

  const totalCard = document.getElementById("dashTotalCount");
  const pendingCard = document.getElementById("dashPendingCount");
  const progressCard = document.getElementById("dashProgressCount");
  const resolvedCard = document.getElementById("dashResolvedCount");
  const complaintsList = document.getElementById("dashComplaintsList");

  function renderCitizenDashboard() {
    const all = window.getComplaints();

    const total = all.length;
    const pending = all.filter(c => c.status === "Registered" || c.status === "Under Review" || c.status === "Assigned").length;
    const progress = all.filter(c => c.status === "In Progress").length;
    const resolved = all.filter(c => c.status === "Resolved" || c.status === "Closed").length;

    if (totalCard) totalCard.textContent = total;
    if (pendingCard) pendingCard.textContent = pending;
    if (progressCard) progressCard.textContent = progress;
    if (resolvedCard) resolvedCard.textContent = resolved;

    // Filter complaints based on active tab
    const filtered = all.filter(c => {
      if (activeTab === "all") return true;
      if (activeTab === "pending") return (c.status === "Registered" || c.status === "Under Review" || c.status === "Assigned");
      if (activeTab === "progress") return c.status === "In Progress";
      if (activeTab === "resolved") return (c.status === "Resolved" || c.status === "Closed");
      return true;
    });

    if (!complaintsList) return;

    if (filtered.length === 0) {
      complaintsList.innerHTML = `
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 3rem 1.5rem; text-align: center; color: #64748b;">
          <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; color: #cbd5e1; margin-bottom: 1rem;"></i>
          <h4 style="color: #1e293b; margin-bottom: 0.5rem;">No Complaints in this view</h4>
          <p style="font-size: 0.9rem; margin-bottom: 1.5rem;">Have an issue to report in your neighborhood in Kanpur?</p>
          <a href="report.html" class="btn btn-primary">
            <i class="fa-solid fa-plus"></i> Report a Civic Issue
          </a>
        </div>
      `;
      return;
    }

    complaintsList.innerHTML = filtered.map(c => `
      <div class="category-card" style="margin-bottom: 1rem; border-left: 5px solid ${c.status === 'Resolved' ? '#16a34a' : (c.priority === 'High' ? '#dc2626' : '#0f3e6d')};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 0.75rem;">
          <div>
            <span style="font-size: 0.8125rem; font-weight: 700; color: #0f3e6d;">ID: ${c.id}</span>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 2px 0;">${c.categoryLabel}</h3>
            <span style="font-size: 0.8125rem; color: #64748b;">
              <i class="fa-solid fa-building-columns"></i> ${c.department}
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            ${window.getPriorityBadgeHtml(c.priority)}
            ${window.getStatusBadgeHtml(c.status)}
          </div>
        </div>

        <p style="font-size: 0.9rem; color: #334155; margin-bottom: 0.75rem; line-height: 1.5;">
          ${c.description}
        </p>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-top: 1px solid #f1f5f9; padding-top: 0.75rem; font-size: 0.8125rem; color: #64748b;">
          <div>
            <i class="fa-solid fa-location-dot" style="color: #ea580c;"></i>
            <strong>${c.location.area || "Kanpur"}</strong>: ${c.location.address}
          </div>
          <div style="display: flex; align-items: center; gap: 14px;">
            <span><i class="fa-regular fa-calendar"></i> ${window.formatDate(c.reportedDate)}</span>
            <a href="track.html?id=${c.id}" class="btn btn-sm btn-outline-navy">
              <i class="fa-solid fa-magnifying-glass"></i> Track Status
            </a>
          </div>
        </div>
      </div>
    `).join("");
  }

  // Filter tabs
  document.querySelectorAll(".dash-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".dash-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeTab = btn.dataset.tab;
      renderCitizenDashboard();
    });
  });

  renderCitizenDashboard();
});
