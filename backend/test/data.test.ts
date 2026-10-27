import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_COMPLAINTS, DEPARTMENTS, KANPUR_LOCALITIES } from '../src/data.ts';

test('Kanpur seed complaints are loaded properly', () => {
  assert.ok(INITIAL_COMPLAINTS.length >= 5, 'Should have at least 5 initial complaints');
  const sample = INITIAL_COMPLAINTS.find(c => c.id === 'SS-KNP-2026-001245');
  assert.ok(sample, 'Sample pothole complaint exists');
  assert.equal(sample.deptCode, 'PWD-ROAD');
  assert.equal(sample.priority, 'High');
});

test('Department mappings cover all key civic categories', () => {
  const categories = ['pothole', 'garbage', 'streetlight', 'water', 'drainage'];
  categories.forEach(cat => {
    assert.ok(DEPARTMENTS[cat], `Department config exists for ${cat}`);
    assert.ok(DEPARTMENTS[cat].code, `Dept code exists for ${cat}`);
  });
});

test('Kanpur localities and zones are valid', () => {
  assert.ok(KANPUR_LOCALITIES.length >= 8, 'Should cover major Kanpur wards');
  const kalyanpur = KANPUR_LOCALITIES.find(l => l.name === 'Kalyanpur');
  assert.ok(kalyanpur);
  assert.ok(kalyanpur.lat > 26 && kalyanpur.lng > 80, 'Coordinates should match Kanpur');
});
