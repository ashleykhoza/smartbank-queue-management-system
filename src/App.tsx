/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DepartmentSelector } from './components/Kiosk/DepartmentSelector';
import { ServiceSelector } from './components/Kiosk/ServiceSelector';
import { CustomerDetailsForm } from './components/Kiosk/CustomerDetailsForm';
import { TicketConfirmation } from './components/TicketConfirmation';
import { BranchDisplayBoard } from './components/DisplayBoard/BranchDisplayBoard';
import { TicketTracker } from './components/Tracker/TicketTracker';
import { TellerStationModal } from './components/TellerSimulator/TellerStationModal';
import { DEPARTMENTS, INITIAL_BRANCH_INFO } from './data/departmentsData';
import { DepartmentId, DepartmentInfo, SubService, Ticket, TicketPriority, BranchInfo } from './types/queue';
import { ticketStore } from './services/ticketStore';
import { soundManager } from './utils/audioChimes';
import { Building2, Clock, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'kiosk' | 'board' | 'tracker' | 'teller'>('kiosk');
  const [kioskStep, setKioskStep] = useState<'department' | 'service' | 'details' | 'confirmation'>('department');

  // Kiosk flow state
  const [selectedDeptId, setSelectedDeptId] = useState<DepartmentId | null>(null);
  const [selectedService, setSelectedService] = useState<SubService | null>(null);
  const [issuedTicket, setIssuedTicket] = useState<Ticket | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackerCode, setTrackerCode] = useState<string>('');

  // Live branch counts
  const [branchInfo, setBranchInfo] = useState<BranchInfo>(INITIAL_BRANCH_INFO);
  const [totalWaiting, setTotalWaiting] = useState(0);

  useEffect(() => {
    const updateStats = () => {
      const tickets = ticketStore.getTickets();
      const waiting = tickets.filter(t => t.status === 'waiting').length;
      setTotalWaiting(waiting);
      setBranchInfo(ticketStore.getBranchInfo());
    };

    updateStats();
    const unsub = ticketStore.subscribe(updateStats);
    return unsub;
  }, []);

  // Department selected in kiosk
  const handleSelectDepartment = (deptId: DepartmentId) => {
    setSelectedDeptId(deptId);
    const dept = DEPARTMENTS.find(d => d.id === deptId);
    if (dept && dept.subServices.length > 0) {
      setSelectedService(dept.subServices[0]);
    }
    setKioskStep('service');
  };

  // Service selected in kiosk
  const handleSelectService = (service: SubService) => {
    setSelectedService(service);
  };

  // Submit ticket creation
  const handleGenerateTicket = async (formData: {
    customerName?: string;
    phone?: string;
    requestNotes?: string;
    priority: TicketPriority;
  }) => {
    if (!selectedDeptId || !selectedService) return;

    setIsSubmitting(true);
    try {
      // 1. Play realistic bank kiosk chime
      soundManager.playTicketIssuedChime();

      // 2. Issue ticket via store (persisted in localStorage + state)
      const newTicket = ticketStore.issueTicket({
        departmentId: selectedDeptId,
        serviceId: selectedService.id,
        customerName: formData.customerName,
        phone: formData.phone,
        requestNotes: formData.requestNotes,
        priority: formData.priority
      });

      // 3. Post to backend Express API if running
      try {
        await fetch('/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            departmentId: newTicket.departmentId,
            departmentName: newTicket.departmentName,
            serviceId: newTicket.serviceId,
            serviceName: newTicket.serviceName,
            customerName: newTicket.customerName,
            phone: newTicket.phone,
            requestNotes: newTicket.requestNotes,
            priority: newTicket.priority
          })
        });
      } catch {
        // Backend fallback is graceful
      }

      setIssuedTicket(newTicket);
      setKioskStep('confirmation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetKiosk = () => {
    setSelectedDeptId(null);
    setSelectedService(null);
    setIssuedTicket(null);
    setKioskStep('department');
    setActiveView('kiosk');
  };

  const handleTrackTicket = (ticketNumber: string) => {
    setTrackerCode(ticketNumber);
    setActiveView('tracker');
  };

  const currentSelectedDept = DEPARTMENTS.find(d => d.id === selectedDeptId);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      
      {/* Universal Top Navigation conforming to Top Bar Contract */}
      <Header
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          if (view === 'kiosk' && !issuedTicket) {
            setKioskStep('department');
          }
        }}
        onNewTicketClick={handleResetKiosk}
        waitingCount={totalWaiting}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Branch Context Strip (Visible on Kiosk and Board) */}
        {activeView === 'kiosk' && kioskStep === 'department' && (
          <div className="mb-6 relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 text-white min-h-[170px] flex items-center">
            {/* Background bank branch interior photo with measured gradient scrim */}
            <img
              src="/src/assets/images/bank_branch_interior_1793635628137.jpg"
              alt="SmartBank Metro Central Branch Lobby"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071322] via-[#0B1E36]/90 to-[#0F294D]/75" />

            <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-blue-300 uppercase tracking-widest mb-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Metro Central Flagship · Branch #0412</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Welcome to SmartBank
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
                  Take a digital or printed ticket to join the queue. Our specialized tellers and mortgage advisors will assist you promptly.
                </p>
              </div>

              {/* Branch quick KPI pill indicators */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-4 py-2.5 text-center">
                  <div className="text-[10px] text-blue-200 uppercase font-mono">Current Wait</div>
                  <div className="text-lg font-bold font-mono text-white tabular-nums">~6 mins</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-4 py-2.5 text-center">
                  <div className="text-[10px] text-blue-200 uppercase font-mono">Active Queue</div>
                  <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                    {totalWaiting} Waiting
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-4 py-2.5 text-center hidden sm:block">
                  <div className="text-[10px] text-blue-200 uppercase font-mono">Tellers Active</div>
                  <div className="text-lg font-bold font-mono text-white tabular-nums">15 Counters</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View 1: Customer-Facing Kiosk Flow */}
        {activeView === 'kiosk' && (
          <div>
            {kioskStep === 'department' && (
              <DepartmentSelector
                departments={DEPARTMENTS}
                selectedDepartmentId={selectedDeptId}
                onSelectDepartment={handleSelectDepartment}
              />
            )}

            {kioskStep === 'service' && currentSelectedDept && (
              <ServiceSelector
                department={currentSelectedDept}
                selectedServiceId={selectedService?.id || null}
                onSelectService={handleSelectService}
                onBack={() => setKioskStep('department')}
                onProceed={() => setKioskStep('details')}
              />
            )}

            {kioskStep === 'details' && currentSelectedDept && selectedService && (
              <CustomerDetailsForm
                department={currentSelectedDept}
                service={selectedService}
                onBack={() => setKioskStep('service')}
                onSubmit={handleGenerateTicket}
                isSubmitting={isSubmitting}
              />
            )}

            {kioskStep === 'confirmation' && issuedTicket && (
              <TicketConfirmation
                ticket={issuedTicket}
                onTakeAnother={handleResetKiosk}
                onTrackTicket={handleTrackTicket}
              />
            )}
          </div>
        )}

        {/* View 2: Branch Lobby Overhead Display Board */}
        {activeView === 'board' && (
          <BranchDisplayBoard
            onSelectTicket={(num) => {
              setTrackerCode(num);
              setActiveView('tracker');
            }}
          />
        )}

        {/* View 3: Ticket Tracker Search & Status */}
        {activeView === 'tracker' && (
          <TicketTracker
            initialTicketNumber={trackerCode}
            onViewConfirmation={(t) => {
              setIssuedTicket(t);
              setKioskStep('confirmation');
              setActiveView('kiosk');
            }}
          />
        )}

        {/* View 4: Teller Simulator Station */}
        {activeView === 'teller' && <TellerStationModal />}

      </main>

      {/* Clean quiet corporate footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">SmartBank Queue</span>
            <span>·</span>
            <span>Branch Operating Hours: Mon – Fri 08:30 – 17:00</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Branch #0412</span>
            <span>·</span>
            <span>PCI-DSS & Bank Security Certified</span>
            <span>·</span>
            <span className="font-mono text-slate-400">Firebase Firestore Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
