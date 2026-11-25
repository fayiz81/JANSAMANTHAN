// Printable Official RTI Act 2005 Auto-Response Notice modal.

import { AshokaEmblem } from "./AshokaEmblem";
export const RtiDocumentModal = ({
  grievance,
  isOpen,
  onClose
}) => {
  if (!isOpen || !grievance) return null;
  const { rtiResponse } = grievance;
  const handlePrint = () => {
    window.print();
  };
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="bg-white max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-300 flex flex-col max-h-[92vh]">
        {/* Top Control Bar (Hidden during print) */}
        <div className="no-print bg-[#0B3C5D] text-white px-5 py-3 flex items-center justify-between border-b border-[#082D46] shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase tracking-wider">
              Official Statutory RTI Notice (Section 6 & 7 Compliant)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
    type="button"
    onClick={handlePrint}
    className="px-3 py-1.5 bg-[#FF9933] hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase cursor-pointer"
  >
              Print / Save PDF
            </button>

            <button
    type="button"
    onClick={onClose}
    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
    title="Close Notice"
  >
              Close [✕]
            </button>
          </div>
        </div>

        {/* Printable Official Government Document */}
        <div className="p-6 sm:p-10 overflow-y-auto print-page font-serif bg-white text-slate-900 text-xs sm:text-sm leading-relaxed space-y-6">
          {/* Government Crest & Header */}
          <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
            <div className="flex justify-center mb-1">
              <AshokaEmblem className="h-16 w-auto" size={64} />
            </div>

            <div className="text-base sm:text-lg font-bold tracking-widest uppercase">
              GOVERNMENT OF INDIA
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 uppercase tracking-wide">
              MINISTRY OF PERSONNEL, PUBLIC GRIEVANCES & PENSIONS (DARPG)
            </div>
            <div className="text-xs font-semibold text-[#0B3C5D]">
              {grievance.departmentName} ({grievance.departmentCode})
            </div>
            <div className="text-[11px] text-slate-600 font-sans">
              Centralised Public Grievance Redress And Monitoring System (CPGRAMS) • pgportal.gov.in
            </div>

            <div className="pt-2 text-[11px] font-sans font-bold text-slate-900 flex flex-wrap items-center justify-between border-t border-slate-200 mt-3 pt-2">
              <span>DOCKET NUMBER: <strong className="font-mono text-[#0B3C5D]">{grievance.id}</strong></span>
              <span>RTI TOKEN: <strong className="font-mono">{grievance.token}</strong></span>
              <span>STATUTORY SLA: <strong className="text-[#0B3C5D]">{grievance.statutorySlaDays} DAYS</strong></span>
            </div>
          </div>

          {/* Core Memorandum Body */}
          <div className="space-y-4 text-justify font-sans text-xs sm:text-sm">
            <div className="text-center font-bold text-sm uppercase underline">
              STATUTORY INTIMATION AND FIRST ACTION TAKEN REPORT (ATR) NOTICE
            </div>

            <p>
              <strong>To:</strong> {grievance.citizenName}
              <br />
              <strong>Address of Site:</strong> {grievance.location.address}, {grievance.location.wardOrSector}, {grievance.location.district}, PIN: {grievance.location.pinCode}
            </p>

            <p>
              <strong>Subject:</strong> Electronic Registration and Statutory Scrutiny of Public Grievance regarding <em>"{grievance.title}"</em> under Section 6(1) read with Section 7(1) Proviso of the Right to Information Act, 2005.
            </p>

            <p>
              1. This is to officially acknowledge receipt of your public grievance lodged electronically on the Central Portal. The grievance has been duly recorded on the Central Public Grievance Redress and Monitoring System (CPGRAMS) under Docket Number <strong>{grievance.id}</strong>.
            </p>

            <p>
              2. <strong>Competent Nodal Authority:</strong> The matter has been placed before the designated Central Public Information Officer (CPIO) and the Executive Engineer:
            </p>

            <div className="border border-slate-300 p-3 bg-slate-50 space-y-1">
              <div><strong>Designated CPIO:</strong> {rtiResponse.designatedPio.name}</div>
              <div><strong>Designation:</strong> {rtiResponse.designatedPio.designation}</div>
              <div><strong>Office Address:</strong> {rtiResponse.designatedPio.officeAddress}</div>
              <div><strong>Official Telephone:</strong> {rtiResponse.designatedPio.phone || "011-23092471"}</div>
              <div><strong>First Appellate Authority (FAA):</strong> {rtiResponse.firstAppellateAuthority.name}, {rtiResponse.firstAppellateAuthority.designation}</div>
            </div>

            <p>
              3. <strong>Statutory Redressal Timeline:</strong> In accordance with statutory norms, this public authority is bound to redress or report on the defect within <strong>{grievance.statutorySlaDays} days</strong>. For matters involving critical hazards to life and safety, fast-track mobilization of the Zonal Rapid Action Force has been initiated.
            </p>

            <p>
              4. <strong>Action Directives Dispatched:</strong>
            </p>

            <ol className="list-decimal list-inside space-y-1 bg-slate-50 p-3 border border-slate-200">
              {grievance.actionPlanSteps.map((step, idx) => <li key={idx} className="leading-relaxed">
                  {step}
                </li>)}
            </ol>

            <p>
              5. <strong>Right of Appeal:</strong> If you are aggrieved by any delay or non-redressal within the mandated period, you are entitled under Section 19(1) of the RTI Act 2005 to prefer an appeal to the First Appellate Authority named above.
            </p>
          </div>

          {/* Signature Block */}
          <div className="pt-8 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
            <div className="text-slate-500 text-[11px]">
              <div>System Generated Electronic Intimation</div>
              <div>Ref: NIC-CPGRAMS-GOV-DELHI-{grievance.departmentCode}</div>
            </div>

            <div className="text-right">
              <div className="font-bold text-slate-900">(Digital Signature of Authorized Nodal Officer)</div>
              <div className="text-slate-700">Central Public Information Officer (CPIO)</div>
              <div className="text-[11px] text-slate-500">Government of India / National Portal Switch</div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
