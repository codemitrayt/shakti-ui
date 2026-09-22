export type TripStatus = 'Created' | 'Billed' | 'Verified' | 'Closed' | 'Action required';

export interface Trip {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone?: string;
  site: string;
  dock: string;
  status: TripStatus;
  timestamp: string;
  dateFormatted?: string;
  material?: string;
  transporter?: string;
  passBadge?: 'P1' | 'P2' | null;
  weightCFT?: string;
  checkPostsCount?: {
    completed: number;
    total: number;
    warning?: boolean;
  };
  tareWeight?: string;
  grossWeight?: string;
  netWeight?: string;
  checkPostStatus?: 'Passed' | 'Pending' | 'Flagged';
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
