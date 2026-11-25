// Official Electronic Grievance Acknowledgment Slip shown after submitting a complaint.

import { useState } from "react";

export function ReceiptSlip({
  submissionResult,
  onViewGrievance,
  onViewLiveFeed,
  onReset,
}) {
  const [copiedDocket, setCopiedDocket] = useState(false);

  function handleCopyDocket() {
    navigator.clipboard.writeText(submissionResult.id);
    setCopiedDocket(true);
    setTimeout(() => setCopiedDocket(false), 2000);
  }

  return (
    <div className="bg-white border-2 border-[#138808] shadow-md p-6 space-y-6">
      {/* Header of Official Receipt */}
      <div className="border-b-2 border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            GOVERNMENT OF INDIA • MINISTRY OF PERSONNEL, PUBLIC GRIEVANCES &amp; PENSIONS
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-serif mt-0.5">
            OFFICIAL ELECTRONIC GRIEVANCE ACKNOWLEDGMENT SLIP
          </h3>
          <div className="text-xs text-slate-600 mt-1">
            Centralized Public Grievance Redress and Monitoring System (CPGRAMS)
          </div>
        </div>

        <div className="bg-[#EBF7EE] border border-[#138808] p-3 text-center sm:text-right shrink-0">
          <div className="text-xs font-bold text-[#138808] uppercase">
            STATUS: REGISTERED &amp; ROUTED
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-1.5 mt-0.5">
            <span className="text-xs font-mono font-bold text-slate-900">
              Docket #{submissionResult.id}
            </span>
            <button
              type="button"
              onClick={handleCopyDocket}
              className="px-1.5 py-0.5 text-[10px] font-bold bg-white hover:bg-slate-100 border border-[#138808] text-[#138808] cursor-pointer"
              title="Copy Docket ID"
            >
              {copiedDocket ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <div className="text-[10px] text-slate-600">
            Token: {submissionResult.token}
          </div>
        </div>
      </div>

      {/* SMS Alert Preview */}
      <div className="bg-slate-50 border-l-4 border-l-[#138808] border-y border-r border-slate-300 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">📱</span>
          <div className="text-xs">
            <span className="font-bold text-slate-900">Official SMS Dispatched to Citizen: </span>
            <span className="text-slate-700">
              "CPGRAMS Grievance #{submissionResult.id} registered for {submissionResult.departmentName}. Zonal unit alerted. Track live on pgportal.gov.in."
            </span>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300 shrink-0">
          SMS Delivered
        </span>
      </div>

      {/* Core Complaint Details Table */}
      <div className="border border-slate-300 overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <tbody>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="py-2.5 px-4 font-semibold text-slate-700 w-1/4 border-r border-slate-200">
                Grievance Subject:
              </th>
              <td className="py-2.5 px-4 font-bold text-slate-900">
                {submissionResult.title}
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <th className="py-2.5 px-4 font-semibold text-slate-700 border-r border-slate-200">
                Allocated Department:
              </th>
              <td className="py-2.5 px-4 font-bold text-[#0B3C5D]">
                {submissionResult.departmentName} ({submissionResult.departmentCode})
              </td>
            </tr>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="py-2.5 px-4 font-semibold text-slate-700 border-r border-slate-200">
                Designated CPIO:
              </th>
              <td className="py-2.5 px-4 text-slate-900">
                <span className="font-semibold">
                  {submissionResult.rtiResponse.designatedPio.name}
                </span>
                , {submissionResult.rtiResponse.designatedPio.designation} (
                {submissionResult.rtiResponse.designatedPio.officeAddress})
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <th className="py-2.5 px-4 font-semibold text-slate-700 border-r border-slate-200">
                Territorial Location:
              </th>
              <td className="py-2.5 px-4 text-slate-900">
                {submissionResult.location.address}, {submissionResult.location.wardOrSector},{" "}
                {submissionResult.location.district}, PIN: {submissionResult.location.pinCode}
              </td>
            </tr>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="py-2.5 px-4 font-semibold text-slate-700 border-r border-slate-200">
                Statutory Resolution SLA:
              </th>
              <td className="py-2.5 px-4 font-bold text-slate-900">
                {submissionResult.statutorySlaDays} Days Maximum (under{" "}
                {submissionResult.rtiResponse.statutorySection})
              </td>
            </tr>
            <tr>
              <th className="py-2.5 px-4 font-semibold text-slate-700 border-r border-slate-200">
                Government Gateway Dispatch:
              </th>
              <td className="py-2.5 px-4 text-slate-900">
                <span className="font-semibold text-[#138808]">
                  Directly Transmitted to CPGRAMS Central Hub (pgportal.gov.in)
                </span>{" "}
                • Reference: {submissionResult.governmentDispatch?.governmentRefNumber}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Departmental Action Steps */}
      <div className="bg-slate-50 border border-slate-300 p-4">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
          Official Departmental Action Directives Dispatched:
        </div>
        <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-800">
          {submissionResult.actionPlanSteps.map((step, idx) => (
            <li key={idx} className="leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Receipt Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
        <div className="text-[11px] text-slate-500">
          This is a computer-generated statutory acknowledgment and requires no physical signature.
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onViewGrievance(submissionResult.id)}
            className="px-5 py-2.5 bg-[#0B3C5D] hover:bg-[#082D46] text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xs border border-[#082D46]"
          >
            🔍 Track Live Status &amp; Field Team
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 border border-slate-400 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs cursor-pointer"
          >
            Print Slip
          </button>

          {onViewLiveFeed && (
            <button
              type="button"
              onClick={onViewLiveFeed}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-semibold text-xs cursor-pointer"
            >
              View in Live Stream
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
          >
            Lodge Another Grievance
          </button>
        </div>
      </div>
    </div>
  );
}
