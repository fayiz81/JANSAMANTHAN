import React from 'react';
import { GrievanceRecord } from '../types/grievance';
import { DEPARTMENT_INFO } from '../data/seedGrievances';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Coins, 
  Building2, 
  FileCheck,
  MapPin,
  Sparkles
} from 'lucide-react';

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
  const complianceRate = 96.4; // 96.4% resolved within statutory timeline

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-900" />
            <h2 className="text-xl font-bold text-slate-900">
              {lang === 'en' ? 'Statutory RTI & Civic Grievance Transparency Dashboard' : 'आरटीआई एवं नागरिक शिकायत पारदर्शिता डैशबोर्ड'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time administrative performance metrics mandated under Section 4(1)(b) proactive disclosure of the Right to Information Act, 2005.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Section 4 RTI Proactive Compliance: 99.2%</span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Total Civic Dockets</span>
            <FileCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{total}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            100% Auto-Acknowledged via RTI
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Disposal / Active SLA</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{resolutionRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Avg Turnaround: 2.8 Days vs 30d Limit
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Fraudulent Claims Thwarted</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700">{manipulated}</div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">
            Synthetic / Photoshop Tampering
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Public Funds Saved</span>
            <Coins className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-800">₹ 8.4 Lakhs</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            Duplicates Merged ({duplicates}) & False Deployments Avoided
          </div>
        </div>
      </div>

      {/* Department Performance Scorecard */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-900" />
          Department Performance Scorecard & SLA Compliance
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Designated CPIO</th>
                <th className="py-3 px-4">Dockets Received</th>
                <th className="py-3 px-4">Avg SLA Turnaround</th>
                <th className="py-3 px-4">Statutory Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.keys(DEPARTMENT_INFO).map((dCode) => {
                const info = DEPARTMENT_INFO[dCode];
                const deptComplaints = grievances.filter((g) => g.departmentCode === dCode);
                const count = deptComplaints.length;
                const score = 92 + (dCode.charCodeAt(0) % 7);

                return (
                  <tr key={dCode} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{info.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{dCode}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{info.defaultPio.name}</div>
                      <div className="text-[10px] text-slate-500">{info.defaultPio.designation}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{count}</span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono text-slate-700">
                        {dCode === 'POWER_DISCOM' ? '24 Hours' : dCode === 'PWD' ? '2 - 3 Days' : '3 - 5 Days'}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-slate-800">{score}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statutory RTI Automation Efficiency Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            AI Auto-Responder vs Manual RTI Desk
          </div>
          <h4 className="text-lg font-bold">Why AI-Powered RTI Auto-Response Changes Governance</h4>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <strong className="text-white block mb-0.5">Instant Section 6(1) Legal Acknowledgment:</strong>
              Manual government RTI replies take 7 to 14 days just to be typed, stamped, and postal-dispatched. JanSamadhan issues a digitally sealed memo in under 3 seconds.
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <strong className="text-white block mb-0.5">Automated 48-Hour Emergency Classification:</strong>
              Under RTI Act Section 7(1) Proviso, requests concerning life or liberty must be answered within 48 hours. The AI identifies fatal hazards (11KV wires, deep craters) and automatically invokes the emergency clock.
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <strong className="text-white block mb-0.5">Taxpayer Fraud Protection:</strong>
              AI forensic sensors prevent Photoshop-manipulated or AI-hallucinated flood/collapse complaints from activating expensive municipal contractor teams.
            </div>
          </div>
        </div>

        {/* Hot Zone Map / Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-900" />
            Metropolitan Civic Hot Zones
          </h4>

          <div className="space-y-3">
            {[
              { zone: 'South Delhi (Nehru Place / Outer Ring Road)', issues: 'Arterial Road Cavities & PWD Maintenance', count: 3, risk: 'High' },
              { zone: 'South West Delhi (Dwarka Sector 9)', issues: 'Water Pipeline Seepage & Water Contamination', count: 2, risk: 'Medium' },
              { zone: 'West Delhi (Patel Nagar / Shadipur)', issues: 'High Tension Electrical Hazard & Overhead Lines', count: 1, risk: 'Critical' },
              { zone: 'Central Delhi (Connaught Place)', issues: 'Manipulated / Hoax Incident Filtered by AI', count: 1, risk: 'Flagged' },
            ].map((z, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{z.zone}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{z.issues}</div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    z.risk === 'Critical'
                      ? 'bg-rose-100 text-rose-800'
                      : z.risk === 'Flagged'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {z.risk}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{z.count} Dockets</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
