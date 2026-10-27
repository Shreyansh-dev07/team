/**
 * SudhaarSetu - Track Your Complaint Controller (js/track.js)
 * Lookup complaints by ID, display interactive timeline, details,
 * resolution evidence, and print receipt.
 */

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("trackComplaintInput");
  const searchBtn = document.getElementById("trackSubmitBtn");
  const resultCard = document.getElementById("trackingResultContainer");
  const notFoundCard = document.getElementById("trackingNotFoundContainer");

  // Check URL query parameters (e.g. ?id=SS-KNP-2026-001245)
  const urlParams = new URLSearchParams(window.location.search);
  const paramId = urlParams.get("id");
  if (paramId) {
    if (searchInput) searchInput.value = paramId.trim();
    searchComplaint(paramId.trim());
  }

  // Quick ID link clicks
  document.querySelectorAll(".quick-id-link").forEach(link => {
    link.addEventListener("click", () => {
      const id = link.dataset.id || link.innerText.trim();
      if (searchInput) searchInput.value = id;
      searchComplaint(id);
    });
  });

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
      const val = searchInput.value.trim();
      if (!val) {
        window.showToast("Please enter a valid Complaint ID", "warning");
        return;
      }
      searchComplaint(val);
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        searchBtn.click();
      }
    });
  }

  function searchComplaint(id) {
    const complaint = window.getComplaintById(id);

    if (!complaint) {
      if (resultCard) resultCard.style.display = "none";
      if (notFoundCard) {
        notFoundCard.style.display = "block";
        document.getElementById("searchedIdDisplay").textContent = id;
      }
      window.showToast(`No complaint found with ID: ${id}`, "danger");
      return;
    }

    if (notFoundCard) notFoundCard.style.display = "none";
    if (resultCard) {
      resultCard.style.display = "block";
      renderComplaintTracking(complaint);
      resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function renderComplaintTracking(c) {
    // Header Info
    document.getElementById("trackDispId").textContent = c.id;
    document.getElementById("trackDispDate").textContent = `Reported: ${window.formatDate(c.reportedDate)}`;
    document.getElementById("trackStatusBadge").innerHTML = window.getStatusBadgeHtml(c.status);

    // Meta details
    document.getElementById("trackCategory").textContent = c.categoryLabel || c.category;
    document.getElementById("trackDept").textContent = c.department;
    document.getElementById("trackPriority").innerHTML = window.getPriorityBadgeHtml(c.priority);
    document.getElementById("trackLocation").textContent = `${c.location.address} (${c.location.area || ""}, ${c.location.ward || ""})`;
    document.getElementById("trackLandmark").textContent = c.location.landmark || "Not specified";
    document.getElementById("trackDescription").textContent = c.description;

    // Attached Citizen Photo
    const photoBox = document.getElementById("trackPhotoBox");
    if (photoBox) {
      if (c.photoUrl) {
        photoBox.innerHTML = `
          <div style="margin-top: 1rem;">
            <strong style="display:block; font-size: 0.85rem; color: #475569; margin-bottom: 6px;">
              <i class="fa-solid fa-camera"></i> Citizen Uploaded Photo:
            </strong>
            <img src="${c.photoUrl}" style="max-height: 180px; border-radius: 8px; border: 1px solid #cbd5e1; object-fit: cover;" alt="Complaint Photo">
          </div>
        `;
      } else {
        photoBox.innerHTML = "";
      }
    }

    // Render Timeline Steps
    renderTimeline(c.status, c.timeline);

    // Render Resolution Evidence if resolved
    const resEvidenceBox = document.getElementById("resolutionEvidenceBox");
    if (resEvidenceBox) {
      if (c.status === "Resolved" || c.status === "Closed") {
        const evidence = c.resolutionEvidence || {
          resolvedDate: window.formatDate(c.updatedDate),
          officer: "Concerned Department Field Team",
          photoUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80"
        };

        resEvidenceBox.style.display = "block";
        resEvidenceBox.innerHTML = `
          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 1.25rem; margin-top: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 8px; color: #166534; font-weight: 700; margin-bottom: 8px;">
              <i class="fa-solid fa-circle-check"></i> Resolution Evidence & Verification
            </div>
            <p style="font-size: 0.875rem; color: #14532d; margin-bottom: 12px;">
              This civic issue was inspected and resolved on <strong>${evidence.resolvedDate || "Recent date"}</strong> by <strong>${evidence.officer || "Department Squad"}</strong>.
            </p>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <div>
                <span style="display: block; font-size: 0.75rem; color: #475569; font-weight: 600; text-transform: uppercase;">Before (Reported)</span>
                <img src="${c.photoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80'}" style="width: 150px; height: 110px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e1;" alt="Before">
              </div>
              <div>
                <span style="display: block; font-size: 0.75rem; color: #15803d; font-weight: 600; text-transform: uppercase;">After (Resolution Evidence)</span>
                <img src="${evidence.photoUrl || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=400&q=80'}" style="width: 150px; height: 110px; object-fit: cover; border-radius: 6px; border: 2px solid #22c55e;" alt="After">
              </div>
            </div>
          </div>
        `;
      } else {
        resEvidenceBox.style.display = "none";
      }
    }
  }

  function renderTimeline(currentStatus, customTimeline) {
    const STAGES = [
      { key: "Registered", title: "Complaint Registered", icon: "fa-clipboard-check", desc: "Citizen filed grievance" },
      { key: "Under Review", title: "Forwarded to Dept", icon: "fa-paper-plane", desc: "Routed to concerned division" },
      { key: "Assigned", title: "Officer / Squad Assigned", icon: "fa-user-check", desc: "Inspection scheduled" },
      { key: "In Progress", title: "Work in Progress", icon: "fa-wrench", desc: "Field action underway" },
      { key: "Resolved", title: "Issue Resolved", icon: "fa-circle-check", desc: "Work completed & verified" }
    ];

    const timelineList = document.getElementById("civicTimelineList");
    if (!timelineList) return;

    const statusHierarchy = {
      "Registered": 1,
      "Under Review": 2,
      "Assigned": 3,
      "In Progress": 4,
      "Resolved": 5,
      "Closed": 5
    };

    const currentRank = statusHierarchy[currentStatus] || 1;

    let html = "";
    STAGES.forEach((stage, idx) => {
      const stageRank = idx + 1;
      let stateClass = "pending";
      let icon = stage.icon;

      if (stageRank < currentRank) {
        stateClass = "completed";
        icon = "fa-check";
      } else if (stageRank === currentRank) {
        stateClass = "active";
      }

      // Check if timeline entry has specific date/remarks
      const matchEntry = (customTimeline || []).find(e => e.status === stage.key);
      const dateText = matchEntry ? matchEntry.date : (stageRank <= currentRank ? "Completed" : "Pending");
      const remarksText = matchEntry ? matchEntry.remarks : stage.desc;

      html += `
        <li class="timeline-step ${stateClass}">
          <div class="timeline-step-icon">
            <i class="fa-solid ${icon}"></i>
          </div>
          <div class="timeline-step-title">${stage.title}</div>
          <div class="timeline-step-date">${dateText}</div>
          <div style="font-size: 0.725rem; color: #64748b; margin-top: 3px;">${remarksText}</div>
        </li>
      `;
    });

    timelineList.innerHTML = html;
  }

  // Print / Save Receipt
  const printBtn = document.getElementById("printReceiptBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
});
