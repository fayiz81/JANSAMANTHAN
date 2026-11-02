import React, { useState } from 'react';
import { GrievanceRecord, GrievanceStatus } from '../types/grievance';
import { DEPARTMENT_INFO } from '../data/seedGrievances';

interface OfficerDashboardProps {
  grievances: GrievanceRecord[];
  onUpdateStatus: (id: string, newStatus: GrievanceStatus, note: string) => void;
  onOpenRtiModal: (grievance: GrievanceRecord) => void;
  onInspectForensics: (id: string) => void;
  lang: 'en' | 'hi';
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  grievances,
  onUpdateStatus,
  onOpenRtiModal,
  onInspectForensics,
  lang
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGrievanceDetail, setActiveGrievanceDetail] = useState<GrievanceRecord | null>(null);
  const [officerNote, setOfficerNote] = useState('');

  const filtered = grievances.filter((g) => {
    if (selectedDept !== 'ALL' && g.departmentCode !== selectedDept) return false;
    if (statusFilter === 'CRITICAL' && g.severity !== 'CRITICAL') return false;
    if (statusFilter === 'SUSPICIOUS' && !g.imageForensics.isManipulated) return false;
    if (statusFilter === 'MERGED' && g.status !== 'MERGED_DUPLICATE') return false;
    if (statusFilter === 'RESOLVED' && g.status !== 'RESOLVED') return false;
    if (statusFilter === 'PENDING' && (g.status === 'RESOLVED' || g.status === 'REJECTED_MANIPULATED')) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = (g.id + ' ' + g.title + ' ' + g.description + ' ' + g.location.address).toLowerCase();
      return matchText.includes(q);
    }
    return true;
  });

  const criticalCount = grievances.filter((g) => g.severity === 'CRITICAL' && g.status !== 'RESOLVED').length;
  const suspiciousCount = grievances.filter((g) => g.imageForensics.isManipulated).length;
  const mergedCount = grievances.filter((g) => g.status === 'MERGED_DUPLICATE').length;
  const resolvedCount = grievances.filter((g) => g.status === 'RESOLVED').length;

  const handleStatusChange = (newStatus: GrievanceStatus) => {
    if (!activeGrievanceDetail) return;
    const note = officerNote.trim() || `Status updated to ${newStatus.replace(/_/g, ' ')} by designated CPIO officer.`;
    onUpdateStatus(activeGrievanceDetail.id, newStatus, note);
    setActiveGrievanceDetail({
      ...activeGrievanceDetail,
      status: newStatus,
      statusTimeline: [
        ...activeGrievanceDetail.statusTimeline,
        {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note,
          actor: 'Designated CPIO Officer',
        },
      ],
    });
    setOfficerNote('');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6 font-sans">
      {/* 1. Official Header Banner */}
      <div className="bg-white border-t-4 border-t-[#0B3C5D] border-x border-b border-slate-300 shadow-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0B3C5D]">
              GOVERNMENT OF INDIA • DEPARTMENT OF ADMINISTRATIVE REFORMS & PUBLIC GRIEVANCES
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mt-0.5">
              {lang === 'en' 
                ? 'Central Public Information Officer (CPIO) & Executive Engineer Redressal Console' 
                : 'केंद्रीय लोक सूचना अधिकारी (सीपीआईओ) एवं कार्यपालक अभियंता डेस्क'}
            </h2>
            <div className="text-xs text-slate-600 mt-0.5">
              Statutory Nodal Processing Desk under Right to Information Act, 2005 (Section 6 & 7 Compliance)
            </div>
          </div>

          {/* Quick Status Counters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="bg-[#FFF2F2] border border-[#E57373] px-3 py-1 text-slate-900 font-bold">
              Critical (48h SLA): <span className="text-[#B71C1C]">{criticalCount}</span>
            </div>
            <div className="bg-[#FFFDF2] border border-[#E6D8A8] px-3 py-1 text-slate-900 font-bold">
              Evidence Inquiries: <span className="text-[#8A5A00]">{suspiciousCount}</span>
            </div>
            <div className="bg-[#EBF7EE] border border-[#138808] px-3 py-1 text-slate-900 font-bold">
              Closed (ATR Certified): <span className="text-[#138808]">{resolvedCount}</span>
            </div>
          </div>
        </div>

        {/* 2. Department Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 text-xs">
          <span className="font-semibold text-slate-700 mr-1">Select Ministry / Body:</span>
          <button
            type="button"
            onClick={() => setSelectedDept('ALL')}
            className={`px-3 py-1.5 font-bold cursor-pointer border ${
              selectedDept === 'ALL'
                ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            All Departments ({grievances.length})
          </button>
          {Object.keys(DEPARTMENT_INFO).map((dCode) => {
            const count = grievances.filter((g) => g.departmentCode === dCode).length;
            return (
              <button
                key={dCode}
                type="button"
                onClick={() => setSelectedDept(dCode)}
                className={`px-3 py-1.5 font-bold cursor-pointer border ${
                  selectedDept === dCode
                    ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {dCode} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Filter and Search Bar */}
      <div className="bg-white border border-slate-300 shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 text-xs">
          <span className="font-semibold text-slate-700 mr-1">Status:</span>
          {[
            { id: 'ALL', label: 'All Dockets' },
            { id: 'PENDING', label: 'Pending Action' },
            { id: 'CRITICAL', label: 'Critical Life Risk' },
            { id: 'SUSPICIOUS', label: 'Evidence Scrutiny' },
            { id: 'MERGED', label: 'Merged Duplicates' },
            { id: 'RESOLVED', label: 'Closed / Resolved' },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStatusFilter(st.id)}
              className={`px-2.5 py-1 text-xs font-semibold cursor-pointer border ${
                statusFilter === st.id
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by docket, address, citizen name..."
          className="px-3 py-1.5 text-xs border border-slate-300 w-full md:w-72 focus:outline-none focus:border-[#0B3C5D]"
        />
      </div>

      {/* 4. Official Departmental Desk Table */}
      <div className="bg-white border border-slate-300 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-[#0B3C5D] text-white font-bold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="py-3 px-3 border-r border-[#082D46]">Docket / Date</th>
              <th className="py-3 px-3 border-r border-[#082D46]">Grievance Subject & Ward</th>
              <th className="py-3 px-3 border-r border-[#082D46]">Department</th>
              <th className="py-3 px-3 border-r border-[#082D46]">Statutory SLA</th>
              <th className="py-3 px-3 border-r border-[#082D46]">Evidence Integrity</th>
              <th className="py-3 px-3 border-r border-[#082D46]">Current Status</th>
              <th className="py-3 px-3 text-center">Officer Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((g, idx) => {
              const isSelected = activeGrievanceDetail?.id === g.id;
              const isSolved = g.status === 'RESOLVED';
              const isCrewOnSite = g.governmentDispatch?.transmissionStatus === 'CREW_ON_SITE' || g.status === 'FIELD_WORK_DISPATCHED';

              return (
                <tr key={g.id} className={isSelected ? 'bg-amber-50/70' : idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/60'}>
                  <td className="py-3 px-3 align-top border-r border-slate-200 font-mono">
                    <div className="font-bold text-[#0B3C5D]">{g.id}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {new Date(g.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>

                  <td className="py-3 px-3 align-top border-r border-slate-200 max-w-xs">
                    <div className="font-bold text-slate-900 line-clamp-1">{g.title}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                      {g.location.address}, {g.location.wardOrSector}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Applicant: <strong>{g.citizenName}</strong>
                    </div>
                  </td>

                  <td className="py-3 px-3 align-top border-r border-slate-200 font-bold text-slate-800">
                    <div>{g.departmentCode}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{g.subCategory}</div>
                  </td>

                  <td className="py-3 px-3 align-top border-r border-slate-200">
                    <div className="font-bold text-slate-900">{g.statutorySlaDays} Days</div>
                    <div className="text-[10px] text-slate-500">
                      {g.severity === 'CRITICAL' ? <span className="text-red-700 font-bold">Sec 7(1) 48h Life Risk</span> : 'Sec 6(1) Regular'}
                    </div>
                  </td>

                  <td className="py-3 px-3 align-top border-r border-slate-200">
                    {g.imageForensics.isManipulated ? (
                      <span className="bg-[#FFF2F2] border border-[#E57373] text-[#B71C1C] px-1.5 py-0.5 font-bold text-[10px]">
                        EVIDENCE TAMPER FLAG ({g.imageForensics.manipulationConfidenceScore}%)
                      </span>
                    ) : (
                      <span className="bg-[#EBF7EE] border border-[#138808] text-[#138808] px-1.5 py-0.5 font-bold text-[10px]">
                        VERIFIED SEC 65B
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 align-top border-r border-slate-200">
                    {isSolved ? (
                      <span className="bg-[#EBF7EE] border border-[#138808] text-[#138808] px-2 py-0.5 font-bold text-[10px] block text-center">
                        RESOLVED (ATR FILED)
                      </span>
                    ) : isCrewOnSite ? (
                      <span className="bg-blue-50 border border-blue-400 text-blue-900 px-2 py-0.5 font-bold text-[10px] block text-center">
                        CREW DISPATCHED
                      </span>
                    ) : (
                      <span className="bg-slate-100 border border-slate-300 text-slate-800 px-2 py-0.5 font-bold text-[10px] block text-center">
                        UNDER SCRUTINY
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 align-top text-center space-y-1 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setActiveGrievanceDetail(g)}
                      className="w-full px-2.5 py-1 bg-[#0B3C5D] hover:bg-[#082D46] text-white text-[11px] font-semibold cursor-pointer block text-center"
                    >
                      Process Docket
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenRtiModal(g)}
                      className="w-full px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-400 text-slate-800 text-[10px] font-semibold cursor-pointer block text-center"
                    >
                      RTI Memo
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 5. Officer Action Taken Report (ATR) Processing Modal / Panel */}
      {activeGrievanceDetail && (
        <div className="bg-white border-2 border-[#0B3C5D] shadow-md p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#0B3C5D]">
                OFFICIAL ACTION TAKEN REPORT (ATR) FILING CONSOLE
              </div>
              <h3 className="text-base font-bold text-slate-900 font-serif mt-0.5">
                Docket #{activeGrievanceDetail.id}: {activeGrievanceDetail.title}
              </h3>
              <div className="text-xs text-slate-600">
                Department: <strong>{activeGrievanceDetail.departmentName}</strong> • CPIO: <strong>{activeGrievanceDetail.rtiResponse.designatedPio.name}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveGrievanceDetail(null)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer self-start sm:self-auto"
            >
              Close Console
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 border border-slate-300 p-3">
                <div className="font-bold text-slate-800 mb-1">Citizen Statement:</div>
                <p className="text-slate-700 leading-relaxed">{activeGrievanceDetail.description}</p>
                <div className="mt-2 pt-2 border-t border-slate-200 text-slate-600">
                  <strong>Location:</strong> {activeGrievanceDetail.location.address}, {activeGrievanceDetail.location.wardOrSector}, PIN: {activeGrievanceDetail.location.pinCode}
                </div>
              </div>

              {activeGrievanceDetail.imageUrl && (
                <div className="border border-slate-300 p-2 bg-slate-100">
                  <div className="text-[11px] font-bold text-slate-700 mb-1">Attached Civic Evidence:</div>
                  <img src={activeGrievanceDetail.imageUrl} alt="Attached Civic Evidence" className="w-full h-40 object-cover border border-slate-300" />
                  <button
                    type="button"
                    onClick={() => onInspectForensics(activeGrievanceDetail.id)}
                    className="mt-2 w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer"
                  >
                    Open Digital Evidence & Vigilance Audit Wing
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                Official Action Taken Report (ATR) / Departmental Note:
              </label>
              <textarea
                rows={4}
                value={officerNote}
                onChange={(e) => setOfficerNote(e.target.value)}
                placeholder="Enter official departmental action remarks (e.g. 'Site inspected by Assistant Engineer. Road cavity filled with dense bituminous macadam. Quality test satisfactory. ATR submitted to CPGRAMS.')"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-[#0B3C5D]"
              />

              <div className="text-xs font-bold text-slate-800 pt-1">
                Update Statutory Docket Status:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleStatusChange('FIELD_WORK_DISPATCHED')}
                  className="py-2 px-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold cursor-pointer border border-blue-950"
                >
                  Mobilize Field Crew
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange('INVESTIGATING')}
                  className="py-2 px-3 bg-indigo-900 hover:bg-indigo-800 text-white font-semibold cursor-pointer border border-indigo-950"
                >
                  Order Zonal Inquiry
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange('RESOLVED')}
                  className="py-2 px-3 bg-[#138808] hover:bg-[#0f6b06] text-white font-semibold cursor-pointer border border-[#0f6b06]"
                >
                  Certify Redressal (File ATR)
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange('REJECTED_MANIPULATED')}
                  className="py-2 px-3 bg-[#B71C1C] hover:bg-[#8b1515] text-white font-semibold cursor-pointer border border-[#8b1515]"
                >
                  Reject (Evidence Tampered)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
