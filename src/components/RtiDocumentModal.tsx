import React from 'react';
import { GrievanceRecord } from '../types/grievance';
import { X, Printer, ShieldCheck, Download, CheckCircle, Scale, Calendar, FileText } from 'lucide-react';

interface RtiDocumentModalProps {
  grievance: GrievanceRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RtiDocumentModal: React.FC<RtiDocumentModalProps> = ({
  grievance,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !grievance) return null;

  const { rtiResponse, imageForensics, duplicateDetection } = grievance;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Top Control Bar (Hidden during print) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">
              Official Statutory RTI Auto-Response Notice (Sec 6 & 7)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Government Gazette Document */}
        <div className="p-6 sm:p-10 overflow-y-auto print-page font-serif-gov bg-white text-slate-900 text-xs sm:text-sm leading-relaxed space-y-6">
          {/* Government Crest & Header */}
          <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
            <div className="flex justify-center mb-1">
              {/* National Crest Emblem */}
              <div className="w-14 h-14 text-slate-900 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.54-3.14 8.79-7 9.87-3.86-1.08-7-5.33-7-9.87v-4.7l7-3.12zm-1 5.82v6h2v-6h-2zm0 8v2h2v-2h-2z" />
                </svg>
              </div>
            </div>

            <div className="text-base sm:text-lg font-bold tracking-widest uppercase">
              GOVERNMENT OF INDIA / STATE PUBLIC ADMINISTRATION
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 uppercase tracking-wide">
              {rtiResponse.publicAuthorityName}
            </div>
            <div className="text-[11px] text-slate-600 font-sans">
              Right to Information Act, 2005 (Act No. 22 of 2005) • JanSamadhan Civic Redressal Portal
            </div>

            <div className="pt-2 text-[11px] font-sans font-bold text-slate-900 flex flex-wrap items-center justify-between border-t border-slate-200 mt-3 pt-2">
              <span>DISPATCH REF NO: <strong className="font-mono text-blue-900">{rtiResponse.referenceId}</strong></span>
              <span>DATE OF ISSUE: <strong>{rtiResponse.acknowledgementDate}</strong></span>
              <span>STATUTORY TIMELINE: <strong className="text-amber-800">{grievance.statutorySlaDays} DAYS (Due: {rtiResponse.statutoryDeadline})</strong></span>
            </div>
          </div>

          {/* Barcode / Tracking Header Strip */}
          <div className="flex items-center justify-between border border-slate-300 p-3 bg-slate-50 font-sans rounded">
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-bold">Unique Tracking Token</div>
              <div className="text-sm font-mono font-bold text-slate-900">{grievance.token}</div>
              <div className="text-[11px] text-slate-600">Geo-tag: {grievance.location.lat}° N, {grievance.location.lng}° E ({grievance.location.district})</div>
            </div>

            {/* Simulated 2D Barcode */}
            <div className="text-right">
              <div className="inline-block p-1 bg-white border border-slate-300 rounded">
                <div className="w-16 h-8 bg-repeating-linear-gradient flex items-center justify-center font-mono text-[9px] tracking-widest text-slate-600">
                  ||||| | |||| |
                </div>
              </div>
              <div className="text-[9px] text-slate-500 font-mono">DIGITALLY SEALED</div>
            </div>
          </div>

          {/* Addressed To */}
          <div className="font-sans text-xs space-y-1">
            <div className="font-bold uppercase text-slate-800">TO THE APPLICANT / AGGRIEVED CITIZEN:</div>
            <div className="font-semibold text-slate-900">{grievance.citizenName}</div>
            <div className="text-slate-600">Location: {grievance.location.address}, {grievance.location.wardOrSector || ''}, {grievance.location.district} - {grievance.location.pinCode}</div>
          </div>

          {/* Subject Line */}
          <div className="bg-slate-100 p-3 border-l-4 border-slate-800 font-sans">
            <span className="font-bold text-slate-900">SUBJECT: </span>
            <span className="font-semibold text-slate-800">{rtiResponse.subjectLine}</span>
            <div className="text-xs text-slate-600 mt-1">
              Applicable Section: <strong className="text-blue-900">{rtiResponse.statutorySection}</strong>
            </div>
          </div>

          {/* Main Legal Body Text */}
          <div className="font-sans space-y-3 text-slate-800 text-xs sm:text-sm">
            <p>Sir/Madam,</p>
            <p className="leading-relaxed">
              {rtiResponse.acknowledgementText}
            </p>
            <p className="leading-relaxed">
              <strong>PRELIMINARY ADMINISTRATIVE ACTION TAKEN: </strong>
              {rtiResponse.preliminaryAction}
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1.5 my-3">
              <div className="font-bold text-xs uppercase tracking-wide text-slate-700">
                Action Directives & Engineering Tasks Mobilized:
              </div>
              <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700">
                {grievance.actionPlanSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="font-bold text-xs uppercase text-slate-800">
                STATUTORY CLAUSES & DISCLOSURE NOTICES:
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                {rtiResponse.legalNoticeClauses.map((clause, idx) => (
                  <li key={idx}>{clause}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Forensic Integrity Seal */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 font-sans flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Digital Forensic Verification Seal</div>
                <div className="text-slate-500 text-[11px]">
                  Integrity Rating: <span className="font-semibold text-emerald-800">{imageForensics.authenticityRating}</span> ({imageForensics.manipulationConfidenceScore}% Authentic)
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 sm:text-right">
              <div>Duplicate Analysis: <span className="font-semibold">{duplicateDetection.duplicateRisk} Risk</span></div>
              <div>Inspection Window: <span className="font-semibold">{rtiResponse.inspectionScheduled?.inspectionWindow || 'Within SLA'}</span></div>
            </div>
          </div>

          {/* Signatures & PIO Stamp Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-300 font-sans text-xs">
            {/* Designated CPIO Particulars */}
            <div className="space-y-1">
              <div className="font-bold uppercase text-slate-700 text-[11px]">
                ISSUING AUTHORITY (CENTRAL PIO):
              </div>
              <div className="font-bold text-slate-900">{rtiResponse.designatedPio.name}</div>
              <div className="text-slate-600">{rtiResponse.designatedPio.designation}</div>
              <div className="text-slate-600">{rtiResponse.designatedPio.department}</div>
              <div className="text-slate-600">Email: {rtiResponse.designatedPio.contactEmail}</div>
              <div className="text-slate-600">Phone: {rtiResponse.designatedPio.phone}</div>
              <div className="text-slate-500 text-[11px]">{rtiResponse.designatedPio.officeAddress}</div>
            </div>

            {/* Official Stamp & Appellate Authority */}
            <div className="flex flex-col sm:items-end justify-between space-y-4">
              {/* Seal Stamp */}
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-blue-900/40 p-2 flex items-center justify-center text-center text-[10px] text-blue-900 uppercase font-bold transform -rotate-6">
                <div>
                  <div>★ JAN-SAMADHAN ★</div>
                  <div className="text-[8px] my-1 font-mono">{rtiResponse.referenceId}</div>
                  <div>RTI ACT 2005</div>
                  <div>E-SEALED</div>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-600">
                <div className="font-bold uppercase text-slate-700">FIRST APPELLATE AUTHORITY:</div>
                <div className="font-semibold text-slate-900">{rtiResponse.firstAppellateAuthority.name}</div>
                <div>{rtiResponse.firstAppellateAuthority.designation}</div>
                <div className="text-slate-500">{rtiResponse.firstAppellateAuthority.officeAddress}</div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center border-t border-slate-200 pt-3 text-[10px] font-sans text-slate-500">
            This is an electronically generated statutory memo under the Information Technology Act 2000 and Right to Information Act 2005. No physical signature is required.
          </div>
        </div>
      </div>
    </div>
  );
};
