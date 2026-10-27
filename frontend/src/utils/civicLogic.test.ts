import test from 'node:test';
import assert from 'node:assert/strict';
import {
  determineDepartment,
  calculatePriority,
  calculateDistanceMeters,
  detectDuplicateComplaint,
  generateComplaintId,
  DEPARTMENT_MAPPING,
} from './civicLogic';

test('determineDepartment correctly routes pothole to Road / PWD', () => {
  const dept = determineDepartment('pothole');
  assert.equal(dept.code, 'PWD-ROAD');
  assert.match(dept.name, /Road \/ Public Works/);
});

test('determineDepartment correctly routes garbage to Sanitation / Solid Waste', () => {
  const dept = determineDepartment('garbage');
  assert.equal(dept.code, 'SWM-SAN');
  assert.match(dept.name, /Sanitation/);
});

test('determineDepartment falls back safely for unknown categories', () => {
  const dept = determineDepartment('unknown_hazard');
  assert.equal(dept.code, 'GEN-CIVIC');
});

test('calculatePriority elevates dangerous keywords to High', () => {
  assert.equal(
    calculatePriority('garbage', 'Dangerous open manhole spilling chemicals near hospital'),
    'High'
  );
  assert.equal(
    calculatePriority('pothole', 'Pothole in front of market'),
    'High'
  );
  assert.equal(
    calculatePriority('streetlight', 'Single lamp flickering on minor street'),
    'Medium'
  );
});

test('calculateDistanceMeters computes reasonable distances in Kanpur', () => {
  // Kanpur Kalyanpur (26.4912, 80.2588) to IIT Kanpur (26.5123, 80.2329) ~3.5 km
  const dist = calculateDistanceMeters(26.4912, 80.2588, 26.5123, 80.2329);
  assert.ok(dist > 3000 && dist < 4500, `Expected ~3.5km, got ${dist}`);
});

test('detectDuplicateComplaint flags complaints of same category within 400m', () => {
  const existing = [
    {
      id: 'SS-KNP-2026-001245',
      category: 'pothole',
      lat: 26.471,
      lng: 80.312,
      status: 'In Progress',
      address: 'Kakadeo Kanpur',
    },
  ];

  // 100 meters away
  const closeCheck = detectDuplicateComplaint('pothole', 26.4715, 80.3125, existing, 400);
  assert.equal(closeCheck.isDuplicate, true);
  assert.equal(closeCheck.duplicateOf?.id, 'SS-KNP-2026-001245');

  // Different category (garbage) at same spot is not duplicate
  const diffCategory = detectDuplicateComplaint('garbage', 26.4715, 80.3125, existing, 400);
  assert.equal(diffCategory.isDuplicate, false);
});

test('generateComplaintId formats proper Kanpur standard ID', () => {
  const id = generateComplaintId(1245);
  const currentYear = new Date().getFullYear();
  assert.equal(id, `SS-KNP-${currentYear}-001245`);
});
