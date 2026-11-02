import React from 'react';
import { ChevronLeft, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DepartmentInfo, SubService } from '../../types/queue';

interface ServiceSelectorProps {
  department: DepartmentInfo;
  selectedServiceId: string | null;
  onSelectService: (service: SubService) => void;
  onBack: () => void;
  onProceed: () => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  department,
  selectedServiceId,
  onSelectService,
  onBack,
  onProceed
}) => {
  return (
    <div className="space-y-6">
      {/* Header bar with Back button */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Change Department</span>
          </button>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Step 2 of 3: Select Service
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                Prefix: {department.codePrefix}
              </span>
              <h1 className="text-2xl font-bold text-slate-900">
                {department.name} Services
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Select the specific banking task you need help with. This ensures your ticket routes directly to the right desk.
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs text-slate-600">Assigned Counter Area</div>
            <div className="text-sm font-semibold text-slate-800">{department.assignedCounters}</div>
          </div>
        </div>
      </div>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {department.subServices.map((service) => {
          const isSelected = selectedServiceId === service.id;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelectService(service)}
              className={`p-5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between bg-white relative ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/20 shadow-md'
                  : 'border-slate-200 hover:border-blue-400 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <span>{service.name}</span>
                    {service.popular && (
                      <span className="text-[10px] font-semibold tracking-wide text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                        Most Frequent
                      </span>
                    )}
                  </h3>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected ? 'text-blue-600' : 'text-slate-300'
                  }`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1 font-mono tabular-nums">
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Est. service duration: ~{service.estimatedMinutes} mins</span>
                </span>

                <span className={`text-xs font-semibold ${isSelected ? 'text-blue-700 font-bold' : 'text-slate-600'}`}>
                  {isSelected ? 'Selected' : 'Select'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Proceed Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onProceed}
          disabled={!selectedServiceId}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all shadow-sm ${
            selectedServiceId
              ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
              : 'bg-slate-300 cursor-not-allowed text-slate-500'
          }`}
        >
          <span>Continue to Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
