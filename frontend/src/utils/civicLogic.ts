/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SudhaarSetu Civic Rules Engine
 * Pure logic for department routing, priority calculation, and duplicate detection.
 */

export interface DepartmentInfo {
  name: string;
  nameHi: string;
  code: string;
  officerRole: string;
  estimatedResolutionDays: number;
}

export const DEPARTMENT_MAPPING: Record<string, DepartmentInfo> = {
  pothole: {
    name: "Road / Public Works Department",
    nameHi: "सड़क एवं लोक निर्माण विभाग (PWD / KNN Road Cell)",
    code: "PWD-ROAD",
    officerRole: "Executive Engineer (Roads)",
    estimatedResolutionDays: 3,
  },
  road_crack: {
    name: "Road / Public Works Department",
    nameHi: "सड़क एवं लोक निर्माण विभाग (PWD / KNN Road Cell)",
    code: "PWD-ROAD",
    officerRole: "Assistant Engineer (Maintenance)",
    estimatedResolutionDays: 4,
  },
  garbage: {
    name: "Sanitation / Solid Waste Management Department",
    nameHi: "नगर स्वास्थ्य एवं स्वच्छता प्रबंधन विभाग",
    code: "SWM-SAN",
    officerRole: "City Health Officer / Zonal Sanitary Inspector",
    estimatedResolutionDays: 1,
  },
  streetlight: {
    name: "Streetlight / Electrical Department",
    nameHi: "मार्ग प्रकाश एवं विद्युत अभियांत्रिकी विभाग",
    code: "ELEC-LIGHT",
    officerRole: "Superintending Engineer (Electrical)",
    estimatedResolutionDays: 2,
  },
  water: {
    name: "Kanpur Jal Sansthan / Water Supply Department",
    nameHi: "कानपुर जल संस्थान (पेयजल एवं पाइपलाइन विंग)",
    code: "KJS-WATER",
    officerRole: "General Manager / Zonal Water Engineer",
    estimatedResolutionDays: 2,
  },
  drainage: {
    name: "Drainage / Sewerage Management Department",
    nameHi: "जल निकासी एवं सीवरेज प्रबंधन विभाग",
    code: "DRAIN-SEWER",
    officerRole: "Chief Engineer (Drainage Works)",
    estimatedResolutionDays: 3,
  },
  other: {
    name: "General Civic & Public Works Department",
    nameHi: "सामान्य नागरिक एवं लोक निर्माण अनुभाग",
    code: "GEN-CIVIC",
    officerRole: "Nodal Grievance Redressal Officer",
    estimatedResolutionDays: 5,
  },
};

export type PriorityLevel = "High" | "Medium" | "Low";

export function determineDepartment(issueKey: string): DepartmentInfo {
  const normalizedKey = (issueKey || "").toLowerCase().trim();
  return DEPARTMENT_MAPPING[normalizedKey] || DEPARTMENT_MAPPING.other;
}

export function calculatePriority(
  issueKey: string,
  description: string = "",
  userSeverity: string = "normal"
): PriorityLevel {
  const text = (description + " " + issueKey + " " + userSeverity).toLowerCase();

  // High priority triggers (danger, safety, open manhole, hospital, deep, flooding, sparking)
  const highKeywords = [
    "danger",
    "hazard",
    "accident",
    "deep",
    "open manhole",
    "spark",
    "electric",
    "shock",
    "contaminat",
    "burst",
    "hospital",
    "school",
    "severe",
    "urgent",
    "overflowing drain",
    "dead animal",
  ];

  for (const kw of highKeywords) {
    if (text.includes(kw)) {
      return "High";
    }
  }

  // Potholes and open water bursts default to at least Medium or High
  if (issueKey === "pothole" || issueKey === "drainage") {
    return "High";
  }

  if (issueKey === "garbage" || issueKey === "streetlight" || issueKey === "water") {
    return "Medium";
  }

  return "Low";
}

/**
 * Calculates distance in meters between two lat/lng coordinates (Haversine formula)
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export interface ExistingComplaintSummary {
  id: string;
  category: string;
  lat: number;
  lng: number;
  status: string;
  address: string;
}

/**
 * Checks if a complaint is likely a duplicate (same category within distance threshold meters, e.g. 350m)
 */
export function detectDuplicateComplaint(
  category: string,
  lat: number,
  lng: number,
  existingComplaints: ExistingComplaintSummary[],
  thresholdMeters: number = 400
): { isDuplicate: boolean; duplicateOf?: ExistingComplaintSummary; distanceMeters?: number } {
  for (const item of existingComplaints) {
    // Only compare active/pending complaints in same category
    if (item.category === category && item.status !== "Resolved" && item.status !== "Closed") {
      const distance = calculateDistanceMeters(lat, lng, item.lat, item.lng);
      if (distance <= thresholdMeters) {
        return {
          isDuplicate: true,
          duplicateOf: item,
          distanceMeters: distance,
        };
      }
    }
  }
  return { isDuplicate: false };
}

/**
 * Formats a clean Indian civic complaint tracking ID (e.g. SS-KNP-2026-001245)
 */
export function generateComplaintId(sequenceNumber: number): string {
  const year = new Date().getFullYear();
  const padded = String(sequenceNumber).padStart(6, "0");
  return `SS-KNP-${year}-${padded}`;
}
