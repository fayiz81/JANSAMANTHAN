import React, { useState } from 'react';
import { GrievanceRecord, DepartmentCode, GrievanceStatus } from '../types/grievance';
import { DEPARTMENT_INFO } from '../data/seedGrievances';
import { 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  AlertTriangle, 
  ArrowUpRight, 
  FileText, 
  UserCheck, 
  Check, 
  X,
  Layers,
  ChevronRight,
  HardHat,
  Eye,
  Plus
} from 'lucide-react';

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

  // Department counts
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
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-900" />
            <h2 className="text-xl font-bold text-slate-900">
              {lang === 'en' ? 'Central PIO & Department Redressal Desk' : 'केंद्रीय पीआईओ एवं विभागीय निवारण डेस्क'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Integrated CPIO dispatch console under Right to Information Act 2005. Manage citizen dockets, verify AI visual forensics, and dispatch statutory action notices.
          </p>
        </div>

        {/* Quick status counters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <div>
              <span className="font-bold text-rose-900">{criticalCount}</span>
              <span className="text-rose-700 text-[11px] ml-1">Critical (48h SLA)</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <div>
              <span className="font-bold text-amber-900">{suspiciousCount}</span>
              <span className="text-amber-700 text-[11px] ml-1">Flagged Photos</span>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <div>
              <span className="font-bold text-purple-900">{mergedCount}</span>
              <span className="text-purple-700 text-[11px] ml-1">Merged Duplicates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        {/* Department tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            onClick={() => setSelectedDept('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              selectedDept === 'ALL'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Departments ({grievances.length})
          </button>

          {Object.keys(DEPARTMENT_INFO).map((dCode) => {
            const info = DEPARTMENT_INFO[dCode];
            const count = grievances.filter((g) => g.departmentCode === dCode).length;
            return (
              <button
                key={dCode}
                onClick={() => setSelectedDept(dCode)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  selectedDept === dCode
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{dCode}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Status filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
            <span className="text-slate-400 text-xs hidden md:inline">Status:</span>
            {[
              { id: 'ALL', label: 'All Items' },
              { id: 'PENDING', label: 'Pending Action' },
              { id: 'CRITICAL', label: 'Critical Life Risk' },
              { id: 'SUSPICIOUS', label: 'Flagged / Tampered' },
              { id: 'MERGED', label: 'Merged Duplicates' },
              { id: 'RESOLVED', label: 'Resolved' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  statusFilter === st.id
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by docket, address, issue..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Grievance Table / Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Docket & Date</th>
                <th className="py-3 px-4">Grievance Issue & Location</th>
                <th className="py-3 px-4">Department & Sub-Category</th>
                <th className="py-3 px-4">AI Forensics</th>
                <th className="py-3 px-4">SLA / Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((g) => (
                <tr 
                  key={g.id} 
                  className={`hover:bg-slate-50/80 transition-colors ${
                    activeGrievanceDetail?.id === g.id ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-blue-900">{g.id}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(g.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-slate-900 line-clamp-1">{g.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{g.location.address}</div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-800">{g.departmentCode}</span>
                    <div className="text-[10px] text-slate-500">{g.subCategory}</div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    {g.imageForensics.isManipulated ? (
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        SUSPICIOUS ({g.imageForensics.manipulationConfidenceScore}%)
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        AUTHENTIC
                      </span>
                    )}
                    {g.duplicateDetection.isDuplicateCandidate && (
                      <span className="text-[10px] font-semibold text-purple-700 block mt-0.5">
                        Duplicate Candidate
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        g.status === 'RESOLVED'
                          ? 'bg-emerald-500'
                          : g.severity === 'CRITICAL'
                          ? 'bg-rose-500 animate-pulse'
                          : 'bg-blue-500'
                      }`}></span>
                      <span className="font-medium text-slate-800">{g.status.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="text-[10px] text-amber-700 font-mono mt-0.5">
                      SLA: {g.statutorySlaDays} Days
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                    <button
                      onClick={() => setActiveGrievanceDetail(g)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>

                    <button
                      onClick={() => onOpenRtiModal(g)}
                      className="px-2.5 py-1 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                      title="View Official Statutory Memo"
                    >
                      RTI Memo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              No grievance records found matching your filter criteria.
            </div>
          )}
        </div>
      </div>

      {/* DETAIL INSPECTION DRAWER / MODAL */}
      {activeGrievanceDetail && (
        <div className="bg-white border-2 border-blue-900 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {activeGrievanceDetail.id}
                </span>
                <span className="text-xs font-bold text-slate-600">
                  {activeGrievanceDetail.departmentName}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                {activeGrievanceDetail.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onInspectForensics(activeGrievanceDetail.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Forensics Sandbox</span>
              </button>

              <button
                onClick={() => onOpenRtiModal(activeGrievanceDetail)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View RTI Notice</span>
              </button>

              <button
                onClick={() => setActiveGrievanceDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Description & Action Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div>
                <strong className="text-slate-700">Citizen Description:</strong>
                <p className="text-slate-600 mt-1 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {activeGrievanceDetail.description}
                </p>
              </div>

              <div>
                <strong className="text-slate-700">Location & Coordinates:</strong>
                <div className="text-slate-600 mt-1">
                  {activeGrievanceDetail.location.address}, {activeGrievanceDetail.location.wardOrSector || ''}, {activeGrievanceDetail.location.district} (PIN: {activeGrievanceDetail.location.pinCode})
                </div>
                <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                  GPS: {activeGrievanceDetail.location.lat}° N, {activeGrievanceDetail.location.lng}° E
                </div>
              </div>

              <div>
                <strong className="text-slate-700">Applicant:</strong>
                <div className="text-slate-600 mt-0.5">
                  {activeGrievanceDetail.citizenName} ({activeGrievanceDetail.citizenPhone})
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <strong className="text-slate-700">Department Action Directives (AI Generated):</strong>
                <ol className="list-decimal list-inside space-y-1 mt-1 text-slate-700 bg-blue-50/50 p-3 rounded-lg border border-blue-200">
                  {activeGrievanceDetail.actionPlanSteps.map((st, idx) => (
                    <li key={idx}>{st}</li>
                  ))}
                </ol>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                <div className="font-semibold text-slate-800 mb-1">AI Image Verification:</div>
                <div className="text-slate-600">Rating: <strong>{activeGrievanceDetail.imageForensics.authenticityRating}</strong></div>
                <div className="text-slate-600">Manipulation Risk Score: <strong>{activeGrievanceDetail.imageForensics.manipulationConfidenceScore}%</strong></div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Summary: {activeGrievanceDetail.imageForensics.visualSummary}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Officer Redressal Actions */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Official CPIO Administrative Action
            </h4>

            <div>
              <label className="block text-xs text-slate-600 mb-1 font-medium">
                Official ATR Note / Field Update:
              </label>
              <input
                type="text"
                value={officerNote}
                onChange={(e) => setOfficerNote(e.target.value)}
                placeholder="e.g. Field Engineer Team #4 dispatched with road roller & bitumen mix..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => handleStatusChange('FIELD_WORK_DISPATCHED')}
                className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Dispatch Field Work Force
              </button>

              <button
                onClick={() => handleStatusChange('INVESTIGATING')}
                className="px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Mark Site Inspection Active
              </button>

              <button
                onClick={() => handleStatusChange('RESOLVED')}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Mark Redressed & Close Docket
              </button>

              <button
                onClick={() => handleStatusChange('MERGED_DUPLICATE')}
                className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Merge with Cluster
              </button>

              <button
                onClick={() => handleStatusChange('REJECTED_MANIPULATED')}
                className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Reject for Fraud / Tampering
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
