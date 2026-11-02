import React, { useState } from 'react';
import { GrievanceRecord } from '../types/grievance';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Eye, 
  Layers, 
  Radar, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Maximize2,
  Sliders,
  FileSearch,
  ScanLine,
  Compass
} from 'lucide-react';

interface VisualForensicsLabProps {
  grievances: GrievanceRecord[];
  selectedGrievanceId?: string | null;
  onSelectGrievance: (id: string) => void;
  lang: 'en' | 'hi';
}

export const VisualForensicsLab: React.FC<VisualForensicsLabProps> = ({
  grievances,
  selectedGrievanceId,
  onSelectGrievance,
  lang
}) => {
  const [activeId, setActiveId] = useState<string>(
    selectedGrievanceId || grievances[2]?.id || grievances[0]?.id
  );

  const [forensicMode, setForensicMode] = useState<
    'ORIGINAL' | 'ELA' | 'EDGES' | 'HEATMAP'
  >('ELA');

  const currentGrievance = grievances.find((g) => g.id === activeId) || grievances[0];
  const { imageForensics, duplicateDetection } = currentGrievance;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold tracking-tight">
              {lang === 'en' ? 'AI Visual Forensics & Duplicate Inspection Lab' : 'एआई दृश्य फॉरेंसिक एवं डुप्लिकेट लैब'}
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Deep forensic analysis tool for verifying civic evidence. Detects synthetic generative AI artifacts, Photoshop copy-move tampering, and clusters geographic duplicate submissions within municipal wards.
          </p>
        </div>

        {/* Docket Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 shrink-0">Inspect Docket:</label>
          <select
            value={currentGrievance.id}
            onChange={(e) => {
              setActiveId(e.target.value);
              onSelectGrievance(e.target.value);
            }}
            className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
          >
            {grievances.map((g) => (
              <option key={g.id} value={g.id}>
                {g.id} ({g.departmentCode} - {g.imageForensics.isManipulated ? 'TAMPERED' : 'AUTHENTIC'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Forensic Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Visual Inspector & Lens Modes */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                {currentGrievance.id}
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">
                {currentGrievance.title}
              </h3>
            </div>

            {/* Forensic Inspection Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setForensicMode('ORIGINAL')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  forensicMode === 'ORIGINAL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Original Photo
              </button>
              <button
                onClick={() => setForensicMode('ELA')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  forensicMode === 'ELA'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ELA Simulation
              </button>
              <button
                onClick={() => setForensicMode('EDGES')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  forensicMode === 'EDGES'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Edge Gradient
              </button>
              <button
                onClick={() => setForensicMode('HEATMAP')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  forensicMode === 'HEATMAP'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Anomalous Heatmap
              </button>
            </div>
          </div>

          {/* Interactive Image Frame */}
          <div className="relative rounded-xl overflow-hidden bg-slate-950 h-80 sm:h-96 flex items-center justify-center border border-slate-800">
            {currentGrievance.imageUrl ? (
              <div className="w-full h-full relative">
                <img
                  src={currentGrievance.imageUrl}
                  alt="Forensic Target"
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    forensicMode === 'ELA'
                      ? 'contrast-200 saturate-200 invert-[0.3] brightness-125 hue-rotate-180'
                      : forensicMode === 'EDGES'
                      ? 'grayscale contrast-250 brightness-75'
                      : forensicMode === 'HEATMAP'
                      ? 'invert hue-rotate-90 saturate-250 contrast-150'
                      : ''
                  }`}
                />

                {/* Overlaid Forensic HUD */}
                <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-emerald-400 bg-black/75 px-2 py-0.5 rounded border border-emerald-500/40">
                      SCAN_MODE: {forensicMode}
                    </span>
                    <span className="font-mono text-[10px] text-amber-300 bg-black/75 px-2 py-0.5 rounded border border-amber-500/40">
                      CONFIDENCE: {imageForensics.manipulationConfidenceScore}%
                    </span>
                  </div>

                  {imageForensics.isManipulated && (
                    <div className="self-center bg-rose-600/90 text-white text-xs font-bold px-3 py-1 rounded-full border border-rose-400 animate-pulse flex items-center gap-1.5 shadow-lg">
                      <AlertTriangle className="w-4 h-4" />
                      SYNTHETIC / TAMPERED ARTIFACTS ISOLATED
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 bg-black/75 p-2 rounded border border-slate-700">
                    <span>SENSOR: {imageForensics.exifData?.cameraModel || 'Optical Digital Sensor'}</span>
                    <span>TIMESTAMP: {imageForensics.exifData?.timestamp || 'Captured on Site'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-xs">No photographic evidence provided for this docket.</div>
            )}
          </div>

          {/* Forensic Mode Explainer */}
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <ScanLine className="w-4 h-4 text-blue-600" />
              <span>Inspection Mode Rationale:</span>
            </div>
            {forensicMode === 'ELA' && (
              <p>
                <strong>Error Level Analysis (ELA):</strong> Highlights JPEG compression error rate variations. Pasted, clone-stamped, or AI-inpainted portions exhibit glaringly brighter noise signatures than the background camera grain.
              </p>
            )}
            {forensicMode === 'EDGES' && (
              <p>
                <strong>Sobel Edge Gradient:</strong> Exposes unnatural blur boundaries or anti-aliased cutouts typical of synthetic composites or Photoshop magnetic lasso operations.
              </p>
            )}
            {forensicMode === 'HEATMAP' && (
              <p>
                <strong>Pixel Anomaly Heatmap:</strong> Isolates aberrant chrominance gradients and inconsistent illumination directions between foreground objects and street scenery.
              </p>
            )}
            {forensicMode === 'ORIGINAL' && (
              <p>
                <strong>Standard Photographic Evidence:</strong> Inspect natural field lighting, perspective, and visual context as submitted by citizen.
              </p>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Forensics Metadata & Duplicate Radar */}
        <div className="lg:col-span-5 space-y-6">
          {/* Integrity Scorecard */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                AI Forensic Verdict
              </h3>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                imageForensics.isManipulated
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {imageForensics.authenticityRating}
              </span>
            </div>

            {/* Score progress bars */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-medium text-slate-700 mb-1">
                  <span>Authenticity Confidence</span>
                  <span className="font-bold">{imageForensics.manipulationConfidenceScore}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      imageForensics.isManipulated ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${imageForensics.manipulationConfidenceScore}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-slate-700 mb-1">
                  <span>Synthetic / AI Diffusion Probability</span>
                  <span className="font-bold">{imageForensics.aiGeneratedProbability}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      imageForensics.aiGeneratedProbability > 50 ? 'bg-rose-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${imageForensics.aiGeneratedProbability}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Detected Artifacts list */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                Observed Artifact Signatures:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {imageForensics.detectedArtifacts.map((art, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                    <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>{art}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* EXIF Data */}
            <div className="bg-slate-900 text-slate-200 rounded-xl p-3 text-[11px] font-mono space-y-1">
              <div className="text-amber-400 font-bold text-[10px] uppercase">Sensor & EXIF Metadata</div>
              <div>Camera: {imageForensics.exifData?.cameraModel || 'Optical Camera Device'}</div>
              <div>Software: {imageForensics.exifData?.softwareUsed || 'Native Firmware'}</div>
              <div>Timestamp: {imageForensics.exifData?.timestamp || '2026-11-01 IST'}</div>
              <div>GPS Embedded: {imageForensics.exifData?.gpsEmbedded ? 'YES (Lat/Lng Verified)' : 'NO'}</div>
            </div>
          </div>

          {/* SPATIAL DUPLICATE CLUSTERING RADAR */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Radar className="w-4 h-4 text-purple-600" />
                Duplicate Spatial Cluster Radar
              </h3>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                duplicateDetection.duplicateRisk === 'HIGH'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {duplicateDetection.duplicateRisk} Risk
              </span>
            </div>

            {duplicateDetection.topMatches.length > 0 ? (
              <div className="space-y-3">
                <div className="text-xs text-slate-600">
                  Recommendation: <strong className="text-purple-900">{duplicateDetection.recommendation.replace(/_/g, ' ')}</strong>
                </div>

                {duplicateDetection.topMatches.map((m, idx) => (
                  <div key={idx} className="bg-purple-50/70 border border-purple-200 rounded-xl p-3 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-purple-900">{m.matchedId}</span>
                      <span className="font-bold text-purple-800 bg-purple-200 px-2 py-0.5 rounded">
                        {m.similarityPercentage}% Match
                      </span>
                    </div>

                    <div className="font-semibold text-slate-800">{m.matchedTitle}</div>
                    <div className="text-slate-600 text-[11px]">
                      Distance: <strong className="text-slate-900">{m.distanceMeters}m</strong> away • Reported {m.createdHoursAgo}h ago
                    </div>
                    <p className="text-purple-900 text-[11px] italic bg-purple-100/60 p-2 rounded">
                      "{m.reason}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-500" />
                <span>No duplicate civic reports found within 500m radius. Unique issue.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
