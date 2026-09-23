export type TripStatus = 'Created' | 'Billed' | 'Verified' | 'Closed' | 'Action required';

export interface TripHistoryEvent {
  id: string;
  title: string;
  timestamp: string;
  date: string;
  actor: string;
  actorInitials: string;
  location?: string;
  token?: string;
  type: 'verified' | 'billed' | 'pass_issued' | 'created' | 'closed';
  isLatest?: boolean;
}

export interface Trip {
  id: string;
  uuid?: string;
  vehicleNumber: string;
  vehicleModel?: string;
  driverName: string;
  driverPhone?: string;
  site: string;
  siteCode?: string;
  dock: string;
  status: TripStatus;
  timestamp: string;
  dateFormatted?: string;
  material?: string;
  transporter?: string;
  transporterPhone?: string;
  passBadge?: 'P1' | 'P2' | null;
  passToken?: string;
  weightCFT?: string;
  checksRecorded?: number;
  challanNumber?: string;
  checkPostsCount?: {
    completed: number;
    total: number;
    warning?: boolean;
    name?: string;
  };
  tareWeight?: string;
  grossWeight?: string;
  netWeight?: string;
  checkPostStatus?: 'Passed' | 'Pending' | 'Flagged';
  history?: TripHistoryEvent[];
}

export interface DeviceApproval {
  id: string;
  userName: string;
  userEmail: string;
  initials: string;
  device: string;
  platform: string;
  requestTime: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  ipAddress?: string;
  location?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Operator' | 'Transporter';
  initials: string;
  joinedAgo: string;
  status: 'Active' | 'Inactive';
}

export interface ActionIncident {
  id: string;
  vehicleNumber: string;
  vehicleModel?: string;
  driverName: string;
  driverPhone: string;
  transporter?: string;
  reason: string;
  stoppedAt: {
    name: string;
    code: string;
    location?: string;
  };
  matchingTripId?: string | null;
  matchingTripVehicle?: string;
  matchingTripTransporter?: string;
  createdAt: string;
  timeAgo: string;
  status: 'Open' | 'Resolved';
  resolution?: {
    resolvedAt: string;
    resolvedBy: string;
    actionTaken: string;
    notes?: string;
  };
}

export interface MetricItem {
  id: string;
  title: string;
  value: number;
  subtext: string;
  iconName: string;
  highlight?: boolean;
  highlightColor?: string;
  badge?: string;
}
