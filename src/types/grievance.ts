export type DepartmentCode = 
  | 'PWD'
  | 'WATER'
  | 'MCD_SANITATION'
  | 'POWER_DISCOM'
  | 'HEALTH'
  | 'TRAFFIC'
  | 'URBAN_PLANNING';

export type GrievanceSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'ROUTINE';

export type GrievanceStatus = 
  | 'SUBMITTED'
  | 'AI_VERIFIED'
  | 'ROUTED'
  | 'INVESTIGATING'
  | 'FIELD_WORK_DISPATCHED'
  | 'RESOLVED'
  | 'REJECTED_MANIPULATED'
  | 'MERGED_DUPLICATE';

export type GovTransmissionStatus = 
  | 'TRANSMITTED_TO_MINISTRY'
  | 'ASSIGNED_TO_FIELD_ENGINEER'
  | 'CREW_ON_SITE'
  | 'WORK_COMPLETED'
  | 'CLOSED_VERIFIED';

export type AuthenticityRating = 
  | 'AUTHENTIC'
  | 'SUSPICIOUS'
  | 'LIKELY_MANIPULATED'
  | 'STOCK_OR_SYNTHETIC';

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  landmark?: string;
  wardOrSector?: string;
  district: string;
  state: string;
  pinCode: string;
}

export interface ImageForensicsResult {
  isManipulated: boolean;
  authenticityRating: AuthenticityRating;
  manipulationConfidenceScore: number; // 0 - 100
  aiGeneratedProbability: number; // 0 - 100
  detectedArtifacts: string[];
  visualSummary: string;
  exifData?: {
    cameraModel?: string;
    timestamp?: string;
    gpsEmbedded?: boolean;
    softwareUsed?: string;
  };
}

export interface DuplicateCheckMatch {
  matchedId: string;
  matchedTitle: string;
  similarityPercentage: number;
  distanceMeters: number;
  createdHoursAgo: number;
  reason: string;
}

export interface DuplicateDetectionResult {
  isDuplicateCandidate: boolean;
  duplicateRisk: 'LOW' | 'MODERATE' | 'HIGH';
  topMatches: DuplicateCheckMatch[];
  recommendation: 'PROCEED_DISPATCH' | 'FLAG_FOR_OFFICER_REVIEW' | 'MERGE_CLUSTER';
  clusterId?: string;
}

export interface RtiAutoResponse {
  referenceId: string;
  acknowledgementDate: string;
  statutoryDeadline: string;
  statutorySection: string; // e.g. "Section 7(1) Proviso (Life & Liberty - 48h)" or "Section 7(1) (30 Days)"
  publicAuthorityName: string;
  subjectLine: string;
  acknowledgementText: string;
  preliminaryAction: string;
  legalNoticeClauses: string[];
  designatedPio: {
    name: string;
    designation: string;
    department: string;
    contactEmail: string;
    phone: string;
    officeAddress: string;
  };
  firstAppellateAuthority: {
    name: string;
    designation: string;
    officeAddress: string;
  };
  inspectionScheduled?: {
    willInspect: boolean;
    inspectionWindow: string;
  };
}

export interface GovernmentDispatchInfo {
  isDirectlyDispatched: boolean;
  governmentPortal: string; // e.g., "CPGRAMS / Central Public Grievance Portal & Ministry Gateway"
  governmentRefNumber: string; // e.g., "CPGRAMS/2026/DL-94102"
  dispatchedAt: string;
  nodalMinistry: string;
  transmissionStatus: GovTransmissionStatus;
  portalSourceUrl?: string; // Direct URL to government portal
  portalHost?: string; // e.g. "pgportal.gov.in" | "rtionline.gov.in" | "mcdonline.nic.in"
  isLiveSyncedFromGov?: boolean;
  liveSyncTimestamp?: string;
  govCitations?: {
    title: string;
    uri: string;
  }[];
  fieldTeamAssigned?: {
    engineerName: string;
    designation: string;
    vehicleNumber?: string;
    contactPhone: string;
    etaMinutes?: number;
  };
  resolutionProof?: {
    completionNote: string;
    resolvedAt: string;
    inspectorBadge: string;
    beforeAfterImg?: string;
  };
}

export interface GrievanceRecord {
  id: string; // e.g., GRV-2026-PWD-8921
  token: string;
  title: string;
  description: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  location: LocationData;
  departmentCode: DepartmentCode;
  departmentName: string;
  subCategory: string;
  severity: GrievanceSeverity;
  urgencyRationale: string;
  statutorySlaDays: number;
  status: GrievanceStatus;
  statusTimeline: {
    status: GrievanceStatus;
    timestamp: string;
    note: string;
    actor: string;
  }[];
  actionPlanSteps: string[];
  imageForensics: ImageForensicsResult;
  duplicateDetection: DuplicateDetectionResult;
  rtiResponse: RtiAutoResponse;
  governmentDispatch: GovernmentDispatchInfo;
  officerNotes?: string;
  parentGrievanceId?: string;
  isLiveGovFeedItem?: boolean;
  govPortalUrl?: string;
}
