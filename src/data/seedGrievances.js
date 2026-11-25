// Initial sample grievances and department metadata loaded on first visit.

const INITIAL_GRIEVANCES = [
  {
    id: "GRV-2026-PWD-8402",
    token: "RTI-2026-PWD-8402",
    title: "Severe 4-Foot Road Cave-In Near Metro Pillar 142 on Outer Ring Road",
    description: "A deep road subsidence / crater has formed right on the bus lane after overnight rain. Two two-wheelers have already skidded and traffic is bottlenecked. Immediate structural patching required before evening peak hours.",
    citizenName: "Devendra Sharma",
    citizenPhone: "+91 98112 45910",
    citizenEmail: "d.sharma22@gmail.com",
    isAnonymous: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    location: {
      lat: 28.6289,
      lng: 77.2065,
      address: "Outer Ring Road, Opp. Metro Pillar 142, Block C",
      landmark: "Near Nehru Place Flyover",
      wardOrSector: "Ward 48 - South Zone",
      district: "South Delhi",
      state: "Delhi (NCT)",
      pinCode: "110019"
    },
    departmentCode: "PWD",
    departmentName: "Public Works Department (PWD) - Roads & Infrastructure",
    subCategory: "Arterial Road Cavity / Pavement Failure",
    severity: "CRITICAL",
    urgencyRationale: "Active vehicular hazard on major arterial transit route posing immediate risk of fatal accidents and major gridlock.",
    statutorySlaDays: 2,
    status: "FIELD_WORK_DISPATCHED",
    statusTimeline: [
      {
        status: "SUBMITTED",
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        note: "Grievance submitted by citizen via JanSamadhan Mobile Portal with live geo-coordinates.",
        actor: "Citizen Portal"
      },
      {
        status: "AI_VERIFIED",
        timestamp: new Date(Date.now() - 3600000 * 4.8).toISOString(),
        note: "AI Visual Forensics certified photograph authentic (98% confidence). No digital tampering found.",
        actor: "JanSamadhan AI Engine"
      },
      {
        status: "ROUTED",
        timestamp: new Date(Date.now() - 3600000 * 4.5).toISOString(),
        note: "Automatically routed to PWD South Division. Section 7(1) Proviso (Life & Liberty 48h SLA) triggered.",
        actor: "JanSamadhan Auto-Router"
      },
      {
        status: "FIELD_WORK_DISPATCHED",
        timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
        note: "Emergency Asphalt patching crew & barricading team deployed under Junior Engineer R.K. Varma (Team #4).",
        actor: "Executive Engineer (PWD)"
      }
    ],
    actionPlanSteps: [
      "Immediate barricading and red reflector cones placement at 50m approach",
      "Structural base inspection for underlying water leakage or sewer hollow",
      "Rapid Cold-Mix Asphalt compaction & hot-bitumen seal application",
      "Civil engineer certification before reopening lane"
    ],
    imageForensics: {
      isManipulated: false,
      authenticityRating: "AUTHENTIC",
      manipulationConfidenceScore: 97,
      aiGeneratedProbability: 1,
      detectedArtifacts: [
        "Natural optical depth-of-field matches standard smartphone lens f/1.8",
        "Continuous asphalt grain texture with realistic rain puddle reflection",
        "Valid EXIF header from Samsung Galaxy S23 with matching timestamp",
        "No copy-move cloning or synthetic pixel tampering identified"
      ],
      visualSummary: "Photograph clearly depicts an acute circular asphalt depression approximately 1.2m wide with exposed gravel bed on wet tarmac.",
      exifData: {
        cameraModel: "Samsung Galaxy S23 (SM-S911B)",
        timestamp: "2026-11-01 15:42:18 IST",
        gpsEmbedded: true,
        softwareUsed: "Android Camera v14.0"
      }
    },
    duplicateDetection: {
      isDuplicateCandidate: false,
      duplicateRisk: "LOW",
      topMatches: [],
      recommendation: "PROCEED_DISPATCH"
    },
    rtiResponse: {
      referenceId: "RTI/PWD/2026/DL-08402",
      acknowledgementDate: new Date(Date.now() - 3600000 * 4.5).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      statutoryDeadline: new Date(Date.now() + 86400000 * 2).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      statutorySection: "Section 7(1) Proviso, RTI Act 2005 (Immediate Life/Safety Threat - 48 Hours)",
      publicAuthorityName: "Office of the Central Public Information Officer (CPIO), Public Works Department (HQ)",
      subjectLine: "Statutory Acknowledgment and Emergency Action Memorandum under RTI Act 2005",
      acknowledgementText: "Receipt of your application/grievance registered under Unique Docket #GRV-2026-PWD-8402 is hereby formally acknowledged under the Right to Information Act, 2005. Having recognized an imminent threat to vehicular passenger safety, this matter has been designated under Section 7(1) emergency fast-track SLA.",
      preliminaryAction: "Emergency Work Order #PWD/SO/EMRG/2026/91 has been electronically generated and dispatched to the South Division Maintenance Wing. On-site barricading commenced.",
      legalNoticeClauses: [
        "Under Section 5(1) & 5(2) of the RTI Act 2005, CPIO has mandated immediate site inspection within 12 hours.",
        "Under Section 7(1) Proviso, information concerning life and safety is subject to mandatory action within forty-eight hours.",
        "Applicant is exempt from additional inspection fees as per Central RTI Rules 2012 Schedule II."
      ],
      designatedPio: {
        name: "Er. Rajeshwar Meena",
        designation: "Superintending Engineer & CPIO",
        department: "Public Works Department, South Zone",
        contactEmail: "cpio-south.pwd@gov.in",
        phone: "011-23348120",
        officeAddress: "PWD Division Office, 2nd Floor, Vikas Bhawan II, New Delhi 110002"
      },
      firstAppellateAuthority: {
        name: "Shri Amitabh Sinha, IAS",
        designation: "Chief Engineer & First Appellate Authority (FAA)",
        officeAddress: "Engineer-in-Chief Secretariat, PWD HQ, MSO Building, I.P. Estate, New Delhi"
      },
      inspectionScheduled: {
        willInspect: true,
        inspectionWindow: "Within 18 Hours (Completed by 08:00 AM Tomorrow)"
      }
    },
    governmentDispatch: {
      isDirectlyDispatched: true,
      governmentPortal: "CPGRAMS / Ministry of Housing & Urban Affairs (MoHUA) Nodal Gateway",
      governmentRefNumber: "CPGRAMS/2026/PWD-DL-8402",
      dispatchedAt: new Date(Date.now() - 3600000 * 4.5).toISOString(),
      nodalMinistry: "Ministry of Road Transport & Highways / Delhi PWD Nodal Centre",
      transmissionStatus: "CREW_ON_SITE",
      fieldTeamAssigned: {
        engineerName: "Er. R.K. Varma (Junior Engineer)",
        designation: "Field Maintenance Wing, Team #4",
        vehicleNumber: "DL-1GA-7892 (Asphalt Compactor)",
        contactPhone: "+91 98101 44521",
        etaMinutes: 15
      }
    }
  },
  {
    id: "GRV-2026-MCD-1092",
    token: "RTI-2026-MCD-1092",
    title: "SOLVED: 12-Ton Overflowing Commercial Garbage Dump at Azadpur Mandi Gate 3",
    description: "Rotting vegetable waste accumulated for 5 days blocking market lane and breeding swarms of flies. Pungent odor causing respiratory discomfort to vendors.",
    citizenName: "Suraj Pal Singh",
    citizenPhone: "+91 98188 52109",
    citizenEmail: "suraj.pal@mandiunion.org",
    isAnonymous: false,
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80",
    location: {
      lat: 28.7154,
      lng: 77.1782,
      address: "Gate No. 3, Azadpur Mandi, GT Karnal Road",
      landmark: "Near Wholesale Shed B",
      wardOrSector: "Ward 62 - Civil Lines Zone",
      district: "North Delhi",
      state: "Delhi (NCT)",
      pinCode: "110033"
    },
    departmentCode: "MCD_SANITATION",
    departmentName: "Municipal Corporation (MCD) - Solid Waste & Sanitation",
    subCategory: "Commercial Waste Clearance & Sanitization",
    severity: "HIGH",
    urgencyRationale: "High public health risk at major national fruit and vegetable wholesale hub.",
    statutorySlaDays: 3,
    status: "RESOLVED",
    statusTimeline: [
      {
        status: "SUBMITTED",
        timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
        note: "Complaint registered by market association secretary.",
        actor: "Citizen Portal"
      },
      {
        status: "AI_VERIFIED",
        timestamp: new Date(Date.now() - 3600000 * 27.8).toISOString(),
        note: "AI validated authentic photo of uncollected municipal garbage.",
        actor: "JanSamadhan AI Engine"
      },
      {
        status: "ROUTED",
        timestamp: new Date(Date.now() - 3600000 * 27.5).toISOString(),
        note: "Directly transmitted to MCD Civil Lines Zone Control Room via CPGRAMS API.",
        actor: "Government Gateway"
      },
      {
        status: "FIELD_WORK_DISPATCHED",
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
        note: "2 Hydraulic Tipper Trucks and mechanical loader mobilized under Sanitary Inspector S.P. Joshi.",
        actor: "Chief Sanitary Inspector"
      },
      {
        status: "RESOLVED",
        timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
        note: "Complete site cleared (12.4 MT bio-waste transferred to Bhalaswa Waste-to-Energy plant). Disinfectant bleaching powder sprayed. Geotagged ATR uploaded.",
        actor: "Zonal Sanitary Officer"
      }
    ],
    actionPlanSteps: [
      "Deploy 2 Hydraulic Compactors for rapid waste clearance",
      "Disinfect perimeter with Sodium Hypochlorite & lime powder",
      "Establish twice-daily fixed collection schedule for Gate 3",
      "Upload geofenced Action Taken Report (ATR) with before/after photos"
    ],
    imageForensics: {
      isManipulated: false,
      authenticityRating: "AUTHENTIC",
      manipulationConfidenceScore: 99,
      aiGeneratedProbability: 0,
      detectedArtifacts: [
        "Natural lighting and real optical lens depth",
        "Valid EXIF header from Vivo V29 handset",
        "No digital alteration detected"
      ],
      visualSummary: "Authentic image showing substantial mound of discarded organic vegetable matter and cardboard packaging obstructing street.",
      exifData: {
        cameraModel: "Vivo V29 5G",
        timestamp: "2026-10-31 16:10:02 IST",
        gpsEmbedded: true
      }
    },
    duplicateDetection: {
      isDuplicateCandidate: false,
      duplicateRisk: "LOW",
      topMatches: [],
      recommendation: "PROCEED_DISPATCH"
    },
    rtiResponse: {
      referenceId: "RTI/MCD/2026/CL-01092",
      acknowledgementDate: new Date(Date.now() - 3600000 * 27.5).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      statutoryDeadline: new Date(Date.now() - 3600000 * 1).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      statutorySection: "Section 7(1) (Expedited Health Action - Completed)",
      publicAuthorityName: "Office of the Public Information Officer, Municipal Corporation (Civil Lines Zone)",
      subjectLine: "Final Action Taken Report & Closure Memo under RTI Act 2005",
      acknowledgementText: "Grievance Docket #GRV-2026-MCD-1092 has been fully investigated, redressed, and officially certified by the Zonal Sanitary Inspector.",
      preliminaryAction: "Full clearance executed. 12.4 Metric Tonnes transported. Disinfection spraying complete.",
      legalNoticeClauses: [
        "Under Section 4(1)(b) of the RTI Act 2005, public authorities proactively disclose completed public service works.",
        "Citizen feedback rating submitted to Quality Assurance Cell."
      ],
      designatedPio: {
        name: "Shri Vikramaditya Negi",
        designation: "Deputy Commissioner & CPIO (Sanitation)",
        department: "MCD Civil Lines Zone",
        contactEmail: "cpio-sanitation.mcd@gov.in",
        phone: "011-23225010",
        officeAddress: "Dr. S.P. Mukherjee Civic Centre, Minto Road, New Delhi 110002"
      },
      firstAppellateAuthority: {
        name: "Additional Commissioner (Sanitation)",
        designation: "Appellate Authority under RTI Act",
        officeAddress: "Civic Centre, New Delhi"
      }
    },
    governmentDispatch: {
      isDirectlyDispatched: true,
      governmentPortal: "CPGRAMS / Ministry of Housing & Urban Affairs (MoHUA)",
      governmentRefNumber: "CPGRAMS/2026/MCD-1092",
      dispatchedAt: new Date(Date.now() - 3600000 * 27.5).toISOString(),
      nodalMinistry: "Ministry of Housing and Urban Affairs (Swachh Bharat Directorate)",
      transmissionStatus: "CLOSED_VERIFIED",
      resolutionProof: {
        completionNote: "12.4 MT commercial bio-waste removed using tippers DL-1M-4412 and DL-1M-4415. Bleaching and lime treatment completed. Geofenced CCTV confirmation recorded.",
        resolvedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        inspectorBadge: "MCD-INSP-7810-CLZ",
        beforeAfterImg: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80"
      }
    }
  },
  {
    id: "GRV-2026-WATER-6119",
    token: "RTI-2026-WATER-6119",
    title: "Severe Contaminated Brown Tap Water and Main Pipeline Leakage in Sector 9",
    description: "Potable water supply pipeline has burst underground mixing with drainage line. For 3 days residents are getting foul-smelling muddy water. High risk of waterborne diseases for over 400 households.",
    citizenName: "Meenakshi Iyer",
    citizenPhone: "+91 99201 88341",
    citizenEmail: "meenakshi.iyer@outlook.com",
    isAnonymous: false,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
    location: {
      lat: 28.5823,
      lng: 77.0601,
      address: "Pocket B, Near Community Center, Sector 9",
      landmark: "Behind DDA Park",
      wardOrSector: "Sector 9 Dwarka",
      district: "South West Delhi",
      state: "Delhi (NCT)",
      pinCode: "110077"
    },
    departmentCode: "WATER",
    departmentName: "Delhi Jal Board (DJB) / Municipal Water Supply & Sewerage",
    subCategory: "Potable Water Contamination & Main Pipeline Rupture",
    severity: "HIGH",
    urgencyRationale: "Contaminated tap water with drainage seepage poses immediate community epidemic risk (Gastroenteritis / Cholera) affecting ~400 families.",
    statutorySlaDays: 3,
    status: "INVESTIGATING",
    statusTimeline: [
      {
        status: "SUBMITTED",
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
        note: "Complaint registered with water sample photograph.",
        actor: "Citizen Portal"
      },
      {
        status: "AI_VERIFIED",
        timestamp: new Date(Date.now() - 3600000 * 17.8).toISOString(),
        note: "AI Visual check confirms authentic muddy turbidity. No synthetic artifacts detected.",
        actor: "JanSamadhan AI Engine"
      },
      {
        status: "ROUTED",
        timestamp: new Date(Date.now() - 3600000 * 17.5).toISOString(),
        note: "Auto-routed to DJB Water Quality & Sewer Maintenance Division.",
        actor: "JanSamadhan Auto-Router"
      },
      {
        status: "INVESTIGATING",
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        note: "Water tankers deployed as interim relief. Acoustic pipe leak detection team currently isolating junction.",
        actor: "Zonal Assistant Engineer (DJB)"
      }
    ],
    actionPlanSteps: [
      "Deploy 3 emergency potable water tankers to Sector 9 Pocket B immediately",
      "Collect water samples for bacteriological & chlorine residual lab testing",
      "Isolate valve section at Main Line 400mm and excavate intersection",
      "Replace rusted MS pipe section and flush distribution line with hyperchlorination"
    ],
    imageForensics: {
      isManipulated: false,
      authenticityRating: "AUTHENTIC",
      manipulationConfidenceScore: 95,
      aiGeneratedProbability: 2,
      detectedArtifacts: [
        "Natural suspended sediment particles visible in glass container",
        "Consistent kitchen lighting reflections and realistic chromatic balance",
        "Standard smartphone compression blocks without tampering"
      ],
      visualSummary: "Image shows a clear glass tumbler filled with turbid yellowish-brown tap water with visible settled particulate matter.",
      exifData: {
        cameraModel: "iPhone 14",
        timestamp: "2026-11-01 07:15:30 IST",
        gpsEmbedded: true,
        softwareUsed: "iOS 18.1 Camera"
      }
    },
    duplicateDetection: {
      isDuplicateCandidate: false,
      duplicateRisk: "LOW",
      topMatches: [],
      recommendation: "PROCEED_DISPATCH"
    },
    rtiResponse: {
      referenceId: "RTI/DJB/2026/SW-06119",
      acknowledgementDate: new Date(Date.now() - 3600000 * 17.5).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      statutoryDeadline: new Date(Date.now() + 86400000 * 3).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      statutorySection: "Section 7(1), RTI Act 2005 (Expedited Public Health Priority - 72 Hours)",
      publicAuthorityName: "Office of the Public Information Officer, Delhi Jal Board (West Zone)",
      subjectLine: "Statutory Acknowledgment and Quality Redressal Notice under RTI Act 2005",
      acknowledgementText: "This is an automated statutory acknowledgment for Complaint Reference #GRV-2026-WATER-6119 regarding drinking water quality and supply interruption. DJB has logged this ticket with emergency public health status.",
      preliminaryAction: "Temporary water tankers #DL-1GC-4921 & #DL-1GC-5109 have been mobilized for Sector 9 Pocket B. Excavation permit issued.",
      legalNoticeClauses: [
        "In accordance with BIS 10500:2012 standards, safe drinking water assurance is a fundamental civic obligation.",
        "Under Section 6(3) of the RTI Act 2005, copy has been marked to Chief Water Analyst for emergency sample testing.",
        "Right to appeal lies with the Additional Chief Executive Officer, DJB within 30 days."
      ],
      designatedPio: {
        name: "Dr. Vivek Saxena",
        designation: "Director (Water Treatment) & CPIO",
        department: "Delhi Jal Board, HQ Varunalaya",
        contactEmail: "cpio-waterquality@djb.gov.in",
        phone: "011-23512349",
        officeAddress: "Varunalaya Phase-II, Jhandewalan, New Delhi 110005"
      },
      firstAppellateAuthority: {
        name: "Ms. Anita Chaudhary, IRS",
        designation: "Member (Water Supply) & Appellate Authority",
        officeAddress: "DJB Headquarters, Jhandewalan, New Delhi"
      },
      inspectionScheduled: {
        willInspect: true,
        inspectionWindow: "Sampling team on-site today between 02:00 PM - 05:00 PM"
      }
    },
    governmentDispatch: {
      isDirectlyDispatched: true,
      governmentPortal: "CPGRAMS / Ministry of Jal Shakti Nodal Portal",
      governmentRefNumber: "CPGRAMS/2026/DJB-6119",
      dispatchedAt: new Date(Date.now() - 3600000 * 17.5).toISOString(),
      nodalMinistry: "Ministry of Jal Shakti / Delhi Jal Board Central Control",
      transmissionStatus: "ASSIGNED_TO_FIELD_ENGINEER",
      fieldTeamAssigned: {
        engineerName: "Er. S.K. Bansal (Assistant Engineer)",
        designation: "Zonal Leak Detection & Pipeline Maintenance",
        vehicleNumber: "DL-1L-2910 (Acoustic Detector Van)",
        contactPhone: "+91 98110 33819",
        etaMinutes: 30
      }
    }
  },
  {
    id: "GRV-2026-MCD-4903",
    token: "RTI-2026-MCD-4903",
    title: "SUSPICIOUS: Claimed Toxic Chemical Barrel Spill on Commercial Boulevard",
    description: "Anonymous complaint alleging an overturned chemical toxic barrel creating green corrosive smog on the main shopping street. Asking for urgent multi-crore hazmat cleanup.",
    citizenName: "Anonymous Citizen",
    citizenPhone: "+91 91000 00000",
    citizenEmail: "confidential_civic@proton.me",
    isAnonymous: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 23.5).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
    location: {
      lat: 28.6328,
      lng: 77.2197,
      address: "Inner Circle, Connaught Place, Block E",
      landmark: "Near Central Park Gate 2",
      wardOrSector: "Ward 12 - City SP Zone",
      district: "Central Delhi",
      state: "Delhi (NCT)",
      pinCode: "110001"
    },
    departmentCode: "MCD_SANITATION",
    departmentName: "Municipal Corporation (MCD) - Solid Waste & Sanitation",
    subCategory: "Hazardous Waste / Chemical Disposal",
    severity: "ROUTINE",
    urgencyRationale: "AI Visual Forensics flagged photograph as digitally composited / synthetic. No on-ground hazardous incident detected by civic CCTV.",
    statutorySlaDays: 30,
    status: "REJECTED_MANIPULATED",
    statusTimeline: [
      {
        status: "SUBMITTED",
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        note: "Anonymous grievance filed alleging high-grade chemical disaster.",
        actor: "Web Portal (VPN)"
      },
      {
        status: "AI_VERIFIED",
        timestamp: new Date(Date.now() - 3600000 * 23.8).toISOString(),
        note: "AI Visual Forensics flagged MANIPULATION: 92% synthetic probability, cloned smoke layers, missing shadows under barrels.",
        actor: "JanSamadhan AI Engine"
      },
      {
        status: "REJECTED_MANIPULATED",
        timestamp: new Date(Date.now() - 3600000 * 23.5).toISOString(),
        note: "Submission rejected under Section 8(1) of RTI Act for fraudulent digital tampering. Notification sent to grievance log.",
        actor: "Chief Vigilance Officer"
      }
    ],
    actionPlanSteps: [
      "Cross-reference live municipal Smart City CCTV feed for Connaught Place Block E",
      "Verify digital EXIF signature for editing software fingerprints",
      "Issue formal notice of rejection with digital manipulation audit report",
      "Prevent unwarranted hazmat mobilization to safeguard public resources"
    ],
    imageForensics: {
      isManipulated: true,
      authenticityRating: "LIKELY_MANIPULATED",
      manipulationConfidenceScore: 94,
      aiGeneratedProbability: 88,
      detectedArtifacts: [
        "Cloning & copy-move artifacts detected in vapor/smoke texture pattern",
        "Inconsistent directional lighting: building shadows cast North-East while barrel highlights suggest South-West light source",
        "Unnatural pixel sharpness gradient along barrel boundary indicating cut-and-paste compositing",
        "Error Level Analysis (ELA) exhibits extreme high-frequency white noise along edge mask",
        "Metadata shows recent export from image editing software"
      ],
      visualSummary: "Artificially generated or heavily edited graphic showing green glowing chemical barrels overlaid onto a dry pedestrian street.",
      exifData: {
        cameraModel: "Unknown / Virtual Device",
        timestamp: "2026-10-31 22:11:00",
        gpsEmbedded: false,
        softwareUsed: "Adobe Photoshop 2025 / Midjourney Inpainting"
      }
    },
    duplicateDetection: {
      isDuplicateCandidate: false,
      duplicateRisk: "LOW",
      topMatches: [],
      recommendation: "FLAG_FOR_OFFICER_REVIEW"
    },
    rtiResponse: {
      referenceId: "RTI/MCD/2026/REJ-04903",
      acknowledgementDate: new Date(Date.now() - 3600000 * 23.5).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      statutoryDeadline: "N/A - Application Terminated",
      statutorySection: "Section 8(1) & IT Act 2000 (Fabricated / Tampered Evidence)",
      publicAuthorityName: "Office of the Public Information Officer, Municipal Corporation (Sanitation Wing)",
      subjectLine: "Notice of Rejection & Summary Disposal Due to Fabricated Visual Evidence",
      acknowledgementText: "Upon algorithmic examination by the JanSamadhan Forensic Inspection Pipeline, the attached photographic proof demonstrates definitive indications of digital alteration and synthetic compositing. Consequently, this docket cannot be processed for department mobilization.",
      preliminaryAction: "Grievance flagged in civic fraud audit register. No civic deployment authorized.",
      legalNoticeClauses: [
        "Submission of manipulated photographic evidence to initiate emergency civic mobilization is liable under IPC Section 182 / BNS.",
        "The applicant is granted 15 days to tender authentic unedited original evidence if this determination is contested."
      ],
      designatedPio: {
        name: "Shri Vikramaditya Negi",
        designation: "Deputy Commissioner & CPIO (Sanitation)",
        department: "MCD Central Zone",
        contactEmail: "cpio-vigilance.mcd@gov.in",
        phone: "011-23225010",
        officeAddress: "Dr. S.P. Mukherjee Civic Centre, Minto Road, New Delhi 110002"
      },
      firstAppellateAuthority: {
        name: "Additional Commissioner (Public Safety)",
        designation: "MCD Appellate Authority",
        officeAddress: "Civic Centre, New Delhi"
      }
    },
    governmentDispatch: {
      isDirectlyDispatched: false,
      governmentPortal: "CPGRAMS Security & Vigilance Gateway",
      governmentRefNumber: "VIGILANCE/2026/MCD-4903-REJ",
      dispatchedAt: new Date(Date.now() - 3600000 * 23.5).toISOString(),
      nodalMinistry: "Central Vigilance Commission / Anti-Fraud Cell",
      transmissionStatus: "CLOSED_VERIFIED",
      resolutionProof: {
        completionNote: "Audited by Chief Vigilance Officer. CCTV cross-check confirmed normal market pedestrian traffic with zero chemical spillage.",
        resolvedAt: new Date(Date.now() - 3600000 * 23.5).toISOString(),
        inspectorBadge: "CVO-AUDIT-901"
      }
    }
  },
  {
    id: "GRV-2026-PWD-8409",
    token: "RTI-2026-PWD-8409",
    title: "DUPLICATE CANDIDATE: Deep Pothole and Broken Curb on Outer Ring Road",
    description: "Road damage with broken stones near Nehru Place flyover pillar 143. Cars are bumping hard.",
    citizenName: "Kunal Singhal",
    citizenPhone: "+91 97170 33812",
    citizenEmail: "kunal.s99@yahoo.com",
    isAnonymous: false,
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1.2).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    location: {
      lat: 28.6291,
      lng: 77.2067,
      address: "Outer Ring Road, Nehru Place Flyover Base, 35m from Pillar 142",
      landmark: "Opposite Nehru Place Metro",
      wardOrSector: "Ward 48 - South Zone",
      district: "South Delhi",
      state: "Delhi (NCT)",
      pinCode: "110019"
    },
    departmentCode: "PWD",
    departmentName: "Public Works Department (PWD) - Roads & Infrastructure",
    subCategory: "Arterial Road Cavity / Pavement Failure",
    severity: "HIGH",
    urgencyRationale: "Identified as direct duplicate of Parent Ticket #GRV-2026-PWD-8402 (located 35m away, reported 3.5 hrs prior). Merged to avoid redundant crew dispatch.",
    statutorySlaDays: 2,
    status: "MERGED_DUPLICATE",
    parentGrievanceId: "GRV-2026-PWD-8402",
    statusTimeline: [
      {
        status: "SUBMITTED",
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        note: "Complaint submitted by citizen.",
        actor: "Citizen Portal"
      },
      {
        status: "AI_VERIFIED",
        timestamp: new Date(Date.now() - 3600000 * 1.4).toISOString(),
        note: "AI Duplicate Detection triggered: 94% spatial and visual match with active Ticket #GRV-2026-PWD-8402.",
        actor: "JanSamadhan AI Engine"
      },
      {
        status: "MERGED_DUPLICATE",
        timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(),
        note: "Automatically merged into primary incident docket #GRV-2026-PWD-8402. Citizen Kunal Singhal subscribed to parent ticket SMS/Email alerts.",
        actor: "JanSamadhan Duplicate Resolver"
      }
    ],
    actionPlanSteps: [
      "Link applicant contact Kunal Singhal to Parent Work Order #PWD/SO/EMRG/2026/91",
      "Prevent duplicate contractor billing for identical GPS coordinates",
      "Send synchronized completion notice when patching crew finishes repair"
    ],
    imageForensics: {
      isManipulated: false,
      authenticityRating: "AUTHENTIC",
      manipulationConfidenceScore: 96,
      aiGeneratedProbability: 1,
      detectedArtifacts: [
        "Image authentic; matches parent location incident from a secondary angle (approximately 15 degrees offset)"
      ],
      visualSummary: "Second angle of identical road cavity previously reported at Pillar 142.",
      exifData: {
        cameraModel: "OnePlus 11R",
        timestamp: "2026-11-01 19:10:45 IST",
        gpsEmbedded: true
      }
    },
    duplicateDetection: {
      isDuplicateCandidate: true,
      duplicateRisk: "HIGH",
      clusterId: "CLUSTER-DL-PWD-RINGROAD-01",
      topMatches: [
        {
          matchedId: "GRV-2026-PWD-8402",
          matchedTitle: "Severe 4-Foot Road Cave-In Near Metro Pillar 142 on Outer Ring Road",
          similarityPercentage: 94,
          distanceMeters: 35,
          createdHoursAgo: 3.5,
          reason: "Spatial proximity within 35 meters and identical visual semantic subject matter (road cavity on Outer Ring Road)."
        }
      ],
      recommendation: "MERGE_CLUSTER"
    },
    rtiResponse: {
      referenceId: "RTI/PWD/2026/MERG-08409",
      acknowledgementDate: new Date(Date.now() - 3600000 * 1.2).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      statutoryDeadline: new Date(Date.now() + 86400000 * 2).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      statutorySection: "Section 7(1) & Cluster Redressal Norms",
      publicAuthorityName: "Office of the Central Public Information Officer (CPIO), Public Works Department (HQ)",
      subjectLine: "Consolidation & Joint Redressal Intimation under RTI Act 2005",
      acknowledgementText: "Thank you for bringing this road defect to our attention. Our spatial grievance intelligence system has linked your submission with Active Lead Docket #GRV-2026-PWD-8402. Work is already underway on site.",
      preliminaryAction: "Linked to active site crew #4. Redressal will automatically fulfill both applications concurrently.",
      legalNoticeClauses: [
        "Under Government e-Governance & RTI Administrative Efficiency Guidelines, identical civic grievances within immediate radius are coalesced for swift execution.",
        "You will receive SMS notifications at every stage of the parent work order until final completion."
      ],
      designatedPio: {
        name: "Er. Rajeshwar Meena",
        designation: "Superintending Engineer & CPIO",
        department: "Public Works Department, South Zone",
        contactEmail: "cpio-south.pwd@gov.in",
        phone: "011-23348120",
        officeAddress: "PWD Division Office, 2nd Floor, Vikas Bhawan II, New Delhi 110002"
      },
      firstAppellateAuthority: {
        name: "Shri Amitabh Sinha, IAS",
        designation: "Chief Engineer & First Appellate Authority (FAA)",
        officeAddress: "PWD HQ, MSO Building, New Delhi"
      }
    },
    governmentDispatch: {
      isDirectlyDispatched: true,
      governmentPortal: "CPGRAMS / MoHUA Urban Hub",
      governmentRefNumber: "CPGRAMS/2026/PWD-DL-8409-MERG",
      dispatchedAt: new Date(Date.now() - 3600000 * 1.2).toISOString(),
      nodalMinistry: "Delhi PWD South Division Nodal Desk",
      transmissionStatus: "CREW_ON_SITE",
      fieldTeamAssigned: {
        engineerName: "Er. R.K. Varma (Junior Engineer)",
        designation: "Field Maintenance Wing, Team #4 (Parent Ticket Crew)",
        vehicleNumber: "DL-1GA-7892",
        contactPhone: "+91 98101 44521",
        etaMinutes: 10
      }
    }
  },
  {
    id: "GRV-2026-DISCOM-3312",
    token: "RTI-2026-DISCOM-3312",
    title: "Sparking Overhead 11KV Power Cable Dangling Above School Pedestrian Gate",
    description: "High voltage overhead cable insulation has torn and is giving loud sparks whenever wind blows. It is sagging just 7 feet above the main entry gate of Government Model Senior Secondary School.",
    citizenName: "Sunita Rawat",
    citizenPhone: "+91 98731 00293",
    citizenEmail: "sunitagovt.teacher@nic.in",
    isAnonymous: false,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 7.5).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    location: {
      lat: 28.6508,
      lng: 77.1724,
      address: "Main Gate, Govt Model Senior Secondary School, Patel Nagar",
      landmark: "Near Shadipur Flyover",
      wardOrSector: "Ward 91 - West Patel Nagar",
      district: "West Delhi",
      state: "Delhi (NCT)",
      pinCode: "110008"
    },
    departmentCode: "POWER_DISCOM",
    departmentName: "State Electricity Distribution & Power Grid (BSES / Discom)",
    subCategory: "High Tension Electrical Hazard / Live Sagging Cable",
    severity: "CRITICAL",
    urgencyRationale: "Immediate electrocution catastrophe hazard located directly at school student entrance.",
    statutorySlaDays: 1,
    status: "ROUTED",
    statusTimeline: [
      {
        status: "SUBMITTED",
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
        note: "High-voltage emergency grievance filed by school faculty.",
        actor: "Citizen Portal"
      },
      {
        status: "AI_VERIFIED",
        timestamp: new Date(Date.now() - 3600000 * 7.9).toISOString(),
        note: "AI verified authentic image of dangling HT conductor wire. Emergency SLA 24h triggered.",
        actor: "JanSamadhan AI Engine"
      },
      {
        status: "ROUTED",
        timestamp: new Date(Date.now() - 3600000 * 7.5).toISOString(),
        note: "Direct high-priority alert relayed to Patel Nagar Grid Substation & Central Disaster Cell.",
        actor: "JanSamadhan Auto-Router"
      }
    ],
    actionPlanSteps: [
      "Remote feeder tripping / load isolation for Patel Nagar 11KV Feeder 3 if sparking escalates",
      "Deploy emergency aerial lift bucket van (Van #E-09) with Class-4 insulated gear",
      "Retension sagging cable and replace cracked ceramic insulator bracket",
      "Inspect adjacent pole grounding earth wire"
    ],
    imageForensics: {
      isManipulated: false,
      authenticityRating: "AUTHENTIC",
      manipulationConfidenceScore: 98,
      aiGeneratedProbability: 0,
      detectedArtifacts: [
        "Genuine electrical pole structure and authentic cable tension deflection curve",
        "Natural overcast day lighting consistent with weather data"
      ],
      visualSummary: "High tension cable noticeably deflected downwards near school boundary wall with visible abrasion wear.",
      exifData: {
        cameraModel: "Xiaomi Redmi Note 12",
        timestamp: "2026-11-01 13:02:11 IST",
        gpsEmbedded: true
      }
    },
    duplicateDetection: {
      isDuplicateCandidate: false,
      duplicateRisk: "LOW",
      topMatches: [],
      recommendation: "PROCEED_DISPATCH"
    },
    rtiResponse: {
      referenceId: "RTI/DISCOM/2026/DL-03312",
      acknowledgementDate: new Date(Date.now() - 3600000 * 7.5).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      statutoryDeadline: new Date(Date.now() + 86400000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      statutorySection: "Section 7(1) Proviso (Life Safety Emergency - 24 to 48 Hours)",
      publicAuthorityName: "Office of the Designated PIO & Chief Safety Officer, BSES Yamuna / Rajdhani Power Ltd.",
      subjectLine: "Urgent Electrical Safety Directive & Statutory RTI Acknowledgment",
      acknowledgementText: "Docket #GRV-2026-DISCOM-3312 has been classified as Grade-1 Life Safety Priority. Patel Nagar Central Feeder Control Room has dispatched emergency repair vehicle.",
      preliminaryAction: "Line Inspector P.K. Gupta assigned. Live circuit isolation protocol initiated.",
      legalNoticeClauses: [
        "Under Central Electricity Authority (Measures relating to Safety and Electric Supply) Regulations, ground clearance must be immediately restored.",
        "Compliance report will be submitted within 24 hours to the Chief Electrical Inspector of the State."
      ],
      designatedPio: {
        name: "Er. Sandeep Bhasin",
        designation: "General Manager (Operations & Safety) & CPIO",
        department: "Power Distribution & Grid Operations",
        contactEmail: "safety.emergency@bsesdelhi.com",
        phone: "19123 / 011-39999707",
        officeAddress: "BSES Corporate Office, Nehru Place, New Delhi 110019"
      },
      firstAppellateAuthority: {
        name: "Director (Operations)",
        designation: "Appellate Authority under RTI Act",
        officeAddress: "BSES Bhawan, Nehru Place, New Delhi"
      },
      inspectionScheduled: {
        willInspect: true,
        inspectionWindow: "Immediate (Within 45 Minutes of Alert)"
      }
    },
    governmentDispatch: {
      isDirectlyDispatched: true,
      governmentPortal: "CPGRAMS / Ministry of Power Emergency Disaster Gateway",
      governmentRefNumber: "CPGRAMS/2026/DISCOM-3312",
      dispatchedAt: new Date(Date.now() - 3600000 * 7.5).toISOString(),
      nodalMinistry: "Ministry of Power / Central Electricity Authority Control Cell",
      transmissionStatus: "ASSIGNED_TO_FIELD_ENGINEER",
      fieldTeamAssigned: {
        engineerName: "Line Inspector P.K. Gupta",
        designation: "BSES Rapid Electrical Restoration Van #E-09",
        vehicleNumber: "DL-1ED-3390",
        contactPhone: "19123",
        etaMinutes: 20
      }
    }
  }
];
const DEPARTMENT_INFO = {
  PWD: {
    name: "Public Works Department (PWD)",
    code: "PWD",
    color: "#0284c7",
    bgLight: "#f0f9ff",
    borderLight: "#bae6fd",
    iconName: "Hammer",
    defaultPio: {
      name: "Er. Rajeshwar Meena",
      designation: "Superintending Engineer & CPIO",
      email: "cpio-south.pwd@gov.in",
      phone: "011-23348120",
      address: "PWD Division Office, Vikas Bhawan II, New Delhi"
    },
    sampleIssues: ["Pothole & Road Subsidence", "Broken Bridge Railing", "Footpath Caved In", "Street Lighting Flyover Blackout"]
  },
  WATER: {
    name: "Water Supply & Sewerage Board (Jal Board)",
    code: "WATER",
    color: "#0891b2",
    bgLight: "#ecfeff",
    borderLight: "#a5f3fc",
    iconName: "Droplets",
    defaultPio: {
      name: "Dr. Vivek Saxena",
      designation: "Director (Quality & Distribution) & CPIO",
      email: "cpio-waterquality@djb.gov.in",
      phone: "011-23512349",
      address: "Varunalaya Phase-II, Jhandewalan, New Delhi"
    },
    sampleIssues: ["Contaminated Drinking Water", "Main Water Pipeline Burst", "Overflowing Sewage on Street", "Low Water Pressure"]
  },
  MCD_SANITATION: {
    name: "Municipal Corporation (Solid Waste & Public Health)",
    code: "MCD_SANITATION",
    color: "#16a34a",
    bgLight: "#f0fdf4",
    borderLight: "#bbf7d0",
    iconName: "Trash2",
    defaultPio: {
      name: "Shri Vikramaditya Negi",
      designation: "Deputy Commissioner (Sanitation) & CPIO",
      email: "cpio-vigilance.mcd@gov.in",
      phone: "011-23225010",
      address: "Civic Centre, Minto Road, New Delhi"
    },
    sampleIssues: ["Uncollected Municipal Garbage Dump", "Clogged Stormwater Drain", "Dead Animal Carcass Removal", "Illegal Plastic Burning"]
  },
  POWER_DISCOM: {
    name: "State Electricity Distribution & Power Grid",
    code: "POWER_DISCOM",
    color: "#d97706",
    bgLight: "#fffbeb",
    borderLight: "#fde68a",
    iconName: "Zap",
    defaultPio: {
      name: "Er. Sandeep Bhasin",
      designation: "GM (Safety & Operations) & CPIO",
      email: "safety.emergency@bsesdelhi.com",
      phone: "19123 / 011-39999707",
      address: "BSES Corporate Office, Nehru Place, New Delhi"
    },
    sampleIssues: ["Dangling High-Tension Wire", "Transformer Sparking / Overheating", "Frequent Voltage Surges", "Open Underground Electrical Junction Box"]
  },
  HEALTH: {
    name: "Department of Health & Family Welfare",
    code: "HEALTH",
    color: "#e11d48",
    bgLight: "#fff1f2",
    borderLight: "#fecdd3",
    iconName: "HeartPulse",
    defaultPio: {
      name: "Dr. Sunita Kapoor",
      designation: "Chief Medical Officer & CPIO",
      email: "cpio.health@gov.in",
      phone: "011-22307145",
      address: "Directorate General of Health Services, Karkardooma, Delhi"
    },
    sampleIssues: ["Vector-Borne Disease Hotspot / Stagnant Dengue Water", "Hospital Emergency Refusal", "Shortage of Anti-Rabies Vaccine", "Bio-Medical Waste Violation"]
  },
  TRAFFIC: {
    name: "Traffic Police & Urban Mobility Transport Authority",
    code: "TRAFFIC",
    color: "#9333ea",
    bgLight: "#faf5ff",
    borderLight: "#e9d5ff",
    iconName: "Compass",
    defaultPio: {
      name: "Shri K.P. Ranganathan, IPS",
      designation: "Deputy Commissioner of Police (Traffic) & CPIO",
      email: "cpio.traffic@delhipolice.gov.in",
      phone: "011-25844444",
      address: "Traffic Police Headquarters, Todapur, New Delhi"
    },
    sampleIssues: ["Defective Traffic Signal Junction", "Unmarked Deadly Speed Breaker", "Illegal Auto-Rickshaw Stand Choking Intersection", "Missing Road Signage"]
  },
  URBAN_PLANNING: {
    name: "Town & Country Planning / Anti-Encroachment Cell",
    code: "URBAN_PLANNING",
    color: "#4f46e5",
    bgLight: "#eef2ff",
    borderLight: "#c7d2fe",
    iconName: "Building",
    defaultPio: {
      name: "Shri R.C. Malhotra",
      designation: "Director (Vigilance & Enforcement) & CPIO",
      email: "cpio-enforcement@dda.gov.in",
      phone: "011-24690412",
      address: "Vikas Sadan, INA, New Delhi"
    },
    sampleIssues: ["Illegal Public Footpath Commercial Encroachment", "Unauthorized Construction in Green Belt", "Demolished Boundary Wall in Public Park"]
  }
};
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
export {
  DEPARTMENT_INFO,
  INITIAL_GRIEVANCES,
  calculateDistanceMeters
};
