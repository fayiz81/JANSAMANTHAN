import React, { useState } from 'react';
import { GrievanceRecord } from '../types/grievance';
import { DEPARTMENT_INFO } from '../data/seedGrievances';

interface LiveGovFeedProps {
  grievances: GrievanceRecord[];
  onSelectGrievance: (id: string) => void;
  onOpenRtiModal: (grievance: GrievanceRecord) => void;
  onSimulateProgress: (id: string) => void;
  onSyncLiveGov?: () => Promise<void>;
  isSyncingLiveGov?: boolean;
  lastGovSyncTime?: string;
  govGatewayStatus?: Record<string, { status: string; pingMs: number; node?: string }>;
  lang: 'en' | 'hi';
}

export const LiveGovFeed: React.FC<LiveGovFeedProps> = ({
  grievances,
  onSelectGrievance,
  onOpenRtiModal,
  onSimulateProgress,
  onSyncLiveGov,
  isSyncingLiveGov = false,
  lastGovSyncTime = 'Just now',
  govGatewayStatus,
  lang,
}) => {
  const [filterState, setFilterState] = useState<'ALL' | 'ACTIVE' | 'SOLVED' | 'MY_DISPATCH'>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [portalFilter, setPortalFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARDS'>('TABLE');
  const [localRefreshing, setLocalRefreshing] = useState(false);

  const handleManualSync = async () => {
    if (onSyncLiveGov) {
      await onSyncLiveGov();
    } else {
      setLocalRefreshing(true);
      setTimeout(() => setLocalRefreshing(false), 800);
    }
  };

  const isRefreshing = isSyncingLiveGov || localRefreshing;

  const filtered = grievances.filter((g) => {
    if (filterState === 'SOLVED' && g.status !== 'RESOLVED') return false;
    if (filterState === 'ACTIVE' && (g.status === 'RESOLVED' || g.status === 'REJECTED_MANIPULATED')) return false;
    if (filterState === 'MY_DISPATCH' && !g.governmentDispatch?.isDirectlyDispatched) return false;
    if (deptFilter !== 'ALL' && g.departmentCode !== deptFilter) return false;

    if (portalFilter !== 'ALL') {
      const host = g.governmentDispatch?.portalHost || '';
      const portal = g.governmentDispatch?.governmentPortal || '';
      if (portalFilter === 'pgportal.gov.in' && !host.includes('pgportal') && !portal.includes('CPGRAMS')) return false;
      if (portalFilter === 'rtionline.gov.in' && !host.includes('rtionline') && !portal.includes('RTI')) return false;
      if (portalFilter === 'mcdonline.nic.in' && !host.includes('mcdonline') && !portal.includes('MCD')) return false;
      if (portalFilter === 'mohua.gov.in' && !host.includes('mohua') && !portal.includes('MoHUA')) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const text = `${g.id} ${g.title} ${g.location.address} ${g.departmentName} ${g.governmentDispatch?.governmentRefNumber || ''} ${g.governmentDispatch?.portalHost || ''}`.toLowerCase();
      return text.includes(q);
    }
    return true;
  });

  const solvedCount = grievances.filter((g) => g.status === 'RESOLVED').length;
  const activeCount = grievances.filter((g) => g.status !== 'RESOLVED' && g.status !== 'REJECTED_MANIPULATED').length;
  const directlyDispatchedCount = grievances.filter((g) => g.governmentDispatch?.isDirectlyDispatched).length;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6 font-sans">
      {/* 1. Official Government Header / Nodal Stream Banner */}
      <div className="bg-white border-t-4 border-t-[#0B3C5D] border-x border-b border-slate-300 shadow-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0B3C5D]">
              GOVERNMENT OF INDIA • CENTRAL PUBLIC GRIEVANCE REDRESS AND MONITORING SYSTEM
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mt-0.5">
              {lang === 'en' 
                ? 'Live Government Redressal Stream & Action Taken Report (ATR) Ledger' 
                : 'लाइव सरकारी निवारण स्ट्रीम एवं कार्रवाई रिपोर्ट (एटीआर)'}
            </h2>
            <div className="text-xs text-slate-600 mt-1">
              Synchronized directly with Central Ministry Gateways: CPGRAMS (pgportal.gov.in), RTI Online (rtionline.gov.in), and MCD Portal (mcdonline.nic.in).
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="text-left sm:text-right">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Gateway Sync State</div>
              <div className="text-xs font-bold text-[#138808]">
                Connected ({lastGovSyncTime})
              </div>
            </div>

            <button
              type="button"
              onClick={handleManualSync}
              disabled={isRefreshing}
              className="px-4 py-2 bg-[#0B3C5D] hover:bg-[#082D46] text-white text-xs font-bold uppercase tracking-wider cursor-pointer border border-[#082D46]"
            >
              {isRefreshing ? 'Synchronizing Gateway...' : 'Refresh Govt Gateway'}
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="bg-slate-50 border border-slate-300 p-2.5">
            <div className="text-[10px] text-slate-600 uppercase font-bold">Total Recorded Dockets</div>
            <div className="text-base font-bold text-slate-900 font-mono mt-0.5">{grievances.length}</div>
          </div>

          <div className="bg-[#EBF7EE] border border-[#138808] p-2.5">
            <div className="text-[10px] text-[#138808] uppercase font-bold">Solved (ATR Verified)</div>
            <div className="text-base font-bold text-[#138808] font-mono mt-0.5">{solvedCount} Closed</div>
          </div>

          <div className="bg-amber-50 border border-amber-300 p-2.5">
            <div className="text-[10px] text-amber-800 uppercase font-bold">Active in Field</div>
            <div className="text-base font-bold text-amber-900 font-mono mt-0.5">{activeCount} Pending</div>
          </div>

          <div className="bg-blue-50 border border-blue-300 p-2.5">
            <div className="text-[10px] text-blue-900 uppercase font-bold">Direct Portal Filings</div>
            <div className="text-base font-bold text-blue-900 font-mono mt-0.5">{directlyDispatchedCount} Linked</div>
          </div>
        </div>

        {/* Connected Government Portal Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 mt-3 border-t border-slate-200 text-xs">
          <div className="bg-white border border-slate-300 px-3 py-1.5 flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold text-slate-800">pgportal.gov.in</span>
            <span className="text-[10px] font-bold text-[#138808] bg-green-50 px-1 border border-green-200">ONLINE ({govGatewayStatus?.['pgportal.gov.in']?.pingMs || 38}ms)</span>
          </div>

          <div className="bg-white border border-slate-300 px-3 py-1.5 flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold text-slate-800">rtionline.gov.in</span>
            <span className="text-[10px] font-bold text-[#138808] bg-green-50 px-1 border border-green-200">ONLINE ({govGatewayStatus?.['rtionline.gov.in']?.pingMs || 44}ms)</span>
          </div>

          <div className="bg-white border border-slate-300 px-3 py-1.5 flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold text-slate-800">mcdonline.nic.in</span>
            <span className="text-[10px] font-bold text-[#138808] bg-green-50 px-1 border border-green-200">ONLINE ({govGatewayStatus?.['mcdonline.nic.in']?.pingMs || 51}ms)</span>
          </div>

          <div className="bg-white border border-slate-300 px-3 py-1.5 flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold text-slate-800">mohua.gov.in</span>
            <span className="text-[10px] font-bold text-[#138808] bg-green-50 px-1 border border-green-200">ONLINE ({govGatewayStatus?.['mohua.gov.in']?.pingMs || 41}ms)</span>
          </div>
        </div>
      </div>

      {/* 2. Standard Government Filters and Search */}
      <div className="bg-white border border-slate-300 shadow-xs p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setFilterState('ALL')}
              className={`px-3 py-1.5 font-semibold cursor-pointer border ${
                filterState === 'ALL'
                  ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              All Dockets ({grievances.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterState('ACTIVE')}
              className={`px-3 py-1.5 font-semibold cursor-pointer border ${
                filterState === 'ACTIVE'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Active in Field ({activeCount})
            </button>

            <button
              type="button"
              onClick={() => setFilterState('SOLVED')}
              className={`px-3 py-1.5 font-semibold cursor-pointer border ${
                filterState === 'SOLVED'
                  ? 'bg-[#138808] text-white border-[#138808]'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Solved & Closed ({solvedCount})
            </button>

            <button
              type="button"
              onClick={() => setFilterState('MY_DISPATCH')}
              className={`px-3 py-1.5 font-semibold cursor-pointer border ${
                filterState === 'MY_DISPATCH'
                  ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Portal Direct Filings ({directlyDispatchedCount})
            </button>
          </div>

          {/* Search Box and View Mode Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Docket #, Road, or Department..."
              className="px-3 py-1.5 text-xs border border-slate-300 w-full sm:w-64 focus:outline-none focus:border-[#0B3C5D]"
            />

            <div className="flex border border-slate-300 bg-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('TABLE')}
                className={`px-2.5 py-1 font-semibold cursor-pointer ${
                  viewMode === 'TABLE' ? 'bg-[#0B3C5D] text-white' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                Table View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('CARDS')}
                className={`px-2.5 py-1 font-semibold cursor-pointer ${
                  viewMode === 'CARDS' ? 'bg-[#0B3C5D] text-white' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                Card View
              </button>
            </div>
          </div>
        </div>

        {/* Portal Source and Department Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 text-xs">
          <span className="font-semibold text-slate-700">Source Portal:</span>
          <button
            type="button"
            onClick={() => setPortalFilter('ALL')}
            className={`px-2 py-0.5 border cursor-pointer ${
              portalFilter === 'ALL' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            All Portals
          </button>
          <button
            type="button"
            onClick={() => setPortalFilter('pgportal.gov.in')}
            className={`px-2 py-0.5 border cursor-pointer ${
              portalFilter === 'pgportal.gov.in' ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            CPGRAMS (pgportal.gov.in)
          </button>
          <button
            type="button"
            onClick={() => setPortalFilter('rtionline.gov.in')}
            className={`px-2 py-0.5 border cursor-pointer ${
              portalFilter === 'rtionline.gov.in' ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            RTI Online (rtionline.gov.in)
          </button>
          <button
            type="button"
            onClick={() => setPortalFilter('mcdonline.nic.in')}
            className={`px-2 py-0.5 border cursor-pointer ${
              portalFilter === 'mcdonline.nic.in' ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            MCD Delhi (mcdonline.nic.in)
          </button>

          <span className="text-slate-300 mx-1">|</span>

          <span className="font-semibold text-slate-700">Dept:</span>
          <button
            type="button"
            onClick={() => setDeptFilter('ALL')}
            className={`px-2 py-0.5 border cursor-pointer ${
              deptFilter === 'ALL' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            All
          </button>
          {Object.keys(DEPARTMENT_INFO).map((dCode) => (
            <button
              key={dCode}
              type="button"
              onClick={() => setDeptFilter(dCode)}
              className={`px-2 py-0.5 border cursor-pointer ${
                deptFilter === dCode ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]' : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              {dCode}
            </button>
          ))}
        </div>
      </div>

      {/* 3. PRIMARY VIEW: STANDARD OFFICIAL GOVERNMENT TABLE */}
      {viewMode === 'TABLE' && (
        <div className="bg-white border border-slate-300 shadow-xs overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#0B3C5D] text-white font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-3 border-r border-[#082D46]">Govt Docket / Ref No.</th>
                <th className="py-3 px-3 border-r border-[#082D46]">Subject & Location</th>
                <th className="py-3 px-3 border-r border-[#082D46]">Department</th>
                <th className="py-3 px-3 border-r border-[#082D46]">Live Statutory Status</th>
                <th className="py-3 px-3 border-r border-[#082D46]">Action Taken Report (ATR) / Notes</th>
                <th className="py-3 px-3 text-center">Statutory Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((g, idx) => {
                const isSolved = g.status === 'RESOLVED';
                const isCrewOnSite = g.governmentDispatch?.transmissionStatus === 'CREW_ON_SITE' || g.status === 'FIELD_WORK_DISPATCHED';
                const portalHost = g.governmentDispatch?.portalHost || 'pgportal.gov.in';

                return (
                  <tr key={g.id} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-100/80'}>
                    {/* Docket Number & Source */}
                    <td className="py-3 px-3 align-top border-r border-slate-200 font-mono">
                      <div className="font-bold text-[#0B3C5D]">{g.id}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Token: {g.token}</div>
                      <a
                        href={g.governmentDispatch?.portalSourceUrl || 'https://pgportal.gov.in'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-semibold text-blue-700 underline block mt-1"
                      >
                        Source: {portalHost}
                      </a>
                    </td>

                    {/* Subject & Location */}
                    <td className="py-3 px-3 align-top border-r border-slate-200 max-w-xs">
                      <div className="font-bold text-slate-900 line-clamp-2">{g.title}</div>
                      <div className="text-[11px] text-slate-600 mt-1">
                        {g.location.address}, {g.location.wardOrSector}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Pin Code: {g.location.pinCode} • GPS: {g.location.lat}°N, {g.location.lng}°E
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-3 align-top border-r border-slate-200">
                      <div className="font-bold text-slate-900">{g.departmentName}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-semibold">Code: {g.departmentCode}</div>
                      <div className="text-[10px] text-slate-600 mt-1">
                        SLA: <strong className="text-slate-800">{g.statutorySlaDays} Days</strong>
                      </div>
                    </td>

                    {/* Live Status */}
                    <td className="py-3 px-3 align-top border-r border-slate-200">
                      {isSolved ? (
                        <div className="bg-[#EBF7EE] border border-[#138808] text-[#138808] px-2 py-1 text-[11px] font-bold text-center">
                          RESOLVED (ATR FILED)
                        </div>
                      ) : isCrewOnSite ? (
                        <div className="bg-blue-50 border border-blue-400 text-blue-900 px-2 py-1 text-[11px] font-bold text-center">
                          FIELD CREW ON SITE
                        </div>
                      ) : g.severity === 'CRITICAL' ? (
                        <div className="bg-red-50 border border-red-400 text-red-900 px-2 py-1 text-[11px] font-bold text-center">
                          CRITICAL (48H SLA)
                        </div>
                      ) : (
                        <div className="bg-slate-100 border border-slate-300 text-slate-800 px-2 py-1 text-[11px] font-bold text-center">
                          UNDER SCRUTINY
                        </div>
                      )}

                      {g.governmentDispatch?.fieldTeamAssigned && !isSolved && (
                        <div className="text-[10px] text-slate-600 mt-1.5 leading-snug">
                          <strong>Crew:</strong> {g.governmentDispatch.fieldTeamAssigned.engineerName}
                        </div>
                      )}
                    </td>

                    {/* Action Taken Report / Notes */}
                    <td className="py-3 px-3 align-top border-r border-slate-200 max-w-sm">
                      {isSolved && g.governmentDispatch?.resolutionProof ? (
                        <div className="bg-emerald-50/70 border border-emerald-200 p-2 text-[11px] text-emerald-950">
                          <div className="font-bold text-[#138808] uppercase text-[10px]">
                            Certified Completion Notice:
                          </div>
                          <p className="mt-0.5 line-clamp-3">
                            {g.governmentDispatch.resolutionProof.completionNote}
                          </p>
                          <div className="text-[10px] text-slate-500 mt-1">
                            Badge: {g.governmentDispatch.resolutionProof.inspectorBadge || 'MUNICIPAL-INSP-2026-DL'}
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-700 text-[11px] space-y-1">
                          <p className="line-clamp-2">{g.description}</p>
                          <div className="text-[10px] text-slate-500">
                            CPIO Assigned: {g.rtiResponse.designatedPio.name}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 align-top text-center space-y-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectGrievance(g.id)}
                        className="w-full px-2.5 py-1 bg-[#0B3C5D] hover:bg-[#082D46] text-white text-[11px] font-semibold cursor-pointer block text-center"
                      >
                        Track Docket
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenRtiModal(g)}
                        className="w-full px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-400 text-slate-800 text-[11px] font-semibold cursor-pointer block text-center"
                      >
                        RTI Notice
                      </button>

                      {/* Officer / Test progress simulation */}
                      {!isSolved && (
                        <button
                          type="button"
                          onClick={() => onSimulateProgress(g.id)}
                          className="w-full px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-[10px] font-semibold cursor-pointer block text-center"
                          title="Simulate Field Work Advancement"
                        >
                          {g.status === 'ROUTED' || g.status === 'SUBMITTED' ? 'Advance to Field' : 'Certify Closure'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. SECONDARY VIEW: DETAILED CARD LEDGER */}
      {viewMode === 'CARDS' && (
        <div className="space-y-4">
          {filtered.map((g) => {
            const isSolved = g.status === 'RESOLVED';
            const isCrewOnSite = g.governmentDispatch?.transmissionStatus === 'CREW_ON_SITE' || g.status === 'FIELD_WORK_DISPATCHED';
            const portalHost = g.governmentDispatch?.portalHost || 'pgportal.gov.in';

            return (
              <div
                key={g.id}
                className={`bg-white border p-5 shadow-xs ${
                  isSolved ? 'border-l-4 border-l-[#138808] border-slate-300' : 'border-l-4 border-l-[#0B3C5D] border-slate-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0B3C5D] bg-slate-100 px-2 py-0.5 border border-slate-300">
                      {g.id}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{g.departmentName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      (Gov Gateway: <strong className="text-slate-700">{portalHost}</strong>)
                    </span>
                  </div>

                  <div>
                    {isSolved ? (
                      <span className="bg-[#EBF7EE] border border-[#138808] text-[#138808] px-2 py-0.5 text-xs font-bold">
                        RESOLVED (ATR FILED)
                      </span>
                    ) : isCrewOnSite ? (
                      <span className="bg-blue-50 border border-blue-400 text-blue-900 px-2 py-0.5 text-xs font-bold">
                        FIELD CREW ON SITE
                      </span>
                    ) : (
                      <span className="bg-slate-100 border border-slate-300 text-slate-800 px-2 py-0.5 text-xs font-bold">
                        UNDER SCRUTINY
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                  <div className="md:col-span-3 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900">{g.title}</h3>
                    <p className="text-xs text-slate-700 leading-relaxed">{g.description}</p>
                    <div className="text-xs text-slate-600">
                      <strong>Location:</strong> {g.location.address}, {g.location.wardOrSector}, PIN: {g.location.pinCode}
                    </div>

                    {isSolved && g.governmentDispatch?.resolutionProof && (
                      <div className="mt-2 bg-[#EBF7EE] border border-[#138808] p-3 text-xs text-slate-900">
                        <strong className="text-[#138808]">Action Taken Report (ATR) Certified by Zonal Inspector:</strong>
                        <p className="mt-1">{g.governmentDispatch.resolutionProof.completionNote}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200 md:pl-4 text-xs">
                    <button
                      type="button"
                      onClick={() => onSelectGrievance(g.id)}
                      className="w-full py-1.5 bg-[#0B3C5D] hover:bg-[#082D46] text-white font-semibold cursor-pointer text-center block"
                    >
                      Track Docket Status
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenRtiModal(g)}
                      className="w-full py-1.5 bg-white hover:bg-slate-50 border border-slate-400 text-slate-800 font-semibold cursor-pointer text-center block"
                    >
                      View RTI Notice
                    </button>
                    {!isSolved && (
                      <button
                        type="button"
                        onClick={() => onSimulateProgress(g.id)}
                        className="w-full py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold text-[11px] cursor-pointer text-center block"
                      >
                        {g.status === 'ROUTED' || g.status === 'SUBMITTED' ? 'Advance Field Work' : 'Certify Closure'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
