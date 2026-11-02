export type DepartmentId =
  | 'cash-deposits'
  | 'cash-withdrawals'
  | 'vehicle-finance'
  | 'home-loans'
  | 'account-opening'
  | 'card-services'
  | 'fraud-disputes'
  | 'general-support';

export type TicketPriority = 'standard' | 'senior' | 'accessibility' | 'premier';

export type TicketStatus = 'waiting' | 'called' | 'in-service' | 'completed' | 'cancelled';

export interface SubService {
  id: string;
  name: string;
  description: string;
  estimatedMinutes: number;
  popular?: boolean;
}

export interface DepartmentInfo {
  id: DepartmentId;
  name: string;
  codePrefix: string;
  category: 'Cash & Tellers' | 'Personal & Commercial Lending' | 'Accounts & Cards' | 'Security & Support';
  description: string;
  iconName: string;
  avgServiceMinutes: number;
  assignedCounters: string;
  subServices: SubService[];
  colorTheme: {
    accent: string;
    border: string;
    badgeBg: string;
    badgeText: string;
  };
}

export interface Ticket {
  id: string;
  ticketNumber: string; // e.g. "CD-104"
  departmentId: DepartmentId;
  departmentName: string;
  serviceId: string;
  serviceName: string;
  customerName?: string;
  phone?: string;
  requestNotes?: string;
  priority: TicketPriority;
  status: TicketStatus;
  queuePosition: number; // 1-based, dynamically calculated
  estimatedWaitMinutes: number;
  assignedCounter: string;
  branchId: string;
  branchName: string;
  createdAt: string; // ISO
  calledAt?: string;
  completedAt?: string;
}

export interface BranchInfo {
  id: string;
  name: string;
  code: string;
  address: string;
  operatingHours: string;
  status: 'Open' | 'Peak Hours' | 'Closing Soon' | 'Closed';
  activeTellers: number;
  activeConsultants: number;
  totalWaiting: number;
  totalServedToday: number;
  avgWaitTimeMinutes: number;
}
