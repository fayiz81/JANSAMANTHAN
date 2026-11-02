import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GrievanceForm } from './components/GrievanceForm';
import { TrackGrievance } from './components/TrackGrievance';
import { LiveGovFeed } from './components/LiveGovFeed';
import { CivicGroundingPanel } from './components/CivicGroundingPanel';
import { OfficerDashboard } from './components/OfficerDashboard';
import { VisualForensicsLab } from './components/VisualForensicsLab';
import { AnalyticsView } from './components/AnalyticsView';
import { RtiDocumentModal } from './components/RtiDocumentModal';
import { GrievanceRecord, GrievanceStatus } from './types/grievance';
import { INITIAL_GRIEVANCES } from './data/seedGrievances';
import { ShieldCheck, Scale, ExternalLink, HelpCircle, FileText } from 'lucide-react';

const STORAGE_KEY = 'jansamadhan_grievances_v3';

export default function App() {
  const [grievances, setGrievances] = useState<GrievanceRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load local grievances:', e);
    }
    return INITIAL_GRIEVANCES;
  });

  const [activeTab, setActiveTab] = useState<
    'submit' | 'track' | 'live' | 'grounding' | 'officer' | 'forensics' | 'analytics'
  >('submit');

  const [selectedGrievanceId, setSelectedGrievanceId] = useState<string | null>(
    INITIAL_GRIEVANCES[0]?.id || null
  );

  const [rtiModalGrievance, setRtiModalGrievance] = useState<GrievanceRecord | null>(null);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(grievances));
    } catch (e) {
      console.warn('Failed to save grievances to localStorage:', e);
    }
  }, [grievances]);

  const handleGrievanceCreated = (newRecord: GrievanceRecord) => {
    setGrievances((prev) => [newRecord, ...prev]);
    setSelectedGrievanceId(newRecord.id);
  };

  const handleUpdateStatus = (id: string, newStatus: GrievanceStatus, note: string) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        return {
          ...g,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          governmentDispatch: {
            ...g.governmentDispatch,
            transmissionStatus: newStatus === 'RESOLVED' ? 'CLOSED_VERIFIED' : newStatus === 'FIELD_WORK_DISPATCHED' ? 'CREW_ON_SITE' : g.governmentDispatch.transmissionStatus,
            resolutionProof: newStatus === 'RESOLVED' ? {
              completionNote: note || 'Issue officially redressed and certified by Zonal Inspector.',
              resolvedAt: new Date().toISOString(),
              inspectorBadge: 'MUNICIPAL-INSP-2026-DL'
            } : g.governmentDispatch.resolutionProof
          },
          statusTimeline: [
            ...g.statusTimeline,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              note,
              actor: 'Designated CPIO Officer',
            },
          ],
        };
      })
    );
  };

  // Live simulation of field engineer progressing work (for user demonstration)
  const handleSimulateProgress = (id: string) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const isCurrentlyRouted = g.status === 'ROUTED' || g.status === 'SUBMITTED';
        const isCurrentlyField = g.status === 'FIELD_WORK_DISPATCHED' || g.status === 'INVESTIGATING';

        if (isCurrentlyRouted) {
          return {
            ...g,
            status: 'FIELD_WORK_DISPATCHED',
            updatedAt: new Date().toISOString(),
            governmentDispatch: {
              ...g.governmentDispatch,
              transmissionStatus: 'CREW_ON_SITE',
              fieldTeamAssigned: {
                engineerName: 'Er. R.K. Varma (Junior Engineer)',
                designation: 'Zonal Rapid Repair Force, Unit 3',
                vehicleNumber: 'DL-1GA-5520 (Hydraulic Repair Unit)',
                contactPhone: '+91 98101 44521',
                etaMinutes: 10,
              },
            },
            statusTimeline: [
              ...g.statusTimeline,
              {
                status: 'FIELD_WORK_DISPATCHED',
                timestamp: new Date().toISOString(),
                note: 'Government Field Crew mobilized on site. Traffic cones and repair equipment deployed.',
                actor: 'Assistant Engineer (Zonal Control)',
              },
            ],
          };
        } else if (isCurrentlyField) {
          return {
            ...g,
            status: 'RESOLVED',
            updatedAt: new Date().toISOString(),
            governmentDispatch: {
              ...g.governmentDispatch,
              transmissionStatus: 'CLOSED_VERIFIED',
              resolutionProof: {
                completionNote: 'Civic defect physically resolved by on-site departmental team. Quality check and compaction/leak test verified satisfactory.',
                resolvedAt: new Date().toISOString(),
                inspectorBadge: 'MUNICIPAL-INSP-2026-DL',
                beforeAfterImg: g.imageUrl,
              },
            },
            statusTimeline: [
              ...g.statusTimeline,
              {
                status: 'RESOLVED',
                timestamp: new Date().toISOString(),
                note: 'Physical repair completed and certified. Official Action Taken Report (ATR) recorded in CPGRAMS.',
                actor: 'Chief Sanitary / Executive Engineer',
              },
            ],
          };
        }
        return g;
      })
    );
  };

  const handleViewGrievance = (id: string) => {
    setSelectedGrievanceId(id);
    const found = grievances.find((g) => g.id === id);
    if (found) {
      setRtiModalGrievance(found);
    }
    setActiveTab('track');
  };

  const handleInspectForensics = (id: string) => {
    setSelectedGrievanceId(id);
    setActiveTab('forensics');
  };

  const pendingCount = grievances.filter(
    (g) => g.status !== 'RESOLVED' && g.status !== 'REJECTED_MANIPULATED'
  ).length;

  const criticalCount = grievances.filter(
    (g) => g.severity === 'CRITICAL' && g.status !== 'RESOLVED'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Official Government Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        pendingCount={pendingCount}
        criticalCount={criticalCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'submit' && (
          <GrievanceForm
            onGrievanceCreated={handleGrievanceCreated}
            onViewGrievance={handleViewGrievance}
            onViewLiveFeed={() => setActiveTab('live')}
            lang={lang}
            existingComplaints={grievances}
          />
        )}

        {activeTab === 'track' && (
          <TrackGrievance
            grievances={grievances}
            selectedGrievanceId={selectedGrievanceId}
            onSelectGrievance={(id) => setSelectedGrievanceId(id)}
            onOpenRtiModal={(g) => setRtiModalGrievance(g)}
            onSimulateProgress={handleSimulateProgress}
            lang={lang}
          />
        )}

        {activeTab === 'live' && (
          <LiveGovFeed
            grievances={grievances}
            onSelectGrievance={(id) => {
              setSelectedGrievanceId(id);
              setActiveTab('track');
            }}
            onOpenRtiModal={(g) => setRtiModalGrievance(g)}
            onSimulateProgress={handleSimulateProgress}
            lang={lang}
          />
        )}

        {activeTab === 'grounding' && (
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
            <CivicGroundingPanel
              initialLat={grievances.find((g) => g.id === selectedGrievanceId)?.location.lat || 28.6289}
              initialLng={grievances.find((g) => g.id === selectedGrievanceId)?.location.lng || 77.2065}
              initialAddress={grievances.find((g) => g.id === selectedGrievanceId)?.location.address || 'Outer Ring Road, Nehru Place, South Delhi'}
              initialDistrict={grievances.find((g) => g.id === selectedGrievanceId)?.location.district || 'South Delhi'}
              initialDepartment={grievances.find((g) => g.id === selectedGrievanceId)?.departmentCode || 'PWD'}
              lang={lang}
            />
          </div>
        )}

        {activeTab === 'officer' && (
          <OfficerDashboard
            grievances={grievances}
            onUpdateStatus={handleUpdateStatus}
            onOpenRtiModal={(g) => setRtiModalGrievance(g)}
            onInspectForensics={handleInspectForensics}
            lang={lang}
          />
        )}

        {activeTab === 'forensics' && (
          <VisualForensicsLab
            grievances={grievances}
            selectedGrievanceId={selectedGrievanceId}
            onSelectGrievance={(id) => setSelectedGrievanceId(id)}
            lang={lang}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView grievances={grievances} lang={lang} />
        )}
      </main>

      {/* Official Stamped RTI Auto-Response Modal */}
      <RtiDocumentModal
        grievance={rtiModalGrievance}
        isOpen={!!rtiModalGrievance}
        onClose={() => setRtiModalGrievance(null)}
      />

      {/* Official Footer */}
      <footer className="no-print bg-slate-950 text-slate-400 border-t border-slate-800 text-xs mt-12 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-white font-bold text-sm font-serif-gov">
                JanSamadhan AI Portal
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                National AI-powered Civic Grievance Triage & Automated RTI Auto-Responder System. Connected directly with Government Nodal Gateways (CPGRAMS) for real-time citizen-to-ministry resolution.
              </p>
            </div>

            <div>
              <div className="text-white font-bold text-xs uppercase tracking-wider mb-2">
                Statutory Provisions
              </div>
              <ul className="space-y-1 text-slate-400">
                <li>• Section 6(1) RTI: Direct Electronic Filing</li>
                <li>• Section 7(1) Proviso: 48h Life & Liberty Mandate</li>
                <li>• Section 4(1)(b): Proactive Civic Disclosure</li>
                <li>• CPGRAMS: Integrated Nodal Dispatch</li>
              </ul>
            </div>

            <div>
              <div className="text-white font-bold text-xs uppercase tracking-wider mb-2">
                Departmental Nodal Links
              </div>
              <ul className="space-y-1 text-slate-400">
                <li>• Public Works Department (PWD HQ)</li>
                <li>• Municipal Corporation Delhi (MCD Sanitation)</li>
                <li>• Delhi Jal Board (DJB Water & Sewerage)</li>
                <li>• State Power Distribution (DISCOM)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-white font-bold text-xs uppercase tracking-wider">
                Emergency & Support
              </div>
              <p className="text-slate-400 text-xs">
                Toll-Free Grievance Helpline: <strong className="text-amber-400">1905</strong>
              </p>
              <p className="text-slate-400 text-xs">
                RTI Online Inquiries: <strong className="text-blue-400">rti-support@gov.in</strong>
              </p>
              <div className="text-[10px] text-slate-500 pt-1">
                Direct integration with Central & State Public Authorities.
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <div>
              © 2026 JanSamadhan AI • Ministry of Personnel, Public Grievances & Pensions. All Rights Reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Security Audited (NIC Cert-In)</span>
              <span>ISO 9001:2015</span>
              <span>WCAG 2.1 AA Accessible</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
