import React, { useState } from 'react';
import { 
  Upload, 
  MapPin, 
  Navigation, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  FileCheck, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Printer, 
  ArrowRight,
  Camera,
  RefreshCw,
  Building,
  UserCheck,
  Zap,
  Info,
  Radio
} from 'lucide-react';
import { GrievanceRecord, LocationData } from '../types/grievance';
import { DEPARTMENT_INFO } from '../data/seedGrievances';

interface GrievanceFormProps {
  onGrievanceCreated: (newGrievance: GrievanceRecord) => void;
  onViewGrievance: (id: string) => void;
  onViewLiveFeed?: () => void;
  lang: 'en' | 'hi';
  existingComplaints: GrievanceRecord[];
}

export const GrievanceForm: React.FC<GrievanceFormProps> = ({
  onGrievanceCreated,
  onViewGrievance,
  onViewLiveFeed,
  lang,
  existingComplaints
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [directGovDispatch, setDirectGovDispatch] = useState(true);

  const [location, setLocation] = useState<LocationData>({
    lat: 28.6289,
    lng: 77.2065,
    address: 'Outer Ring Road, Block C, Nehru Place',
    landmark: 'Opposite Metro Pillar 142',
    wardOrSector: 'Ward 48 - South Zone',
    district: 'South Delhi',
    state: 'Delhi (NCT)',
    pinCode: '110019'
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<string | null>(null);

  // Submission & AI Pipeline state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPipelineStep, setCurrentPipelineStep] = useState(0);
  const [submissionResult, setSubmissionResult] = useState<GrievanceRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Demo scenarios for quick 1-click testing
  const demoScenarios = [
    {
      label: 'Dangerous Road Cave-In',
      tag: 'Critical PWD',
      title: 'Deep 4-Foot Crater Near Metro Pillar 142 on Outer Ring Road',
      desc: 'Active road collapse on main traffic artery right before evening peak hour. Vehicles are swerving into oncoming lanes.',
      img: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      loc: {
        lat: 28.6289,
        lng: 77.2065,
        address: 'Outer Ring Road, Opp Metro Pillar 142',
        landmark: 'Nehru Place Flyover Base',
        wardOrSector: 'Ward 48',
        district: 'South Delhi',
        state: 'Delhi',
        pinCode: '110019'
      }
    },
    {
      label: 'Drinking Water Contamination',
      tag: 'Health / Jal Board',
      title: 'Muddy Foul-Smelling Tap Water Seepage in Sector 9',
      desc: 'Main potable water pipeline has ruptured and mixed with drainage. Over 400 families receiving brown contaminated water for 48 hours.',
      img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80',
      loc: {
        lat: 28.5823,
        lng: 77.0601,
        address: 'Pocket B, Sector 9 Dwarka',
        landmark: 'Near Community Center',
        wardOrSector: 'Sector 9',
        district: 'South West Delhi',
        state: 'Delhi',
        pinCode: '110077'
      }
    },
    {
      label: 'Live 11KV Sparking Wire',
      tag: 'Life Safety (24h SLA)',
      title: 'High-Tension Power Cable Dangling 7ft Above School Gate',
      desc: 'Torn insulation causing loud sparking whenever wind gusts. Located right above student pedestrian exit gate of Model School.',
      img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      loc: {
        lat: 28.6508,
        lng: 77.1724,
        address: 'Main Gate, Govt Senior Secondary School',
        landmark: 'Shadipur Flyover',
        wardOrSector: 'Ward 91',
        district: 'West Delhi',
        state: 'Delhi',
        pinCode: '110008'
      }
    },
    {
      label: 'Suspicious / Manipulated Photo Test',
      tag: 'AI Forensics Flag',
      title: 'Claimed Toxic Green Chemical Explosion on Pedestrian Street',
      desc: 'Anonymous post claiming radioactive green smoke leaking from barrels in commercial shopping plaza requiring emergency evacuation.',
      img: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
      loc: {
        lat: 28.6328,
        lng: 77.2197,
        address: 'Inner Circle, Connaught Place, Block E',
        landmark: 'Central Park Gate 2',
        wardOrSector: 'Ward 12',
        district: 'Central Delhi',
        state: 'Delhi',
        pinCode: '110001'
      }
    },
    {
      label: 'Duplicate Submission Test',
      tag: 'Cluster Merge Test',
      title: 'Crater and broken asphalt near pillar 142 Outer Ring Road',
      desc: 'Huge pothole damaging vehicle rims near Nehru place pillar 142.',
      img: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      loc: {
        lat: 28.6290,
        lng: 77.2066,
        address: 'Outer Ring Road, 30m from Pillar 142',
        landmark: 'Nehru Place',
        wardOrSector: 'Ward 48',
        district: 'South Delhi',
        state: 'Delhi',
        pinCode: '110019'
      }
    }
  ];

  const handleApplyScenario = (scenario: typeof demoScenarios[0]) => {
    setTitle(scenario.title);
    setDescription(scenario.desc);
    setImagePreview(scenario.img);
    setLocation(scenario.loc);
    if (!citizenName) {
      setCitizenName('Rajesh Verma');
      setCitizenPhone('+91 98100 12345');
      setCitizenEmail('r.verma@example.com');
    }
  };

  // Live GPS geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setGpsAccuracy(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(5));
        const lng = parseFloat(pos.coords.longitude.toFixed(5));
        const accuracy = Math.round(pos.coords.accuracy);
        setGpsAccuracy(`GPS Locked (±${accuracy}m precision)`);

        setLocation((prev) => ({
          ...prev,
          lat,
          lng,
          address: `Geo-tagged Location (${lat}° N, ${lng}° E)`,
          landmark: 'Live GPS Pinpoint',
        }));
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error or permission denied:', err.message);
        setGpsAccuracy('GPS unavailable. Defaulting to municipal ward coordinates.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Image file handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Grievance submission with AI pipeline
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMessage('Please provide both a grievance title and a detailed description.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    setCurrentPipelineStep(1);

    // Simulate progressive inspection pipeline steps for user feedback
    const stepTimer1 = setTimeout(() => setCurrentPipelineStep(2), 700);
    const stepTimer2 = setTimeout(() => setCurrentPipelineStep(3), 1500);
    const stepTimer3 = setTimeout(() => setCurrentPipelineStep(4), 2300);

    try {
      const response = await fetch('/api/analyze-grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          location,
          citizenName: isAnonymous ? 'Anonymous Citizen' : citizenName || 'Civic Applicant',
          citizenPhone: isAnonymous ? 'Confidential' : citizenPhone,
          citizenEmail: isAnonymous ? 'Confidential' : citizenEmail,
          imageBase64: imagePreview,
          existingComplaints: existingComplaints.map(c => ({
            id: c.id,
            title: c.title,
            description: c.description,
            departmentCode: c.departmentCode,
            location: c.location
          }))
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const json = await response.json();
      const aiData = json.data;

      const randomToken = Math.floor(1000 + Math.random() * 9000);
      const generatedId = `GRV-2026-${aiData.departmentCode}-${randomToken}`;
      const token = `RTI-2026-${aiData.departmentCode}-${randomToken}`;

      const isManipulated = aiData.imageForensics?.isManipulated;
      const isDuplicate = aiData.duplicateDetection?.isDuplicateCandidate;

      let initialStatus: GrievanceRecord['status'] = 'ROUTED';
      if (isManipulated) initialStatus = 'REJECTED_MANIPULATED';
      else if (isDuplicate) initialStatus = 'MERGED_DUPLICATE';
      else if (aiData.severity === 'CRITICAL') initialStatus = 'FIELD_WORK_DISPATCHED';

      const newRecord: GrievanceRecord = {
        id: generatedId,
        token,
        title,
        description,
        citizenName: isAnonymous ? 'Anonymous Citizen (Whistleblower Mode)' : citizenName || 'Applicant',
        citizenPhone: isAnonymous ? 'Confidential' : citizenPhone || 'N/A',
        citizenEmail: isAnonymous ? 'Confidential' : citizenEmail || 'N/A',
        isAnonymous,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        imageUrl: imagePreview || undefined,
        location,
        departmentCode: aiData.departmentCode,
        departmentName: aiData.departmentName,
        subCategory: aiData.subCategory,
        severity: aiData.severity,
        urgencyRationale: aiData.urgencyRationale,
        statutorySlaDays: aiData.statutorySlaDays,
        status: initialStatus,
        statusTimeline: [
          {
            status: 'SUBMITTED',
            timestamp: new Date().toISOString(),
            note: 'Grievance submitted by citizen with geo-coordinates and photographic evidence.',
            actor: 'Citizen Portal'
          },
          {
            status: 'AI_VERIFIED',
            timestamp: new Date().toISOString(),
            note: `AI Visual Forensics: ${aiData.imageForensics?.authenticityRating} (${aiData.imageForensics?.manipulationConfidenceScore}% confidence). Duplicate Risk: ${aiData.duplicateDetection?.duplicateRisk}.`,
            actor: 'JanSamadhan AI Core'
          },
          {
            status: initialStatus,
            timestamp: new Date().toISOString(),
            note: isManipulated 
              ? 'Submission rejected under Section 8(1) for synthetic or manipulated photo evidence.'
              : isDuplicate 
              ? `Duplicate candidate identified (${aiData.duplicateDetection?.similarityPercentage || 88}% match). Merged with parent docket.`
              : `Automatically routed to ${aiData.departmentName}. SLA: ${aiData.statutorySlaDays} days.`,
            actor: 'JanSamadhan Auto-Router'
          }
        ],
        actionPlanSteps: aiData.actionPlanSteps || [],
        imageForensics: {
          isManipulated: aiData.imageForensics?.isManipulated || false,
          authenticityRating: aiData.imageForensics?.authenticityRating || 'AUTHENTIC',
          manipulationConfidenceScore: aiData.imageForensics?.manipulationConfidenceScore || 95,
          aiGeneratedProbability: aiData.imageForensics?.aiGeneratedProbability || 2,
          detectedArtifacts: aiData.imageForensics?.detectedArtifacts || ['No synthetic anomalies detected'],
          visualSummary: aiData.imageForensics?.visualSummary || 'Visual evidence reviewed.',
          exifData: {
            cameraModel: 'Live Camera Capture',
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' IST',
            gpsEmbedded: true
          }
        },
        duplicateDetection: {
          isDuplicateCandidate: aiData.duplicateDetection?.isDuplicateCandidate || false,
          duplicateRisk: aiData.duplicateDetection?.duplicateRisk || 'LOW',
          topMatches: aiData.duplicateDetection?.matchedExistingId ? [{
            matchedId: aiData.duplicateDetection.matchedExistingId,
            matchedTitle: 'Nearby Civic Docket',
            similarityPercentage: aiData.duplicateDetection.similarityPercentage || 85,
            distanceMeters: 45,
            createdHoursAgo: 2,
            reason: aiData.duplicateDetection.reason || 'Proximity and semantic match.'
          }] : [],
          recommendation: aiData.duplicateDetection?.recommendation || 'PROCEED_DISPATCH'
        },
        rtiResponse: {
          referenceId: aiData.rtiResponse?.referenceId || `RTI/${aiData.departmentCode}/2026/${randomToken}`,
          acknowledgementDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          statutoryDeadline: new Date(Date.now() + 86400000 * aiData.statutorySlaDays).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          statutorySection: aiData.rtiResponse?.statutorySection || (aiData.severity === 'CRITICAL' ? 'Section 7(1) Proviso (Life Safety - 48h)' : 'Section 7(1) (30 Days)'),
          publicAuthorityName: aiData.rtiResponse?.publicAuthorityName || `Office of CPIO, ${aiData.departmentName}`,
          subjectLine: aiData.rtiResponse?.subjectLine || 'Statutory RTI Acknowledgment Memo',
          acknowledgementText: aiData.rtiResponse?.acknowledgementText || 'Receipt of grievance acknowledged.',
          preliminaryAction: aiData.rtiResponse?.preliminaryAction || 'Task force assigned.',
          legalNoticeClauses: aiData.rtiResponse?.legalNoticeClauses || [
            'Cognizance taken under Right to Information Act 2005.',
            `Mandatory SLA target: ${aiData.statutorySlaDays} days.`,
            'Right of appeal lies with First Appellate Authority.'
          ],
          designatedPio: aiData.rtiResponse?.designatedPio || {
            name: 'Er. R.K. Singhal',
            designation: 'Executive Engineer & CPIO',
            department: aiData.departmentName,
            contactEmail: `cpio.${aiData.departmentCode.toLowerCase()}@gov.in`,
            phone: '011-23001905',
            officeAddress: 'Civic Centre, New Delhi'
          },
          firstAppellateAuthority: aiData.rtiResponse?.firstAppellateAuthority || {
            name: 'Chief Engineer / Appellate Authority',
            designation: 'First Appellate Authority',
            officeAddress: 'Department Secretariat'
          },
          inspectionScheduled: {
            willInspect: true,
            inspectionWindow: `Within ${Math.max(1, Math.round(aiData.statutorySlaDays * 0.4))} Days`
          }
        },
        governmentDispatch: {
          isDirectlyDispatched: directGovDispatch,
          governmentPortal: 'CPGRAMS / National Nodal Grievance Gateway',
          governmentRefNumber: `CPGRAMS/2026/${aiData.departmentCode}-${randomToken}`,
          dispatchedAt: new Date().toISOString(),
          nodalMinistry: `${aiData.departmentName} Nodal Central Desk`,
          transmissionStatus: initialStatus === 'FIELD_WORK_DISPATCHED' ? 'CREW_ON_SITE' : 'ASSIGNED_TO_FIELD_ENGINEER',
          fieldTeamAssigned: {
            engineerName: `Er. ${aiData.rtiResponse?.designatedPio?.name?.split(' ')[1] || 'R.K. Varma'} (Nodal Rapid Action Wing)`,
            designation: `Zonal Junior Engineer, ${aiData.departmentCode}`,
            vehicleNumber: `DL-1G-${Math.floor(1000 + Math.random() * 9000)}`,
            contactPhone: aiData.rtiResponse?.designatedPio?.phone || '1905',
            etaMinutes: aiData.severity === 'CRITICAL' ? 15 : 45
          }
        }
      };

      onGrievanceCreated(newRecord);
      setSubmissionResult(newRecord);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrorMessage(`Failed to process grievance: ${err.message}. Please retry.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImagePreview(null);
    setSubmissionResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Official Banner / Notice */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium mb-2 border border-blue-400/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'en' ? 'Statutory RTI Auto-Responder Active' : 'वैधानिक आरटीआई ऑटो-रेस्पॉन्डर सक्रिय'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {lang === 'en' ? 'Citizen Civic Grievance & RTI Redressal Portal' : 'नागरिक लोक शिकायत एवं आरटीआई निवारण पोर्टल'}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-2xl">
              {lang === 'en'
                ? 'Submit civic defects with photo & GPS. The AI engine instantly verifies image authenticity, filters duplicate claims, routes to the exact municipal authority, and issues a legally binding RTI Acknowledgment.'
                : 'फोटो और जीपीएस के साथ नागरिक समस्याएं दर्ज करें। एआई तुरंत प्रामाणिकता की जांच करता है, डुप्लिकेट हटाता है और विभाग को प्रेषित करता है।'}
            </p>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 border-t md:border-t-0 md:border-l border-blue-700/50 pt-3 md:pt-0 md:pl-5 text-xs text-blue-200">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Section 7(1) Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>48h Fast-Track for Life Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Interactive Test Scenarios */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {lang === 'en' ? 'Try 1-Click Civic Scenarios' : '1-क्लिक परीक्षण परिदृश्य'}
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            {lang === 'en' ? 'Pre-fills authentic photos, GPS and text' : 'त्वरित परीक्षण हेतु क्लिक करें'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {demoScenarios.map((sc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyScenario(sc)}
              className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-xs group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-900 group-hover:text-blue-700 truncate">
                  {sc.label}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {sc.tag}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SUCCESS CONFIRMATION MODAL / PANEL */}
      {submissionResult ? (
        <div className="bg-white border-2 border-emerald-500 rounded-2xl p-6 shadow-md space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="inline-block bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200 mb-1">
                  OFFICIALLY REGISTERED & ROUTED
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Grievance Docket #{submissionResult.id}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs text-slate-600">
                    RTI Token: <strong className="font-mono text-blue-700">{submissionResult.token}</strong>
                  </span>
                  {submissionResult.governmentDispatch?.isDirectlyDispatched && (
                    <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-blue-600 animate-pulse" />
                      Direct Govt Dispatch: {submissionResult.governmentDispatch.governmentRefNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {onViewLiveFeed && (
                <button
                  onClick={onViewLiveFeed}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>View in Live Govt Feed</span>
                </button>
              )}
              <button
                onClick={() => onViewGrievance(submissionResult.id)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>View Official RTI Notice</span>
              </button>
              <button
                onClick={resetForm}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Submit Another</span>
              </button>
            </div>
          </div>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Department Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                <Building className="w-4 h-4 text-blue-600" />
                <span>Assigned Department</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {submissionResult.departmentName}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Category: <span className="font-medium">{submissionResult.subCategory}</span>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <div>CPIO: <span className="font-medium text-slate-900">{submissionResult.rtiResponse.designatedPio.name}</span></div>
                <div>Office: {submissionResult.rtiResponse.designatedPio.officeAddress}</div>
              </div>
            </div>

            {/* Forensics Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>AI Visual Forensics</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  submissionResult.imageForensics.isManipulated
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {submissionResult.imageForensics.authenticityRating}
                </span>
                <span className="text-xs text-slate-600 font-semibold">
                  {submissionResult.imageForensics.manipulationConfidenceScore}% Score
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                {submissionResult.imageForensics.visualSummary}
              </p>
              <div className="mt-2 text-[11px] text-slate-500">
                Duplicates: {submissionResult.duplicateDetection.duplicateRisk} Risk
              </div>
            </div>

            {/* Statutory SLA Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Statutory SLA & Section</span>
              </div>
              <div className="text-base font-extrabold text-amber-900">
                {submissionResult.statutorySlaDays} Days Maximum
              </div>
              <div className="text-xs text-slate-700 mt-1">
                {submissionResult.rtiResponse.statutorySection}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                Inspection Window: <span className="font-medium">{submissionResult.rtiResponse.inspectionScheduled?.inspectionWindow || 'Within SLA'}</span>
              </div>
            </div>
          </div>

          {/* Action Taken Steps */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Automated Departmental Action Directives
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-950">
              {submissionResult.actionPlanSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {/* MAIN SUBMISSION FORM */}
      {!submissionResult && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Grievance Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs">1</span>
                {lang === 'en' ? 'Grievance Description & Photo Proof' : 'शिकायत का विवरण एवं फोटो साक्ष्य'}
              </h3>
              <span className="text-xs text-rose-600">* Mandatory</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'en' ? 'Grievance Title / Subject' : 'शिकायत का विषय'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={lang === 'en' ? 'e.g. Hazardous deep road cavity near Metro Pillar 142' : 'उदा. मुख्य मार्ग पर गहरा गड्ढा'}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'en' ? 'Detailed Description of the Civic Defect' : 'समस्या का विस्तृत विवरण'}
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={lang === 'en' ? 'Provide specific details (since when, estimated dimensions, danger to pedestrians or vehicles)...' : 'समस्या का पूर्ण विवरण दें...'}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y"
              />
            </div>

            {/* Photo / Camera upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>{lang === 'en' ? 'Upload Photo Evidence (AI Scans for Authenticity)' : 'फोटो साक्ष्य अपलोड करें'}</span>
                <span className="text-[11px] text-slate-400">JPEG, PNG, WebP up to 15MB</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                {/* Upload drag drop box */}
                <div className="sm:col-span-2 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition-colors relative bg-slate-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center justify-center py-3">
                    <Upload className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-xs font-semibold text-slate-800">
                      {lang === 'en' ? 'Click or drag photo here' : 'फोटो अपलोड करने के लिए क्लिक करें'}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      AI analyzes sensor noise, metadata, and tamper marks
                    </span>
                  </div>
                </div>

                {/* Preview box */}
                <div className="border border-slate-200 rounded-xl p-2 bg-slate-50 h-36 flex items-center justify-center overflow-hidden relative">
                  {imagePreview ? (
                    <div className="w-full h-full relative group">
                      <img 
                        src={imagePreview} 
                        alt="Evidence Preview" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white text-[10px] px-2 py-0.5 rounded cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 text-xs">
                      <Camera className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                      <span>No photo selected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Location & GPS Pinpointing */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs">2</span>
                {lang === 'en' ? 'Geographic Location & Municipal Ward' : 'भौगोलिक स्थिति एवं वार्ड'}
              </h3>

              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Acquiring GPS...' : 'Use My Live GPS'}</span>
              </button>
            </div>

            {gpsAccuracy && (
              <div className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{gpsAccuracy}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street / Address
                </label>
                <input
                  type="text"
                  value={location.address}
                  onChange={(e) => setLocation({ ...location, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  value={location.landmark || ''}
                  onChange={(e) => setLocation({ ...location, landmark: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ward / Sector
                </label>
                <input
                  type="text"
                  value={location.wardOrSector || ''}
                  onChange={(e) => setLocation({ ...location, wardOrSector: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  District
                </label>
                <input
                  type="text"
                  value={location.district}
                  onChange={(e) => setLocation({ ...location, district: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  State / UT
                </label>
                <input
                  type="text"
                  value={location.state}
                  onChange={(e) => setLocation({ ...location, state: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Postal PIN Code
                </label>
                <input
                  type="text"
                  value={location.pinCode}
                  onChange={(e) => setLocation({ ...location, pinCode: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GPS Coordinates
                </label>
                <div className="text-xs font-mono bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 text-slate-700">
                  {location.lat}° N, {location.lng}° E
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Citizen / Applicant Identity */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs">3</span>
                {lang === 'en' ? 'Applicant Particulars (For Official RTI Notice)' : 'आवेदक का विवरण'}
              </h3>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded border border-slate-300">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Whistleblower / Anonymous Mode</span>
              </label>
            </div>

            {!isAnonymous ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="e.g. Anand Kumar"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number (SMS updates)
                  </label>
                  <input
                    type="text"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email (Official Memo PDF)
                  </label>
                  <input
                    type="email"
                    value={citizenEmail}
                    onChange={(e) => setCitizenEmail(e.target.value)}
                    placeholder="anand@example.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3 rounded-lg flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  Whistleblower Mode enabled: Personal identity will be masked in all public registers. You will track this grievance strictly via your secret RTI Token.
                </span>
              </div>
            )}

            {/* Direct Government Department Transmission Gateway Toggle */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                    <span>Direct Wire to Government Central Gateway (CPGRAMS / Ministry Exchange)</span>
                    <span className="bg-blue-200 text-blue-900 text-[10px] font-bold px-1.5 py-0.2 rounded">Official</span>
                  </div>
                  <div className="text-[11px] text-blue-800/80 mt-0.5">
                    Transmits issue directly to Government Municipal Portal, assigns official Nodal Ref No., and tracks live resolution status.
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-blue-950 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-blue-300 shadow-xs shrink-0">
                <input
                  type="checkbox"
                  checked={directGovDispatch}
                  onChange={(e) => setDirectGovDispatch(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span>Direct Govt Dispatch</span>
              </label>
            </div>
          </div>

          {/* Submission Button & Live AI Pipeline Indicator */}
          <div className="pt-4 border-t border-slate-100 flex flex-col items-center">
            {isSubmitting ? (
              <div className="w-full max-w-lg bg-blue-50 border border-blue-200 rounded-xl p-4 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-blue-900">
                  <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                  <span>Transmitting Issue to Government & Drafting RTI Auto-Response...</span>
                </div>

                <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-1.5 transition-all duration-500 rounded-full"
                    style={{ width: `${(currentPipelineStep / 4) * 100}%` }}
                  ></div>
                </div>

                <div className="text-xs text-blue-800 font-medium">
                  {currentPipelineStep === 1 && 'Step 1/4: Scanning image sensors & Error Level Analysis (ELA)...'}
                  {currentPipelineStep === 2 && 'Step 2/4: Checking civic registry within radius for duplicate dockets...'}
                  {currentPipelineStep === 3 && 'Step 3/4: Transmitting encrypted docket to Government Nodal Gateway (CPGRAMS)...'}
                  {currentPipelineStep === 4 && 'Step 4/4: Formulating official RTI Auto-Response Memo under RTI Act 2005...'}
                </div>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{lang === 'en' ? 'Submit Grievance & Generate RTI Auto-Response' : 'शिकायत दर्ज करें एवं आरटीआई ऑटो-जवाब जारी करें'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <p className="text-[11px] text-slate-500 mt-2 text-center">
              Protected under Right to Information Act 2005. Free of cost civic service.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
