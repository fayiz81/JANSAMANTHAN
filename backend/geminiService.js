// Helper module for calling the Gemini AI SDK.
// Handles grievance analysis, Maps office lookup, Search advisories, and portal verification.

import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini client if GEMINI_API_KEY is available in .env
export function createGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: { "User-Agent": "aistudio-build" },
    },
  });
}

// JSON schema telling Gemini the exact structure to return for a grievance
const GRIEVANCE_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    departmentCode: {
      type: Type.STRING,
      description: "One of: PWD, WATER, MCD_SANITATION, POWER_DISCOM, HEALTH, TRAFFIC, URBAN_PLANNING",
    },
    departmentName: { type: Type.STRING },
    subCategory: { type: Type.STRING },
    severity: { type: Type.STRING, description: "CRITICAL, HIGH, MEDIUM, or ROUTINE" },
    urgencyRationale: { type: Type.STRING },
    statutorySlaDays: { type: Type.INTEGER },
    actionPlanSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
    imageForensics: {
      type: Type.OBJECT,
      properties: {
        isManipulated: { type: Type.BOOLEAN },
        authenticityRating: {
          type: Type.STRING,
          description: "AUTHENTIC, SUSPICIOUS, LIKELY_MANIPULATED, or STOCK_OR_SYNTHETIC",
        },
        manipulationConfidenceScore: { type: Type.NUMBER },
        aiGeneratedProbability: { type: Type.NUMBER },
        detectedArtifacts: { type: Type.ARRAY, items: { type: Type.STRING } },
        visualSummary: { type: Type.STRING },
      },
      required: [
        "isManipulated",
        "authenticityRating",
        "manipulationConfidenceScore",
        "aiGeneratedProbability",
        "detectedArtifacts",
        "visualSummary",
      ],
    },
    duplicateDetection: {
      type: Type.OBJECT,
      properties: {
        isDuplicateCandidate: { type: Type.BOOLEAN },
        duplicateRisk: { type: Type.STRING, description: "LOW, MODERATE, or HIGH" },
        recommendation: {
          type: Type.STRING,
          description: "PROCEED_DISPATCH, FLAG_FOR_OFFICER_REVIEW, or MERGE_CLUSTER",
        },
        matchedExistingId: { type: Type.STRING },
        similarityPercentage: { type: Type.NUMBER },
        reason: { type: Type.STRING },
      },
      required: ["isDuplicateCandidate", "duplicateRisk", "recommendation"],
    },
    rtiResponse: {
      type: Type.OBJECT,
      properties: {
        referenceId: { type: Type.STRING },
        statutorySection: { type: Type.STRING },
        publicAuthorityName: { type: Type.STRING },
        subjectLine: { type: Type.STRING },
        acknowledgementText: { type: Type.STRING },
        preliminaryAction: { type: Type.STRING },
        legalNoticeClauses: { type: Type.ARRAY, items: { type: Type.STRING } },
        designatedPio: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            designation: { type: Type.STRING },
            department: { type: Type.STRING },
            contactEmail: { type: Type.STRING },
            phone: { type: Type.STRING },
            officeAddress: { type: Type.STRING },
          },
          required: ["name", "designation", "department", "contactEmail", "phone", "officeAddress"],
        },
        firstAppellateAuthority: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            designation: { type: Type.STRING },
            officeAddress: { type: Type.STRING },
          },
          required: ["name", "designation", "officeAddress"],
        },
      },
      required: [
        "referenceId",
        "statutorySection",
        "publicAuthorityName",
        "subjectLine",
        "acknowledgementText",
        "preliminaryAction",
        "legalNoticeClauses",
        "designatedPio",
        "firstAppellateAuthority",
      ],
    },
  },
  required: [
    "departmentCode",
    "departmentName",
    "subCategory",
    "severity",
    "urgencyRationale",
    "statutorySlaDays",
    "actionPlanSteps",
    "imageForensics",
    "duplicateDetection",
    "rtiResponse",
  ],
};

/**
 * Analyze a citizen grievance (text + optional image) using Gemini.
 */
export async function analyzeGrievanceWithAI(ai, payload) {
  const { title, description, location, citizenName, imageBase64, mimeType = "image/jpeg", existingComplaints = [] } = payload;

  const contentsParts = [];

  // Attach uploaded image if it is a base64 data URL
  if (imageBase64 && imageBase64.startsWith("data:image")) {
    const [header, base64Data] = imageBase64.split("base64,");
    const mimeMatch = header.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);/);
    contentsParts.push({
      inlineData: {
        mimeType: mimeMatch ? mimeMatch[1] : mimeType,
        data: base64Data,
      },
    });
  }

  // Summarize up to 10 recent complaints so AI can spot duplicates
  const existingSummary = Array.isArray(existingComplaints)
    ? existingComplaints
        .slice(0, 10)
        .map(
          (c) =>
            `[ID: ${c.id}] Title: "${c.title}" | Dept: ${c.departmentCode} | Loc: ${c.location?.address || "N/A"} (${c.location?.lat}, ${c.location?.lng})`
        )
        .join("\n")
    : "None";

  const promptText = `
You are an official CPIO and Civic Grievance Analyst for JanSamadhan (Indian Government Grievance & RTI Portal).
Analyze this citizen complaint and return valid JSON matching the schema:

COMPLAINT:
- Title: ${title}
- Description: ${description}
- Citizen: ${citizenName || "Anonymous Citizen"}
- Location: ${JSON.stringify(location || {})}

RECENT EXISTING COMPLAINTS (for duplicate check):
${existingSummary}

TASKS:
1. Image Forensics: Check for tampering, AI generation, or stock image reuse if an image is provided.
2. Department Routing: Pick the best department code (PWD, WATER, MCD_SANITATION, POWER_DISCOM, HEALTH, TRAFFIC, URBAN_PLANNING), severity (CRITICAL/HIGH/MEDIUM/ROUTINE), SLA days, and 4 action plan steps.
3. Duplicate Check: Flag if an existing complaint within 500m reports the same defect.
4. RTI Notice: Draft a formal RTI Act 2005 (Sec 6 & 7) acknowledgment with CPIO and First Appellate Authority details.
`;

  contentsParts.push({ text: promptText });

  // Timeout after 12 seconds so the form never hangs
  const response = await Promise.race([
    ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: contentsParts,
      config: {
        systemInstruction:
          "You are a Government Public Information Officer (CPIO) and Civic Forensic Analyst. Return accurate structured JSON.",
        responseMimeType: "application/json",
        responseSchema: GRIEVANCE_RESPONSE_SCHEMA,
      },
    }),
    new Promise((_, reject) => setTimeout(() => reject(new Error("AI request timed out")), 12000)),
  ]);

  return JSON.parse((response.text || "{}").trim());
}

/**
 * Find nearby government offices using Gemini Google Maps grounding.
 */
export async function searchNearbyOfficesWithAI(ai, { lat, lng, address, query }) {
  const prompt =
    query ||
    `Find the nearest PWD zonal office, municipal ward office, Delhi Jal Board depot, or civic response centers near: ${address || "New Delhi, India"}.`;

  const response = await ai.models.generateContent({
    model: "gemini-4-hydrogen",
    contents: prompt,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: { latLng: { latitude: lat, longitude: lng } },
      },
    },
  });

  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const mapPlaces = chunks
    .filter((chunk) => chunk.maps)
    .map((chunk) => ({
      title: chunk.maps.title || "Government Office",
      uri:
        chunk.maps.uri ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(chunk.maps.title || address)}`,
      placeAnswerSources: chunk.maps.placeAnswerSources,
    }));

  return {
    text: response.text || "",
    mapPlaces,
    groundingMetadata: response.candidates?.[0]?.groundingMetadata,
  };
}

/**
 * Search live government advisories or portal updates using Gemini Google Search grounding.
 */
export async function searchGovWebWithAI(ai, prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-4-hydrogen",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = chunks
    .filter((chunk) => chunk.web)
    .map((chunk) => ({
      title: chunk.web.title || "Official Government Source",
      uri: chunk.web.uri,
    }));

  return {
    text: response.text || "",
    sources,
    groundingMetadata: response.candidates?.[0]?.groundingMetadata,
  };
}
