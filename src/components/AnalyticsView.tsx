import React from 'react';
import { GrievanceRecord } from '../types/grievance';
import { DEPARTMENT_INFO } from '../data/seedGrievances';

interface AnalyticsViewProps {
  grievances: GrievanceRecord[];
  lang: 'en' | 'hi';
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ grievances, lang }) => {
  const total = grievances.length;
  const resolved = grievances.filter((g) => g.status === 'RESOLVED').length;
  const inField = grievances.filter((g) => g.status === 'FIELD_WORK_DISPATCHED').length;
  const critical = grievances.filter((g) => g.severity === 'CRITICAL').length;
  const manipulated = grievances.filter((g) => g.imageForensics.isManipulated).length;
  const duplicates = grievances.filter((g) => g.status === 'MERGED_DUPLICATE').length;

  const resolutionRate = total > 0 ? Math.round(((resolved + inField) / total) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6 font-sans">
      {/* 1. Official Header */}
      <div className="bg-white border-t-4 border-t-[#0B3C5D] border-x border-b border-slate-300 shadow-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0B3C5D]">
              GOVERNMENT OF INDIA • PROACTIVE STATUTORY DISCLOSURE (SECTION 4(1)(B) RTI ACT 2005)
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mt-0.5">
              {lang === 'en' 
                ? 'Citizen’s Charter & Departmental Redressal Performance Audit' 
                : 'नागरिक अधिकार पत्र एवं विभागीय निवारण निष्पादन लेखापरीक्षा'}
            </h2>
            <div className="text-xs text-slate-600 mt-0.5">
              Annual and Monthly Grievance Redressal Compliance Metrics under CPGRAMS Guidelines
            </div>
          </div>

          <div className="bg-[#EBF7EE] border border-[#138808] px-3 py-1.5 text-xs text-[#138808] font-bold">
            Section 4 Proactive Compliance: 99.2%
          </div>
        </div>

        {/* 2. Key Administrative Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="bg-slate-50 border border-slate-300 p-3">
            <div className="text-[10px] text-slate-600 uppercase font-bold">Total Dockets Lodged</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{total}</div>
            <div className="text-[10px] text-slate-500 mt-1">100% Electronically Recorded</div>
          </div>

          <div className="bg-[#EBF7EE] border border-[#138808] p-3">
            <div className="text-[10px] text-[#138808] uppercase font-bold">Disposal & Active SLA Rate</div>
            <div className="text-xl font-bold font-mono text-[#138808] mt-0.5">{resolutionRate}%</div>
            <div className="text-[10px] text-slate-600 mt-1">Average Turnaround: 2.8 Days</div>
          </div>

          <div className="bg-[#FFF2F2] border border-[#E57373] p-3">
            <div className="text-[10px] text-[#B71C1C] uppercase font-bold">Evidence Inquiries Flagged</div>
            <div className="text-xl font-bold font-mono text-[#B71C1C] mt-0.5">{manipulated}</div>
            <div className="text-[10px] text-slate-600 mt-1">Sec 65B Integrity Failures</div>
          </div>

          <div className="bg-[#FFFDF2] border border-[#E6D8A8] p-3">
            <div className="text-[10px] text-[#8A5A00] uppercase font-bold">Deduplicated Submissions</div>
            <div className="text-xl font-bold font-mono text-[#8A5A00] mt-0.5">{duplicates}</div>
            <div className="text-[10px] text-slate-600 mt-1">Unified to Lead Docket</div>
          </div>
        </div>
      </div>

      {/* 3. Departmental Performance Breakdown Table */}
      <div className="bg-white border border-slate-300 shadow-xs p-5 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
          Departmental SLA Compliance & Redressal Performance (Citizen Charter)
        </div>

        <div className="border border-slate-300 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#0B3C5D] text-white font-bold uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3 border-r border-[#082D46]">Department / Body</th>
                <th className="py-2.5 px-3 border-r border-[#082D46]">Code</th>
                <th className="py-2.5 px-3 border-r border-[#082D46]">Charter SLA Limit</th>
                <th className="py-2.5 px-3 border-r border-[#082D46]">Recorded Dockets</th>
                <th className="py-2.5 px-3 border-r border-[#082D46]">Closed / ATR Filed</th>
                <th className="py-2.5 px-3">Compliance Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {Object.keys(DEPARTMENT_INFO).map((dCode, idx) => {
                const info = DEPARTMENT_INFO[dCode];
                const deptGrievances = grievances.filter((g) => g.departmentCode === dCode);
                const deptTotal = deptGrievances.length;
                const deptResolved = deptGrievances.filter((g) => g.status === 'RESOLVED').length;
                const ratio = deptTotal > 0 ? Math.round((deptResolved / deptTotal) * 100) : 100;

                const deptSla = deptGrievances[0]?.statutorySlaDays || (dCode === 'POWER_DISCOM' ? 2 : dCode === 'PWD' ? 3 : 7);

                return (
                  <tr key={dCode} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="py-2.5 px-3 align-top border-r border-slate-200 font-bold text-slate-900">
                      {info.name}
                    </td>
                    <td className="py-2.5 px-3 align-top border-r border-slate-200 font-mono text-slate-700">
                      {dCode}
                    </td>
                    <td className="py-2.5 px-3 align-top border-r border-slate-200 text-slate-800">
                      {deptSla} Days
                    </td>
                    <td className="py-2.5 px-3 align-top border-r border-slate-200 font-mono text-slate-900">
                      {deptTotal}
                    </td>
                    <td className="py-2.5 px-3 align-top border-r border-slate-200 font-mono text-[#138808] font-bold">
                      {deptResolved}
                    </td>
                    <td className="py-2.5 px-3 align-top font-bold">
                      <span className={ratio >= 50 ? 'text-[#138808]' : 'text-amber-700'}>
                        {ratio}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
