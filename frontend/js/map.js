/**
 * SudhaarSetu - Civic Issues Map Controller (js/map.js)
 * Interactive Kanpur map with category pins, filtering,
 * privacy-safe issue details, and track linking.
 */

document.addEventListener("DOMContentLoaded", () => {
  let mapInstance = null;
  let markersLayer = null;
  let activeFilters = {
    category: "all",
    status: "all",
    priority: "all",
    area: "all"
  };

  const mapCanvas = document.getElementById("civicFullMap");
  const countBadge = document.getElementById("filteredCountBadge");
  const issuesListContainer = document.getElementById("mapIssuesList");

  // Category Icon & Color definitions
  const CATEGORY_META = {
    pothole: { color: "#ea580c", icon: "fa-road", label: "Pothole" },
    road_crack: { color: "#d97706", icon: "fa-car-burst", label: "Road Crack" },
    garbage: { color: "#16a34a", icon: "fa-trash-can", label: "Garbage" },
    streetlight: { color: "#ca8a04", icon: "fa-lightbulb", label: "Streetlight" },
    water: { color: "#0284c7", icon: "fa-faucet-drip", label: "Water Leakage" },
    drainage: { color: "#7c3aed", icon: "fa-water", label: "Drainage / Sewer" },
    other: { color: "#64748b", icon: "fa-triangle-exclamation", label: "Other" }
  };

  function initMap() {
    if (!mapCanvas) return;

    if (typeof L !== "undefined") {
      try {
        mapInstance = L.map(mapCanvas).setView([window.KANPUR_COORDS.lat, window.KANPUR_COORDS.lng], 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors | SudhaarSetu Kanpur'
        }).addTo(mapInstance);

        markersLayer = L.layerGroup().addTo(mapInstance);
        renderFilteredMarkers();
      } catch (err) {
        console.error("Map initialization error:", err);
      }
    } else {
      mapCanvas.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; padding:2rem; background:#f1f5f9;">
          <i class="fa-solid fa-map-location-dot" style="font-size:3rem; color:#0f3e6d; margin-bottom:1rem;"></i>
          <h3>Civic Issues Map for Kanpur</h3>
          <p style="color:#64748b; max-width:400px;">Interactive map layer is initializing. If you have a Google Maps Key, configure it in js/script.js.</p>
        </div>
      `;
    }
  }

  function getFilteredComplaints() {
    const all = window.getComplaints();
    return all.filter(c => {
      if (activeFilters.category !== "all" && c.category !== activeFilters.category) return false;
      if (activeFilters.status !== "all" && c.status.toLowerCase() !== activeFilters.status.toLowerCase()) return false;
      if (activeFilters.priority !== "all" && c.priority.toLowerCase() !== activeFilters.priority.toLowerCase()) return false;
      if (activeFilters.area !== "all" && c.location.area !== activeFilters.area) return false;
      return true;
    });
  }

  function renderFilteredMarkers() {
    if (!markersLayer) return;

    markersLayer.clearLayers();
    const complaints = getFilteredComplaints();

    if (countBadge) {
      countBadge.textContent = `${complaints.length} Issues Found`;
    }

    renderSidebarList(complaints);

    complaints.forEach(item => {
      const meta = CATEGORY_META[item.category] || CATEGORY_META.other;

      const markerHtml = `
        <div style="background-color: ${meta.color}; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 6px rgba(0,0,0,0.3); border: 2px solid white; cursor: pointer;">
          <i class="fa-solid ${meta.icon}" style="font-size: 14px;"></i>
        </div>
      `;

      const customIcon = L.divIcon({
        className: `civic-marker-wrap`,
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      // Public Safe Popup (NO citizen name or phone)
      const popupContent = `
        <div style="min-width: 240px; font-family: system-ui, sans-serif; padding: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 0.75rem; font-weight: 700; color: #0f3e6d;">#${item.id}</span>
            ${window.getStatusBadgeHtml(item.status)}
          </div>
          <h4 style="margin: 0 0 4px; font-size: 1rem; color: #0f172a;">${item.categoryLabel}</h4>
          <p style="font-size: 0.8125rem; color: #475569; margin: 0 0 6px;">
            <i class="fa-solid fa-location-dot" style="color: #ea580c;"></i> ${item.location.address}
          </p>
          <div style="display: flex; gap: 6px; margin-bottom: 8px;">
            ${window.getPriorityBadgeHtml(item.priority)}
            <span style="font-size: 0.75rem; background: #e2e8f0; color: #334155; padding: 2px 6px; border-radius: 4px;">
              ${item.location.ward || "Kanpur"}
            </span>
          </div>
          <p style="font-size: 0.8rem; color: #334155; line-height: 1.3; margin-bottom: 10px; max-height: 48px; overflow: hidden; text-overflow: ellipsis;">
            ${item.description}
          </p>
          <a href="track.html?id=${item.id}" class="btn btn-sm btn-gov-navy" style="display: block; text-align: center; color: white !important;">
            <i class="fa-solid fa-magnifying-glass"></i> Track Progress
          </a>
        </div>
      `;

      const marker = L.marker([item.location.lat, item.location.lng], { icon: customIcon })
        .bindPopup(popupContent)
        .addTo(markersLayer);

      // Save marker reference on item for sidebar click
      item._marker = marker;
    });
  }

  function renderSidebarList(complaints) {
    if (!issuesListContainer) return;

    if (complaints.length === 0) {
      issuesListContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: #94a3b8;">
          <i class="fa-solid fa-circle-check" style="font-size: 2rem; margin-bottom: 8px;"></i>
          <p>No civic issues match the selected filters in Kanpur.</p>
        </div>
      `;
      return;
    }

    issuesListContainer.innerHTML = complaints.map(c => `
      <div class="map-issue-card" data-id="${c.id}" style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s; border-left: 4px solid ${CATEGORY_META[c.category] ? CATEGORY_META[c.category].color : '#0f3e6d'};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <strong style="font-size: 0.85rem; color: #0f3e6d;">#${c.id}</strong>
          ${window.getStatusBadgeHtml(c.status)}
        </div>
        <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 2px;">${c.categoryLabel}</div>
        <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">
          <i class="fa-solid fa-location-dot"></i> ${c.location.area || "Kanpur"} (${c.location.ward || ""})
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #94a3b8;">
          <span>${window.formatDate(c.reportedDate)}</span>
          ${window.getPriorityBadgeHtml(c.priority)}
        </div>
      </div>
    `).join("");

    // Add click listeners to focus marker on map
    issuesListContainer.querySelectorAll(".map-issue-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.dataset.id;
        const target = complaints.find(c => c.id === id);
        if (target && target._marker && mapInstance) {
          mapInstance.setView([target.location.lat, target.location.lng], 15);
          target._marker.openPopup();
        }
      });
    });
  }

  // Filter Event Listeners
  // Category buttons
  document.querySelectorAll(".filter-cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilters.category = btn.dataset.category;
      renderFilteredMarkers();
    });
  });

  // Status buttons
  document.querySelectorAll(".filter-status-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-status-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilters.status = btn.dataset.status;
      renderFilteredMarkers();
    });
  });

  // Priority buttons
  document.querySelectorAll(".filter-priority-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-priority-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilters.priority = btn.dataset.priority;
      renderFilteredMarkers();
    });
  });

  // Area select dropdown
  const areaSelect = document.getElementById("mapAreaFilter");
  if (areaSelect) {
    areaSelect.innerHTML = `<option value="all">All Kanpur Areas</option>` +
      window.KANPUR_LOCALITIES.map(l => `<option value="${l.name}">${l.name} (${l.ward})</option>`).join("");

    areaSelect.addEventListener("change", (e) => {
      activeFilters.area = e.target.value;
      if (e.target.value !== "all" && mapInstance) {
        const loc = window.KANPUR_LOCALITIES.find(l => l.name === e.target.value);
        if (loc) {
          mapInstance.setView([loc.lat, loc.lng], 14);
        }
      }
      renderFilteredMarkers();
    });
  }

  // Reset filters
  const resetBtn = document.getElementById("resetFiltersBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      activeFilters = { category: "all", status: "all", priority: "all", area: "all" };
      document.querySelectorAll(".filter-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.category === "all" || b.dataset.status === "all" || b.dataset.priority === "all");
      });
      if (areaSelect) areaSelect.value = "all";
      if (mapInstance) {
        mapInstance.setView([window.KANPUR_COORDS.lat, window.KANPUR_COORDS.lng], 12);
      }
      renderFilteredMarkers();
      window.showToast("Map filters reset", "info");
    });
  }

  initMap();
});
