import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory backend ticket cache initialized with demo data
interface BackendTicket {
  id: string;
  ticketNumber: string;
  departmentId: string;
  departmentName: string;
  serviceId: string;
  serviceName: string;
  customerName?: string;
  phone?: string;
  requestNotes?: string;
  priority: 'standard' | 'senior' | 'accessibility' | 'premier';
  status: 'waiting' | 'called' | 'in-service' | 'completed' | 'cancelled';
  queuePosition: number;
  estimatedWaitMinutes: number;
  assignedCounter: string;
  branchId: string;
  branchName: string;
  createdAt: string;
  calledAt?: string;
  completedAt?: string;
}

let serverTickets: BackendTicket[] = [
  {
    id: 'srv-1',
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
    id: 'srv-2',
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
    id: 'srv-3',
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
    createdAt: new Date(Date.now() - 12 * 60000).toISOString()
  },
  {
    id: 'srv-4',
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
    createdAt: new Date(Date.now() - 22 * 60000).toISOString()
  }
];

const departmentPrefixes: Record<string, string> = {
  'cash-deposits': 'CD',
  'cash-withdrawals': 'CW',
  'vehicle-finance': 'VF',
  'home-loans': 'HL',
  'account-opening': 'AO',
  'card-services': 'CS',
  'fraud-disputes': 'FD',
  'general-support': 'GS'
};

const departmentCounters: Record<string, string> = {
  'cash-deposits': 'Teller Windows 1 – 3',
  'cash-withdrawals': 'Teller Windows 4 – 5',
  'vehicle-finance': 'Lending Suite Desk 6 & 7',
  'home-loans': 'Mortgage Advisory Suite 8 & 9',
  'account-opening': 'Relationship Desks 10 – 12',
  'card-services': 'Express Counter 6 & Desk 13',
  'fraud-disputes': 'Private Security Room A',
  'general-support': 'Service Desks 14 & 15'
};

// API: Branch Info
app.get('/api/branch', (req: Request, res: Response) => {
  const waitingCount = serverTickets.filter(t => t.status === 'waiting').length;
  res.json({
    id: 'branch-0412',
    name: 'Metro Financial Center Flagship',
    code: 'SMART-0412',
    address: '250 Queen Victoria Financial Boulevard, Suite 100',
    operatingHours: '08:30 AM – 05:00 PM (Mon – Fri) · 09:00 AM – 01:00 PM (Sat)',
    status: 'Open',
    activeTellers: 6,
    activeConsultants: 9,
    totalWaiting: waitingCount,
    totalServedToday: 148,
    avgWaitTimeMinutes: 7
  });
});

// API: Get All Tickets
app.get('/api/tickets', (req: Request, res: Response) => {
  const { departmentId, status } = req.query;
  let filtered = [...serverTickets];

  if (departmentId && typeof departmentId === 'string') {
    filtered = filtered.filter(t => t.departmentId === departmentId);
  }
  if (status && typeof status === 'string') {
    filtered = filtered.filter(t => t.status === status);
  }

  res.json({ tickets: filtered });
});

// API: Get Specific Ticket by Number
app.get('/api/tickets/:ticketNumber', (req: Request, res: Response) => {
  const ticketNumber = req.params.ticketNumber.toUpperCase();
  const ticket = serverTickets.find(t => t.ticketNumber.toUpperCase() === ticketNumber);

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  // Calculate live position among waiting tickets
  if (ticket.status === 'waiting') {
    const waitingSameDept = serverTickets
      .filter(t => t.departmentId === ticket.departmentId && t.status === 'waiting')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    const index = waitingSameDept.findIndex(t => t.ticketNumber === ticket.ticketNumber);
    ticket.queuePosition = index !== -1 ? index + 1 : 1;
    ticket.estimatedWaitMinutes = Math.max(3, ticket.queuePosition * 4);
  }

  res.json({ ticket });
});

// API: Issue New Ticket
app.post('/api/tickets', (req: Request, res: Response) => {
  const {
    departmentId,
    departmentName,
    serviceId,
    serviceName,
    customerName,
    phone,
    requestNotes,
    priority = 'standard'
  } = req.body;

  if (!departmentId || !departmentName || !serviceName) {
    return res.status(400).json({ error: 'Missing required ticket fields' });
  }

  const prefix = departmentPrefixes[departmentId] || 'TK';
  const matchingTickets = serverTickets.filter(t => t.ticketNumber.startsWith(`${prefix}-`));
  
  let maxSeq = 100;
  matchingTickets.forEach(t => {
    const num = parseInt(t.ticketNumber.split('-')[1], 10);
    if (!isNaN(num) && num > maxSeq) {
      maxSeq = num;
    }
  });

  const nextNumber = `${prefix}-${maxSeq + 1}`;
  const assignedCounter = departmentCounters[departmentId] || 'Customer Service Desk';

  // Count current waiting in this department
  const currentWaiting = serverTickets.filter(t => t.departmentId === departmentId && t.status === 'waiting').length;
  const queuePosition = currentWaiting + 1;
  const estimatedWaitMinutes = Math.max(3, queuePosition * 4);

  const newTicket: BackendTicket = {
    id: `srv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    ticketNumber: nextNumber,
    departmentId,
    departmentName,
    serviceId: serviceId || 'default-service',
    serviceName,
    customerName: customerName || undefined,
    phone: phone || undefined,
    requestNotes: requestNotes || undefined,
    priority,
    status: 'waiting',
    queuePosition,
    estimatedWaitMinutes,
    assignedCounter,
    branchId: 'branch-0412',
    branchName: 'Metro Financial Center Flagship',
    createdAt: new Date().toISOString()
  };

  serverTickets.push(newTicket);
  res.status(201).json({ ticket: newTicket });
});

// API: Call Ticket
app.patch('/api/tickets/:ticketNumber/call', (req: Request, res: Response) => {
  const ticketNumber = req.params.ticketNumber.toUpperCase();
  const { counterName } = req.body;
  const ticket = serverTickets.find(t => t.ticketNumber.toUpperCase() === ticketNumber);

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  ticket.status = 'called';
  ticket.calledAt = new Date().toISOString();
  if (counterName) {
    ticket.assignedCounter = counterName;
  }
  ticket.queuePosition = 0;
  ticket.estimatedWaitMinutes = 0;

  res.json({ ticket });
});

// API: Complete Ticket
app.patch('/api/tickets/:ticketNumber/complete', (req: Request, res: Response) => {
  const ticketNumber = req.params.ticketNumber.toUpperCase();
  const ticket = serverTickets.find(t => t.ticketNumber.toUpperCase() === ticketNumber);

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  ticket.status = 'completed';
  ticket.completedAt = new Date().toISOString();
  res.json({ ticket });
});

// API: Cancel Ticket
app.patch('/api/tickets/:ticketNumber/cancel', (req: Request, res: Response) => {
  const ticketNumber = req.params.ticketNumber.toUpperCase();
  const ticket = serverTickets.find(t => t.ticketNumber.toUpperCase() === ticketNumber);

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  ticket.status = 'cancelled';
  res.json({ ticket });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartBank Queue Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
