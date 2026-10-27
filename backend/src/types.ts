export type IssueCategory = 
  | 'pothole'
  | 'road_crack'
  | 'garbage'
  | 'streetlight'
  | 'water'
  | 'drainage'
  | 'other';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export type ComplaintStatus = 
  | 'Registered'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed';

export interface TimelineEvent {
  step: string;
  title: string;
  date: string;
  completed: boolean;
  active: boolean;
  remarks: string;
}

export interface Complaint {
  id: string;
  category: IssueCategory;
  categoryTitle: string;
  deptCode: string;
  deptName: string;
  priority: PriorityLevel;
  status: ComplaintStatus;
  location: string;
  ward: string;
  zone: string;
  lat: number;
  lng: number;
  landmark?: string;
  description: string;
  citizenName?: string;
  citizenPhone?: string;
  photoUrl?: string;
  resolutionPhotoUrl?: string;
  assignedTo?: string;
  officialRemarks?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface DepartmentInfo {
  code: string;
  name: string;
  officer: string;
  sla: string;
}
