import React, { useState } from 'react';
import {
  Printer,
  Share2,
  Check,
  Clock,
  Users,
  Building2,
  BellRing,
  RotateCcw,
  Sparkles,
  Smartphone,
  Receipt,
  FileCheck2,
  ShieldCheck,
  Volume2
} from 'lucide-react';
import { Ticket } from '../types/queue';
import { soundManager } from '../utils/audioChimes';
import { ticketStore } from '../services/ticketStore';

interface TicketConfirmationProps {
  ticket: Ticket;
  onTakeAnother: () => void;
  onTrackTicket: (ticketNumber: string) => void;
}

export const TicketConfirmation: React.FC<TicketConfirmationProps> = ({
  ticket: initialTicket,
  onTakeAnother,
  onTrackTicket
}) => {
  const [currentTicket, setCurrentTicket] = useState<Ticket>(initialTicket);
  const [copied, setCopied] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'thermal' | 'digital'>('thermal');

  // Keep ticket updated if store state changes
  React.useEffect(() => {
    const unsub = ticketStore.subscribe(() => {
      const updated = ticketStore.getTicketByNumber(initialTicket.ticketNumber);
      if (updated) {
        setCurrentTicket({ ...updated });
      }
    });
    return unsub;
  }, [initialTicket.ticketNumber]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentTicket.ticketNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSms = () => {
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3500);
  };

  // Simulate teller calling this ticket so the user can see live interactive queue progression!
  const handleSimulateCall = () => {
    soundManager.playCounterCallChime();
    const updated = ticketStore.callTicket(currentTicket.ticketNumber, 'Counter 2');
    if (updated) {
      setCurrentTicket({ ...updated });
    }
  };

  const formattedDate = new Date(currentTicket.createdAt).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = new Date(currentTicket.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const isCalled = currentTicket.status === 'called';
  const isInService = currentTicket.status === 'in-service';
  const isWaiting = currentTicket.status === 'waiting';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Success Banner */}
      <div className="bg-emerald-900 text-white rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
              Ticket Successfully Issued
            </div>
            <h1 className="text-xl font-bold text-white">
              Please take your ticket and proceed to the waiting lounge
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveViewMode('thermal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeViewMode === 'thermal'
                ? 'bg-white text-emerald-950 shadow'
                : 'text-emerald-200 hover:text-white bg-emerald-800/60'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Printed Slip</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveViewMode('digital')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeViewMode === 'digital'
                ? 'bg-white text-emerald-950 shadow'
                : 'text-emerald-200 hover:text-white bg-emerald-800/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Digital Pass</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Ticket Display on Left, Live Actions on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left 6-7 Cols: The Physical Thermal Slip or Digital Pass */}
        <div className="md:col-span-6 lg:col-span-7 flex justify-center">
          
          {activeViewMode === 'thermal' ? (
            /* ================= REALISTIC THERMAL SLIP ================= */
            <div
              id="thermal-slip-print"
              className="w-full max-w-sm bg-white border border-slate-300 rounded-lg p-6 shadow-xl relative text-slate-800 font-mono text-sm leading-tight transition-all"
              style={{
                backgroundImage: 'radial-gradient(#f1f5f9 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            >
              {/* Serrated Top Edge visual simulation */}
              <div className="absolute -top-1 left-0 right-0 h-1 flex justify-between overflow-hidden">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="w-3 h-2 bg-slate-100 rotate-45 transform origin-top -mt-1" />
                ))}
              </div>

              {/* Thermal Bank Header */}
              <div className="text-center pb-4 border-b-2 border-dashed border-slate-300 space-y-1">
                <div className="font-bold text-base tracking-widest text-slate-900">SMARTBANK</div>
                <div className="text-xs text-slate-600">METRO FINANCIAL CENTER #0412</div>
                <div className="text-[11px] text-slate-500">250 Queen Victoria Blvd, Suite 100</div>
                <div className="text-[11px] text-slate-500 pt-1">
                  <span>{formattedDate}</span> · <span>{formattedTime}</span>
                </div>
              </div>

              {/* TICKET NUMBER HERO */}
              <div className="py-6 text-center border-b-2 border-dashed border-slate-300">
                <div className="text-xs font-sans uppercase tracking-widest text-slate-500 font-semibold mb-1">
                  YOUR TICKET NUMBER
                </div>
                <div className="text-5xl font-black text-slate-950 font-mono tracking-tight tabular-nums py-1">
                  {currentTicket.ticketNumber}
                </div>
                {currentTicket.priority !== 'standard' && (
                  <div className="inline-block mt-1 font-sans text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded uppercase">
                    {currentTicket.priority === 'senior' ? '★ Priority Senior (65+)' : '★ Accessibility Assistance'}
                  </div>
                )}
              </div>

              {/* Assigned Service & Queue Details */}
              <div className="py-4 border-b-2 border-dashed border-slate-300 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 uppercase">DEPARTMENT:</span>
                  <span className="font-bold text-slate-900 text-right">{currentTicket.departmentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 uppercase">SERVICE:</span>
                  <span className="font-medium text-slate-800 text-right max-w-[190px]">{currentTicket.serviceName}</span>
                </div>
                {currentTicket.customerName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase">CUSTOMER:</span>
                    <span className="font-medium text-slate-800">{currentTicket.customerName}</span>
                  </div>
                )}
                {currentTicket.requestNotes && (
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 uppercase">NOTE:</span>
                    <span className="italic text-slate-600 text-right max-w-[180px] truncate">{currentTicket.requestNotes}</span>
                  </div>
                )}
              </div>

              {/* Position & Waiting Time Metric Box */}
              <div className="py-4 border-b-2 border-dashed border-slate-300 bg-slate-50 -mx-6 px-6">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="border-r border-slate-200 pr-2">
                    <div className="text-[10px] text-slate-500 uppercase">QUEUE POSITION</div>
                    <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-0.5">
                      {isWaiting ? (
                        currentTicket.queuePosition === 1 ? (
                          <span className="text-blue-600 font-sans text-lg font-bold">NEXT IN LINE</span>
                        ) : (
                          `#${currentTicket.queuePosition}`
                        )
                      ) : isCalled ? (
                        <span className="text-amber-600 font-sans text-sm font-bold">CALLED</span>
                      ) : (
                        <span className="text-emerald-600 font-sans text-sm font-bold">IN SERVICE</span>
                      )}
                    </div>
                    {isWaiting && (
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {currentTicket.queuePosition - 1} ahead of you
                      </div>
                    )}
                  </div>

                  <div className="pl-2">
                    <div className="text-[10px] text-slate-500 uppercase">EST. WAIT TIME</div>
                    <div className="text-2xl font-bold font-mono text-blue-700 tabular-nums mt-0.5">
                      {isWaiting ? `~${currentTicket.estimatedWaitMinutes}m` : '0m'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">average turnaround</div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 uppercase">ASSIGNED LOCATION</div>
                  <div className="text-xs font-bold text-slate-800">{currentTicket.assignedCounter}</div>
                </div>
              </div>

              {/* Barcode SVG Graphic */}
              <div className="py-4 text-center border-b-2 border-dashed border-slate-300 space-y-1">
                <div className="flex justify-center items-center h-10 gap-0.5 opacity-80">
                  {/* Stylized realistic barcode bars */}
                  {[3,1,2,1,4,1,2,3,1,2,1,4,2,1,3,1,2,4,1,2,3,1,1,3,2,1,4,1,2].map((w, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900 h-full"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
                <div className="text-[10px] tracking-widest text-slate-500">
                  *{currentTicket.ticketNumber}-{currentTicket.id.slice(-4)}*
                </div>
              </div>

              {/* Footer instruction */}
              <div className="pt-4 text-center text-[11px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">
                  Please watch the lobby display screen for your ticket number.
                </p>
                <p className="text-[10px] text-slate-600">
                  Thank you for banking with SmartBank.
                </p>
              </div>

              {/* Bottom serrated visual */}
              <div className="absolute -bottom-1 left-0 right-0 h-1 flex justify-between overflow-hidden">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="w-3 h-2 bg-slate-100 rotate-45 transform origin-bottom -mb-1" />
                ))}
              </div>
            </div>
          ) : (
            /* ================= DIGITAL WALLET PASS ================= */
            <div className="w-full max-w-sm bg-gradient-to-br from-[#0A2540] to-[#081B2E] text-white rounded-2xl p-6 shadow-xl border border-blue-900/60 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-blue-800/40">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                    SB
                  </div>
                  <div>
                    <div className="font-bold text-sm tracking-tight">SmartBank Digital Pass</div>
                    <div className="text-[10px] text-blue-300">Metro Central Flagship</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-blue-300 font-semibold px-2 py-0.5 bg-blue-950 rounded">
                  {currentTicket.priority.toUpperCase()}
                </span>
              </div>

              <div className="py-6 text-center">
                <div className="text-xs text-blue-300 uppercase tracking-widest font-medium">Ticket Identifier</div>
                <div className="text-4xl font-extrabold font-mono tracking-tight text-white mt-1">
                  {currentTicket.ticketNumber}
                </div>
                <div className="mt-2 text-xs font-semibold text-blue-200">
                  {currentTicket.departmentName}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-white/5 rounded-xl border border-white/10 text-xs">
                <div>
                  <div className="text-blue-300 text-[10px] uppercase">QUEUE POSITION</div>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">
                    {isWaiting ? `#${currentTicket.queuePosition}` : 'Calling'}
                  </div>
                  <div className="text-[10px] text-slate-300">
                    {currentTicket.queuePosition > 1 ? `${currentTicket.queuePosition - 1} ahead` : 'Next in line'}
                  </div>
                </div>

                <div>
                  <div className="text-blue-300 text-[10px] uppercase">EST. WAIT</div>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                    ~{currentTicket.estimatedWaitMinutes} mins
                  </div>
                  <div className="text-[10px] text-slate-300">turnaround</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-800/40 flex items-center justify-between text-xs text-blue-200">
                <span>{currentTicket.assignedCounter}</span>
                <span className="font-mono">{formattedTime}</span>
              </div>
            </div>
          )}

        </div>

        {/* Right 5-6 Cols: Key Queue Metrics & Functional Actions */}
        <div className="md:col-span-6 lg:col-span-5 space-y-4">
          
          {/* Real-time Status Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Current Status
              </span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                isWaiting
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : isCalled
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  isWaiting ? 'bg-blue-600' : isCalled ? 'bg-amber-500' : 'bg-emerald-600'
                }`} />
                <span>
                  {isWaiting
                    ? 'Waiting in Queue'
                    : isCalled
                    ? 'Now Calling to Counter'
                    : 'Currently In Consultation'}
                </span>
              </span>
            </div>

            {isCalled && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1 text-amber-800">
                  <BellRing className="w-4 h-4 text-amber-600 animate-bounce" />
                  <span>Ticket {currentTicket.ticketNumber} is Being Called!</span>
                </div>
                <p>
                  Please proceed immediately to <strong>{currentTicket.assignedCounter}</strong>. Your bank specialist is ready.
                </p>
              </div>
            )}

            {/* Key Data Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>Position</span>
                </div>
                <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  #{currentTicket.queuePosition}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {currentTicket.queuePosition === 1 ? 'Next to be served' : `${currentTicket.queuePosition - 1} customers ahead`}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Estimated Wait</span>
                </div>
                <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  ~{currentTicket.estimatedWaitMinutes}m
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Dynamic queue SLA
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Service Task:</span>
                <span className="font-semibold text-slate-900">{currentTicket.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service Desk:</span>
                <span className="font-semibold text-blue-700">{currentTicket.assignedCounter}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timestamp:</span>
                <span className="font-mono text-slate-700">{formattedTime}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Customer Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Physical Slip</span>
              </button>

              <button
                type="button"
                onClick={() => onTrackTicket(currentTicket.ticketNumber)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                <Smartphone className="w-4 h-4" />
                <span>Track Live on Mobile</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs text-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Copied!' : 'Copy Ticket #'}</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateSms}
                className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs text-slate-700 transition-colors"
              >
                <BellRing className="w-3.5 h-3.5 text-slate-500" />
                <span>{smsSent ? 'SMS Dispatched' : 'SMS Alert'}</span>
              </button>
            </div>

            {smsSent && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-xs text-blue-800 text-center animate-fade-in">
                Demo SMS: "SmartBank: Your ticket {currentTicket.ticketNumber} is active. Est wait ~{currentTicket.estimatedWaitMinutes}m."
              </div>
            )}

            {/* Interactive Simulation Helper */}
            <div className="pt-3 border-t border-slate-100">
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-700 uppercase">Interactive Branch Demo</span>
                  <span className="text-[10px] text-slate-500">Test calling simulation</span>
                </div>
                <button
                  type="button"
                  onClick={handleSimulateCall}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-semibold transition-colors shadow-sm"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Simulate Staff Calling Next Ticket</span>
                </button>
              </div>
            </div>

            {/* Take Another Ticket Return Button */}
            <button
              type="button"
              onClick={onTakeAnother}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors hover:bg-slate-50 mt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Back to Kiosk (Take Another Ticket)</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
