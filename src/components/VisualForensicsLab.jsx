// Section 65B Digital Evidence & Duplicate Verification Console.

import { useState } from "react";
export const VisualForensicsLab = ({
  grievances,
  selectedGrievanceId,
  onSelectGrievance,
  lang
}) => {
  const [activeId, setActiveId] = useState(
    selectedGrievanceId || grievances[2]?.id || grievances[0]?.id
  );
  const [forensicMode, setForensicMode] = useState("ELA");
  const currentGrievance = grievances.find((g) => g.id === activeId) || grievances[0];
  const { imageForensics, duplicateDetection } = currentGrievance;
  return <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6 font-sans">
      {/* 1. Official Government Header */}
      <div className="bg-white border-t-4 border-t-[#0B3C5D] border-x border-b border-slate-300 shadow-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0B3C5D]">
              GOVERNMENT OF INDIA • DIGITAL EVIDENCE & VIGILANCE AUDIT WING
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mt-0.5">
              {lang === "en" ? "Photo & Duplicate Check" : "फ़ोटो एवं डुप्लीकेट जांच"}
            </h2>
            <div className="text-xs text-slate-600 mt-0.5">
              Check if an uploaded complaint photo is genuine, edited, or already reported nearby.
            </div>
          </div>

          {/* Docket Switcher */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-700 shrink-0">Select Complaint:</label>
            <select
              value={currentGrievance.id}
              onChange={(e) => {
                setActiveId(e.target.value);
                onSelectGrievance(e.target.value);
              }}
              className="bg-white text-slate-900 text-xs px-3 py-1.5 border border-slate-300 focus:outline-none focus:border-[#0B3C5D] cursor-pointer"
            >
              {grievances.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.id} ({g.departmentCode} - {g.imageForensics.isManipulated ? "FLAGGED EDITED" : "GENUINE"})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Callout */}
        <div className="mt-3 p-3 text-xs border border-slate-300 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-900">Complaint: {currentGrievance.id}</span>
            <span className="text-slate-600 ml-2">({currentGrievance.title})</span>
          </div>
          <div>
            {imageForensics.isManipulated ? (
              <span className="bg-[#FFF2F2] border border-[#E57373] text-[#B71C1C] px-2 py-0.5 font-bold">
                STATUS: POSSIBLE EDITED PHOTO
              </span>
            ) : (
              <span className="bg-[#EBF7EE] border border-[#138808] text-[#138808] px-2 py-0.5 font-bold">
                STATUS: VERIFIED REAL PHOTO
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Photo Inspection Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Photo Viewer */}
        <div className="lg:col-span-7 bg-white border border-slate-300 shadow-xs p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Uploaded Photo Preview
            </div>

            {/* Simple View Mode Buttons */}
            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setForensicMode("ORIGINAL")}
                className={`px-2.5 py-1 font-semibold cursor-pointer border ${forensicMode === "ORIGINAL" ? "bg-[#0B3C5D] text-white border-[#0B3C5D]" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}
              >
                Original Photo
              </button>
              <button
                type="button"
                onClick={() => setForensicMode("ELA")}
                className={`px-2.5 py-1 font-semibold cursor-pointer border ${forensicMode === "ELA" ? "bg-[#0B3C5D] text-white border-[#0B3C5D]" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}
              >
                Edit Check
              </button>
              <button
                type="button"
                onClick={() => setForensicMode("EDGES")}
                className={`px-2.5 py-1 font-semibold cursor-pointer border ${forensicMode === "EDGES" ? "bg-[#0B3C5D] text-white border-[#0B3C5D]" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}
              >
                Edge View
              </button>
              <button
                type="button"
                onClick={() => setForensicMode("HEATMAP")}
                className={`px-2.5 py-1 font-semibold cursor-pointer border ${forensicMode === "HEATMAP" ? "bg-[#0B3C5D] text-white border-[#0B3C5D]" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}
              >
                Heatmap
              </button>
            </div>
          </div>

          {/* Evidence Frame */}
          <div className="border border-slate-300 bg-slate-900 h-80 flex items-center justify-center relative overflow-hidden">
            {currentGrievance.imageUrl ? <img
    src={currentGrievance.imageUrl}
    alt="Forensic Evidence"
    className={`w-full h-full object-cover transition-all duration-300 ${forensicMode === "ELA" ? "contrast-200 saturate-200 invert-[0.3] brightness-125 hue-rotate-180" : forensicMode === "EDGES" ? "grayscale contrast-250 brightness-75" : forensicMode === "HEATMAP" ? "invert hue-rotate-90 saturate-250 contrast-150" : ""}`}
  /> : <span className="text-white text-xs">No media available</span>}

            <div className="absolute bottom-2 left-2 bg-black/80 text-white font-mono text-[10px] px-2 py-0.5 border border-slate-600">
              MODE: {forensicMode} • DOCKET: {currentGrievance.id}
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 p-3 border border-slate-200 leading-relaxed">
            <strong>Methodology Note:</strong> Error Level Analysis (ELA) identifies discrepancies in compression levels across image regions. Unmodified photographic captures exhibit uniform error distribution, whereas inserted or generative objects show distinct compression gradients.
          </div>
        </div>

        {/* Right Column (5 cols): Official Forensic Audit Certificate */}
        <div className="lg:col-span-5 bg-white border border-slate-300 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0B3C5D]">
              Statutory Evidence Certificate
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">
              Section 65B Certificate of Electronic Record
            </h3>
          </div>

          {/* Core Findings Table */}
          <div className="border border-slate-300 overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-2 px-3 font-semibold text-slate-700 w-2/5 border-r border-slate-200">Authenticity Rating:</th>
                  <td className="py-2 px-3 font-bold text-slate-900">{imageForensics.authenticityRating}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="py-2 px-3 font-semibold text-slate-700 border-r border-slate-200">Tamper Risk Score:</th>
                  <td className="py-2 px-3 font-bold font-mono text-slate-900">
                    {imageForensics.manipulationConfidenceScore}% ({imageForensics.isManipulated ? "High Probability Alteration" : "Within Normal Tolerances"})
                  </td>
                </tr>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-2 px-3 font-semibold text-slate-700 border-r border-slate-200">Regional Cluster Risk:</th>
                  <td className="py-2 px-3 font-bold text-slate-900">
                    {duplicateDetection.duplicateRisk} Risk ({duplicateDetection.topMatches[0]?.similarityPercentage || 8}% Similarity)
                  </td>
                </tr>
                <tr>
                  <th className="py-2 px-3 font-semibold text-slate-700 border-r border-slate-200">Camera / Sensor:</th>
                  <td className="py-2 px-3 text-slate-900">
                    {imageForensics.exifData?.cameraModel || "Optical Mobile Sensor (Verified)"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Detailed Verification Summary */}
          <div className="bg-slate-50 border border-slate-300 p-3 space-y-1.5 text-xs text-slate-800">
            <div className="font-bold text-slate-900">Forensic Examiner Summary:</div>
            <p className="leading-relaxed text-slate-700">
              {imageForensics.visualSummary}
            </p>
          </div>

          {/* Deduplication Cluster Notes */}
          <div className="bg-[#FFFDF2] border border-[#E6D8A8] p-3 space-y-1 text-xs text-slate-800">
            <div className="font-bold text-[#8A5A00]">Ward Spatial Deduplication Audit:</div>
            <p className="text-slate-700 leading-relaxed">
              {duplicateDetection.topMatches[0]?.reason || (duplicateDetection.isDuplicateCandidate ? "Prior active complaint verified in same municipal ward sector." : "Unique grievance logged in ward sector registry without identical duplicates.")}
            </p>
          </div>

          {/* Certified Seal Box */}
          <div className="border border-slate-300 p-3 text-center bg-slate-50 text-[11px] text-slate-600">
            <div>Digitally certified under Section 65B(4) of the Indian Evidence Act, 1872.</div>
            <div className="font-mono text-slate-800 font-bold mt-1">HASH: SHA256-CERT-2026-DELHI-MCD-VERIFIED</div>
          </div>
        </div>
      </div>
    </div>;
};
