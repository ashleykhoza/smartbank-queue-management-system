import React, { useState, useEffect } from 'react';
import { Tv, Volume2, ArrowRight, Building2, BellRing, Sparkles } from 'lucide-react';
import { ticketStore } from '../../services/ticketStore';
import { Ticket } from '../../types/queue';
import { DEPARTMENTS } from '../../data/departmentsData';
import { soundManager } from '../../utils/audioChimes';

interface BranchDisplayBoardProps {
  onSelectTicket?: (ticketNumber: string) => void;
}

export const BranchDisplayBoard: React.FC<BranchDisplayBoardProps> = ({ onSelectTicket }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setTickets(ticketStore.getTickets());
    const unsub = ticketStore.subscribe(() => {
      setTickets(ticketStore.getTickets());
    });

    const clockTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      unsub();
      clearInterval(clockTimer);
    };
  }, []);

  const currentlyServing = tickets.filter(t => t.status === 'in-service' || t.status === 'called');
  const upNextTickets = tickets.filter(t => t.status === 'waiting');

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Board Top Header: Overhead Bank Display Theme */}
      <div className="bg-[#071322] text-white rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-48 bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
                Lobby Digital Information Board
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                SmartBank Branch Display
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-white tracking-widest tabular-nums">
                {formattedTime}
              </div>
              <div className="text-xs text-slate-400">{formattedDate}</div>
            </div>

            <button
              type="button"
              onClick={() => soundManager.playCounterCallChime()}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white rounded-xl transition-colors border border-slate-700"
              title="Test lobby audio chime"
              aria-label="Test lobby audio chime"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Split: "NOW SERVING" and "WAITING QUEUE" */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          
          {/* Left 7 Cols: NOW SERVING COUNTERS */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span>NOW SERVING AT COUNTERS</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {currentlyServing.length} Active Sessions
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentlyServing.length === 0 ? (
                <div className="col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                  <p>All counters are currently awaiting next customer call.</p>
                </div>
              ) : (
                currentlyServing.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectTicket && onSelectTicket(item.ticketNumber)}
                    className="cursor-pointer bg-slate-900/90 border border-slate-800 hover:border-amber-400/50 rounded-xl p-4 transition-all hover:bg-slate-800/80 group"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2 mb-3">
                      <span className="font-semibold text-amber-300">
                        {item.assignedCounter}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 uppercase">
                        {item.status === 'called' ? 'Calling...' : 'In Service'}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div className="text-4xl font-black font-mono tracking-tight text-white group-hover:text-amber-300 transition-colors">
                        {item.ticketNumber}
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-slate-200">
                          {item.departmentName}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[130px]">
                          {item.serviceName}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right 5 Cols: UP NEXT QUEUE */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                UP NEXT IN QUEUE
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {upNextTickets.length} Waiting
              </span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 divide-y divide-slate-800/60 max-h-[360px] overflow-y-auto">
              {upNextTickets.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No customers currently waiting in line.
                </div>
              ) : (
                upNextTickets.map((waitItem) => (
                  <div
                    key={waitItem.id}
                    onClick={() => onSelectTicket && onSelectTicket(waitItem.ticketNumber)}
                    className="py-2.5 px-2 flex items-center justify-between hover:bg-slate-800/40 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-400 w-5">
                        #{waitItem.queuePosition}
                      </span>
                      <div>
                        <div className="font-mono font-bold text-base text-white">
                          {waitItem.ticketNumber}
                        </div>
                        <div className="text-xs text-slate-400">
                          {waitItem.departmentName}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-semibold text-emerald-400">
                        ~{waitItem.estimatedWaitMinutes}m wait
                      </span>
                      <div className="text-[11px] text-slate-400">
                        {waitItem.assignedCounter.split('&')[0]}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Bottom Ticker: Branch Service Hours & Announcements */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Metro Central Flagship · 250 Queen Victoria Blvd</span>
          </div>
          <div>
            <span>Please have your official photo ID ready when your number is called.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
