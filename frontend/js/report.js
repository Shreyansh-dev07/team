/**
 * SudhaarSetu - Report an Issue Controller (js/report.js)
 * Multi-step form, photo analysis AI demo, Kanpur maps & geolocation,
 * automatic department routing, duplicate detection, and submission.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Current Form State
  const state = {
    currentStep: 1,
    category: "",
    categoryLabel: "",
    photoUrl: "",
    photoName: "",
    location: {
      lat: window.KANPUR_COORDS.lat,
      lng: window.KANPUR_COORDS.lng,
      address: "Civil Lines, Kanpur, Uttar Pradesh",
      area: "Civil Lines",
      ward: "Ward 12",
      landmark: "Near Green Park Stadium"
    },
    locationConfirmed: false,
    description: "",
    landmark: "",
    area: "Civil Lines",
    ward: "Ward 12",
    citizenName: "",
    citizenPhone: "",
    additionalRemarks: "",
    department: null,
    priority: "Medium",
    aiAnalysis: null,
    duplicateWarning: null
  };

  // Sample photos for demo testing
  const SAMPLE_PHOTOS = {
    pothole: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    garbage: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80",
    streetlight: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80",
    water: "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80",
    drainage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
  };

  // Elements
  const stepBlocks = document.querySelectorAll(".step-block");
  const stepPills = document.querySelectorAll(".step-pill");
  const prevBtn = document.getElementById("prevStepBtn");
  const nextBtn = document.getElementById("nextStepBtn");
  const submitBtn = document.getElementById("submitComplaintBtn");

  // Step 1: Issue Selection
  const issueCards = document.querySelectorAll(".issue-option-card");
  issueCards.forEach(card => {
    card.addEventListener("click", () => {
      issueCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      state.category = card.dataset.category;
      state.categoryLabel = card.querySelector(".opt-title").innerText;
      
      // Update department routing immediately
      updateDepartmentRouting();
      validateStep(1);
    });
  });

  // Check URL query parameters (e.g. ?category=pothole)
  const urlParams = new URLSearchParams(window.location.search);
  const preselectCat = urlParams.get("category");
  if (preselectCat) {
    const targetCard = document.querySelector(`.issue-option-card[data-category="${preselectCat}"]`);
    if (targetCard) {
      targetCard.click();
    }
  }

  // Step 2: Photo Upload & AI Demo Analysis
  const photoInput = document.getElementById("issuePhotoInput");
  const photoDropZone = document.getElementById("photoDropZone");
  const photoPreviewContainer = document.getElementById("photoPreviewContainer");
  const photoPreviewImg = document.getElementById("photoPreviewImg");
  const removePhotoBtn = document.getElementById("removePhotoBtn");
  const aiAssistantCard = document.getElementById("aiAssistantCard");
  const aiDetectedCategory = document.getElementById("aiDetectedCategory");
  const aiConfidenceText = document.getElementById("aiConfidenceText");
  const aiConfidenceBar = document.getElementById("aiConfidenceBar");
  const confirmAiBtn = document.getElementById("confirmAiBtn");

  if (photoDropZone && photoInput) {
    photoDropZone.addEventListener("click", () => photoInput.click());
    photoDropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      photoDropZone.classList.add("dragover");
    });
    photoDropZone.addEventListener("dragleave", () => photoDropZone.classList.remove("dragover"));
    photoDropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      photoDropZone.classList.remove("dragover");
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handlePhotoFile(e.dataTransfer.files[0]);
      }
    });

    photoInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        handlePhotoFile(e.target.files[0]);
      }
    });
  }

  // Sample photo quick buttons
  document.querySelectorAll(".sample-photo-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const type = btn.dataset.sample;
      if (SAMPLE_PHOTOS[type]) {
        applyPhotoUrl(SAMPLE_PHOTOS[type], `Kanpur_Sample_${type}.jpg`, type);
      }
    });
  });

  function handlePhotoFile(file) {
    if (!file.type.match("image.*")) {
      window.showToast("Please upload a valid image file (JPG, JPEG, PNG)", "warning");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      applyPhotoUrl(e.target.result, file.name);
    };
    reader.readAsDataURL(file);
  }

  function applyPhotoUrl(url, filename, forceType = null) {
    state.photoUrl = url;
    state.photoName = filename || "Uploaded_Photo.jpg";

    if (photoPreviewImg && photoPreviewContainer) {
      photoPreviewImg.src = url;
      photoPreviewContainer.style.display = "block";
      if (photoDropZone) photoDropZone.style.display = "none";
    }

    window.showToast("Photo uploaded successfully", "success");

    // Run simulated AI Vision Analysis
    triggerAiVisionAnalysis(forceType);
  }

  if (removePhotoBtn) {
    removePhotoBtn.addEventListener("click", () => {
      state.photoUrl = "";
      state.photoName = "";
      if (photoInput) photoInput.value = "";
      if (photoPreviewContainer) photoPreviewContainer.style.display = "none";
      if (photoDropZone) photoDropZone.style.display = "block";
      if (aiAssistantCard) aiAssistantCard.style.display = "none";
      window.showToast("Photo removed", "info");
    });
  }

  function triggerAiVisionAnalysis(forceType) {
    if (!aiAssistantCard) return;

    aiAssistantCard.style.display = "block";
    aiDetectedCategory.textContent = "Analyzing image features...";
    aiConfidenceText.textContent = "...";
    if (aiConfidenceBar) aiConfidenceBar.style.width = "30%";

    // Realistic delay for simulated neural network inference
    setTimeout(() => {
      let suggestedKey = forceType || state.category || "pothole";
      let confidence = Math.floor(Math.random() * 8) + 89; // 89% to 96%
      let label = "Pothole / Road Damage";
      let priority = "High";

      if (suggestedKey === "garbage") {
        label = "Solid Waste / Garbage Accumulation";
        priority = "Medium";
      } else if (suggestedKey === "streetlight") {
        label = "Non-functional Streetlight / Dark Street";
        priority = "Medium";
      } else if (suggestedKey === "water") {
        label = "Potable Water Pipeline Leakage";
        priority = "High";
      } else if (suggestedKey === "drainage") {
        label = "Blocked Stormwater Drain / Sewer Overflow";
        priority = "High";
      }

      state.aiAnalysis = {
        categoryKey: suggestedKey,
        label: label,
        confidence: confidence,
        suggestedPriority: priority
      };

      aiDetectedCategory.textContent = label;
      aiConfidenceText.textContent = `${confidence}%`;
      if (aiConfidenceBar) aiConfidenceBar.style.width = `${confidence}%`;

      // If user hasn't selected a category yet, pre-select AI's recommendation
      if (!state.category) {
        const card = document.querySelector(`.issue-option-card[data-category="${suggestedKey}"]`);
        if (card) card.click();
      }
    }, 700);
  }

  if (confirmAiBtn) {
    confirmAiBtn.addEventListener("click", () => {
      if (state.aiAnalysis && state.aiAnalysis.categoryKey) {
        const card = document.querySelector(`.issue-option-card[data-category="${state.aiAnalysis.categoryKey}"]`);
        if (card) {
          card.click();
          window.showToast(`Category confirmed as: ${state.aiAnalysis.label}`, "success");
        }
      }
    });
  }

  // Step 3: Location Selection & Kanpur Map
  let mapInstance = null;
  let markerInstance = null;

  function initKanpurLocationMap() {
    const mapContainer = document.getElementById("locationMapCanvas");
    if (!mapContainer || mapInstance) return;

    // Check if Leaflet is loaded (robust fallback or default)
    if (typeof L !== "undefined") {
      try {
        mapInstance = L.map(mapContainer).setView([state.location.lat, state.location.lng], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors | Kanpur Civic Map'
        }).addTo(mapInstance);

        // Custom pin marker
        const civicIcon = L.divIcon({
          className: "custom-map-pin",
          html: `<div style="background-color: #0f3e6d; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 2px solid #ff9933; font-size: 16px;"><i class="fa-solid fa-location-dot"></i></div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 34]
        });

        markerInstance = L.marker([state.location.lat, state.location.lng], {
          draggable: true,
          icon: civicIcon
        }).addTo(mapInstance);

        markerInstance.on("dragend", (e) => {
          const pos = e.target.getLatLng();
          updateSelectedCoords(pos.lat, pos.lng);
        });

        mapInstance.on("click", (e) => {
          markerInstance.setLatLng(e.latlng);
          updateSelectedCoords(e.latlng.lat, e.latlng.lng);
        });

        // Trigger map invalidate size when tab renders
        setTimeout(() => { mapInstance.invalidateSize(); }, 200);
      } catch (err) {
        console.warn("Leaflet map init warning:", err);
      }
    } else {
      // Graceful fallback display
      mapContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #e2e8f0; color: #475569; padding: 20px; text-align: center;">
          <i class="fa-solid fa-map-location-dot" style="font-size: 3rem; color: #0f3e6d; margin-bottom: 10px;"></i>
          <strong>Interactive Kanpur Map</strong>
          <p style="font-size: 0.85rem; max-width: 380px;">Map preview active. Use buttons above to capture GPS location or select Kanpur locality.</p>
        </div>
      `;
    }
  }

  function updateSelectedCoords(lat, lng) {
    state.location.lat = parseFloat(lat.toFixed(5));
    state.location.lng = parseFloat(lng.toFixed(5));

    // Reverse geocode against Kanpur localities
    const nearest = findNearestKanpurLocality(state.location.lat, state.location.lng);
    state.location.area = nearest.name;
    state.location.ward = nearest.ward;
    state.location.landmark = nearest.landmark;
    state.location.address = `${nearest.landmark}, ${nearest.name}, Kanpur, Uttar Pradesh`;
    state.locationConfirmed = true;

    // Update UI fields
    const addrField = document.getElementById("manualAddressInput");
    const landmarkField = document.getElementById("landmarkInput");
    const wardSelect = document.getElementById("wardSelect");
    const areaSelect = document.getElementById("areaSelect");

    if (addrField) addrField.value = state.location.address;
    if (landmarkField && !landmarkField.value) landmarkField.value = nearest.landmark;
    if (wardSelect) wardSelect.value = nearest.ward;
    if (areaSelect) areaSelect.value = nearest.name;

    const statusBadge = document.getElementById("locationStatusBadge");
    if (statusBadge) {
      statusBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Location Selected Successfully: <strong>${nearest.name} (${nearest.ward})</strong>`;
      statusBadge.classList.add("active");
    }

    // Check for nearby duplicate reports
    checkForDuplicates();
  }

  function findNearestKanpurLocality(lat, lng) {
    let best = window.KANPUR_LOCALITIES[0];
    let minD = 9999999;
    window.KANPUR_LOCALITIES.forEach(loc => {
      const d = Math.hypot(loc.lat - lat, loc.lng - lng);
      if (d < minD) {
        minD = d;
        best = loc;
      }
    });
    return best;
  }

  // Geolocation button
  const useGpsBtn = document.getElementById("useCurrentLocationBtn");
  if (useGpsBtn) {
    useGpsBtn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        window.showToast("Geolocation is not supported by your browser", "warning");
        return;
      }
      useGpsBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Detecting GPS...';
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          useGpsBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> Use My Current Location';
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          if (mapInstance && markerInstance) {
            mapInstance.setView([lat, lng], 15);
            markerInstance.setLatLng([lat, lng]);
          }
          updateSelectedCoords(lat, lng);
          window.showToast("Current location detected successfully", "success");
        },
        (err) => {
          useGpsBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> Use My Current Location';
          console.warn("Geolocation fallback:", err.message);
          // Center on Swaroop Nagar / Motijheel as simulated location
          const fallback = window.KANPUR_LOCALITIES[1];
          if (mapInstance && markerInstance) {
            mapInstance.setView([fallback.lat, fallback.lng], 14);
            markerInstance.setLatLng([fallback.lat, fallback.lng]);
          }
          updateSelectedCoords(fallback.lat, fallback.lng);
          window.showToast("Location set to Kanpur central zone (Swaroop Nagar)", "info");
        },
        { timeout: 7000 }
      );
    });
  }

  // Locality quick select dropdown change
  const areaSelect = document.getElementById("areaSelect");
  if (areaSelect) {
    // Populate Kanpur localities
    areaSelect.innerHTML = `<option value="">-- Select Kanpur Locality --</option>` +
      window.KANPUR_LOCALITIES.map(l => `<option value="${l.name}">${l.name} (${l.ward})</option>`).join("");

    areaSelect.addEventListener("change", (e) => {
      const selected = window.KANPUR_LOCALITIES.find(l => l.name === e.target.value);
      if (selected) {
        if (mapInstance && markerInstance) {
          mapInstance.setView([selected.lat, selected.lng], 15);
          markerInstance.setLatLng([selected.lat, selected.lng]);
        }
        updateSelectedCoords(selected.lat, selected.lng);
      }
    });
  }

  // Duplicate Check logic
  function checkForDuplicates() {
    const duplicateAlert = document.getElementById("duplicateIssueAlert");
    if (!duplicateAlert) return;

    if (!state.category) {
      duplicateAlert.classList.remove("show");
      return;
    }

    const complaints = window.getComplaints();
    const active = complaints.filter(c => c.status !== "Resolved" && c.status !== "Closed" && c.category === state.category);
    
    let matched = null;
    let shortestDist = 999999;

    active.forEach(item => {
      const d = getDistanceMeters(state.location.lat, state.location.lng, item.location.lat, item.location.lng);
      if (d <= 500 && d < shortestDist) {
        shortestDist = d;
        matched = item;
      }
    });

    if (matched) {
      state.duplicateWarning = { matched, distance: shortestDist };
      duplicateAlert.innerHTML = `
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.5rem; color: #d97706;"></i>
        <div>
          <strong style="color: #92400e; display: block;">Possible Duplicate Issue Detected Nearby</strong>
          <p style="font-size: 0.85rem; color: #78350f; margin: 4px 0;">
            A similar <strong>${matched.categoryLabel}</strong> complaint was already registered ~${shortestDist}m away in ${matched.location.area}
            (<a href="track.html?id=${matched.id}" target="_blank" style="color: #0f3e6d; font-weight: 700; text-decoration: underline;">#${matched.id}</a>).
          </p>
          <span style="font-size: 0.775rem; color: #92400e;">You may still proceed with your submission if this is a separate occurrence.</span>
        </div>
      `;
      duplicateAlert.classList.add("show");
    } else {
      state.duplicateWarning = null;
      duplicateAlert.classList.remove("show");
    }
  }

  function getDistanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
  }

  // Step 4: Description & Details Handlers
  const descInput = document.getElementById("issueDescriptionInput");
  const landmarkInput = document.getElementById("landmarkInput");
  const citizenNameInput = document.getElementById("citizenNameInput");
  const citizenPhoneInput = document.getElementById("citizenPhoneInput");

  if (descInput) {
    descInput.addEventListener("input", (e) => {
      state.description = e.target.value;
      updatePriorityCalculation();
    });
  }

  // Update Department Routing & Priority
  function updateDepartmentRouting() {
    const deptInfo = window.DEPARTMENT_MAPPING[state.category] || window.DEPARTMENT_MAPPING.other;
    state.department = deptInfo;

    const deptNameElem = document.getElementById("routedDeptName");
    const deptOfficerElem = document.getElementById("routedDeptOfficer");
    const deptEstElem = document.getElementById("routedDeptEst");

    if (deptNameElem) deptNameElem.textContent = deptInfo.name;
    if (deptOfficerElem) deptOfficerElem.textContent = `Nodal Officer: ${deptInfo.officer}`;
    if (deptEstElem) deptEstElem.textContent = `Estimated Resolution: Within ${deptInfo.estDays} business days`;

    updatePriorityCalculation();
  }

  function updatePriorityCalculation() {
    let priority = "Medium";
    const text = (state.description + " " + state.category).toLowerCase();

    // Check danger keywords
    if (
      text.includes("danger") ||
      text.includes("accident") ||
      text.includes("deep") ||
      text.includes("open manhole") ||
      text.includes("spark") ||
      text.includes("burst") ||
      text.includes("hospital") ||
      text.includes("urgent") ||
      state.category === "pothole" ||
      state.category === "drainage"
    ) {
      priority = "High";
    } else if (state.category === "other" && text.length < 30) {
      priority = "Low";
    }

    state.priority = priority;

    const priBadge = document.getElementById("suggestedPriorityBadge");
    const priReason = document.getElementById("priorityReasonText");

    if (priBadge) {
      priBadge.className = `priority-badge priority-${priority.toLowerCase()}`;
      priBadge.innerHTML = `<i class="fa-solid fa-shield"></i> Suggested Priority: ${priority.toUpperCase()}`;
    }
    if (priReason) {
      if (priority === "High") {
        priReason.textContent = "Classified as HIGH due to potential public safety risk, road accident hazard, or critical utility disruption.";
      } else if (priority === "Medium") {
        priReason.textContent = "Classified as MEDIUM standard civic grievance requiring scheduled departmental dispatch.";
      } else {
        priReason.textContent = "Classified as LOW routine public works or minor cosmetic maintenance.";
      }
    }
  }

  // Populate Review Table in Step 5
  function populateReviewScreen() {
    const revCategory = document.getElementById("revCategory");
    const revDept = document.getElementById("revDept");
    const revLocation = document.getElementById("revLocation");
    const revPriority = document.getElementById("revPriority");
    const revDesc = document.getElementById("revDesc");
    const revPhoto = document.getElementById("revPhoto");
    const revCitizen = document.getElementById("revCitizen");

    if (revCategory) revCategory.textContent = state.categoryLabel || state.category || "General Issue";
    if (revDept) revDept.textContent = state.department ? state.department.name : "Public Works Department";
    if (revLocation) revLocation.textContent = `${state.location.address} (${state.location.ward})`;
    if (revPriority) revPriority.innerHTML = window.getPriorityBadgeHtml(state.priority);
    if (revDesc) revDesc.textContent = state.description || "No specific remarks provided.";
    if (revCitizen) {
      const name = citizenNameInput ? citizenNameInput.value.trim() : "";
      const phone = citizenPhoneInput ? citizenPhoneInput.value.trim() : "";
      revCitizen.textContent = name ? `${name} (${phone || "Phone not provided"})` : "Anonymous Citizen";
    }

    if (revPhoto) {
      if (state.photoUrl) {
        revPhoto.innerHTML = `<img src="${state.photoUrl}" style="max-height: 120px; border-radius: 6px; border: 1px solid #cbd5e1;" alt="Uploaded issue photo">`;
      } else {
        revPhoto.innerHTML = `<span style="color: #94a3b8; font-size: 0.85rem;"><i class="fa-solid fa-image-slash"></i> No photo attached</span>`;
      }
    }
  }

  // Multi-step navigation validation
  function validateStep(step) {
    if (step === 1) {
      if (!state.category) {
        window.showToast("Please select a problem category to proceed", "warning");
        return false;
      }
      return true;
    }
    if (step === 2) {
      // Photo is optional but recommended
      return true;
    }
    if (step === 3) {
      // Ensure location is assigned
      if (!state.locationConfirmed && !state.location.area) {
        updateSelectedCoords(window.KANPUR_COORDS.lat, window.KANPUR_COORDS.lng);
      }
      return true;
    }
    if (step === 4) {
      if (!state.description || state.description.trim().length < 10) {
        window.showToast("Please provide a brief description (at least 10 characters) of the problem", "warning");
        return false;
      }
      return true;
    }
    return true;
  }

  function goToStep(step) {
    state.currentStep = step;

    // Toggle blocks
    stepBlocks.forEach(b => {
      b.classList.toggle("active", parseInt(b.dataset.step, 10) === step);
    });

    // Update pill states
    stepPills.forEach(p => {
      const pStep = parseInt(p.dataset.step, 10);
      p.classList.remove("active", "completed");
      if (pStep === step) p.classList.add("active");
      else if (pStep < step) p.classList.add("completed");
    });

    // Button states
    if (prevBtn) prevBtn.style.display = (step === 1 || step === 6) ? "none" : "inline-flex";
    if (nextBtn) nextBtn.style.display = (step >= 5) ? "none" : "inline-flex";
    if (submitBtn) submitBtn.style.display = (step === 5) ? "inline-flex" : "none";

    // Step-specific initializations
    if (step === 3) {
      setTimeout(() => initKanpurLocationMap(), 150);
    }
    if (step === 5) {
      populateReviewScreen();
    }

    window.scrollTo({ top: 120, behavior: "smooth" });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (validateStep(state.currentStep)) {
        goToStep(state.currentStep + 1);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (state.currentStep > 1) {
        goToStep(state.currentStep - 1);
      }
    });
  }

  // Edit button in review screen
  const editComplaintBtn = document.getElementById("editComplaintBtn");
  if (editComplaintBtn) {
    editComplaintBtn.addEventListener("click", () => {
      goToStep(1);
    });
  }

  // Final Submission
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting to Department...';

      setTimeout(() => {
        const complaintId = window.generateNextComplaintId();
        const now = new Date();
        const formattedDate = now.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric"
        }) + ", " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

        const newComplaint = {
          id: complaintId,
          category: state.category,
          categoryLabel: state.categoryLabel || state.category,
          department: state.department ? state.department.name : "Road / Public Works Department",
          deptCode: state.department ? state.department.code : "PWD-ROAD",
          priority: state.priority || "Medium",
          status: "Registered",
          reportedDate: now.toISOString(),
          updatedDate: now.toISOString(),
          location: {
            address: state.location.address || "Kanpur, UP",
            area: state.location.area || "Civil Lines",
            ward: state.location.ward || "Ward 12",
            landmark: (landmarkInput ? landmarkInput.value.trim() : "") || state.location.landmark,
            lat: state.location.lat,
            lng: state.location.lng
          },
          description: state.description,
          photoUrl: state.photoUrl || SAMPLE_PHOTOS[state.category] || null,
          citizenName: (citizenNameInput ? citizenNameInput.value.trim() : "") || "Citizen",
          citizenPhone: (citizenPhoneInput ? citizenPhoneInput.value.trim() : "") || "",
          timeline: [
            {
              status: "Registered",
              title: "Complaint Registered",
              date: formattedDate,
              remarks: "Logged on SudhaarSetu civic portal by citizen"
            },
            {
              status: "Under Review",
              title: `Forwarded to ${state.department ? state.department.name : "Concerned Department"}`,
              date: "Forwarded automatically",
              remarks: `Assigned to ${state.department ? state.department.officer : "Nodal Officer"}`
            }
          ],
          remarks: "Complaint forwarded to departmental nodal cell for inspection.",
          resolutionEvidence: null
        };

        // Save to storage
        window.saveComplaint(newComplaint);

        // Display Success Screen (Step 6)
        const successIdElem = document.getElementById("successComplaintId");
        if (successIdElem) successIdElem.textContent = complaintId;

        const trackNowLink = document.getElementById("successTrackLink");
        if (trackNowLink) trackNowLink.href = `track.html?id=${complaintId}`;

        goToStep(6);
        window.showToast(`Complaint ${complaintId} has been successfully registered!`, "success");
      }, 800);
    });
  }

  // Copy Complaint ID button
  const copyIdBtn = document.getElementById("copyComplaintIdBtn");
  if (copyIdBtn) {
    copyIdBtn.addEventListener("click", () => {
      const id = document.getElementById("successComplaintId").textContent;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(id).then(() => {
          window.showToast("Complaint ID copied to clipboard", "success");
        });
      } else {
        window.showToast(`Complaint ID: ${id}`, "info");
      }
    });
  }
});
