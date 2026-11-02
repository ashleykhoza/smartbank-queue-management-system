import { DepartmentInfo } from '../types/queue';

export const DEPARTMENTS: DepartmentInfo[] = [
  {
    id: 'cash-deposits',
    name: 'Cash Deposits',
    codePrefix: 'CD',
    category: 'Cash & Tellers',
    description: 'Cash, coin, bag deposits and multi-currency commercial lodgements.',
    iconName: 'ArrowDownCircle',
    avgServiceMinutes: 4,
    assignedCounters: 'Teller Windows 1 – 3',
    subServices: [
      { id: 'quick-cash-deposit', name: 'Quick Cash & Note Deposit', description: 'Over-the-counter paper note deposit into personal/business account', estimatedMinutes: 3, popular: true },
      { id: 'coin-bag-deposit', name: 'Bulk Coin / Sealed Night Bag', description: 'Machine verification for coin bags and merchant deposits', estimatedMinutes: 6 },
      { id: 'payroll-cashin', name: 'Corporate Commercial Lodgement', description: 'Multi-slip deposit, bulk notes and treasury processing', estimatedMinutes: 8 },
      { id: 'foreign-currency-deposit', name: 'Foreign Currency Lodgement', description: 'Exchange and credit foreign currency banknotes to account', estimatedMinutes: 5 }
    ],
    colorTheme: {
      accent: 'emerald',
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700'
    }
  },
  {
    id: 'cash-withdrawals',
    name: 'Cash Withdrawals',
    codePrefix: 'CW',
    category: 'Cash & Tellers',
    description: 'Counter cash withdrawals, certified bank cheques and foreign exchange cash-out.',
    iconName: 'ArrowUpCircle',
    avgServiceMinutes: 5,
    assignedCounters: 'Teller Windows 4 – 5',
    subServices: [
      { id: 'counter-cash-withdrawal', name: 'Standard Cash Withdrawal', description: 'Withdraw cash exceeding ATM daily limits', estimatedMinutes: 4, popular: true },
      { id: 'cheque-encashment', name: 'Cheque Encashment & Clearing', description: 'Immediate verification and cash-out of bearer/bank cheques', estimatedMinutes: 5 },
      { id: 'large-amount-notice', name: 'High-Value Cash Collection', description: 'Pre-ordered large cash denomination withdrawal', estimatedMinutes: 7 },
      { id: 'foreign-cash-exchange', name: 'Travel Currency Exchange Cash-Out', description: 'Purchase foreign currency cash for international travel', estimatedMinutes: 6 }
    ],
    colorTheme: {
      accent: 'blue',
      border: 'border-blue-200',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-700'
    }
  },
  {
    id: 'vehicle-finance',
    name: 'Vehicle Finance',
    codePrefix: 'VF',
    category: 'Personal & Commercial Lending',
    description: 'Automotive loans, novated leasing, pre-approvals and fleet solutions.',
    iconName: 'Car',
    avgServiceMinutes: 15,
    assignedCounters: 'Lending Suite Desk 6 & 7',
    subServices: [
      { id: 'auto-loan-application', name: 'New & Used Vehicle Loan', description: 'Competitive rate vehicle loan application & rate lock', estimatedMinutes: 15, popular: true },
      { id: 'lease-refinancing', name: 'Balloon Payment & Refinancing', description: 'Restructure current vehicle contract or lower monthly repayment', estimatedMinutes: 12 },
      { id: 'pre-approval-check', name: 'Showroom Pre-Approval Assessment', description: 'Instant borrowing power certificate before visiting dealer', estimatedMinutes: 10 },
      { id: 'commercial-fleet', name: 'Business Vehicle & Equipment', description: 'Tax-effective asset finance for commercial vans, trucks & fleet', estimatedMinutes: 18 }
    ],
    colorTheme: {
      accent: 'indigo',
      border: 'border-indigo-200',
      badgeBg: 'bg-indigo-50',
      badgeText: 'text-indigo-700'
    }
  },
  {
    id: 'home-loans',
    name: 'Home Loans',
    codePrefix: 'HL',
    category: 'Personal & Commercial Lending',
    description: 'Mortgage advisory, residential purchases, equity cash-out and refinancing.',
    iconName: 'Home',
    avgServiceMinutes: 20,
    assignedCounters: 'Mortgage Advisory Suite 8 & 9',
    subServices: [
      { id: 'first-home-buyer', name: 'First Home Buyer Consultation', description: 'Gov grants, deposit scheme guidance & borrowing power', estimatedMinutes: 25, popular: true },
      { id: 'mortgage-refinance', name: 'Home Loan Switch & Refinance', description: 'Lower interest rate review, cashback and debt consolidation', estimatedMinutes: 20 },
      { id: 'property-equity-release', name: 'Equity Release & Home Renovation', description: 'Access accumulated property equity for home improvements', estimatedMinutes: 15 },
      { id: 'construction-loan', name: 'Building & Construction Loan', description: 'Progress payment facility for new home construction', estimatedMinutes: 20 }
    ],
    colorTheme: {
      accent: 'teal',
      border: 'border-teal-200',
      badgeBg: 'bg-teal-50',
      badgeText: 'text-teal-700'
    }
  },
  {
    id: 'account-opening',
    name: 'Account Opening',
    codePrefix: 'AO',
    category: 'Accounts & Cards',
    description: 'New personal, student, business corporate accounts and high-yield deposits.',
    iconName: 'UserPlus',
    avgServiceMinutes: 12,
    assignedCounters: 'Relationship Desks 10 – 12',
    subServices: [
      { id: 'personal-checking-savings', name: 'Everyday Checking & High-Interest Savings', description: 'Zero-fee daily transaction account with digital mobile banking', estimatedMinutes: 10, popular: true },
      { id: 'business-commercial-account', name: 'Business & Commercial Operating Account', description: 'Merchant facility, tax invoice management & multi-signatory', estimatedMinutes: 18 },
      { id: 'fixed-term-deposit', name: 'Fixed Term Deposit & Treasury Lodgement', description: 'Lock in guaranteed high-yield interest rate for 3-36 months', estimatedMinutes: 10 },
      { id: 'student-youth-account', name: 'Student, Graduate & Youth Account', description: 'Special student fee-free banking with budgeting insights', estimatedMinutes: 8 }
    ],
    colorTheme: {
      accent: 'sky',
      border: 'border-sky-200',
      badgeBg: 'bg-sky-50',
      badgeText: 'text-sky-700'
    }
  },
  {
    id: 'card-services',
    name: 'Card Services',
    codePrefix: 'CS',
    category: 'Accounts & Cards',
    description: 'Instant debit/credit card issuance, PIN resets, limit increases and travel locks.',
    iconName: 'CreditCard',
    avgServiceMinutes: 6,
    assignedCounters: 'Express Counter 6 & Desk 13',
    subServices: [
      { id: 'instant-card-replacement', name: 'Instant On-the-Spot Card Printing', description: 'Print and activate a replacement chip & contactless card in 3 mins', estimatedMinutes: 4, popular: true },
      { id: 'pin-reset-activation', name: 'PIN Reset, Unblock & Activation', description: 'Biometric verified instant PIN change or unblock locked card', estimatedMinutes: 3 },
      { id: 'credit-limit-adjustment', name: 'Credit Limit Increase / Decrease', description: 'Real-time affordability check and limit adjustment', estimatedMinutes: 8 },
      { id: 'travel-security-card', name: 'International Travel Card & Overseas Notice', description: 'Enable multi-currency card wallet and unblock overseas ATMs', estimatedMinutes: 5 }
    ],
    colorTheme: {
      accent: 'cyan',
      border: 'border-cyan-200',
      badgeBg: 'bg-cyan-50',
      badgeText: 'text-cyan-700'
    }
  },
  {
    id: 'fraud-disputes',
    name: 'Fraud and Disputes',
    codePrefix: 'FD',
    category: 'Security & Support',
    description: 'Urgent unauthorized transaction reporting, card compromises and fraud protection.',
    iconName: 'ShieldAlert',
    avgServiceMinutes: 14,
    assignedCounters: 'Private Security Room A',
    subServices: [
      { id: 'unauthorized-charge-report', name: 'Unauthorized Transaction Dispute', description: 'Immediate freeze, chargeback request & affidavit logging', estimatedMinutes: 12, popular: true },
      { id: 'compromised-device-identity', name: 'Identity Theft & Compromised Account', description: 'Comprehensive security lock, credential reset & fraud audit', estimatedMinutes: 18 },
      { id: 'merchant-scam-recovery', name: 'Online Scam & Phishing Recovery', description: 'Emergency recall of wire transfers or scam payments', estimatedMinutes: 15 },
      { id: 'security-clearance-unblock', name: 'Security Hold Removal & Verification', description: 'In-person identity confirmation to release blocked funds', estimatedMinutes: 10 }
    ],
    colorTheme: {
      accent: 'rose',
      border: 'border-rose-200',
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-700'
    }
  },
  {
    id: 'general-support',
    name: 'General Customer Support',
    codePrefix: 'GS',
    category: 'Security & Support',
    description: 'Official bank statements, power of attorney, certificate of balance and general queries.',
    iconName: 'HelpCircle',
    avgServiceMinutes: 8,
    assignedCounters: 'Service Desks 14 & 15',
    subServices: [
      { id: 'certified-statements-letters', name: 'Official Bank Statement & Balance Certificate', description: 'Embossed official proof of balance for visa, legal, or audit', estimatedMinutes: 5, popular: true },
      { id: 'profile-address-update', name: 'Personal Profile & Contact Info Update', description: 'Update legal address, tax residency, phone & email', estimatedMinutes: 5 },
      { id: 'poa-beneficiary-update', name: 'Power of Attorney & Estate Affairs', description: 'Register legal representative or update account beneficiaries', estimatedMinutes: 15 },
      { id: 'online-app-assistance', name: 'Mobile App & Digital Banking Onboarding', description: 'Help setting up 2FA, biometric login & digital features', estimatedMinutes: 8 }
    ],
    colorTheme: {
      accent: 'slate',
      border: 'border-slate-200',
      badgeBg: 'bg-slate-50',
      badgeText: 'text-slate-700'
    }
  }
];

export const INITIAL_BRANCH_INFO: {
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
} = {
  id: 'branch-0412',
  name: 'Metro Financial Center Flagship',
  code: 'SMART-0412',
  address: '250 Queen Victoria Financial Boulevard, Suite 100',
  operatingHours: '08:30 AM – 05:00 PM (Mon – Fri) · 09:00 AM – 01:00 PM (Sat)',
  status: 'Open',
  activeTellers: 6,
  activeConsultants: 9,
  totalWaiting: 12,
  totalServedToday: 148,
  avgWaitTimeMinutes: 7
};
