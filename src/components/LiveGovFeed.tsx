import React, { useState } from 'react';
import { GrievanceRecord, GovTransmissionStatus } from '../types/grievance';
import { DEPARTMENT_INFO } from '../data/seedGrievances';
import { 
  Radio, 
  CheckCircle2, 
  Clock, 
  Building2, 
  HardHat, 
  Truck, 
  FileCheck2, 
  RefreshCw, 
  Search, 
  Filter, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Eye,
  Camera,
  MapPin,
  Sparkles,
  ArrowRight,
  PhoneCall
} from 'lucide-react';

interface LiveGovFeedProps {
  grievances: GrievanceRecord[];
  onSelectGrievance: (id: string) => void;
  onOpenRtiModal: (grievance: GrievanceRecord) => void;
  onSimulateProgress: (id: string) => void;
  lang: 'en' | 'hi';
}

export const LiveGovFeed: React.FC<LiveGovFeedProps> = ({
  grievances,
  onSelectGrievance,
  onOpenRtiModal,
  onSimulateProgress,
  lang,
}) => {
  const [filterState, setFilterState] = useState<'ALL' | 'ACTIVE' | 'SOLVED' | 'MY_DISPATCH'>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [selectedProofModal, setSelectedProofModal] = useState<GrievanceRecord | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 600);
  };

  const filtered = grievances.filter((g) => {
    if (filterState === 'SOLVED' && g.status !== 'RESOLVED') return false;
    if (filterState === 'ACTIVE' && (g.status === 'RESOLVED' || g.status === 'REJECTED_MANIPULATED')) return false;
    if (filterState === 'MY_DISPATCH' && !g.governmentDispatch?.isDirectlyDispatched) return false;
    if (deptFilter !== 'ALL' && g.departmentCode !== deptFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const text = `${g.id} ${g.title} ${g.location.address} ${g.departmentName} ${g.governmentDispatch?.governmentRefNumber || ''}`.toLowerCase();
      return text.includes(q);
    }
    return true;
  });

  const solvedCount = grievances.filter((g) => g.status === 'RESOLVED').length;
  const activeCount = grievances.filter((g) => g.status !== 'RESOLVED' && g.status !== 'REJECTED_MANIPULATED').length;
  const directlyDispatchedCount = grievances.filter((g) => g.governmentDispatch?.isDirectlyDispatched).length;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Live Gateway Broadcast Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-400/30 uppercase tracking-wider">
                LIVE GOVERNMENT NODAL STREAM • CPGRAMS GATEWAY
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {lang === 'en' ? 'Live Department Issues & Real-Time Resolution Feed' : 'लाइव सरकारी विभाग समस्याएं एवं समाधान फ़ीड'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'en'
                ? 'Direct transmission pipeline to Government Central Public Grievance Exchange (CPGRAMS). Track live civic issues, see which ones are Solved vs In-Progress, and verify official Action Taken Reports (ATRs).'
                : 'सरकार के केंद्रीय लोक शिकायत पोर्टल से सीधा संपर्क। देखें कौन सी समस्याएं हल हो चुकी हैं और कौन सी प्रगति पर हैं।'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Ping Government Gateway</span>
            </button>
          </div>
        </div>

        {/* Live Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800 text-xs text-slate-300">
          <div>
            <div className="text-[11px] text-slate-400">Government Portal</div>
            <div className="text-sm font-bold text-white flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              CPGRAMS / MoHUA Nodal
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400">Currently Solved & Closed</div>
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {solvedCount} Resolved (With ATR Proof)
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400">Active Field Crews</div>
            <div className="text-sm font-bold text-amber-300 flex items-center gap-1">
              <HardHat className="w-3.5 h-3.5" />
              {activeCount} In Repair / On Site
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400">Web Direct Dispatches</div>
            <div className="text-sm font-bold text-blue-300 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5" />
              {directlyDispatchedCount} Directly Linked
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Main Status Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setFilterState('ALL')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filterState === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Live Issues ({grievances.length})
            </button>
            <button
              onClick={() => setFilterState('ACTIVE')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                filterState === 'ACTIVE' ? 'bg-amber-500 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Active in Field</span>
              <span className="text-[10px] opacity-80 font-mono">({activeCount})</span>
            </button>
            <button
              onClick={() => setFilterState('SOLVED')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                filterState === 'SOLVED' ? 'bg-emerald-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Solved & Closed</span>
              <span className="text-[10px] opacity-80 font-mono">({solvedCount})</span>
            </button>
            <button
              onClick={() => setFilterState('MY_DISPATCH')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                filterState === 'MY_DISPATCH' ? 'bg-blue-900 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Direct Dispatches</span>
              <span className="text-[10px] opacity-80 font-mono">({directlyDispatchedCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search live issues or Ref No..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Department Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 text-xs scrollbar-none">
          <span className="text-slate-400 text-xs shrink-0 hidden md:inline">Department:</span>
          <button
            onClick={() => setDeptFilter('ALL')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer shrink-0 ${
              deptFilter === 'ALL' ? 'bg-slate-900 text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Departments
          </button>
          {Object.keys(DEPARTMENT_INFO).map((dCode) => (
            <button
              key={dCode}
              onClick={() => setDeptFilter(dCode)}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer shrink-0 ${
                deptFilter === dCode ? 'bg-slate-900 text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dCode}
            </button>
          ))}
        </div>
      </div>

      {/* LIVE FEED CARDS */}
      <div className="space-y-4">
        {filtered.map((g) => {
          const isSolved = g.status === 'RESOLVED';
          const isCrewOnSite = g.governmentDispatch?.transmissionStatus === 'CREW_ON_SITE' || g.status === 'FIELD_WORK_DISPATCHED';
          const isAssigned = g.governmentDispatch?.transmissionStatus === 'ASSIGNED_TO_FIELD_ENGINEER';

          return (
            <div
              key={g.id}
              className={`bg-white border rounded-2xl p-5 shadow-xs transition-all hover:shadow-md ${
                isSolved
                  ? 'border-emerald-300 bg-emerald-50/10'
                  : g.severity === 'CRITICAL'
                  ? 'border-rose-300 bg-rose-50/10'
                  : 'border-slate-200'
              }`}
            >
              {/* Card Top: Department & Live Transmission Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                    {g.id}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {g.departmentName}
                  </span>
                </div>

                {/* Government Nodal Tag */}
                <div className="flex items-center gap-2">
                  {g.governmentDispatch?.isDirectlyDispatched && (
                    <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-blue-600 animate-pulse" />
                      Direct Govt Dispatch: {g.governmentDispatch.governmentRefNumber}
                    </span>
                  )}

                  {/* Solved vs Active Status Badge */}
                  {isSolved ? (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      SOLVED & VERIFIED BY GOVT
                    </span>
                  ) : isCrewOnSite ? (
                    <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                      <HardHat className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                      FIELD CREW ON SITE (REPAIR ACTIVE)
                    </span>
                  ) : isAssigned ? (
                    <span className="bg-indigo-100 text-indigo-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-300 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-indigo-600" />
                      ENGINEER EN ROUTE
                    </span>
                  ) : (
                    <span className="bg-sky-100 text-sky-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-sky-300">
                      TRANSMITTED TO MINISTRY
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body: Title, Location, Images */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-3">
                <div className="md:col-span-8 space-y-2">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {g.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {g.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{g.location.address}, {g.location.district}</span>
                    </div>
                    <div>•</div>
                    <div>Category: <strong className="text-slate-700">{g.subCategory}</strong></div>
                    <div>•</div>
                    <div>Lodged: {new Date(g.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                  </div>

                  {/* FIELD TEAM OR RESOLUTION PROOF BOX */}
                  {isSolved && g.governmentDispatch?.resolutionProof ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs space-y-1 mt-2">
                      <div className="flex items-center justify-between text-emerald-900 font-bold">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Official Government Resolution Memo (ATR)
                        </span>
                        <span className="text-[10px] font-mono text-emerald-800">
                          Badge: {g.governmentDispatch.resolutionProof.inspectorBadge}
                        </span>
                      </div>
                      <p className="text-emerald-950 leading-relaxed text-[11px]">
                        "{g.governmentDispatch.resolutionProof.completionNote}"
                      </p>
                    </div>
                  ) : g.governmentDispatch?.fieldTeamAssigned ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <HardHat className="w-3.5 h-3.5 text-blue-600" />
                          <span>Assigned Engineer: {g.governmentDispatch.fieldTeamAssigned.engineerName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {g.governmentDispatch.fieldTeamAssigned.designation} • Vehicle: {g.governmentDispatch.fieldTeamAssigned.vehicleNumber || 'Municipal Inspection Jeep'}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                          ETA: ~{g.governmentDispatch.fieldTeamAssigned.etaMinutes || 20} Mins
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Right side: Photo & Quick Action Buttons */}
                <div className="md:col-span-4 flex flex-col justify-between space-y-3">
                  {g.imageUrl && (
                    <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 h-28 group">
                      <img
                        src={g.imageUrl}
                        alt="Issue"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {isSolved && (
                        <div className="absolute top-1 right-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          RESOLVED
                        </div>
                      )}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {!isSolved && (
                      <button
                        onClick={() => onSimulateProgress(g.id)}
                        className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        title="Simulate government field repair progress"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Simulate Repair</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectGrievance(g.id)}
                      className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Track Status</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenRtiModal(g)}
                      className="py-1.5 px-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                      title="View Official RTI Memo"
                    >
                      RTI Memo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-xs">
            No live government issues match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
