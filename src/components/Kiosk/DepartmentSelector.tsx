import React from 'react';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Car,
  Home,
  UserPlus,
  CreditCard,
  ShieldAlert,
  HelpCircle,
  Clock,
  Users,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { DepartmentId, DepartmentInfo } from '../../types/queue';
import { ticketStore } from '../../services/ticketStore';

interface DepartmentSelectorProps {
  departments: DepartmentInfo[];
  selectedDepartmentId: DepartmentId | null;
  onSelectDepartment: (id: DepartmentId) => void;
}

const getDepartmentIcon = (iconName: string, className: string = 'w-6 h-6') => {
  switch (iconName) {
    case 'ArrowDownCircle':
      return <ArrowDownCircle className={className} />;
    case 'ArrowUpCircle':
      return <ArrowUpCircle className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'UserPlus':
      return <UserPlus className={className} />;
    case 'CreditCard':
      return <CreditCard className={className} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} />;
    case 'HelpCircle':
    default:
      return <HelpCircle className={className} />;
  }
};

export const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  departments,
  selectedDepartmentId,
  onSelectDepartment
}) => {
  return (
    <div className="space-y-6">
      {/* Kiosk welcome banner with branch context */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
              <span>Step 1 of 3</span>
              <span aria-hidden="true">·</span>
              <span>Self-Service Touchscreen Kiosk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Select Your Banking Department
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Please choose the department for your visit today. We will automatically assign you to the nearest available specialist counter.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-lg p-3 shrink-0 text-xs text-slate-600">
            <div>
              <div className="font-semibold text-slate-800">Branch Status</div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Open for Walk-ins</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <div className="font-semibold text-slate-800">Active Counters</div>
              <div className="font-mono tabular-nums text-slate-700 mt-0.5">15 Counters Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* 8 Banking Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {departments.map((dept) => {
          const stats = ticketStore.getDepartmentQueueStats(dept.id);
          const isSelected = selectedDepartmentId === dept.id;

          return (
            <button
              key={dept.id}
              type="button"
              onClick={() => onSelectDepartment(dept.id)}
              className={`group text-left p-5 rounded-xl border transition-all duration-150 flex flex-col justify-between h-full bg-white relative overflow-hidden ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-md bg-blue-50/20'
                  : 'border-slate-200 hover:border-blue-400 hover:shadow-md'
              }`}
            >
              {/* Top Row: Icon & Prefix Badge */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`p-2.5 rounded-lg transition-colors ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white'
                  }`}>
                    {getDepartmentIcon(dept.iconName, 'w-6 h-6')}
                  </div>
                  
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-slate-600 tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                      {dept.codePrefix}
                    </span>
                    <div className="text-[11px] text-slate-600 mt-1">
                      {dept.assignedCounters.split('&')[0]}
                    </div>
                  </div>
                </div>

                {/* Department Name & Description */}
                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                  {dept.name}
                </h3>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {dept.description}
                </p>

                {/* Sample sub-services indicator */}
                <div className="mt-3 text-[11px] text-slate-600 flex flex-wrap gap-1">
                  {dept.subServices.slice(0, 2).map(sub => (
                    <span key={sub.id} className="bg-slate-50 text-slate-600 border border-slate-200/80 rounded px-1.5 py-0.5">
                      {sub.name}
                    </span>
                  ))}
                  {dept.subServices.length > 2 && (
                    <span className="text-slate-600 py-0.5 px-1">
                      +{dept.subServices.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom: Queue position status & touch CTA */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-600">
                  <span className="flex items-center gap-1 font-mono tabular-nums">
                    <Users className="w-3.5 h-3.5 text-slate-600" />
                    <span>{stats.waitingCount} in queue</span>
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="flex items-center gap-1 font-mono tabular-nums">
                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                    <span>~{stats.estimatedWaitMinutes}m</span>
                  </span>
                </div>

                <div className={`p-1 rounded-full transition-transform ${
                  isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-600 group-hover:text-blue-600 group-hover:translate-x-0.5'
                }`}>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Safety & Security Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-600 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          <strong>Banking Security Assurance:</strong> This self-service terminal will never ask for your account PIN, password, or physical payment card. Your ticket is confidential.
        </span>
      </div>
    </div>
  );
};
