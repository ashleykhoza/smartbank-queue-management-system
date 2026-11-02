import React, { useState, useEffect } from 'react';
import { UserCheck, Volume2, CheckCircle, RotateCcw, AlertCircle, ArrowRight } from 'lucide-react';
import { ticketStore } from '../../services/ticketStore';
import { Ticket, DepartmentId } from '../../types/queue';
import { DEPARTMENTS } from '../../data/departmentsData';
import { soundManager } from '../../utils/audioChimes';

export const TellerStationModal: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedDept, setSelectedDept] = useState<DepartmentId>('cash-deposits');
  const [counterName, setCounterName] = useState('Teller Window 1');

  useEffect(() => {
    setTickets(ticketStore.getTickets());
    const unsub = ticketStore.subscribe(() => {
      setTickets(ticketStore.getTickets());
    });
    return unsub;
  }, []);

  const waitingForDept = tickets.filter(
    t => t.departmentId === selectedDept && t.status === 'waiting'
  );

  const activeInDept = tickets.filter(
    t => t.departmentId === selectedDept && (t.status === 'called' || t.status === 'in-service')
  );

  const handleCallNext = () => {
    if (waitingForDept.length === 0) return;
    const nextTicket = waitingForDept[0];
    soundManager.playCounterCallChime();
    ticketStore.callTicket(nextTicket.ticketNumber, counterName);
  };

  const handleSetInService = (ticketNumber: string) => {
    ticketStore.setInService(ticketNumber);
  };

  const handleComplete = (ticketNumber: string) => {
    ticketStore.completeTicket(ticketNumber);
  };

  const handleReset = () => {
    ticketStore.resetToDemo();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Staff Counter Simulator</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Teller & Relationship Officer Station
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Simulate branch tellers calling waiting tickets to witness live queue position countdown and audio chimes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Counter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Department selection & Calling button */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Select Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => {
                  const val = e.target.value as DepartmentId;
                  setSelectedDept(val);
                  const dept = DEPARTMENTS.find(d => d.id === val);
                  if (dept) setCounterName(dept.assignedCounters.split('&')[0].trim());
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.codePrefix})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Teller Counter / Desk Label
              </label>
              <input
                type="text"
                value={counterName}
                onChange={(e) => setCounterName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-1">
              <div className="text-xs text-slate-500">Waiting in this Department</div>
              <div className="text-3xl font-black font-mono text-slate-900 tabular-nums">
                {waitingForDept.length}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCallNext}
              disabled={waitingForDept.length === 0}
              className={`w-full py-3.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                waitingForDept.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Call Next Customer ({waitingForDept[0]?.ticketNumber || 'None'})</span>
            </button>
          </div>
        </div>

        {/* Right 7 Cols: Active at Desk and Waiting Queue */}
        <div className="md:col-span-7 space-y-4">
          
          {/* Currently Being Served at this Desk */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Currently Called or In-Service
            </h3>

            {activeInDept.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                No customer is currently called or in consultation. Click "Call Next Customer".
              </p>
            ) : (
              <div className="space-y-2">
                {activeInDept.map(t => (
                  <div key={t.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xl font-bold text-slate-900">{t.ticketNumber}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          t.status === 'called' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {t.serviceName} · {t.customerName || 'Guest'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {t.status === 'called' && (
                        <button
                          type="button"
                          onClick={() => handleSetInService(t.ticketNumber)}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
                        >
                          Start Service
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleComplete(t.ticketNumber)}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Waiting list in this department */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Waiting Queue Order ({waitingForDept.length})
            </h3>

            {waitingForDept.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                Queue is clear. Take a ticket from the Kiosk to add customers.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                {waitingForDept.map((t) => (
                  <div key={t.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-slate-400 w-5">#{t.queuePosition}</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">{t.ticketNumber}</span>
                      <span className="text-slate-600">{t.serviceName}</span>
                    </div>
                    <span className="font-mono text-slate-500 tabular-nums">~{t.estimatedWaitMinutes}m</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
