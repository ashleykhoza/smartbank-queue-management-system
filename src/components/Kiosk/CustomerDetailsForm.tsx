import React, { useState } from 'react';
import {
  ChevronLeft,
  Ticket as TicketIcon,
  Accessibility,
  HeartHandshake,
  User,
  Phone,
  FileText,
  AlertCircle,
  Sparkles,
  Building2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { DepartmentInfo, SubService, TicketPriority } from '../../types/queue';
import { ticketStore } from '../../services/ticketStore';

interface CustomerDetailsFormProps {
  department: DepartmentInfo;
  service: SubService;
  onBack: () => void;
  onSubmit: (formData: {
    customerName?: string;
    phone?: string;
    requestNotes?: string;
    priority: TicketPriority;
  }) => void;
  isSubmitting: boolean;
}

const QUICK_NOTES: Record<string, string[]> = {
  'cash-deposits': [
    'Depositing business cash and coins',
    'Deposit into savings account',
    'Multiple deposit envelopes'
  ],
  'cash-withdrawals': [
    'Cash withdrawal over $2,000',
    'Cheque encashment',
    'Foreign currency travel exchange'
  ],
  'vehicle-finance': [
    'New car purchase pre-approval',
    'Refinance existing auto balloon loan',
    'Commercial fleet inquiry'
  ],
  'home-loans': [
    'First-time home buyer grant inquiry',
    'Mortgage refinancing rate review',
    'Construction loan application'
  ],
  'account-opening': [
    'Open everyday personal checking account',
    'Open business enterprise account',
    'High-interest fixed term deposit'
  ],
  'card-services': [
    'Damaged card instant replacement',
    'PIN unblock and reset',
    'Increase international credit limit'
  ],
  'fraud-disputes': [
    'Dispute unauthorized debit card charge',
    'Suspicious email phishing report',
    'Account compromise safety lock'
  ],
  'general-support': [
    'Official stamped statement for visa',
    'Change residential address & contact',
    'Online banking mobile app setup'
  ]
};

export const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({
  department,
  service,
  onBack,
  onSubmit,
  isSubmitting
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [requestNotes, setRequestNotes] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('standard');

  const stats = ticketStore.getDepartmentQueueStats(department.id);
  const sampleSuggestions = QUICK_NOTES[department.id] || QUICK_NOTES['general-support'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      customerName: customerName.trim() || undefined,
      phone: phone.trim() || undefined,
      requestNotes: requestNotes.trim() || undefined,
      priority
    });
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Change Service</span>
          </button>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Step 3 of 3: Ticket Details
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900">
          Confirm Details & Generate Ticket
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Enter an optional short note about your request. All details are optional — you can also generate a ticket immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: The Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            
            {/* Optional Request Description / Notes */}
            <div>
              <label htmlFor="requestNotes" className="block text-sm font-semibold text-slate-900 mb-1.5">
                Short Description of Your Request <span className="text-xs text-slate-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <textarea
                  id="requestNotes"
                  rows={3}
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  placeholder="e.g. Need to deposit 3 customer checks and withdraw petty cash..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Suggestions:</span>
                </span>
                {sampleSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setRequestNotes(suggestion)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded text-xs transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Name & Phone (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Your Name / Initials</span>
                  <span className="text-xs text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Liam Sterling or Guest"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                />
              </div>

              <div>
                <label htmlFor="customerPhone" className="block text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>Mobile Phone for SMS Alert</span>
                  <span className="text-xs text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  id="customerPhone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 font-mono"
                />
              </div>
            </div>

            {/* Priority & Accessibility Section */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Queue Priority & Accessibility Assistance
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPriority('standard')}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    priority === 'standard'
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-semibold text-sm text-slate-900">Standard Service</div>
                  <div className="text-xs text-slate-500 mt-0.5">Regular branch queue order</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPriority('senior')}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    priority === 'senior'
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-sm text-slate-900">
                    <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Senior Citizen (65+)</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Priority teller routing</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPriority('accessibility')}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    priority === 'accessibility'
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-sm text-slate-900">
                    <Accessibility className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Accessibility / Mobility</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Step-free seated desk</div>
                </button>
              </div>
            </div>

            {/* Security Disclaimer */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Protected:</strong> Never enter debit/credit card PINs, passwords, or account numbers. SmartBank staff will verify your physical identity securely at the counter.
              </span>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={onBack}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-7 py-3 rounded-lg text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-600/20 disabled:bg-blue-300"
              >
                <TicketIcon className="w-5 h-5 shrink-0" />
                <span>{isSubmitting ? 'Issuing Ticket...' : 'Generate Ticket'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Summary & Queue Preview */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Selected Service Summary
            </h3>

            <div className="space-y-3 pb-3 border-b border-slate-100 text-sm">
              <div>
                <span className="text-xs text-slate-500">Department</span>
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span>{department.name}</span>
                  <span className="font-mono text-xs bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                    {department.codePrefix}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500">Service Task</span>
                <div className="font-semibold text-blue-700">{service.name}</div>
              </div>

              <div>
                <span className="text-xs text-slate-500">Assigned Counter Area</span>
                <div className="font-medium text-slate-800">{department.assignedCounters}</div>
              </div>
            </div>

            {/* Live Queue Estimate */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
              <div className="text-xs font-semibold text-slate-700">Live Queue Status</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Customers ahead:</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {stats.waitingCount} {stats.waitingCount === 1 ? 'person' : 'people'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Estimated wait:</span>
                <span className="font-mono font-bold text-emerald-700 tabular-nums">
                  ~{stats.estimatedWaitMinutes} minutes
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>SmartBank Metro Central Flagship · Branch #0412</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
