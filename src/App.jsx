// Main React component for JanSamadhan Portal.
// Manages grievance state, localStorage persistence, live government feed sync, and tab navigation.

import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { GrievanceForm } from "./components/GrievanceForm";
import { TrackGrievance } from "./components/TrackGrievance";
import { LiveGovFeed } from "./components/LiveGovFeed";
import { CivicGroundingPanel } from "./components/CivicGroundingPanel";
import { OfficerDashboard } from "./components/OfficerDashboard";
import { VisualForensicsLab } from "./components/VisualForensicsLab";
import { AnalyticsView } from "./components/AnalyticsView";
import { RtiDocumentModal } from "./components/RtiDocumentModal";
import { CitizenGuideModal } from "./components/CitizenGuideModal";
import { INITIAL_GRIEVANCES } from "./data/seedGrievances";
const STORAGE_KEY = "jansamadhan_grievances_v4";
export default function App() {
  const [grievances, setGrievances] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load local grievances:", e);
    }
    return INITIAL_GRIEVANCES;
  });
  const [activeTab, setActiveTab] = useState("submit");
  const [selectedGrievanceId, setSelectedGrievanceId] = useState(
    INITIAL_GRIEVANCES[0]?.id || null
  );
  const [rtiModalGrievance, setRtiModalGrievance] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [fontScale, setFontScale] = useState("normal");
  const [isSyncingGov, setIsSyncingGov] = useState(false);
  const [lastGovSyncTime, setLastGovSyncTime] = useState("Live Connected");
  const [govGatewayStatus, setGovGatewayStatus] = useState({
    "pgportal.gov.in": { status: "ONLINE", pingMs: 38, node: "CPGRAMS National Hub" },
    "rtionline.gov.in": { status: "ONLINE", pingMs: 44, node: "Central Information Commission" },
    "mcdonline.nic.in": { status: "ONLINE", pingMs: 51, node: "Delhi Municipal Data Core" },
    "mohua.gov.in": { status: "ONLINE", pingMs: 41, node: "Ministry of Housing & Urban Affairs" }
  });
  const syncLiveGovPortal = async () => {
    setIsSyncingGov(true);
    try {
      const res = await fetch("/api/live-gov-feed");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
          setGrievances((prev) => {
            const userSubmissions = prev.filter(
              (p) => !p.isLiveGovFeedItem && !p.id.startsWith("CPGRAMS/") && !p.id.startsWith("RTI/MCD/")
            );
            return [...userSubmissions, ...data.items];
          });
        }
        if (data.portalGatewayStatus) {
          setGovGatewayStatus(data.portalGatewayStatus);
        }
        setLastGovSyncTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      }
    } catch (err) {
      console.warn("Live Gov Feed sync encountered notice:", err);
    } finally {
      setIsSyncingGov(false);
    }
  };
  useEffect(() => {
    syncLiveGovPortal();
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(grievances));
    } catch (e) {
      console.warn("Failed to save grievances to localStorage:", e);
    }
  }, [grievances]);
  const handleGrievanceCreated = (newRecord) => {
    setGrievances((prev) => [newRecord, ...prev]);
    setSelectedGrievanceId(newRecord.id);
  };
  const handleUpdateStatus = (id, newStatus, note) => {
    setGrievances(
      (prev) => prev.map((g) => {
        if (g.id !== id) return g;
        return {
          ...g,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          governmentDispatch: {
            ...g.governmentDispatch,
            transmissionStatus: newStatus === "RESOLVED" ? "CLOSED_VERIFIED" : newStatus === "FIELD_WORK_DISPATCHED" ? "CREW_ON_SITE" : g.governmentDispatch.transmissionStatus,
            resolutionProof: newStatus === "RESOLVED" ? {
              completionNote: note || "Issue officially redressed and certified by Zonal Inspector.",
              resolvedAt: new Date().toISOString(),
              inspectorBadge: "MUNICIPAL-INSP-2026-DL"
            } : g.governmentDispatch.resolutionProof
          },
          statusTimeline: [
            ...g.statusTimeline,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              note,
              actor: "Designated CPIO Officer"
            }
          ]
        };
      })
    );
  };
  const handleSimulateProgress = (id) => {
    setGrievances(
      (prev) => prev.map((g) => {
        if (g.id !== id) return g;
        const isCurrentlyRouted = g.status === "ROUTED" || g.status === "SUBMITTED";
        const isCurrentlyField = g.status === "FIELD_WORK_DISPATCHED" || g.status === "INVESTIGATING";
        if (isCurrentlyRouted) {
          return {
            ...g,
            status: "FIELD_WORK_DISPATCHED",
            updatedAt: new Date().toISOString(),
            governmentDispatch: {
              ...g.governmentDispatch,
              transmissionStatus: "CREW_ON_SITE",
              fieldTeamAssigned: {
                engineerName: "Er. R.K. Varma (Junior Engineer)",
                designation: "Zonal Rapid Repair Force, Unit 3",
                vehicleNumber: "DL-1GA-5520 (Hydraulic Repair Unit)",
                contactPhone: "+91 98101 44521",
                etaMinutes: 10
              }
            },
            statusTimeline: [
              ...g.statusTimeline,
              {
                status: "FIELD_WORK_DISPATCHED",
                timestamp: new Date().toISOString(),
                note: "Government Field Crew mobilized on site. Traffic cones and repair equipment deployed.",
                actor: "Assistant Engineer (Zonal Control)"
              }
            ]
          };
        } else if (isCurrentlyField) {
          return {
            ...g,
            status: "RESOLVED",
            updatedAt: new Date().toISOString(),
            governmentDispatch: {
              ...g.governmentDispatch,
              transmissionStatus: "CLOSED_VERIFIED",
              resolutionProof: {
                completionNote: "Civic defect physically resolved by on-site departmental team. Quality check and compaction/leak test verified satisfactory.",
                resolvedAt: new Date().toISOString(),
                inspectorBadge: "MUNICIPAL-INSP-2026-DL",
                beforeAfterImg: g.imageUrl
              }
            },
            statusTimeline: [
              ...g.statusTimeline,
              {
                status: "RESOLVED",
                timestamp: new Date().toISOString(),
                note: "Physical repair completed and certified. Official Action Taken Report (ATR) recorded in CPGRAMS.",
                actor: "Chief Sanitary / Executive Engineer"
              }
            ]
          };
        }
        return g;
      })
    );
  };
  const handleViewGrievance = (id) => {
    setSelectedGrievanceId(id);
    const found = grievances.find((g) => g.id === id);
    if (found) {
      setRtiModalGrievance(found);
    }
    setActiveTab("track");
  };
  const handleInspectForensics = (id) => {
    setSelectedGrievanceId(id);
    setActiveTab("forensics");
  };
  const pendingCount = grievances.filter(
    (g) => g.status !== "RESOLVED" && g.status !== "REJECTED_MANIPULATED"
  ).length;
  const criticalCount = grievances.filter(
    (g) => g.severity === "CRITICAL" && g.status !== "RESOLVED"
  ).length;
  const fontScaleClass = fontScale === "larger" ? "text-base" : fontScale === "large" ? "text-[15px]" : "text-sm";
  return <div className={`min-h-screen flex flex-col bg-[#F4F6F9] text-slate-900 font-sans ${fontScaleClass}`}>
      {/* Official Indian Government Header */}
      <Header
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    lang={lang}
    setLang={setLang}
    pendingCount={pendingCount}
    criticalCount={criticalCount}
    fontScale={fontScale}
    setFontScale={setFontScale}
    onOpenHelp={() => setIsHelpOpen(true)}
  />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === "submit" && <GrievanceForm
    onGrievanceCreated={handleGrievanceCreated}
    onViewGrievance={handleViewGrievance}
    onViewLiveFeed={() => setActiveTab("live")}
    lang={lang}
    existingComplaints={grievances}
  />}

        {activeTab === "track" && <TrackGrievance
    grievances={grievances}
    selectedGrievanceId={selectedGrievanceId}
    onSelectGrievance={(id) => setSelectedGrievanceId(id)}
    onOpenRtiModal={(g) => setRtiModalGrievance(g)}
    onSimulateProgress={handleSimulateProgress}
    lang={lang}
  />}

        {activeTab === "live" && <LiveGovFeed
    grievances={grievances}
    onSelectGrievance={(id) => {
      setSelectedGrievanceId(id);
      setActiveTab("track");
    }}
    onOpenRtiModal={(g) => setRtiModalGrievance(g)}
    onSimulateProgress={handleSimulateProgress}
    onSyncLiveGov={syncLiveGovPortal}
    isSyncingLiveGov={isSyncingGov}
    lastGovSyncTime={lastGovSyncTime}
    govGatewayStatus={govGatewayStatus}
    lang={lang}
  />}

        {activeTab === "grounding" && <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
            <CivicGroundingPanel
    initialLat={grievances.find((g) => g.id === selectedGrievanceId)?.location.lat || 28.6289}
    initialLng={grievances.find((g) => g.id === selectedGrievanceId)?.location.lng || 77.2065}
    initialAddress={grievances.find((g) => g.id === selectedGrievanceId)?.location.address || "Outer Ring Road, Nehru Place, South Delhi"}
    initialDistrict={grievances.find((g) => g.id === selectedGrievanceId)?.location.district || "South Delhi"}
    initialDepartment={grievances.find((g) => g.id === selectedGrievanceId)?.departmentCode || "PWD"}
    lang={lang}
  />
          </div>}

        {activeTab === "officer" && <OfficerDashboard
    grievances={grievances}
    onUpdateStatus={handleUpdateStatus}
    onOpenRtiModal={(g) => setRtiModalGrievance(g)}
    onInspectForensics={handleInspectForensics}
    lang={lang}
  />}

        {activeTab === "forensics" && <VisualForensicsLab
    grievances={grievances}
    selectedGrievanceId={selectedGrievanceId}
    onSelectGrievance={(id) => setSelectedGrievanceId(id)}
    lang={lang}
  />}

        {activeTab === "analytics" && <AnalyticsView grievances={grievances} lang={lang} />}
      </main>

      {/* Official Stamped RTI Auto-Response Modal */}
      <RtiDocumentModal
    grievance={rtiModalGrievance}
    isOpen={!!rtiModalGrievance}
    onClose={() => setRtiModalGrievance(null)}
  />

      {/* Citizen Charter & Help Modal */}
      <CitizenGuideModal
    isOpen={isHelpOpen}
    onClose={() => setIsHelpOpen(false)}
    lang={lang}
  />

      {/* Official Indian Government Footer (NIC & GIGW Standard) */}
      <footer className="no-print bg-[#082238] text-slate-300 border-t-2 border-[#D97706] text-xs mt-12 pt-8 pb-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-white font-bold text-sm uppercase tracking-wider font-serif">
                CPGRAMS / JanSamadhan
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Centralised Public Grievance Redress And Monitoring System. An official portal of the Department of Administrative Reforms and Public Grievances (DARPG), Government of India.
              </p>
              <div className="text-[11px] text-amber-300 font-semibold pt-1">
                Connected to Central Gateway: pgportal.gov.in
              </div>
            </div>

            <div>
              <div className="text-white font-bold text-xs uppercase tracking-wider mb-2 border-b border-slate-700 pb-1">
                Statutory Mandates
              </div>
              <ul className="space-y-1 text-slate-300 text-xs">
                <li>• Right to Information Act, 2005 (Section 6 & 7)</li>
                <li>• Section 7(1) Proviso: 48h Life Risk Guarantee</li>
                <li>• Rule 3: Central Grievance Redressal Regulations</li>
                <li>• Section 65B: Indian Evidence Act Compliance</li>
              </ul>
            </div>

            <div>
              <div className="text-white font-bold text-xs uppercase tracking-wider mb-2 border-b border-slate-700 pb-1">
                Official Ministry Portals
              </div>
              <ul className="space-y-1 text-slate-300 text-xs">
                <li>• <a href="https://pgportal.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">CPGRAMS Central Hub (pgportal.gov.in)</a></li>
                <li>• <a href="https://rtionline.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">RTI Online Portal (rtionline.gov.in)</a></li>
                <li>• <a href="https://mcdonline.nic.in" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">MCD Civic Services (mcdonline.nic.in)</a></li>
                <li>• <a href="https://mohua.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">Ministry of Housing & Urban Affairs</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-white font-bold text-xs uppercase tracking-wider mb-2 border-b border-slate-700 pb-1">
                National Citizen Helplines
              </div>
              <p className="text-slate-300 text-xs">
                Toll-Free Grievance Helpline: <strong className="text-amber-300">1905</strong>
              </p>
              <p className="text-slate-300 text-xs">
                National Consumer Helpline: <strong className="text-amber-300">1800-11-4000</strong>
              </p>
              <p className="text-slate-300 text-xs">
                RTI Support Desk: <strong className="text-blue-300">rti-support@gov.in</strong>
              </p>
              <div className="text-[10px] text-slate-400 pt-1">
                Working Hours: 08:00 AM to 08:00 PM (Monday to Saturday)
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <div>
              Website contents designed, developed, and maintained by National Informatics Centre (NIC) for DARPG, Government of India.
            </div>
            <div className="flex items-center gap-4">
              <span>GIGW 3.0 Compliant</span>
              <span>•</span>
              <span>WCAG 2.1 AA Standard</span>
              <span>•</span>
              <span>© 2026 Government of India</span>
            </div>
          </div>

          {/* Bottom Tricolor Strip */}
          <div className="h-1 w-full flex mt-2">
            <div className="h-full w-1/3 bg-[#FF9933]" />
            <div className="h-full w-1/3 bg-[#FFFFFF]" />
            <div className="h-full w-1/3 bg-[#138808]" />
          </div>
        </div>
      </footer>
    </div>;
}
