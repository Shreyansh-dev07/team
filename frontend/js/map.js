/**
 * SudhaarSetu — Kanpur Civic Issues GIS Map
 */

let mapInstance = null;
let allComplaints = [];
let markersLayer = null;

let filterCat = 'all';
let filterStatus = 'all';
let filterPriority = 'all';
let filterArea = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  initMapFilters();
  initMapEngine();
  allComplaints = await fetchAllComplaints();
  renderMapMarkers();
});

function initMapEngine() {
  if (typeof L === 'undefined') return;

  // Kanpur Central Coordinates
  const KANPUR_CENTER = [26.4499, 80.3319];
  mapInstance = L.map('civicFullMap').setView(KANPUR_CENTER, 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors • Kanpur Nagar GIS'
  }).addTo(mapInstance);

  markersLayer = L.layerGroup().addTo(mapInstance);
}

function initMapFilters() {
  const areaSelect = document.getElementById('mapAreaFilter');
  if (areaSelect) {
    areaSelect.innerHTML = `<option value="all">All Kanpur Wards & Localities</option>` +
      KANPUR_AREAS.map(a => `<option value="${a.name}">${a.name} (${a.ward})</option>`).join('');

    areaSelect.addEventListener('change', (e) => {
      filterArea = e.target.value;
      renderMapMarkers();
    });
  }

  // Category buttons
  document.querySelectorAll('.filter-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCat = btn.getAttribute('data-category');
      renderMapMarkers();
    });
  });

  // Status buttons
  document.querySelectorAll('.filter-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-status-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterStatus = btn.getAttribute('data-status');
      renderMapMarkers();
    });
  });

  // Priority buttons
  document.querySelectorAll('.filter-priority-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-priority-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterPriority = btn.getAttribute('data-priority');
      renderMapMarkers();
    });
  });

  // Reset button
  const resetBtn = document.getElementById('resetFiltersBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      filterCat = 'all';
      filterStatus = 'all';
      filterPriority = 'all';
      filterArea = 'all';
      if (areaSelect) areaSelect.value = 'all';
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.filter-btn[data-category="all"], .filter-btn[data-status="all"], .filter-btn[data-priority="all"]')
        .forEach(b => b.classList.add('active'));
      renderMapMarkers();
    });
  }
}

function getCategoryColor(cat) {
  switch (cat) {
    case 'pothole':
    case 'road_crack': return '#ea580c'; // PWD orange
    case 'garbage': return '#16a34a'; // Sanitation green
    case 'streetlight': return '#ca8a04'; // Light yellow
    case 'water': return '#0284c7'; // Water blue
    case 'drainage': return '#7c3aed'; // Sewer purple
    default: return '#64748b';
  }
}

function renderMapMarkers() {
  if (!mapInstance || !markersLayer) return;
  markersLayer.clearLayers();

  let filtered = allComplaints.filter(c => {
    const matchCat = filterCat === 'all' || c.category === filterCat;
    const matchStatus = filterStatus === 'all' || c.status.toLowerCase() === filterStatus.toLowerCase();
    const matchPriority = filterPriority === 'all' || c.priority.toLowerCase() === filterPriority.toLowerCase();
    const matchArea = filterArea === 'all' || c.location.toLowerCase().includes(filterArea.toLowerCase());
    return matchCat && matchStatus && matchPriority && matchArea;
  });

  const countBadge = document.getElementById('filteredCountBadge');
  if (countBadge) {
    countBadge.textContent = `${filtered.length} Issues Found`;
  }

  const listContainer = document.getElementById('mapIssuesList');
  if (listContainer) {
    if (filtered.length === 0) {
      listContainer.innerHTML = `<div style="font-size: 0.85rem; color: #94a3b8; text-align: center; padding: 2rem 0;">No matching complaints in Kanpur.</div>`;
    } else {
      listContainer.innerHTML = filtered.map(c => `
        <div class="map-issue-card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s;" onclick="zoomToComplaint('${c.id}')">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
            <strong style="font-size: 0.85rem; color: #0f172a;">${c.categoryTitle || c.category}</strong>
            <span class="status-badge status-${c.status.toLowerCase().replace(' ', '-')}" style="font-size: 0.65rem; padding: 2px 6px;">${c.status}</span>
          </div>
          <div style="font-size: 0.775rem; color: #64748b; margin-bottom: 4px;"><i class="fa-solid fa-location-dot"></i> ${c.location}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.725rem;">
            <span style="color: #0369a1; font-weight: 600;">${c.deptCode}</span>
            <a href="track.html?id=${c.id}" style="color: #ea580c; text-decoration: underline;">Track #${c.id}</a>
          </div>
        </div>
      `).join('');
    }
  }

  // Plot custom colored circle markers
  filtered.forEach(c => {
    const color = getCategoryColor(c.category);
    const marker = L.circleMarker([c.lat, c.lng], {
      radius: 9,
      fillColor: color,
      color: '#ffffff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.85
    }).addTo(markersLayer);

    const popupHtml = `
      <div style="font-family: sans-serif; min-width: 200px; padding: 4px;">
        <span style="font-size: 0.7rem; font-weight: 700; color: ${color}; text-transform: uppercase;">${c.deptCode} • ${c.priority} Priority</span>
        <h4 style="margin: 4px 0; font-size: 0.95rem; color: #0f3e6d;">${c.categoryTitle || c.category}</h4>
        <div style="font-size: 0.8rem; color: #475569; margin-bottom: 4px;"><i class="fa-solid fa-location-dot"></i> ${c.location}</div>
        <p style="font-size: 0.775rem; color: #64748b; margin-bottom: 6px;">${c.description}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 6px; border-top: 1px solid #e2e8f0;">
          <span style="font-size: 0.75rem; font-weight: 700;">Status: ${c.status}</span>
          <a href="track.html?id=${c.id}" style="font-size: 0.75rem; color: #ea580c; font-weight: 600; text-decoration: underline;">Track Issue</a>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml);
  });
}

function zoomToComplaint(id) {
  const c = allComplaints.find(item => item.id === id);
  if (c && mapInstance) {
    mapInstance.setView([c.lat, c.lng], 16, { animate: true });
  }
}
