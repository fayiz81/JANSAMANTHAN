import React, { useState } from 'react';
import { GrievanceRecord } from '../types/grievance';
import { CivicGroundingPanel } from './CivicGroundingPanel';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Building, 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  MapPin, 
  ArrowRight,
  ExternalLink,
  Printer,
  Copy,
  Check,
  AlertTriangle,
  Layers,
  Radio,
  HardHat,
  Truck,
  FileCheck2,
  Camera,
  Sparkles
} from 'lucide-react';

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

  // Active tracked grievance
  const currentGrievance = grievances.find(
    (g) => g.id === (selectedGrievanceId || searchQuery) || g.token === searchQuery
  ) || grievances[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const getStatusBadge = (status: GrievanceRecord['status']) => {
    switch (status) {
      case 'RESOLVED':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">RESOLVED</span>;
      case 'FIELD_WORK_DISPATCHED':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-300">FIELD WORK DISPATCHED</span>;
      case 'INVESTIGATING':
        return <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-300">INSPECTION IN PROGRESS</span>;
      case 'ROUTED':
        return <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-sky-300">ROUTED TO CPIO</span>;
      case 'MERGED_DUPLICATE':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-300">MERGED DUPLICATE</span>;
      case 'REJECTED_MANIPULATED':
        return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-300">REJECTED (MANIPULATED)</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-300">SUBMITTED</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Search Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {lang === 'en' ? 'Track Civic Grievance & Statutory RTI Docket' : 'शिकायत एवं आरटीआई स्थिति खोजें'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter Docket Reference ID (e.g. <span className="font-mono text-blue-700">GRV-2026-PWD-8402</span>) or RTI Token
            </p>
          </div>

          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Docket ID or Token (e.g., RTI-2026-PWD-8402)..."
              className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            {currentGrievance && currentGrievance.id !== searchQuery && (
              <button
                onClick={() => setSearchQuery(currentGrievance.id)}
                className="absolute right-2 px-3 py-1 bg-blue-900 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Track
              </button>
            )}
          </div>

          {/* Quick Recent Selection Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs">
            <span className="text-slate-500 text-[11px]">Recent Dockets:</span>
            {grievances.slice(0, 4).map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setSearchQuery(g.id);
                  onSelectGrievance(g.id);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  currentGrievance?.id === g.id
                    ? 'bg-blue-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {g.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {currentGrievance ? (
        <div className="space-y-6">
          {/* Main Docket Status Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            {/* Top row: Title & Action buttons */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                    {currentGrievance.id}
                  </span>
                  {getStatusBadge(currentGrievance.status)}
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    currentGrievance.severity === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-800'
                      : currentGrievance.severity === 'HIGH'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {currentGrievance.severity} SEVERITY
                  </span>
                </div>

                <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {currentGrievance.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentGrievance.location.address}, {currentGrievance.location.district}</span>
                  </div>
                  <div>•</div>
                  <div>Lodged: {new Date(currentGrievance.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                  <div>•</div>
                  <div>Applicant: <strong className="text-slate-700">{currentGrievance.citizenName}</strong></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onOpenRtiModal(currentGrievance)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>View RTI Notice</span>
                </button>

                <button
                  onClick={() => handleCopy(currentGrievance.token)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  title="Copy Tracking Token"
                >
                  {copiedToken ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedToken ? 'Copied' : 'Token'}</span>
                </button>
              </div>
            </div>

            {/* DUPLICATE ALERT BANNER IF MERGED */}
            {currentGrievance.status === 'MERGED_DUPLICATE' && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
                <Layers className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-purple-900">
                    Consolidated with Lead Docket #{currentGrievance.parentGrievanceId || 'GRV-2026-PWD-8402'}
                  </div>
                  <p className="text-purple-800 leading-relaxed">
                    Our spatial duplicate detector identified an identical civic incident reported 35 meters away. To maximize municipal resources and prevent double billing, this ticket is synchronized with the primary field repair crew.
                  </p>
                </div>
              </div>
            )}

            {/* MANIPULATED PHOTO ALERT IF REJECTED */}
            {currentGrievance.status === 'REJECTED_MANIPULATED' && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-rose-900">
                    Application Flagged & Terminated under Section 8(1)
                  </div>
                  <p className="text-rose-800 leading-relaxed">
                    AI Visual Forensics flagged photographic evidence as digitally altered or synthetic (Score: {currentGrievance.imageForensics.manipulationConfidenceScore}%). Public funds cannot be mobilized for fabricated civic claims.
                  </p>
                </div>
              </div>
            )}

            {/* LIVE GOVERNMENT DEPARTMENT DISPATCH STATUS & GATEWAY */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <div>
                    <h3 className="text-sm font-bold tracking-tight">
                      Live Government Department Dispatch Gateway
                    </h3>
                    <div className="text-[11px] text-blue-200">
                      Direct Gateway: <strong className="text-white">{currentGrievance.governmentDispatch?.governmentPortal || 'CPGRAMS Nodal Exchange'}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/30">
                    Ref: {currentGrievance.governmentDispatch?.governmentRefNumber || currentGrievance.id}
                  </span>

                  {onSimulateProgress && currentGrievance.status !== 'RESOLVED' && currentGrievance.status !== 'REJECTED_MANIPULATED' && (
                    <button
                      onClick={() => onSimulateProgress(currentGrievance.id)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                      title="Advance field engineer repair progress"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Simulate Field Action</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Transmission Pipeline Step Indicator */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className={`p-2.5 rounded-xl border ${
                  currentGrievance.governmentDispatch?.isDirectlyDispatched
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Step 1</div>
                  <div className="font-semibold text-white flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Delivered to Ministry
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  currentGrievance.status !== 'SUBMITTED'
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Step 2</div>
                  <div className="font-semibold text-white flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Ward CPIO Assigned
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  currentGrievance.status === 'FIELD_WORK_DISPATCHED' || currentGrievance.status === 'RESOLVED'
                    ? 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Step 3</div>
                  <div className="font-semibold text-white flex items-center gap-1 mt-0.5">
                    <HardHat className="w-3.5 h-3.5 text-amber-400" />
                    {currentGrievance.status === 'RESOLVED' ? 'Repair Completed' : 'Field Crew on Site'}
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  currentGrievance.status === 'RESOLVED'
                    ? 'bg-emerald-600 text-white font-bold border-emerald-400 shadow-md'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}>
                  <div className="text-[10px] uppercase font-bold opacity-80">Step 4</div>
                  <div className="font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {currentGrievance.status === 'RESOLVED' ? 'Closed & Verified (ATR)' : 'Pending Final Close'}
                  </div>
                </div>
              </div>

              {/* Active Field Team OR Resolution Proof banner */}
              {currentGrievance.status === 'RESOLVED' && currentGrievance.governmentDispatch?.resolutionProof ? (
                <div className="bg-emerald-900/40 border border-emerald-500/40 rounded-xl p-3.5 text-xs space-y-2">
                  <div className="flex items-center justify-between text-emerald-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Official Government Action Taken Report (ATR) - Redressed & Solved
                    </span>
                    <span className="text-[11px] font-mono text-emerald-200">
                      Inspector Seal: {currentGrievance.governmentDispatch.resolutionProof.inspectorBadge}
                    </span>
                  </div>
                  <p className="text-emerald-100 leading-relaxed text-xs">
                    "{currentGrievance.governmentDispatch.resolutionProof.completionNote}"
                  </p>
                  <div className="text-[10px] text-emerald-300 font-mono">
                    Official Closure Timestamp: {new Date(currentGrievance.governmentDispatch.resolutionProof.resolvedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
              ) : currentGrievance.governmentDispatch?.fieldTeamAssigned ? (
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <HardHat className="w-3.5 h-3.5 text-amber-400" />
                      <span>Assigned Field Engineer: {currentGrievance.governmentDispatch.fieldTeamAssigned.engineerName}</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {currentGrievance.governmentDispatch.fieldTeamAssigned.designation} • Vehicle: {currentGrievance.governmentDispatch.fieldTeamAssigned.vehicleNumber || 'Municipal Vehicle'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold px-2.5 py-1 rounded">
                      Live ETA: ~{currentGrievance.governmentDispatch.fieldTeamAssigned.etaMinutes || 20} Mins
                    </span>
                    <a
                      href={`tel:${currentGrievance.governmentDispatch.fieldTeamAssigned.contactPhone}`}
                      className="text-xs font-semibold text-blue-300 hover:text-blue-200 underline"
                    >
                      Call Helpline
                    </a>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Verified Step-by-Step Timeline Tracker */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Verified Redressal Audit Trail & Timeline
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {currentGrievance.statusTimeline.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Step Icon */}
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-900 text-white flex items-center justify-center ring-4 ring-white">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1 hover:border-blue-300 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                        <span className="font-bold text-slate-800 uppercase tracking-wide">
                          {step.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-slate-500">
                          {new Date(step.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {step.note}
                      </p>
                      <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                        Authorized Actor: <span className="font-medium text-slate-700">{step.actor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two-Column Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              {/* Left Column: Department & SLA details */}
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wide">
                    <Building className="w-4 h-4 text-blue-600" />
                    <span>Nodal Public Authority & CPIO</span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-slate-900 text-sm">
                      {currentGrievance.departmentName}
                    </div>
                    <div className="text-slate-600">
                      Sub-Category: <strong className="text-slate-800">{currentGrievance.subCategory}</strong>
                    </div>
                    <div className="text-slate-600">
                      CPIO: <strong className="text-slate-800">{currentGrievance.rtiResponse.designatedPio.name}</strong> ({currentGrievance.rtiResponse.designatedPio.designation})
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Email: {currentGrievance.rtiResponse.designatedPio.contactEmail} • Tel: {currentGrievance.rtiResponse.designatedPio.phone}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Office: {currentGrievance.rtiResponse.designatedPio.officeAddress}
                    </div>
                  </div>
                </div>

                {/* SLA Timer */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" />
                      Statutory SLA Deadline
                    </span>
                    <span className="font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded font-mono">
                      {currentGrievance.statutorySlaDays} Days Turnaround
                    </span>
                  </div>

                  <p className="text-xs text-amber-900 leading-relaxed">
                    Mandated under <strong className="font-medium">{currentGrievance.rtiResponse.statutorySection}</strong>. Public Authority must dispatch action report or information by <strong>{currentGrievance.rtiResponse.statutoryDeadline}</strong>.
                  </p>
                </div>
              </div>

              {/* Right Column: Visual Photo Evidence & AI Forensics */}
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      AI Visual Forensics Audit
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      currentGrievance.imageForensics.isManipulated
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {currentGrievance.imageForensics.authenticityRating}
                    </span>
                  </div>

                  {/* Photo Display */}
                  {currentGrievance.imageUrl && (
                    <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-black max-h-48">
                      <img 
                        src={currentGrievance.imageUrl} 
                        alt="Evidence" 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-[10px] text-white flex items-center justify-between">
                        <span>{currentGrievance.imageForensics.exifData?.cameraModel || 'Optical Camera'}</span>
                        <span>{currentGrievance.imageForensics.exifData?.timestamp || 'Captured on Site'}</span>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-slate-700 space-y-1.5">
                    <div>
                      <strong>Visual Summary: </strong>
                      {currentGrievance.imageForensics.visualSummary}
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-200">
                      <div>• Forensic Score: <strong>{currentGrievance.imageForensics.manipulationConfidenceScore}%</strong></div>
                      <div>• Synthetic/AI Probability: <strong>{currentGrievance.imageForensics.aiGeneratedProbability}%</strong></div>
                      <div>• Duplicate Risk Level: <strong>{currentGrievance.duplicateDetection.duplicateRisk}</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GOOGLE MAPS & GOOGLE SEARCH GROUNDING PANEL */}
          <CivicGroundingPanel
            initialLat={currentGrievance.location.lat}
            initialLng={currentGrievance.location.lng}
            initialAddress={currentGrievance.location.address}
            initialDistrict={currentGrievance.location.district}
            initialDepartment={currentGrievance.departmentCode}
            lang={lang}
          />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
          No grievance found matching query. Please verify the docket ID.
        </div>
      )}
    </div>
  );
};
