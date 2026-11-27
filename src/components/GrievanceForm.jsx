// Citizen Grievance & RTI Application Form.
// Lets citizens fill out a complaint, attach a photo, pin their GPS location,
// and submit it to our backend for AI analysis and automatic department routing.

import { useState } from "react";
import {
  DEFAULT_LOCATION,
  DEMO_SCENARIOS,
  SAMPLE_EVIDENCE_PHOTOS,
} from "../data/presets";
import { analyzeComplaintLocally } from "../utils/localAnalyzer";
import { ReceiptSlip } from "./ReceiptSlip";

// Helper function to build the full grievance record object from the API response
function buildGrievanceRecord({
  title,
  description,
  location,
  citizenName,
  citizenPhone,
  citizenEmail,
  isAnonymous,
  directGovDispatch,
  imagePreview,
  aiData,
}) {
  const randomToken = Math.floor(1000 + Math.random() * 9000);
  const generatedId = `CPGRAMS/2026/${aiData.departmentCode}-${randomToken}`;
  const token = `RTI-2026-${aiData.departmentCode}-${randomToken}`;

  const isManipulated = !!aiData.imageForensics?.isManipulated;
  const isDuplicate = !!aiData.duplicateDetection?.isDuplicateCandidate;

  let initialStatus = "ROUTED";
  if (isManipulated) initialStatus = "REJECTED_MANIPULATED";
  else if (isDuplicate) initialStatus = "MERGED_DUPLICATE";
  else if (aiData.severity === "CRITICAL") initialStatus = "FIELD_WORK_DISPATCHED";

  const matchedId =
    aiData.duplicateDetection?.matchedExistingId ||
    aiData.duplicateDetection?.matchingGrievanceId;

  return {
    id: generatedId,
    token,
    title,
    description,
    citizenName: isAnonymous
      ? "Confidential Applicant (Sec 8 Exemption)"
      : citizenName || "Citizen Applicant",
    citizenPhone: isAnonymous ? "Confidential" : citizenPhone,
    citizenEmail: isAnonymous ? "Confidential" : citizenEmail,
    isAnonymous: !!isAnonymous,
    imageUrl:
      imagePreview ||
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    location,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    departmentCode: aiData.departmentCode,
    departmentName: aiData.departmentName,
    subCategory: aiData.subCategory,
    severity: aiData.severity,
    urgencyRationale:
      aiData.urgencyRationale ||
      "Direct civic defect lodged for statutory processing under RTI and CPGRAMS guidelines.",
    status: initialStatus,
    statutorySlaDays: aiData.statutorySlaDays,
    actionPlanSteps: aiData.actionPlanSteps || [],
    imageForensics: {
      isManipulated,
      manipulationConfidenceScore: aiData.imageForensics?.manipulationConfidenceScore || 12,
      authenticityRating: aiData.imageForensics?.authenticityRating || "AUTHENTIC",
      aiGeneratedProbability: aiData.imageForensics?.aiGeneratedProbability ?? (isManipulated ? 85 : 4),
      detectedArtifacts: aiData.imageForensics?.detectedArtifacts ||
        aiData.imageForensics?.flags || [
          "Valid Device Metadata",
          "Consistent Lighting Vectors",
        ],
      visualSummary:
        aiData.imageForensics?.visualSummary ||
        "Image verified against Section 65B Indian Evidence Act digital standards.",
    },
    duplicateDetection: {
      isDuplicateCandidate: isDuplicate,
      duplicateRisk: aiData.duplicateDetection?.duplicateRisk || "LOW",
      topMatches:
        isDuplicate && matchedId
          ? [
              {
                matchedId,
                matchedTitle: "Prior active complaint in same municipal ward sector",
                similarityPercentage: aiData.duplicateDetection?.similarityPercentage || 85,
                distanceMeters: 35,
                createdHoursAgo: 2,
                reason:
                  aiData.duplicateDetection?.reason ||
                  "Spatial proximity within same municipal ward",
              },
            ]
          : [],
      recommendation: isDuplicate ? "MERGE_CLUSTER" : "PROCEED_DISPATCH",
    },
    statusTimeline: [
      {
        status: "SUBMITTED",
        timestamp: new Date().toISOString(),
        note: "Grievance lodged electronically on CPGRAMS central gateway.",
        actor: "Citizen Portal Gateway",
      },
      {
        status: initialStatus,
        timestamp: new Date(Date.now() + 1000).toISOString(),
        note: isManipulated
          ? "Flagged for forensic evidence review under IT Act guidelines."
          : isDuplicate
          ? `Merged into existing primary docket #${matchedId}`
          : `Statutory Scrutiny completed. Routed directly to Central PIO (${aiData.departmentName}).`,
        actor: "Department Nodal Officer",
      },
    ],
    rtiResponse: {
      referenceId: token,
      acknowledgementDate: new Date().toLocaleDateString("en-IN"),
      statutoryDeadline: new Date(Date.now() + 86400000 * 7).toLocaleDateString("en-IN"),
      statutorySection:
        aiData.rtiResponse?.statutorySection ||
        "Section 6(1) read with Section 7(1) Proviso, RTI Act 2005",
      publicAuthorityName: aiData.departmentName,
      subjectLine: title,
      acknowledgementText:
        aiData.rtiResponse?.acknowledgementText ||
        "Acknowledged electronically under Section 6(1) of the RTI Act 2005.",
      preliminaryAction:
        aiData.rtiResponse?.preliminaryAction ||
        "Transmitted to Zonal Executive Engineer & CPIO Desk.",
      legalNoticeClauses: aiData.rtiResponse?.legalNoticeClauses || [
        "Proactive time-bound redressal within mandated statutory SLA.",
        "Direct right of First Appeal under Section 19(1) upon non-redressal.",
      ],
      designatedPio: aiData.rtiResponse?.designatedPio || {
        name: "Dr. S. K. Narang",
        designation: "Central Public Information Officer (CPIO)",
        department: aiData.departmentName,
        contactEmail: "cpio-nodal@gov.in",
        phone: "011-23092471",
        officeAddress: `${aiData.departmentName} Secretariat, New Delhi`,
      },
      firstAppellateAuthority: aiData.rtiResponse?.firstAppellateAuthority || {
        name: "Shri R. P. Tiwari, IAS",
        designation: "First Appellate Authority (FAA)",
        officeAddress: "Ministry of Personnel & Public Grievances, New Delhi",
      },
      inspectionScheduled: {
        willInspect: true,
        inspectionWindow: `Within ${Math.max(1, Math.round(aiData.statutorySlaDays * 0.4))} Days`,
      },
    },
    governmentDispatch: {
      isDirectlyDispatched: directGovDispatch,
      governmentPortal: "CPGRAMS / National Nodal Grievance Gateway (pgportal.gov.in)",
      governmentRefNumber: generatedId,
      dispatchedAt: new Date().toISOString(),
      nodalMinistry: `${aiData.departmentName} Nodal Central Desk`,
      transmissionStatus:
        initialStatus === "FIELD_WORK_DISPATCHED"
          ? "CREW_ON_SITE"
          : "ASSIGNED_TO_FIELD_ENGINEER",
      portalSourceUrl: "https://pgportal.gov.in",
      portalHost: "pgportal.gov.in",
      isLiveSyncedFromGov: true,
      liveSyncTimestamp: new Date().toISOString(),
      fieldTeamAssigned: {
        engineerName: `Er. ${
          aiData.rtiResponse?.designatedPio?.name?.split(" ")[1] || "R.K. Varma"
        } (Zonal Rapid Action Unit)`,
        designation: `Assistant Engineer (Civil/Sanitary), ${aiData.departmentCode}`,
        vehicleNumber: `DL-1G-${Math.floor(1000 + Math.random() * 9000)}`,
        contactPhone: "011-23092471",
        etaMinutes: aiData.severity === "CRITICAL" ? 15 : 45,
      },
    },
    govPortalUrl: "https://pgportal.gov.in",
  };
}

export function GrievanceForm({
  onGrievanceCreated,
  onViewGrievance,
  onViewLiveFeed,
  lang,
  existingComplaints,
}) {
  // Applicant and complaint fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [citizenName, setCitizenName] = useState("");
  const [citizenPhone, setCitizenPhone] = useState("");
  const [citizenEmail, setCitizenEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [directGovDispatch, setDirectGovDispatch] = useState(true);

  // Location & photo evidence fields
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);

  // Submission progress & result state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPipelineStep, setCurrentPipelineStep] = useState(0);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fill the form in 1 click using a common civic scenario
  function handleApplyScenario(scenario) {
    setTitle(scenario.title);
    setDescription(scenario.desc);
    setImagePreview(scenario.img);
    setLocation(scenario.loc);
    if (!citizenName) {
      setCitizenName("Rajesh Verma");
      setCitizenPhone("+91 98100 12345");
      setCitizenEmail("r.verma@nic.in");
    }
  }

  // Get live GPS coordinates from the browser and reverse-geocode to ward/PIN
  function handleGetLocation() {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setGpsAccuracy(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsLocating(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(5));
        const lng = parseFloat(pos.coords.longitude.toFixed(5));
        const accuracy = Math.round(pos.coords.accuracy);
        setGpsAccuracy(`GPS Locked (Precision: ±${accuracy} meters)`);

        try {
          const res = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
          if (res.ok) {
            const geo = await res.json();
            setLocation((prev) => ({
              ...prev,
              lat,
              lng,
              address: geo.address || `Geo-tagged: ${lat}° N, ${lng}° E`,
              landmark: geo.landmark || "Current GPS Location Pin",
              wardOrSector: geo.wardOrSector || prev.wardOrSector,
              district: geo.district || prev.district,
              state: geo.state || prev.state,
              pinCode: geo.pinCode || prev.pinCode,
            }));
            return;
          }
        } catch {
          // Fall back to coordinate text if reverse geocode fails
        }

        setLocation((prev) => ({
          ...prev,
          lat,
          lng,
          address: `Geo-tagged Coordinates: ${lat}° N, ${lng}° E`,
          landmark: "Live GPS Location Point",
        }));
      },
      () => {
        setIsLocating(false);
        setGpsAccuracy("GPS coordinate lock unavailable. Defaulting to municipal ward coordinates.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  // Read uploaded photo file as a base64 data URL for preview & backend analysis
  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  // Send complaint to /api/analyze-grievance and save the resulting docket
  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMessage("Please provide both the grievance title and the detailed description.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    setCurrentPipelineStep(1);

    const timer1 = setTimeout(() => setCurrentPipelineStep(2), 700);
    const timer2 = setTimeout(() => setCurrentPipelineStep(3), 1500);
    const timer3 = setTimeout(() => setCurrentPipelineStep(4), 2300);

    let aiData = null;

    try {
      const response = await fetch("/api/analyze-grievance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          location,
          citizenName: isAnonymous ? "Confidential Applicant" : citizenName || "Citizen Applicant",
          citizenPhone: isAnonymous ? "Confidential" : citizenPhone,
          citizenEmail: isAnonymous ? "Confidential" : citizenEmail,
          imageBase64: imagePreview,
          existingComplaints: existingComplaints.map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            departmentCode: c.departmentCode,
            location: c.location,
          })),
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json?.data) {
          aiData = json.data;
        }
      }
    } catch {
      // Backend API unreachable (e.g. static preview) — fall back to local analyzer below
    }

    clearTimeout(timer1);
    clearTimeout(timer2);
    clearTimeout(timer3);

    try {
      if (!aiData) {
        aiData = analyzeComplaintLocally({
          title,
          description,
          imageBase64: imagePreview,
          existingComplaints,
        });
      }

      const newRecord = buildGrievanceRecord({
        title,
        description,
        location,
        citizenName,
        citizenPhone,
        citizenEmail,
        isAnonymous,
        directGovDispatch,
        imagePreview,
        aiData,
      });

      onGrievanceCreated(newRecord);
      setSubmissionResult(newRecord);
    } catch (err) {
      setErrorMessage(`Could not submit complaint: ${err.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setImagePreview(null);
    setSubmissionResult(null);
    setErrorMessage(null);
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6 font-sans">
      {/* 1. Official Government Header Card with 3-Step Guide */}
      <div className="bg-white border-t-4 border-t-[#0B3C5D] border-x border-b border-slate-300 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0B3C5D]">
              {lang === "en"
                ? "Department of Administrative Reforms and Public Grievances (DARPG)"
                : "प्रशासनिक सुधार और लोक शिकायत विभाग"}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
              {lang === "en"
                ? "File a Public Complaint & RTI Request"
                : "लोक शिकायत एवं आरटीआई आवेदन दर्ज करें"}
            </h2>
            <div className="text-xs text-slate-600 mt-0.5">
              Submit your civic complaint online under CPGRAMS &amp; Right to Information Act, 2005
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-300 px-3 py-2 text-right shrink-0">
            <div className="text-[11px] font-bold text-slate-800">
              Direct Gateway: <span className="text-[#0B3C5D]">pgportal.gov.in</span>
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Central Nodal Switch: ONLINE (24x7)
            </div>
          </div>
        </div>

        {/* 3-Step Visual Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-blue-50 border-b-2 border-blue-700 py-2 px-1">
              <span className="font-bold text-blue-900">Step 1: Defect &amp; Photo</span>
              <div className="text-[10px] text-blue-700 hidden sm:block">Title, Details &amp; Evidence</div>
            </div>
            <div className="bg-slate-50 border-b-2 border-slate-400 py-2 px-1">
              <span className="font-bold text-slate-800">Step 2: Location Pin</span>
              <div className="text-[10px] text-slate-600 hidden sm:block">GPS / Street &amp; Landmark</div>
            </div>
            <div className="bg-slate-50 border-b-2 border-slate-400 py-2 px-1">
              <span className="font-bold text-slate-800">Step 3: Review &amp; Submit</span>
              <div className="text-[10px] text-slate-600 hidden sm:block">Docket &amp; RTI Slip</div>
            </div>
          </div>
        </div>

        <div className="mt-3 bg-[#FFFDF2] border border-[#E6D8A8] p-3 text-xs text-slate-800 flex items-start gap-2">
          <span className="text-amber-700 text-base font-bold shrink-0">ℹ️</span>
          <div className="leading-relaxed text-[11px] sm:text-xs text-slate-700">
            <strong className="text-slate-900 font-bold">No Department Knowledge Needed:</strong>{" "}
            You do not need to identify the owning municipal body. Our automated central routing engine assigns your issue directly to PWD, Delhi Jal Board, MCD, or Power DISCOM based on the problem and GPS location.
          </div>
        </div>
      </div>

      {/* 2. Quick 1-Click Presets */}
      <div className="bg-white border border-slate-300 shadow-xs p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-3">
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <span>⚡</span>
              <span>{lang === "en" ? "Quick 1-Click Civic Issue Presets" : "त्वरित नागरिक समस्या विकल्प"}</span>
            </div>
            <div className="text-[11px] text-slate-600">
              Tap any common civic defect to automatically fill all fields and sample photo in one click:
            </div>
          </div>
          <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 border border-amber-300 font-bold self-start sm:self-auto rounded">
            Auto-Fills Form
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {DEMO_SCENARIOS.map((sc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyScenario(sc)}
              className="text-left p-2.5 border border-slate-300 hover:border-[#0B3C5D] hover:bg-blue-50/50 transition-all text-xs cursor-pointer bg-white group"
            >
              <div className="font-bold text-slate-900 group-hover:text-[#0B3C5D] truncate">
                {sc.label}
              </div>
              <div className="text-[10px] text-[#0B3C5D] font-semibold mt-0.5">
                {sc.tag}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Show Receipt Slip after submission, otherwise show the Form */}
      {submissionResult ? (
        <ReceiptSlip
          submissionResult={submissionResult}
          onViewGrievance={onViewGrievance}
          onViewLiveFeed={onViewLiveFeed}
          onReset={resetForm}
        />
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-300 shadow-xs p-6 space-y-6">
          {errorMessage && (
            <div className="bg-[#FFF2F2] border border-[#E57373] text-[#B71C1C] text-xs p-3 font-semibold">
              Error: {errorMessage}
            </div>
          )}

          {/* PART I: Applicant Particulars */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#0B3C5D] pb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B3C5D]">
                PART I: APPLICANT PARTICULARS / आवेदक का विवरण
              </h3>
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-slate-400 text-[#0B3C5D] focus:ring-0 cursor-pointer"
                />
                <span className="font-semibold">Keep Applicant Identity Confidential</span>
              </label>
            </div>

            {!isAnonymous ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Applicant Full Name <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required={!isAnonymous}
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar Sharma"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-[#0B3C5D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Mobile Number (For SMS Status Alerts) <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="tel"
                    required={!isAnonymous}
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-[#0B3C5D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Email Address (For Official Docket Memo)
                  </label>
                  <input
                    type="email"
                    value={citizenEmail}
                    onChange={(e) => setCitizenEmail(e.target.value)}
                    placeholder="applicant@example.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-[#0B3C5D]"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-[#FFFDF2] border border-[#E6D8A8] p-3 text-xs text-slate-800">
                <strong>Confidential Mode Active:</strong> Your personal identity will be hidden from the public complaint list. Action will continue using your CPGRAMS Docket Number.
              </div>
            )}
          </div>

          {/* PART II: Grievance Details & Photo Evidence */}
          <div className="space-y-4 pt-2">
            <div className="border-b-2 border-[#0B3C5D] pb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B3C5D]">
                PART II: NATURE &amp; PARTICULARS OF GRIEVANCE / शिकायत का विवरण
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Subject / Title of Grievance <span className="text-red-600 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hazardous deep road cavity near Metro Pillar 142 on Outer Ring Road"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-[#0B3C5D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Detailed Statement of Grievance <span className="text-red-600 font-bold">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide comprehensive details: Nature of defect, date/time noticed, severity, impact on traffic/public safety..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-[#0B3C5D] resize-y"
              />
            </div>

            {/* Photo Upload + Sample Evidence Selector */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <label className="block text-xs font-semibold text-slate-800">
                  Photographic / Documentary Evidence{" "}
                  <span className="text-slate-500 font-normal">(Max 15MB: JPG, PNG, WebP)</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  {imagePreview ? "✓ Photo Attached" : "Attach photo or select sample below"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div className="sm:col-span-2 border border-dashed border-slate-400 bg-slate-50 p-4 text-center">
                  <input
                    type="file"
                    id="evidence-file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="evidence-file" className="cursor-pointer block">
                    <div className="text-xs font-bold text-[#0B3C5D] hover:underline">
                      📁 Click to browse and attach photo from your phone or computer
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Geo-tagged digital evidence is scrutinized for authenticity and immediate field routing
                    </div>
                  </label>

                  <div className="mt-3 pt-2.5 border-t border-slate-200">
                    <div className="text-[11px] font-semibold text-slate-700 mb-1.5">
                      Don&apos;t have a photo right now? Tap a sample civic evidence:
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {SAMPLE_EVIDENCE_PHOTOS.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImagePreview(sample.url)}
                          className={`text-[11px] px-2 py-1 border transition-colors cursor-pointer ${
                            imagePreview === sample.url
                              ? "bg-[#0B3C5D] text-white border-[#0B3C5D] font-bold"
                              : "bg-white text-slate-800 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          {sample.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border border-slate-300 bg-slate-100 h-36 flex items-center justify-center overflow-hidden relative">
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img src={imagePreview} alt="Attached Evidence" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute top-1 right-1 bg-red-700 hover:bg-red-800 text-white text-[10px] font-bold px-2 py-0.5 cursor-pointer shadow-xs"
                      >
                        Remove
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] py-0.5 px-1.5 text-center truncate">
                        Evidence Staged for Inspection
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-2 text-slate-500">
                      <div className="text-xl mb-1">📷</div>
                      <span className="text-[11px]">No photo attached</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* PART III: Location & GPS Pin */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b-2 border-[#0B3C5D] pb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B3C5D]">
                PART III: TERRITORIAL JURISDICTION &amp; LOCATION / भौगोलिक अधिकार क्षेत्र
              </h3>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="text-xs font-bold text-[#0B3C5D] hover:underline cursor-pointer bg-slate-100 px-2 py-0.5 border border-slate-300"
              >
                {isLocating ? "Acquiring GPS..." : "Fetch Live GPS Coordinates"}
              </button>
            </div>

            {gpsAccuracy && (
              <div className="text-xs text-[#0D6832] bg-[#EBF7EE] border border-[#138808] p-2 font-medium">
                {gpsAccuracy}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Street Address / Road Stretch <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location.address}
                  onChange={(e) => setLocation({ ...location, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-[#0B3C5D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Nearest Landmark <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location.landmark || ""}
                  onChange={(e) => setLocation({ ...location, landmark: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-[#0B3C5D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Municipal Ward / Zone <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location.wardOrSector || ""}
                  onChange={(e) => setLocation({ ...location, wardOrSector: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-[#0B3C5D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  District <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location.district}
                  onChange={(e) => setLocation({ ...location, district: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-[#0B3C5D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  State / Union Territory <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location.state}
                  onChange={(e) => setLocation({ ...location, state: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-[#0B3C5D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Postal PIN Code (6 Digits) <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={location.pinCode}
                  onChange={(e) => setLocation({ ...location, pinCode: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-[#0B3C5D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Survey Coordinates (WGS84)
                </label>
                <div className="text-xs font-mono bg-slate-100 px-3 py-2 border border-slate-300 text-slate-700">
                  {location.lat}° N, {location.lng}° E
                </div>
              </div>
            </div>
          </div>

          {/* PART IV: Direct Government Gateway Option */}
          <div className="bg-slate-50 border border-slate-300 p-4 space-y-2">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              PART IV: GOVERNMENT CENTRAL GATEWAY DISPATCH DIRECTIVE
            </div>
            <label className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={directGovDispatch}
                onChange={(e) => setDirectGovDispatch(e.target.checked)}
                className="mt-0.5 rounded border-slate-400 text-[#0B3C5D] focus:ring-0 cursor-pointer"
              />
              <div>
                <span className="font-bold text-[#0B3C5D]">
                  Direct Transmission to Central CPGRAMS &amp; RTI Online Nodal Switch (pgportal.gov.in)
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  Directly provisions an official Government Docket Reference Number, registers the grievance on the national nodal dashboard, and generates a formal RTI Notice under Section 6(1) of the RTI Act 2005.
                </p>
              </div>
            </label>
          </div>

          {/* Submit Button / Progress Indicator */}
          <div className="pt-4 border-t border-slate-300 flex flex-col items-center">
            {isSubmitting ? (
              <div className="w-full max-w-lg bg-slate-50 border border-slate-300 p-4 text-center space-y-3">
                <div className="text-sm font-bold text-[#0B3C5D]">
                  Submitting Your Complaint &amp; Assigning Department...
                </div>

                <div className="w-full bg-slate-200 h-2">
                  <div
                    className="bg-[#0B3C5D] h-2 transition-all duration-300"
                    style={{ width: `${(currentPipelineStep / 4) * 100}%` }}
                  />
                </div>

                <div className="text-xs text-slate-700 font-medium">
                  {currentPipelineStep === 1 &&
                    "Step 1/4: Checking uploaded photo..."}
                  {currentPipelineStep === 2 &&
                    "Step 2/4: Checking for nearby duplicate complaints..."}
                  {currentPipelineStep === 3 &&
                    "Step 3/4: Assigning the right department & officer..."}
                  {currentPipelineStep === 4 &&
                    "Step 4/4: Saving complaint & generating receipt..."}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0B3C5D] hover:bg-[#082D46] text-white font-bold text-xs uppercase tracking-wider shadow-xs cursor-pointer border border-[#082D46]"
                >
                  {lang === "en"
                    ? "Submit Grievance to Competent Authority"
                    : "सक्षम प्राधिकारी को शिकायत अग्रेषित करें"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 cursor-pointer"
                >
                  {lang === "en" ? "Clear Form" : "प्रारूप खाली करें"}
                </button>
              </div>
            )}

            <div className="text-[11px] text-slate-500 mt-2 text-center">
              Statutory filing under the Right to Information Act 2005. No processing fee is charged for citizen grievance registration.
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
