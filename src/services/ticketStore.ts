import { DEPARTMENTS, INITIAL_BRANCH_INFO } from '../data/departmentsData';
import { DepartmentId, Ticket, TicketPriority, TicketStatus, BranchInfo } from '../types/queue';

const STORAGE_KEY = 'smartbank_queue_tickets_v1';
const BRANCH_KEY = 'smartbank_queue_branch_v1';

// Seed demo tickets for realistic branch simulation
const INITIAL_SEED_TICKETS: Ticket[] = [
  {
    id: 'seed-1',
    ticketNumber: 'CD-101',
    departmentId: 'cash-deposits',
    departmentName: 'Cash Deposits',
    serviceId: 'quick-cash-deposit',
    serviceName: 'Quick Cash & Note Deposit',
    customerName: 'A. Sterling',
    priority: 'standard',
    status: 'in-service',
    queuePosition: 0,
    estimatedWaitMinutes: 0,
    assignedCounter: 'Teller Window 1',
    branchId: 'branch-0412',
    branchName: 'Metro Financial Center Flagship',
    createdAt: new Date(Date.now() - 14 * 60000).toISOString(),
    calledAt: new Date(Date.now() - 4 * 60000).toISOString()
  },
  {
    id: 'seed-2',
    ticketNumber: 'CD-102',
    departmentId: 'cash-deposits',
    departmentName: 'Cash Deposits',
    serviceId: 'coin-bag-deposit',
    serviceName: 'Bulk Coin / Sealed Night Bag',
    customerName: 'B. Henderson',
    priority: 'standard',
    status: 'waiting',
    queuePosition: 1,
    estimatedWaitMinutes: 4,
    assignedCounter: 'Teller Windows 1 – 3',
    branchId: 'branch-0412',
    branchName: 'Metro Financial Center Flagship',
    createdAt: new Date(Date.now() - 8 * 60000).toISOString()
  },
  {
    id: 'seed-3',
    ticketNumber: 'CD-103',
    departmentId: 'cash-deposits',
    departmentName: 'Cash Deposits',
    serviceId: 'payroll-cashin',
    serviceName: 'Corporate Commercial Lodgement',
    customerName: 'Apex Logistics LLC',
    priority: 'standard',
    status: 'waiting',
    queuePosition: 2,
    estimatedWaitMinutes: 7,
    assignedCounter: 'Teller Windows 1 – 3',
    branchId: 'branch-0412',
    branchName: 'Metro Financial Center Flagship',
    createdAt: new Date(Date.now() - 4 * 60000).toISOString()
  },
  {
    id: 'seed-4',
    ticketNumber: 'CW-101',
    departmentId: 'cash-withdrawals',
    departmentName: 'Cash Withdrawals',
    serviceId: 'counter-cash-withdrawal',
    serviceName: 'Standard Cash Withdrawal',
    customerName: 'D. Vance',
    priority: 'standard',
    status: 'in-service',
    queuePosition: 0,
    estimatedWaitMinutes: 0,
    assignedCounter: 'Teller Window 4',
    branchId: 'branch-0412',
    branchName: 'Metro Financial Center Flagship',
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    calledAt: new Date(Date.now() - 2 * 60000).toISOString()
  },
  {
    id: 'seed-5',
    ticketNumber: 'AO-101',
    departmentId: 'account-opening',
    departmentName: 'Account Opening',
    serviceId: 'personal-checking-savings',
    serviceName: 'Everyday Checking & High-Interest Savings',
    customerName: 'M. Patel',
    priority: 'standard',
    status: 'in-service',
    queuePosition: 0,
    estimatedWaitMinutes: 0,
    assignedCounter: 'Relationship Desk 10',
    branchId: 'branch-0412',
    branchName: 'Metro Financial Center Flagship',
    createdAt: new Date(Date.now() - 22 * 60000).toISOString(),
    calledAt: new Date(Date.now() - 8 * 60000).toISOString()
  },
  {
    id: 'seed-6',
    ticketNumber: 'AO-102',
    departmentId: 'account-opening',
    departmentName: 'Account Opening',
    serviceId: 'business-commercial-account',
    serviceName: 'Business & Commercial Operating Account',
    customerName: 'K. Tanaka',
    priority: 'standard',
    status: 'waiting',
    queuePosition: 1,
    estimatedWaitMinutes: 8,
    assignedCounter: 'Relationship Desks 10 – 12',
    branchId: 'branch-0412',
    branchName: 'Metro Financial Center Flagship',
    createdAt: new Date(Date.now() - 6 * 60000).toISOString()
  },
  {
    id: 'seed-7',
    ticketNumber: 'HL-201',
    departmentId: 'home-loans',
    departmentName: 'Home Loans',
    serviceId: 'first-home-buyer',
    serviceName: 'First Home Buyer Consultation',
    customerName: 'R. & S. Miller',
    priority: 'standard',
    status: 'in-service',
    queuePosition: 0,
    estimatedWaitMinutes: 0,
    assignedCounter: 'Mortgage Advisory Suite 8',
    branchId: 'branch-0412',
    branchName: 'Metro Financial Center Flagship',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    calledAt: new Date(Date.now() - 14 * 60000).toISOString()
  },
  {
    id: 'seed-8',
    ticketNumber: 'CS-301',
    departmentId: 'card-services',
    departmentName: 'Card Services',
    serviceId: 'instant-card-replacement',
    serviceName: 'Instant On-the-Spot Card Printing',
    customerName: 'G. Morales',
    priority: 'senior',
    status: 'waiting',
    queuePosition: 1,
    estimatedWaitMinutes: 4,
    assignedCounter: 'Express Counter 6 & Desk 13',
    branchId: 'branch-0412',
    branchName: 'Metro Financial Center Flagship',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: 'seed-9',
    ticketNumber: 'FD-101',
    departmentId: 'fraud-disputes',
    departmentName: 'Fraud and Disputes',
    serviceId: 'unauthorized-charge-report',
    serviceName: 'Unauthorized Transaction Dispute',
    customerName: 'E. Rossi',
    priority: 'standard',
    status: 'in-service',
    queuePosition: 0,
    estimatedWaitMinutes: 0,
    assignedCounter: 'Private Security Room A',
    branchId: 'branch-0412',
    branchName: 'Metro Financial Center Flagship',
    createdAt: new Date(Date.now() - 18 * 60000).toISOString(),
    calledAt: new Date(Date.now() - 6 * 60000).toISOString()
  }
];

class TicketStore {
  private tickets: Ticket[] = [];
  private branch: BranchInfo = INITIAL_BRANCH_INFO;
  private listeners: Array<() => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== 'undefined') {
      try {
        const storedTickets = localStorage.getItem(STORAGE_KEY);
        if (storedTickets) {
          this.tickets = JSON.parse(storedTickets);
        } else {
          this.tickets = [...INITIAL_SEED_TICKETS];
          this.saveToStorage();
        }

        const storedBranch = localStorage.getItem(BRANCH_KEY);
        if (storedBranch) {
          this.branch = JSON.parse(storedBranch);
        }
      } catch {
        this.tickets = [...INITIAL_SEED_TICKETS];
      }
    } else {
      this.tickets = [...INITIAL_SEED_TICKETS];
    }
    this.recalculatePositions();
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tickets));
        localStorage.setItem(BRANCH_KEY, JSON.stringify(this.branch));
      } catch (e) {
        console.error('Failed saving to localStorage', e);
      }
    }
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach(cb => cb());
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  // Recalculates queue position and estimated wait time for all waiting tickets
  private recalculatePositions() {
    const deptWaitingMap: Record<string, Ticket[]> = {};

    this.tickets.forEach(ticket => {
      if (ticket.status === 'waiting') {
        if (!deptWaitingMap[ticket.departmentId]) {
          deptWaitingMap[ticket.departmentId] = [];
        }
        deptWaitingMap[ticket.departmentId].push(ticket);
      }
    });

    Object.keys(deptWaitingMap).forEach(deptId => {
      const deptList = deptWaitingMap[deptId];
      // Sort waiting by priority first (senior/accessibility ahead), then createdAt timestamp
      deptList.sort((a, b) => {
        const aPriorityWeight = a.priority === 'accessibility' || a.priority === 'senior' ? 0 : 1;
        const bPriorityWeight = b.priority === 'accessibility' || b.priority === 'senior' ? 0 : 1;
        if (aPriorityWeight !== bPriorityWeight) return aPriorityWeight - bPriorityWeight;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

      const deptMeta = DEPARTMENTS.find(d => d.id === deptId);
      const avgMins = deptMeta ? deptMeta.avgServiceMinutes : 5;

      deptList.forEach((t, idx) => {
        t.queuePosition = idx + 1; // 1-based: 1 means you are next!
        // Wait estimate: if position 1, roughly 2-4 mins; otherwise (pos - 1) * avgMins
        t.estimatedWaitMinutes = Math.max(3, Math.round((idx + 1) * (avgMins * 0.75)));
      });
    });

    // Update branch total waiting
    const waitingCount = this.tickets.filter(t => t.status === 'waiting').length;
    this.branch.totalWaiting = waitingCount;
  }

  public getBranchInfo(): BranchInfo {
    return { ...this.branch };
  }

  public getTickets(): Ticket[] {
    this.recalculatePositions();
    return [...this.tickets];
  }

  public getTicketByNumber(ticketNumber: string): Ticket | undefined {
    this.recalculatePositions();
    const cleanNumber = ticketNumber.trim().toUpperCase();
    return this.tickets.find(
      t => t.ticketNumber.toUpperCase() === cleanNumber || t.id === ticketNumber
    );
  }

  public getDepartmentQueueStats(departmentId: DepartmentId): {
    waitingCount: number;
    estimatedWaitMinutes: number;
    currentlyServing?: string;
  } {
    this.recalculatePositions();
    const waiting = this.tickets.filter(t => t.departmentId === departmentId && t.status === 'waiting');
    const inService = this.tickets.find(
      t => t.departmentId === departmentId && (t.status === 'in-service' || t.status === 'called')
    );
    const deptMeta = DEPARTMENTS.find(d => d.id === departmentId);
    const avgMins = deptMeta ? deptMeta.avgServiceMinutes : 5;

    const waitMins = waiting.length === 0 ? 3 : Math.max(3, Math.round(waiting.length * (avgMins * 0.75)));

    return {
      waitingCount: waiting.length,
      estimatedWaitMinutes: waitMins,
      currentlyServing: inService ? inService.ticketNumber : undefined
    };
  }

  // Generate next unique ticket number for department, e.g. "CD-104"
  private generateNextTicketNumber(departmentId: DepartmentId): string {
    const deptMeta = DEPARTMENTS.find(d => d.id === departmentId);
    const prefix = deptMeta ? deptMeta.codePrefix : 'TK';

    // Find all ticket numbers matching this prefix
    const matching = this.tickets
      .map(t => t.ticketNumber)
      .filter(num => num.startsWith(`${prefix}-`));

    let maxNum = 100;
    matching.forEach(num => {
      const parts = num.split('-');
      if (parts[1]) {
        const parsed = parseInt(parts[1], 10);
        if (!isNaN(parsed) && parsed > maxNum) {
          maxNum = parsed;
        }
      }
    });

    const nextSeq = maxNum + 1;
    return `${prefix}-${nextSeq}`;
  }

  public issueTicket(params: {
    departmentId: DepartmentId;
    serviceId: string;
    customerName?: string;
    phone?: string;
    requestNotes?: string;
    priority?: TicketPriority;
  }): Ticket {
    const deptMeta = DEPARTMENTS.find(d => d.id === params.departmentId);
    if (!deptMeta) {
      throw new Error(`Department ${params.departmentId} not found`);
    }

    const subService = deptMeta.subServices.find(s => s.id === params.serviceId) || deptMeta.subServices[0];
    const ticketNumber = this.generateNextTicketNumber(params.departmentId);

    const newTicket: Ticket = {
      id: `ticket-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ticketNumber,
      departmentId: params.departmentId,
      departmentName: deptMeta.name,
      serviceId: subService.id,
      serviceName: subService.name,
      customerName: params.customerName?.trim() || undefined,
      phone: params.phone?.trim() || undefined,
      requestNotes: params.requestNotes?.trim() || undefined,
      priority: params.priority || 'standard',
      status: 'waiting',
      queuePosition: 1, // Will be recalculated
      estimatedWaitMinutes: 5, // Will be recalculated
      assignedCounter: deptMeta.assignedCounters,
      branchId: this.branch.id,
      branchName: this.branch.name,
      createdAt: new Date().toISOString()
    };

    this.tickets.push(newTicket);
    this.recalculatePositions();
    this.notify();
    return newTicket;
  }

  public callTicket(ticketNumber: string, counterName?: string): Ticket | undefined {
    const ticket = this.getTicketByNumber(ticketNumber);
    if (!ticket) return undefined;

    ticket.status = 'called';
    ticket.calledAt = new Date().toISOString();
    if (counterName) {
      ticket.assignedCounter = counterName;
    }
    this.recalculatePositions();
    this.notify();
    return ticket;
  }

  public setInService(ticketNumber: string): Ticket | undefined {
    const ticket = this.getTicketByNumber(ticketNumber);
    if (!ticket) return undefined;

    ticket.status = 'in-service';
    this.recalculatePositions();
    this.notify();
    return ticket;
  }

  public completeTicket(ticketNumber: string): Ticket | undefined {
    const ticket = this.getTicketByNumber(ticketNumber);
    if (!ticket) return undefined;

    ticket.status = 'completed';
    ticket.completedAt = new Date().toISOString();
    this.branch.totalServedToday += 1;
    this.recalculatePositions();
    this.notify();
    return ticket;
  }

  public cancelTicket(ticketNumber: string): Ticket | undefined {
    const ticket = this.getTicketByNumber(ticketNumber);
    if (!ticket) return undefined;

    ticket.status = 'cancelled';
    this.recalculatePositions();
    this.notify();
    return ticket;
  }

  public resetToDemo(): void {
    this.tickets = [...INITIAL_SEED_TICKETS];
    this.branch = { ...INITIAL_BRANCH_INFO };
    this.recalculatePositions();
    this.notify();
  }
}

export const ticketStore = new TicketStore();
