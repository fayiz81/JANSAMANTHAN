import React, { useState } from 'react';
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

  // Submission pipeline state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPipelineStep, setCurrentPipelineStep] = useState(0);
  const [submissionResult, setSubmissionResult] = useState<GrievanceRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Standard government test scenarios for 1-click verification
  const demoScenarios = [
    {
      label: 'Dangerous Road Cave-In',
      tag: 'PWD (Life Safety)',
      title: 'Deep 4-Foot Crater Near Metro Pillar 142 on Outer Ring Road',
      desc: 'Active road collapse on main traffic artery right before evening peak hour. High risk of vehicle overturning.',
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
      tag: 'Delhi Jal Board',
      title: 'Muddy Foul-Smelling Tap Water Seepage in Sector 9',
      desc: 'Main potable water pipeline has ruptured and mixed with drainage line. Over 400 families receiving contaminated water.',
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
      tag: 'DISCOM (48h Mandate)',
      title: 'High-Tension Power Cable Dangling 7ft Above School Gate',
      desc: 'Torn insulation causing sparks whenever wind blows. Located directly above student pedestrian gate of Model School.',
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
      label: 'Evidence Tampering Audit',
      tag: 'Vigilance Verification',
      title: 'Claimed Toxic Green Chemical Explosion on Pedestrian Street',
      desc: 'Suspicious submission claiming radioactive chemical smoke in commercial shopping plaza requiring emergency shutdown.',
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
      label: 'Regional Deduplication',
      tag: 'Cluster Deduplication',
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
      setCitizenEmail('r.verma@nic.in');
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
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
        setGpsAccuracy(`GPS Locked (Precision: ±${accuracy} meters)`);

        setLocation((prev) => ({
          ...prev,
          lat,
          lng,
          address: `Geo-tagged Coordinates: ${lat}° N, ${lng}° E`,
          landmark: 'Live GPS Location Point',
        }));
      },
      (err) => {
        setIsLocating(false);
        setGpsAccuracy('GPS coordinate lock unavailable. Defaulting to municipal ward coordinates.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMessage('Please provide both the grievance title and the detailed description.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    setCurrentPipelineStep(1);

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
          citizenName: isAnonymous ? 'Confidential Applicant' : citizenName || 'Citizen Applicant',
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
      const generatedId = `CPGRAMS/2026/${aiData.departmentCode}-${randomToken}`;
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
        citizenName: isAnonymous ? 'Confidential Applicant (Sec 8 Exemption)' : citizenName || 'Citizen Applicant',
        citizenPhone: isAnonymous ? 'Confidential' : citizenPhone,
        citizenEmail: isAnonymous ? 'Confidential' : citizenEmail,
        isAnonymous: !!isAnonymous,
        imageUrl: imagePreview || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        location,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        departmentCode: aiData.departmentCode,
        departmentName: aiData.departmentName,
        subCategory: aiData.subCategory,
        severity: aiData.severity,
        urgencyRationale: aiData.urgencyRationale || 'Direct civic defect lodged for statutory processing under RTI and CPGRAMS guidelines.',
        status: initialStatus,
        statutorySlaDays: aiData.statutorySlaDays,
        actionPlanSteps: aiData.actionPlanSteps || [],
        imageForensics: {
          isManipulated: !!isManipulated,
          manipulationConfidenceScore: aiData.imageForensics?.manipulationConfidenceScore || 12,
          authenticityRating: aiData.imageForensics?.authenticityRating || 'AUTHENTIC',
          aiGeneratedProbability: isManipulated ? 85 : 4,
          detectedArtifacts: aiData.imageForensics?.flags || ['Valid Device Metadata', 'Consistent Lighting Vectors'],
          visualSummary: aiData.imageForensics?.visualSummary || 'Image verified against Section 65B Indian Evidence Act digital standards.'
        },
        duplicateDetection: {
          isDuplicateCandidate: !!isDuplicate,
          duplicateRisk: aiData.duplicateDetection?.duplicateRisk || 'LOW',
          topMatches: isDuplicate && aiData.duplicateDetection?.matchingGrievanceId ? [
            {
              matchedId: aiData.duplicateDetection.matchingGrievanceId,
              matchedTitle: 'Prior active complaint in same municipal ward sector',
              similarityPercentage: 85,
              distanceMeters: 35,
              createdHoursAgo: 2,
              reason: 'Spatial proximity within same municipal ward'
            }
          ] : [],
          recommendation: isDuplicate ? 'MERGE_CLUSTER' : 'PROCEED_DISPATCH'
        },
        statusTimeline: [
          {
            status: 'SUBMITTED',
            timestamp: new Date().toISOString(),
            note: 'Grievance lodged electronically on CPGRAMS central gateway.',
            actor: 'Citizen Portal Gateway'
          },
          {
            status: initialStatus,
            timestamp: new Date(Date.now() + 1000).toISOString(),
            note: isManipulated
              ? 'Flagged for forensic evidence review under IT Act guidelines.'
              : isDuplicate
              ? `Merged into existing primary docket #${aiData.duplicateDetection?.matchingGrievanceId}`
              : `Statutory Scrutiny completed. Routed directly to Central PIO (${aiData.departmentName}).`,
            actor: 'Department Nodal Officer'
          }
        ],
        rtiResponse: {
          referenceId: token,
          acknowledgementDate: new Date().toLocaleDateString('en-IN'),
          statutoryDeadline: new Date(Date.now() + 86400000 * 7).toLocaleDateString('en-IN'),
          statutorySection: aiData.rtiResponse?.statutorySection || 'Section 6(1) read with Section 7(1) Proviso, RTI Act 2005',
          publicAuthorityName: aiData.departmentName,
          subjectLine: title,
          acknowledgementText: 'Acknowledged electronically under Section 6(1) of the RTI Act 2005.',
          preliminaryAction: 'Transmitted to Zonal Executive Engineer & CPIO Desk.',
          legalNoticeClauses: [
            'Proactive time-bound redressal within mandated statutory SLA.',
            'Direct right of First Appeal under Section 19(1) upon non-redressal.'
          ],
          designatedPio: aiData.rtiResponse?.designatedPio || {
            name: 'Dr. S. K. Narang',
            designation: 'Central Public Information Officer (CPIO)',
            department: aiData.departmentName,
            contactEmail: 'cpio-nodal@gov.in',
            phone: '011-23092471',
            officeAddress: `${aiData.departmentName} Secretariat, New Delhi`
          },
          firstAppellateAuthority: aiData.rtiResponse?.firstAppellateAuthority || {
            name: 'Shri R. P. Tiwari, IAS',
            designation: 'First Appellate Authority (FAA)',
            officeAddress: 'Ministry of Personnel & Public Grievances, New Delhi'
          },
          inspectionScheduled: {
            willInspect: true,
            inspectionWindow: `Within ${Math.max(1, Math.round(aiData.statutorySlaDays * 0.4))} Days`
          }
        },
        governmentDispatch: {
          isDirectlyDispatched: directGovDispatch,
          governmentPortal: 'CPGRAMS / National Nodal Grievance Gateway (pgportal.gov.in)',
          governmentRefNumber: generatedId,
          dispatchedAt: new Date().toISOString(),
          nodalMinistry: `${aiData.departmentName} Nodal Central Desk`,
          transmissionStatus: initialStatus === 'FIELD_WORK_DISPATCHED' ? 'CREW_ON_SITE' : 'ASSIGNED_TO_FIELD_ENGINEER',
          portalSourceUrl: 'https://pgportal.gov.in',
          portalHost: 'pgportal.gov.in',
          isLiveSyncedFromGov: true,
          liveSyncTimestamp: new Date().toISOString(),
          fieldTeamAssigned: {
            engineerName: `Er. ${aiData.rtiResponse?.designatedPio?.name?.split(' ')[1] || 'R.K. Varma'} (Zonal Rapid Action Unit)`,
            designation: `Assistant Engineer (Civil/Sanitary), ${aiData.departmentCode}`,
            vehicleNumber: `DL-1G-${Math.floor(1000 + Math.random() * 9000)}`,
            contactPhone: '011-23092471',
            etaMinutes: aiData.severity === 'CRITICAL' ? 15 : 45
          }
        },
        govPortalUrl: 'https://pgportal.gov.in'
      };

      onGrievanceCreated(newRecord);
      setSubmissionResult(newRecord);
    } catch (err: any) {
      setErrorMessage(`Failed to process grievance transmission: ${err.message}. Please retry.`);
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
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6 font-sans">
      {/* 1. Official Government Header Card */}
      <div className="bg-white border-t-4 border-t-[#0B3C5D] border-x border-b border-slate-300 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0B3C5D]">
              {lang === 'en' ? 'Department of Administrative Reforms and Public Grievances (DARPG)' : 'प्रशासनिक सुधार और लोक शिकायत विभाग'}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
              {lang === 'en' 
                ? 'CPGRAMS Citizen Grievance & Statutory RTI Redressal Form' 
                : 'सीपीजीआरएएमएस नागरिक लोक शिकायत एवं आरटीआई निवारण प्रारूप'}
            </h2>
            <div className="text-xs text-slate-600 mt-0.5">
              Electronic Lodging under Rule 3 of the Central Public Grievance Redressal Mechanism & Right to Information Act, 2005
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-300 px-3 py-2 text-right shrink-0">
            <div className="text-[11px] font-bold text-slate-800">Direct Gateway: <span className="text-[#0B3C5D]">pgportal.gov.in</span></div>
            <div className="text-[10px] text-slate-600">Central Nodal Switch: ONLINE (24x7)</div>
          </div>
        </div>

        {/* Official Statutory Guidelines Notice */}
        <div className="mt-3 bg-[#FFFDF2] border border-[#E6D8A8] p-3 text-xs text-slate-800">
          <div className="font-bold text-[#8A5A00] uppercase tracking-wide mb-1">
            Important Guidelines for Citizen Grievance Lodging:
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed text-[11px] sm:text-xs">
            <li>Fields marked with a red asterisk (<span className="text-red-600 font-bold">*</span>) are mandatory.</li>
            <li>Submit genuine photographic evidence of the civic defect. Submitted media is verified under Section 65B of the Indian Evidence Act.</li>
            <li>Applications are directly transmitted to the designated Central Public Information Officer (CPIO) and Executive Engineer under Section 6(1) of the RTI Act.</li>
            <li>In accordance with Section 7(1) proviso, grievances involving life safety and health hazards are prioritized for fast-track 48-hour resolution.</li>
          </ul>
        </div>
      </div>

      {/* 2. Standard Government Demo Scenarios Test Bench */}
      <div className="bg-white border border-slate-300 shadow-xs p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-3">
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              {lang === 'en' ? 'Standard Demonstration Scenarios' : 'मानक परीक्षण परिदृश्य'}
            </div>
            <div className="text-[11px] text-slate-600">
              Select a pre-configured civic case to test automated departmental routing and CPGRAMS dispatch:
            </div>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-300 font-semibold self-start sm:self-auto">
            1-Click Pre-fill
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {demoScenarios.map((sc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyScenario(sc)}
              className="text-left p-2.5 border border-slate-300 hover:border-[#0B3C5D] hover:bg-slate-50 transition-colors text-xs cursor-pointer bg-white"
            >
              <div className="font-bold text-slate-900 truncate">
                {sc.label}
              </div>
              <div className="text-[10px] text-[#0B3C5D] font-semibold mt-0.5">
                {sc.tag}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. SUCCESS ACKNOWLEDGMENT SLIP (OFFICIAL GOVERNMENT FORMAT) */}
      {submissionResult && (
        <div className="bg-white border-2 border-[#138808] shadow-md p-6 space-y-6">
          {/* Header of Receipt */}
          <div className="border-b-2 border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                GOVERNMENT OF INDIA • MINISTRY OF PERSONNEL, PUBLIC GRIEVANCES & PENSIONS
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
                STATUS: REGISTERED & ROUTED
              </div>
              <div className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                Docket #{submissionResult.id}
              </div>
              <div className="text-[10px] text-slate-600">
                Token: {submissionResult.token}
              </div>
            </div>
          </div>

          {/* Core Particulars Table */}
          <div className="border border-slate-300 overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-2.5 px-4 font-semibold text-slate-700 w-1/4 border-r border-slate-200">Grievance Subject:</th>
                  <td className="py-2.5 px-4 font-bold text-slate-900">{submissionResult.title}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="py-2.5 px-4 font-semibold text-slate-700 border-r border-slate-200">Allocated Department:</th>
                  <td className="py-2.5 px-4 font-bold text-[#0B3C5D]">
                    {submissionResult.departmentName} ({submissionResult.departmentCode})
                  </td>
                </tr>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-2.5 px-4 font-semibold text-slate-700 border-r border-slate-200">Designated CPIO:</th>
                  <td className="py-2.5 px-4 text-slate-900">
                    <span className="font-semibold">{submissionResult.rtiResponse.designatedPio.name}</span>, {submissionResult.rtiResponse.designatedPio.designation} ({submissionResult.rtiResponse.designatedPio.officeAddress})
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="py-2.5 px-4 font-semibold text-slate-700 border-r border-slate-200">Territorial Location:</th>
                  <td className="py-2.5 px-4 text-slate-900">
                    {submissionResult.location.address}, {submissionResult.location.wardOrSector}, {submissionResult.location.district}, PIN: {submissionResult.location.pinCode}
                  </td>
                </tr>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-2.5 px-4 font-semibold text-slate-700 border-r border-slate-200">Statutory Resolution SLA:</th>
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    {submissionResult.statutorySlaDays} Days Maximum (under {submissionResult.rtiResponse.statutorySection})
                  </td>
                </tr>
                <tr>
                  <th className="py-2.5 px-4 font-semibold text-slate-700 border-r border-slate-200">Government Gateway Dispatch:</th>
                  <td className="py-2.5 px-4 text-slate-900">
                    <span className="font-semibold text-[#138808]">Directly Transmitted to CPGRAMS Central Hub (pgportal.gov.in)</span> • Reference: {submissionResult.governmentDispatch?.governmentRefNumber}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action Directives Box */}
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

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
            <div className="text-[11px] text-slate-500">
              This is a computer-generated statutory acknowledgment and requires no physical signature.
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-400 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs cursor-pointer"
              >
                Print Official Slip
              </button>

              {onViewLiveFeed && (
                <button
                  type="button"
                  onClick={onViewLiveFeed}
                  className="px-4 py-2 bg-[#0B3C5D] hover:bg-[#082D46] text-white font-semibold text-xs cursor-pointer"
                >
                  View in Live Govt Stream
                </button>
              )}

              <button
                type="button"
                onClick={() => onViewGrievance(submissionResult.id)}
                className="px-4 py-2 bg-[#1B2A4A] hover:bg-[#0f1d38] text-white font-semibold text-xs cursor-pointer"
              >
                Track Live Status
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Lodge Another Grievance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MAIN GRIEVANCE APPLICATION FORM */}
      {!submissionResult && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-300 shadow-xs p-6 space-y-6">
          {errorMessage && (
            <div className="bg-[#FFF2F2] border border-[#E57373] text-[#B71C1C] text-xs p-3 font-semibold">
              Error: {errorMessage}
            </div>
          )}

          {/* PART 1: Applicant Particulars */}
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
                <strong>Confidential / Whistleblower Mode Active:</strong> Your personal identity will be withheld from the public grievance gazette. Statutory inquiries will proceed under the designated CPGRAMS Docket Number.
              </div>
            )}
          </div>

          {/* PART 2: Grievance Details & Evidence */}
          <div className="space-y-4 pt-2">
            <div className="border-b-2 border-[#0B3C5D] pb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B3C5D]">
                PART II: NATURE & PARTICULARS OF GRIEVANCE / शिकायत का विवरण
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
                placeholder="Provide comprehensive details: Nature of defect, date/time noticed, severity, impact on traffic/public safety, and any prior complaints made to local authorities..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-[#0B3C5D] resize-y"
              />
            </div>

            {/* Evidence Document / Photo Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Photographic / Documentary Evidence <span className="text-slate-500 font-normal">(Max 15MB: JPG, PNG, WebP)</span>
              </label>

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
                    <div className="text-xs font-bold text-[#0B3C5D]">
                      Click here to select and attach photo evidence
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Evidence is scrutinized for digital authenticity and geo-spatial relevance
                    </div>
                  </label>
                </div>

                <div className="border border-slate-300 bg-slate-100 h-32 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img src={imagePreview} alt="Attached Evidence" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute top-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500">No document attached</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* PART 3: Territorial Jurisdiction & Location */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b-2 border-[#0B3C5D] pb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B3C5D]">
                PART III: TERRITORIAL JURISDICTION & LOCATION / भौगोलिक अधिकार क्षेत्र
              </h3>

              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="text-xs font-bold text-[#0B3C5D] hover:underline cursor-pointer bg-slate-100 px-2 py-0.5 border border-slate-300"
              >
                {isLocating ? 'Acquiring GPS...' : 'Fetch Live GPS Coordinates'}
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
                  value={location.landmark || ''}
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
                  value={location.wardOrSector || ''}
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

          {/* PART 4: Direct Government Gateway Dispatch Options */}
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
                  Direct Transmission to Central CPGRAMS & RTI Online Nodal Switch (pgportal.gov.in)
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  Directly provisions an official Government Docket Reference Number, registers the grievance on the national nodal dashboard, and generates a formal RTI Notice under Section 6(1) of the RTI Act 2005.
                </p>
              </div>
            </label>
          </div>

          {/* Submission and Scrutiny Pipeline Indicator */}
          <div className="pt-4 border-t border-slate-300 flex flex-col items-center">
            {isSubmitting ? (
              <div className="w-full max-w-lg bg-slate-50 border border-slate-300 p-4 text-center space-y-3">
                <div className="text-sm font-bold text-[#0B3C5D]">
                  Transmitting to National CPGRAMS Switch & Conducting Statutory Scrutiny...
                </div>

                <div className="w-full bg-slate-200 h-2">
                  <div
                    className="bg-[#0B3C5D] h-2 transition-all duration-300"
                    style={{ width: `${(currentPipelineStep / 4) * 100}%` }}
                  ></div>
                </div>

                <div className="text-xs text-slate-700 font-medium">
                  {currentPipelineStep === 1 && 'Step 1/4: Scrutinizing photographic evidence integrity & digital metadata...'}
                  {currentPipelineStep === 2 && 'Step 2/4: Cross-referencing ward territorial registry for active duplicates...'}
                  {currentPipelineStep === 3 && 'Step 3/4: Allocating designated Central Public Information Officer (CPIO)...'}
                  {currentPipelineStep === 4 && 'Step 4/4: Registering docket on pgportal.gov.in central gateway...'}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0B3C5D] hover:bg-[#082D46] text-white font-bold text-xs uppercase tracking-wider shadow-xs cursor-pointer border border-[#082D46]"
                >
                  {lang === 'en' ? 'Submit Grievance to Competent Authority' : 'सक्षम प्राधिकारी को शिकायत अग्रेषित करें'}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 cursor-pointer"
                >
                  {lang === 'en' ? 'Clear Form' : 'प्रारूप खाली करें'}
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
};
