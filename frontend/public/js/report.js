/**
 * SudhaarSetu — Report Form Wizard Script
 */

let currentStep = 1;
let selectedCategory = 'pothole';
let uploadedPhotoData = '';
let selectedArea = KANPUR_AREAS[0];
let mapInstance = null;
let markerInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  initCategorySelectors();
  initPhotoUpload();
  initKanpurMapPicker();
  initFormNavigation();
  checkUrlCategoryParam();
});

function checkUrlCategoryParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const cat = urlParams.get('category');
  if (cat && DEPARTMENTS[cat]) {
    selectCategory(cat);
  }
}

function initCategorySelectors() {
  const cards = document.querySelectorAll('.issue-option-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-category');
      selectCategory(cat);
    });
  });
}

function selectCategory(cat) {
  selectedCategory = cat;
  document.querySelectorAll('.issue-option-card').forEach(c => {
    c.classList.toggle('selected', c.getAttribute('data-category') === cat);
  });

  const dept = DEPARTMENTS[cat] || DEPARTMENTS.other;
  const nameEl = document.getElementById('routedDeptName');
  const officerEl = document.getElementById('routedDeptOfficer');
  const estEl = document.getElementById('routedDeptEst');

  if (nameEl) nameEl.textContent = dept.name;
  if (officerEl) officerEl.textContent = `Nodal Officer: ${dept.officer}`;
  if (estEl) estEl.textContent = `Estimated Resolution: Within ${dept.sla}`;
}

function initPhotoUpload() {
  const input = document.getElementById('issuePhotoInput');
  const dropZone = document.getElementById('photoDropZone');
  const previewContainer = document.getElementById('photoPreviewContainer');
  const previewImg = document.getElementById('photoPreviewImg');
  const removeBtn = document.getElementById('removePhotoBtn');
  const aiCard = document.getElementById('aiAssistantCard');

  if (input) {
    input.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          uploadedPhotoData = event.target.result;
          displayPhotoPreview(uploadedPhotoData);
          triggerAiAnalysis(file.name);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Quick Sample Photo buttons
  document.querySelectorAll('.sample-photo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-sample');
      const sampleMap = {
        pothole: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        garbage: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80',
        streetlight: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
        water: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80'
      };
      if (sampleMap[type]) {
        uploadedPhotoData = sampleMap[type];
        displayPhotoPreview(uploadedPhotoData);
        triggerAiAnalysis(type);
      }
    });
  });

  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      uploadedPhotoData = '';
      if (previewContainer) previewContainer.style.display = 'none';
      if (dropZone) dropZone.style.display = 'block';
      if (aiCard) aiCard.style.display = 'none';
      if (input) input.value = '';
    });
  }

  function displayPhotoPreview(src) {
    if (previewImg) previewImg.src = src;
    if (previewContainer) previewContainer.style.display = 'block';
    if (dropZone) dropZone.style.display = 'none';
  }

  async function triggerAiAnalysis(context) {
    if (!aiCard) return;
    aiCard.style.display = 'block';

    const confBar = document.getElementById('aiConfidenceBar');
    const confText = document.getElementById('aiConfidenceText');
    const detectedEl = document.getElementById('aiDetectedCategory');

    // Call backend AI triage endpoint
    try {
      const res = await fetch('/api/ai/analyze-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: context, photoUrl: uploadedPhotoData })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          if (detectedEl) detectedEl.textContent = json.data.categoryName;
          if (confBar) confBar.style.width = `${json.data.confidenceScore}%`;
          if (confText) confText.textContent = `${json.data.confidenceScore}%`;
          return;
        }
      }
    } catch (e) {}

    // Fallback simulation
    if (detectedEl) detectedEl.textContent = 'Pothole / Road Damage';
    if (confBar) confBar.style.width = '92%';
    if (confText) confText.textContent = '92%';
  }

  const confirmAiBtn = document.getElementById('confirmAiBtn');
  if (confirmAiBtn) {
    confirmAiBtn.addEventListener('click', () => {
      selectCategory('pothole');
      alert('AI Category recommendation confirmed: Road / Public Works Department.');
    });
  }
}

function initKanpurMapPicker() {
  const areaSelect = document.getElementById('areaSelect');
  if (areaSelect) {
    areaSelect.innerHTML = KANPUR_AREAS.map((a, i) => 
      `<option value="${i}">${a.name} (${a.ward}) - ${a.zone}</option>`
    ).join('');

    areaSelect.addEventListener('change', (e) => {
      const idx = parseInt(e.target.value, 10);
      selectedArea = KANPUR_AREAS[idx];
      updateMapPosition(selectedArea.lat, selectedArea.lng, selectedArea.name);
    });
  }

  // Use Leaflet if loaded
  const mapEl = document.getElementById('locationMapCanvas');
  if (mapEl && typeof L !== 'undefined') {
    mapInstance = L.map('locationMapCanvas').setView([selectedArea.lat, selectedArea.lng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors • Kanpur Nagar'
    }).addTo(mapInstance);

    markerInstance = L.marker([selectedArea.lat, selectedArea.lng], { draggable: true }).addTo(mapInstance);

    markerInstance.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      selectedArea.lat = pos.lat;
      selectedArea.lng = pos.lng;
      updateLocationBadge();
    });

    mapInstance.on('click', (e) => {
      markerInstance.setLatLng(e.latlng);
      selectedArea.lat = e.latlng.lat;
      selectedArea.lng = e.latlng.lng;
      updateLocationBadge();
    });
  }

  const currLocBtn = document.getElementById('useCurrentLocationBtn');
  if (currLocBtn) {
    currLocBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            selectedArea.lat = pos.coords.latitude;
            selectedArea.lng = pos.coords.longitude;
            updateMapPosition(pos.coords.latitude, pos.coords.longitude, 'Your Current Location');
          },
          () => {
            alert('Kanpur GPS location simulated for demo.');
          }
        );
      }
    });
  }
}

function updateMapPosition(lat, lng, label) {
  if (mapInstance && markerInstance) {
    mapInstance.setView([lat, lng], 14);
    markerInstance.setLatLng([lat, lng]);
  }
  updateLocationBadge(label);
}

function updateLocationBadge(customLabel) {
  const badge = document.getElementById('locationStatusBadge');
  const addressInput = document.getElementById('manualAddressInput');
  const txt = customLabel || `${selectedArea.name} (${selectedArea.ward}), Kanpur`;
  if (badge) {
    badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Location Selected: <strong>${txt}</strong>`;
  }
  if (addressInput) {
    addressInput.value = `${txt}, Kanpur, Uttar Pradesh`;
  }
  checkForDuplicates();
}

function checkForDuplicates() {
  const alertBox = document.getElementById('duplicateIssueAlert');
  if (!alertBox) return;

  const stored = getStoredComplaints();
  const nearby = stored.find(c => c.category === selectedCategory && c.status !== 'Resolved' && c.location.toLowerCase().includes(selectedArea.name.toLowerCase()));

  if (nearby) {
    alertBox.style.display = 'block';
    alertBox.innerHTML = `
      <i class="fa-solid fa-circle-exclamation"></i>
      <strong>Notice:</strong> An active <strong>${selectedCategory.toUpperCase()}</strong> complaint (<a href="track.html?id=${nearby.id}" style="color: #b91c1c; text-decoration: underline;">${nearby.id}</a>) is already being addressed near ${selectedArea.name}. You may still proceed if this is a distinct issue.
    `;
  } else {
    alertBox.style.display = 'none';
  }
}

function initFormNavigation() {
  const nextBtn = document.getElementById('nextStepBtn');
  const prevBtn = document.getElementById('prevStepBtn');
  const submitBtn = document.getElementById('submitComplaintBtn');
  const editBtn = document.getElementById('editComplaintBtn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep < 5) {
        goToStep(currentStep + 1);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
  }

  if (editBtn) {
    editBtn.addEventListener('click', () => goToStep(1));
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', handleComplaintSubmit);
  }

  document.querySelectorAll('.step-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const target = parseInt(pill.getAttribute('data-step'), 10);
      if (target <= 5) goToStep(target);
    });
  });
}

function goToStep(step) {
  currentStep = step;

  // Toggle step blocks
  document.querySelectorAll('.step-block').forEach(b => {
    b.classList.toggle('active', parseInt(b.getAttribute('data-step'), 10) === step);
  });

  // Toggle step pills
  document.querySelectorAll('.step-pill').forEach(p => {
    const s = parseInt(p.getAttribute('data-step'), 10);
    p.classList.toggle('active', s === step);
    p.classList.toggle('completed', s < step);
  });

  const prevBtn = document.getElementById('prevStepBtn');
  const nextBtn = document.getElementById('nextStepBtn');
  const submitBtn = document.getElementById('submitComplaintBtn');

  if (prevBtn) prevBtn.style.display = step > 1 && step < 6 ? 'inline-flex' : 'none';
  if (nextBtn) nextBtn.style.display = step < 5 ? 'inline-flex' : 'none';
  if (submitBtn) submitBtn.style.display = step === 5 ? 'inline-flex' : 'none';

  if (step === 3 && mapInstance) {
    setTimeout(() => mapInstance.invalidateSize(), 200);
  }

  if (step === 5) {
    populateReviewTable();
  }
}

function populateReviewTable() {
  const dept = DEPARTMENTS[selectedCategory] || DEPARTMENTS.other;
  const desc = document.getElementById('issueDescriptionInput')?.value || 'Civic infrastructure repair requested.';
  const name = document.getElementById('citizenNameInput')?.value || 'Kanpur Citizen';
  const phone = document.getElementById('citizenPhoneInput')?.value || '';
  const addr = document.getElementById('manualAddressInput')?.value || `${selectedArea.name}, Kanpur`;

  document.getElementById('revCategory').textContent = selectedCategory.toUpperCase().replace('_', ' ');
  document.getElementById('revDept').textContent = `${dept.name} (${dept.code})`;
  document.getElementById('revLocation').textContent = addr;
  document.getElementById('revDesc').textContent = desc;
  document.getElementById('revCitizen').textContent = phone ? `${name} (${phone})` : name;
  document.getElementById('revPhoto').textContent = uploadedPhotoData ? 'Photo Attached (Ready for field squad)' : 'No Photo';
}

async function handleComplaintSubmit() {
  const desc = document.getElementById('issueDescriptionInput')?.value || 'Civic infrastructure repair requested.';
  const name = document.getElementById('citizenNameInput')?.value || 'Kanpur Citizen';
  const phone = document.getElementById('citizenPhoneInput')?.value || '';
  const addr = document.getElementById('manualAddressInput')?.value || `${selectedArea.name}, Kanpur`;
  const landmark = document.getElementById('landmarkInput')?.value || '';

  const payload = {
    category: selectedCategory,
    categoryTitle: `${selectedCategory.toUpperCase().replace('_', ' ')} Report`,
    priority: 'High',
    location: addr,
    ward: selectedArea.ward,
    zone: selectedArea.zone,
    lat: selectedArea.lat,
    lng: selectedArea.lng,
    landmark,
    description: desc,
    citizenName: name,
    citizenPhone: phone,
    photoUrl: uploadedPhotoData
  };

  let newId = `SS-KNP-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.data?.id) newId = data.data.id;
    }
  } catch (err) {
    // Save to local storage
    const all = getStoredComplaints();
    const dept = DEPARTMENTS[selectedCategory] || DEPARTMENTS.other;
    all.unshift({
      ...payload,
      id: newId,
      deptCode: dept.code,
      deptName: dept.name,
      status: 'Registered',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        { step: '1', title: 'Complaint Registered', date: 'Just Now', completed: true, active: true, remarks: `Dispatched to ${dept.name}` },
        { step: '2', title: 'Under Review', date: 'Pending', completed: false, active: false, remarks: 'Desk triage pending.' },
        { step: '3', title: 'Assigned to Field Squad', date: 'Pending', completed: false, active: false, remarks: 'Squad queue.' },
        { step: '4', title: 'Work in Progress', date: 'Pending', completed: false, active: false, remarks: 'Work pending.' },
        { step: '5', title: 'Resolved & Verified', date: 'Pending', completed: false, active: false, remarks: 'Inspection pending.' }
      ]
    });
    saveComplaintsToStorage(all);
  }

  // Display Success Step 6
  goToStep(6);
  document.getElementById('formFooter').style.display = 'none';
  document.getElementById('successComplaintId').textContent = newId;
  document.getElementById('successTrackLink').href = `track.html?id=${newId}`;

  const copyBtn = document.getElementById('copyComplaintIdBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(newId);
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      setTimeout(() => copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy Complaint ID', 2000);
    });
  }
}
