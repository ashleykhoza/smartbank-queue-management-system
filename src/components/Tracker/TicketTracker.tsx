import React, { useState, useEffect } from 'react';
import { Search, Clock, Users, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Smartphone } from 'lucide-react';
import { Ticket } from '../../types/queue';
import { ticketStore } from '../../services/ticketStore';

interface TicketTrackerProps {
  initialTicketNumber?: string;
  onViewConfirmation?: (ticket: Ticket) => void;
}

export const TicketTracker: React.FC<TicketTrackerProps> = ({
  initialTicketNumber = '',
  onViewConfirmation
}) => {
  const [searchCode, setSearchCode] = useState(initialTicketNumber);
  const [matchedTicket, setMatchedTicket] = useState<Ticket | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    setAllTickets(ticketStore.getTickets());
    const unsub = ticketStore.subscribe(() => {
      setAllTickets(ticketStore.getTickets());
      if (searchCode) {
        const found = ticketStore.getTicketByNumber(searchCode);
        if (found) setMatchedTicket({ ...found });
      }
    });

    if (initialTicketNumber) {
      const found = ticketStore.getTicketByNumber(initialTicketNumber);
      if (found) {
        setMatchedTicket(found);
        setHasSearched(true);
      }
    }

    return unsub;
  }, [initialTicketNumber, searchCode]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchCode.trim()) return;

    setHasSearched(true);
    const found = ticketStore.getTicketByNumber(searchCode.trim());
    setMatchedTicket(found || null);
  };

  const handleQuickSelect = (num: string) => {
    setSearchCode(num);
    setHasSearched(true);
    const found = ticketStore.getTicketByNumber(num);
    setMatchedTicket(found || null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Track Your Ticket Status
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Enter your ticket number (e.g. CD-102, AO-101) to view real-time queue position and estimated remaining wait.
        </p>

        <form onSubmit={handleSearch} className="mt-5 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="e.g. CD-102 or VF-201"
              className="w-full pl-11 pr-4 py-2.5 text-base font-mono uppercase rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder:normal-case placeholder:font-sans"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm active:scale-[0.98]"
          >
            Check Status
          </button>
        </form>

        {/* Quick select active tickets */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500">Currently active tickets:</span>
          {allTickets.slice(0, 6).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleQuickSelect(t.ticketNumber)}
              className="font-mono bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2 py-0.5 rounded border border-slate-200 transition-colors"
            >
              {t.ticketNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {matchedTicket ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                Live Ticket Tracking
              </div>
              <div className="text-3xl font-black font-mono text-slate-900 mt-0.5">
                {matchedTicket.ticketNumber}
              </div>
              <div className="text-sm font-semibold text-blue-700 mt-1">
                {matchedTicket.departmentName} · {matchedTicket.serviceName}
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                matchedTicket.status === 'waiting'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : matchedTicket.status === 'called'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  matchedTicket.status === 'waiting'
                    ? 'bg-blue-600'
                    : matchedTicket.status === 'called'
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`} />
                <span>
                  {matchedTicket.status === 'waiting'
                    ? 'Waiting in Queue'
                    : matchedTicket.status === 'called'
                    ? 'CALLED TO COUNTER'
                    : 'Being Served'}
                </span>
              </span>
              <div className="text-xs text-slate-500 mt-1.5">
                Location: {matchedTicket.assignedCounter}
              </div>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className={`p-3 rounded-lg border ${
              matchedTicket.status === 'waiting'
                ? 'bg-blue-50 border-blue-300 font-semibold text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <div className="font-mono text-base font-bold">1</div>
              <div className="mt-1">In Queue</div>
            </div>

            <div className={`p-3 rounded-lg border ${
              matchedTicket.status === 'called'
                ? 'bg-amber-50 border-amber-300 font-semibold text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <div className="font-mono text-base font-bold">2</div>
              <div className="mt-1">Called to Desk</div>
            </div>

            <div className={`p-3 rounded-lg border ${
              matchedTicket.status === 'in-service' || matchedTicket.status === 'completed'
                ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <div className="font-mono text-base font-bold">3</div>
              <div className="mt-1">In Consultation</div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Current Queue Position</span>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {matchedTicket.status === 'waiting' ? `#${matchedTicket.queuePosition}` : 'Ready'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {matchedTicket.status === 'waiting'
                  ? matchedTicket.queuePosition === 1
                    ? 'You are next in line!'
                    : `${matchedTicket.queuePosition - 1} ahead of you`
                  : 'Please approach counter'}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Estimated Wait</span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-700">
                {matchedTicket.status === 'waiting' ? `~${matchedTicket.estimatedWaitMinutes}m` : '0m'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Based on active teller speed
              </div>
            </div>
          </div>

          {onViewConfirmation && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onViewConfirmation(matchedTicket)}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1.5"
              >
                <span>View Full Ticket Slip</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : hasSearched ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No Ticket Found with Reference "{searchCode}"
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please check the letters and numbers printed on your ticket slip or take a new ticket from the customer kiosk.
          </p>
        </div>
      ) : null}

    </div>
  );
};
