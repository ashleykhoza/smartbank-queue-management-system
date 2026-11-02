import React from 'react';
import { Building2, Tv, Search, UserCheck, Volume2, VolumeX, PlusCircle } from 'lucide-react';
import { soundManager } from '../utils/audioChimes';

interface HeaderProps {
  activeView: 'kiosk' | 'board' | 'tracker' | 'teller';
  onViewChange: (view: 'kiosk' | 'board' | 'tracker' | 'teller') => void;
  onNewTicketClick: () => void;
  waitingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onViewChange,
  onNewTicketClick,
  waitingCount
}) => {
  const [isMuted, setIsMuted] = React.useState(soundManager.isMuted);

  const toggleSound = () => {
    soundManager.isMuted = !soundManager.isMuted;
    setIsMuted(soundManager.isMuted);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0A192F] text-white border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-inner font-bold text-lg">
              SB
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                SmartBank Queue
              </span>
              <span className="hidden md:inline-block ml-2 text-xs text-slate-400 font-mono">
                Flagship Branch #0412
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Single-line, unboxed, quiet hover states) */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
            <button
              type="button"
              onClick={() => onViewChange('kiosk')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeView === 'kiosk'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span>Customer Kiosk</span>
            </button>

            <button
              type="button"
              onClick={() => onViewChange('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeView === 'board'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Tv className="w-4 h-4 shrink-0" />
              <span>Lobby Display</span>
            </button>

            <button
              type="button"
              onClick={() => onViewChange('tracker')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeView === 'tracker'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-4 h-4 shrink-0" />
              <span>Ticket Tracker</span>
            </button>

            <button
              type="button"
              onClick={() => onViewChange('teller')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeView === 'teller'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Teller Counter</span>
              <span className="sm:hidden">Staff</span>
              <span className="text-[11px] font-mono px-1.5 py-0.2 bg-slate-800 text-blue-300 rounded ml-1">
                {waitingCount}
              </span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Audio Mute */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleSound}
              title={isMuted ? 'Unmute queue chimes' : 'Mute queue chimes'}
              aria-label={isMuted ? 'Unmute queue chimes' : 'Mute queue chimes'}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={onNewTicketClick}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Take Ticket</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
