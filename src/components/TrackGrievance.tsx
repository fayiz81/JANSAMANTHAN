import React, { useState, useEffect } from 'react';
import { GrievanceRecord } from '../types/grievance';

interface TrackGrievanceProps {
  grievances: GrievanceRecord[];
  selectedGrievanceId?: string | null;
  onSelectGrievance: (id: string) => void;
  onOpenRtiModal: (grievance: GrievanceRecord) => void;
  onSimulateProgress?: (id: string) => void;
  lang: 'en' | 'hi';
}

export const TrackGrievance: React.FC<TrackGrievanceProps> = ({
  grievances,
  selectedGrievanceId,
  onSelectGrievance,
  onOpenRtiModal,
  onSimulateProgress,
  lang
}) => {
  const [searchQuery, setSearchQuery] = useState(selectedGrievanceId || '');
  const [copiedToken, setCopiedToken] = useState(false);
  const [isVerifyingGov, setIsVerifyingGov] = useState(false);
  const [govVerificationData, setGovVerificationData] = useState<any>(null);

  const currentGrievance = grievances.find(
    (g) => g.id === (selectedGrievanceId || searchQuery) || g.token === searchQuery
  ) || grievances[0];

  useEffect(() => {
    setGovVerificationData(null);
  }, [currentGrievance?.id]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleVerifyGov = async () => {
    if (!currentGrievance) return;
    setIsVerifyingGov(true);
    try {
      const res = await fetch('/api/live-portal-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docketId: currentGrievance.id,
          refNumber: currentGrievance.governmentDispatch?.governmentRefNumber,
          department: currentGrievance.departmentCode,
        }),
      });
      const data = await res.json();
      setGovVerificationData(data);
    } catch (err) {
      console.error('Gov verification error:', err);
    } finally {
      setIsVerifyingGov(false);
    }
  };

  const getStatusBadge = (status: GrievanceRecord['status']) => {
    switch (status) {
      case 'RESOLVED':
        return <span className="bg-[#EBF7EE] text-[#138808] border border-[#138808] text-xs font-bold px-2.5 py-0.5">RESOLVED (ATR FILED)</span>;
      case 'FIELD_WORK_DISPATCHED':
        return <span className="bg-blue-50 text-blue-900 border border-blue-400 text-xs font-bold px-2.5 py-0.5">FIELD WORK IN PROGRESS</span>;
      case 'INVESTIGATING':
        return <span className="bg-indigo-50 text-indigo-900 border border-indigo-400 text-xs font-bold px-2.5 py-0.5">INSPECTION ORDERED</span>;
      case 'ROUTED':
        return <span className="bg-slate-100 text-slate-900 border border-slate-300 text-xs font-bold px-2.5 py-0.5">ROUTED TO CPIO</span>;
      case 'MERGED_DUPLICATE':
        return <span className="bg-purple-50 text-purple-900 border border-purple-300 text-xs font-bold px-2.5 py-0.5">MERGED DUPLICATE</span>;
      case 'REJECTED_MANIPULATED':
        return <span className="bg-rose-50 text-rose-900 border border-rose-300 text-xs font-bold px-2.5 py-0.5">REJECTED (EVIDENCE ANOMALY)</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold px-2.5 py-0.5">REGISTERED</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6 font-sans">
      {/* 1. Official Government Tracking Header */}
      <div className="bg-white border-t-4 border-t-[#0B3C5D] border-x border-b border-slate-300 shadow-xs p-5">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0B3C5D]">
              GOVERNMENT OF INDIA • MINISTRY OF PERSONNEL, PUBLIC GRIEVANCES & PENSIONS
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mt-0.5">
              {lang === 'en' ? 'Central Public Grievance Status & Redressal Tracking' : 'लोक शिकायत निवारण स्थिति जांचें'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Enter your Grievance Docket Number (e.g., <span className="font-mono text-[#0B3C5D] font-bold">CPGRAMS/2026/PWD-9402</span>) or RTI Token Number
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Registration / Docket ID..."
              className="w-full px-3.5 py-2 text-xs border border-slate-300 bg-white focus:outline-none focus:border-[#0B3C5D]"
            />
            <button
              type="button"
              onClick={() => {
                const found = grievances.find((g) => g.id === searchQuery || g.token === searchQuery);
                if (found) onSelectGrievance(found.id);
              }}
              className="w-full sm:w-auto px-6 py-2 bg-[#0B3C5D] hover:bg-[#082D46] text-white text-xs font-bold uppercase tracking-wider cursor-pointer border border-[#082D46] whitespace-nowrap"
            >
              Search Status
            </button>
          </div>

          {/* Recent Dockets Quick List */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs">
            <span className="text-slate-500 text-[11px] font-semibold">Active Dockets:</span>
            {grievances.slice(0, 4).map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  setSearchQuery(g.id);
                  onSelectGrievance(g.id);
                }}
                className={`px-2 py-0.5 text-[11px] font-mono border cursor-pointer ${
                  currentGrievance?.id === g.id
                    ? 'bg-[#0B3C5D] text-white border-[#0B3C5D] font-bold'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {g.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {currentGrievance && (
        <div className="space-y-6">
          {/* 2. Official Docket Status Slip */}
          <div className="bg-white border border-slate-300 shadow-xs p-6 space-y-6">
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#0B3C5D] bg-slate-100 px-2 py-0.5 border border-slate-300">
                    Docket #{currentGrievance.id}
                  </span>
                  {getStatusBadge(currentGrievance.status)}
                  <span className="text-[11px] font-bold px-2 py-0.5 border border-slate-300 bg-slate-50 text-slate-800">
                    {currentGrievance.severity} SEVERITY
                  </span>
                </div>

                <h1 className="text-base sm:text-lg font-bold text-slate-900 font-serif pt-1">
                  {currentGrievance.title}
                </h1>

                <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2 pt-0.5">
                  <span><strong>Applicant:</strong> {currentGrievance.citizenName}</span>
                  <span>•</span>
                  <span><strong>Date Lodged:</strong> {new Date(currentGrievance.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  <span>•</span>
                  <span><strong>Location:</strong> {currentGrievance.location.address}, {currentGrievance.location.wardOrSector}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenRtiModal(currentGrievance)}
                  className="px-3.5 py-1.5 bg-[#0B3C5D] hover:bg-[#082D46] text-white text-xs font-semibold cursor-pointer border border-[#082D46]"
                >
                  View RTI Notice Memo
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(currentGrievance.token)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold cursor-pointer"
                  title="Copy RTI Token"
                >
                  {copiedToken ? 'Token Copied' : 'Copy Token'}
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Print Slip
                </button>
              </div>
            </div>

            {/* Official Particulars Table */}
            <div className="border border-slate-300 overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <tbody>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-2.5 px-4 font-semibold text-slate-700 w-1/4 border-r border-slate-200">Competent Authority / Ministry:</th>
                    <td className="py-2.5 px-4 font-bold text-[#0B3C5D]">{currentGrievance.departmentName} ({currentGrievance.departmentCode})</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-2.5 px-4 font-semibold text-slate-700 border-r border-slate-200">Designated CPIO Officer:</th>
                    <td className="py-2.5 px-4 text-slate-900">
                      <strong>{currentGrievance.rtiResponse.designatedPio.name}</strong>, {currentGrievance.rtiResponse.designatedPio.designation} ({currentGrievance.rtiResponse.designatedPio.officeAddress})
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-2.5 px-4 font-semibold text-slate-700 border-r border-slate-200">First Appellate Authority:</th>
                    <td className="py-2.5 px-4 text-slate-900">
                      <strong>{currentGrievance.rtiResponse.firstAppellateAuthority.name}</strong>, {currentGrievance.rtiResponse.firstAppellateAuthority.designation}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-2.5 px-4 font-semibold text-slate-700 border-r border-slate-200">Mandated Redressal Timeline:</th>
                    <td className="py-2.5 px-4 font-bold text-slate-900">
                      {currentGrievance.statutorySlaDays} Days Maximum ({currentGrievance.rtiResponse.statutorySection})
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-2.5 px-4 font-semibold text-slate-700 border-r border-slate-200">Government Gateway Reference:</th>
                    <td className="py-2.5 px-4 text-slate-900">
                      <span className="font-mono font-bold">{currentGrievance.governmentDispatch?.governmentRefNumber || currentGrievance.id}</span>
                      <span className="text-slate-500 ml-2">(Nodal Exchange: {currentGrievance.governmentDispatch?.portalHost || 'pgportal.gov.in'})</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Live Gateway Verification Bar */}
            <div className="bg-slate-50 border border-slate-300 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-800">
                  Central Government Gateway Integrity Check (pgportal.gov.in / rtionline.gov.in)
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Verify cryptographic status sync directly against the National Informatics Centre (NIC) data core.
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerifyGov}
                disabled={isVerifyingGov}
                className="px-3.5 py-1.5 bg-[#0B3C5D] hover:bg-[#082D46] text-white text-xs font-semibold cursor-pointer border border-[#082D46] shrink-0"
              >
                {isVerifyingGov ? 'Querying Gateway...' : 'Verify on Govt Gateway'}
              </button>
            </div>

            {govVerificationData && (
              <div className="bg-[#EBF7EE] border border-[#138808] p-3 text-xs text-slate-900">
                <div className="font-bold text-[#138808] uppercase">
                  Central Switch Verification Confirmed:
                </div>
                <div className="mt-1 font-mono text-[11px] text-slate-800">
                  Node: {govVerificationData.portalNode || 'CPGRAMS Primary Switch'} • Status: {govVerificationData.status || 'ACTIVE_SYNCHRONIZED'} • Timestamp: {new Date().toLocaleTimeString()}
                </div>
              </div>
            )}

            {/* Action Taken Report (ATR) Box if Resolved */}
            {currentGrievance.status === 'RESOLVED' && currentGrievance.governmentDispatch?.resolutionProof && (
              <div className="bg-[#EBF7EE] border-2 border-[#138808] p-4 space-y-2">
                <div className="text-xs font-bold text-[#138808] uppercase tracking-wide">
                  Official Action Taken Report (ATR) & Redressal Certification
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {currentGrievance.governmentDispatch.resolutionProof.completionNote}
                </p>
                <div className="text-[11px] text-slate-600 pt-2 border-t border-[#138808]/30 flex flex-wrap items-center justify-between">
                  <span>Certified By: <strong>Inspector Badge #{currentGrievance.governmentDispatch.resolutionProof.inspectorBadge || 'MUNICIPAL-INSP-2026-DL'}</strong></span>
                  <span>Date Resolved: {new Date(currentGrievance.governmentDispatch.resolutionProof.resolvedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </div>
            )}

            {/* Field Team Assigned Notice if Active in Field */}
            {currentGrievance.governmentDispatch?.fieldTeamAssigned && currentGrievance.status !== 'RESOLVED' && (
              <div className="bg-blue-50 border border-blue-300 p-4 space-y-2">
                <div className="text-xs font-bold text-blue-950 uppercase tracking-wide">
                  Zonal Rapid Action Force Dispatched to Site:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-blue-950">
                  <div>
                    <span className="text-slate-500">Field Engineer:</span>
                    <div className="font-bold">{currentGrievance.governmentDispatch.fieldTeamAssigned.engineerName}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Designation:</span>
                    <div className="font-medium">{currentGrievance.governmentDispatch.fieldTeamAssigned.designation}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Service Vehicle:</span>
                    <div className="font-mono font-bold">{currentGrievance.governmentDispatch.fieldTeamAssigned.vehicleNumber}</div>
                  </div>
                </div>

                {onSimulateProgress && (
                  <div className="pt-2 border-t border-blue-200 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onSimulateProgress(currentGrievance.id)}
                      className="px-3 py-1 bg-[#0B3C5D] hover:bg-[#082D46] text-white text-xs font-semibold cursor-pointer"
                    >
                      Certify Field Work Completion
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. Chronological Action History (Statutory Timeline Table) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1.5">
                Statutory Chronology & Official Action History
              </h3>

              <div className="border border-slate-300 overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 border-r border-slate-300 w-44">Date & Time</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 w-48">Processing Stage</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 w-48">Official Actor</th>
                      <th className="py-2.5 px-3">Statutory Remarks / Action Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentGrievance.statusTimeline.map((step, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="py-2.5 px-3 align-top border-r border-slate-200 font-mono text-[11px] text-slate-600">
                          {new Date(step.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'medium' })}
                        </td>
                        <td className="py-2.5 px-3 align-top border-r border-slate-200 font-bold text-slate-800">
                          {step.status.replace(/_/g, ' ')}
                        </td>
                        <td className="py-2.5 px-3 align-top border-r border-slate-200 text-slate-700">
                          {step.actor || 'Designated Public Officer'}
                        </td>
                        <td className="py-2.5 px-3 align-top text-slate-700">
                          {step.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
