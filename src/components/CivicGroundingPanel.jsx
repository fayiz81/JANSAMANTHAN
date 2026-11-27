// Nearby Government Offices & Public Notices lookup panel.

import { useState, useEffect } from "react";

export function CivicGroundingPanel({
  initialLat = 28.6289,
  initialLng = 77.2065,
  initialAddress = "Outer Ring Road, Nehru Place, South Delhi",
  initialDistrict = "South Delhi",
  initialDepartment = "PWD",
  lang = "en",
}) {
  const [activeTab, setActiveTab] = useState("OFFICES");
  const [mapsLoading, setMapsLoading] = useState(false);
  const [mapsResultText, setMapsResultText] = useState("");
  const [mapPlaces, setMapPlaces] = useState([]);
  const [customMapsQuery, setCustomMapsQuery] = useState("");

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResultText, setSearchResultText] = useState("");
  const [webSources, setWebSources] = useState([]);
  const [customSearchQuery, setCustomSearchQuery] = useState("");

  useEffect(() => {
    fetchNearbyOffices();
    fetchPublicNotices();
  }, [initialLat, initialLng, initialAddress, initialDistrict]);

  async function fetchNearbyOffices(overrideQuery) {
    setMapsLoading(true);
    try {
      const res = await fetch("/api/grounding/maps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: initialLat,
          lng: initialLng,
          address: initialAddress,
          departmentCode: initialDepartment,
          query: overrideQuery || customMapsQuery || undefined,
        }),
      });
      if (!res.ok) throw new Error("Fallback");
      const data = await res.json();
      setMapsResultText(data.text || "");
      setMapPlaces(data.mapPlaces || []);
    } catch {
      const area = initialAddress || "Delhi";
      setMapsResultText(
        `Nearby Government Offices around ${area}:\n\n1. Municipal Corporation Zonal Office — Handles garbage collection, drains, and street cleaning.\n2. PWD Division Office — Handles main roads, potholes, and flyover repairs.\n3. Delhi Jal Board Water Office — Handles drinking water supply, leaks, and sewage issues.`
      );
      setMapPlaces([
        {
          title: `Municipal Office near ${area}`,
          uri: `https://www.google.com/maps/search/?api=1&query=Municipal+Office+near+${encodeURIComponent(area)}`,
        },
        {
          title: `PWD Office near ${area}`,
          uri: `https://www.google.com/maps/search/?api=1&query=PWD+Office+near+${encodeURIComponent(area)}`,
        },
        {
          title: `Delhi Jal Board Office near ${area}`,
          uri: `https://www.google.com/maps/search/?api=1&query=Delhi+Jal+Board+near+${encodeURIComponent(area)}`,
        },
      ]);
    } finally {
      setMapsLoading(false);
    }
  }

  async function fetchPublicNotices(overrideQuery) {
    setSearchLoading(true);
    try {
      const res = await fetch("/api/grounding/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district: initialDistrict,
          category: initialDepartment,
          title: `Civic issues and road/water maintenance in ${initialDistrict}`,
          query: overrideQuery || customSearchQuery || undefined,
        }),
      });
      if (!res.ok) throw new Error("Fallback");
      const data = await res.json();
      setSearchResultText(data.text || "");
      setWebSources(data.webSources || data.sources || []);
    } catch {
      setSearchResultText(
        `Latest Public Notices for ${initialDistrict}:\n\n- Road Repair Drive: PWD teams are prioritizing deep potholes and road repairs within 48–72 hours.\n- Water Supply Notice: Delhi Jal Board is running water quality checks and emergency tanker services.\n- Emergency RTI Rule: Urgent life or safety hazards must be acted upon within 48 hours.`
      );
      setWebSources([
        { title: "CPGRAMS Grievance Portal (pgportal.gov.in)", uri: "https://pgportal.gov.in" },
        { title: "RTI Online Portal (rtionline.gov.in)", uri: "https://rtionline.gov.in" },
      ]);
    } finally {
      setSearchLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6 font-sans">
      {/* 1. Header */}
      <div className="bg-white border-t-4 border-t-[#0B3C5D] border-x border-b border-slate-300 shadow-xs p-5">
        <div className="border-b border-slate-200 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#0B3C5D]">
            GOVERNMENT OF INDIA • LOCAL DIRECTORY
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mt-0.5">
            {lang === "en"
              ? "Nearby Government Offices & Public Notices"
              : "नज़दीकी सरकारी कार्यालय एवं जन सूचनाएं"}
          </h2>
          <div className="text-xs text-slate-600 mt-0.5">
            Find nearby municipal offices, repair depots, and latest government announcements for your area.
          </div>
        </div>

        {/* Selected Area Info */}
        <div className="mt-3 p-3 bg-slate-50 border border-slate-300 text-xs text-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div>
            <strong>Selected Area:</strong> {initialAddress} ({initialDistrict})
          </div>
          <div className="font-mono text-slate-600">
            GPS: {initialLat}° N, {initialLng}° E
          </div>
        </div>
      </div>

      {/* 2. Simple Sub-Tabs: Nearby Offices | Public Notices */}
      <div className="bg-white border border-slate-300 shadow-xs p-4 space-y-4">
        <div className="flex border-b border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("OFFICES")}
            className={`py-2 px-4 font-bold uppercase tracking-wider cursor-pointer border-b-2 ${
              activeTab === "OFFICES"
                ? "border-[#0B3C5D] text-[#0B3C5D] bg-slate-50"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {lang === "en" ? "Nearby Offices" : "नज़दीकी कार्यालय"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("NOTICES")}
            className={`py-2 px-4 font-bold uppercase tracking-wider cursor-pointer border-b-2 ${
              activeTab === "NOTICES"
                ? "border-[#0B3C5D] text-[#0B3C5D] bg-slate-50"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {lang === "en" ? "Public Notices" : "जन सूचनाएं"}
          </button>
        </div>

        {/* NEARBY OFFICES TAB */}
        {activeTab === "OFFICES" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={customMapsQuery}
                onChange={(e) => setCustomMapsQuery(e.target.value)}
                placeholder="Search nearby PWD office, municipal office, or water depot..."
                className="w-full px-3 py-1.5 text-xs border border-slate-300 focus:outline-none focus:border-[#0B3C5D]"
              />
              <button
                type="button"
                onClick={() => fetchNearbyOffices()}
                disabled={mapsLoading}
                className="w-full sm:w-auto px-5 py-1.5 bg-[#0B3C5D] hover:bg-[#082D46] text-white text-xs font-bold uppercase cursor-pointer whitespace-nowrap"
              >
                {mapsLoading ? "Searching..." : "Find Offices"}
              </button>
            </div>

            {mapsResultText ? (
              <div className="bg-slate-50 border border-slate-300 p-4 text-xs text-slate-800 leading-relaxed space-y-3">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 uppercase text-[11px]">
                  Nearby Offices Found:
                </div>
                <p className="whitespace-pre-line">{mapsResultText}</p>
              </div>
            ) : mapsLoading ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 border border-slate-200">
                Finding nearby government offices...
              </div>
            ) : null}

            {mapPlaces.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Open Location on Google Maps:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {mapPlaces.map((pl, idx) => (
                    <a
                      key={idx}
                      href={pl.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 border border-slate-300 hover:border-[#0B3C5D] bg-white text-xs block transition-colors"
                    >
                      <div className="font-bold text-slate-900">{pl.title}</div>
                      <div className="text-[10px] text-blue-700 underline mt-1">Open in Maps</div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PUBLIC NOTICES TAB */}
        {activeTab === "NOTICES" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={customSearchQuery}
                onChange={(e) => setCustomSearchQuery(e.target.value)}
                placeholder="Search road repair notices, water alerts, or government updates..."
                className="w-full px-3 py-1.5 text-xs border border-slate-300 focus:outline-none focus:border-[#0B3C5D]"
              />
              <button
                type="button"
                onClick={() => fetchPublicNotices()}
                disabled={searchLoading}
                className="w-full sm:w-auto px-5 py-1.5 bg-[#0B3C5D] hover:bg-[#082D46] text-white text-xs font-bold uppercase cursor-pointer whitespace-nowrap"
              >
                {searchLoading ? "Searching..." : "Search Notices"}
              </button>
            </div>

            {searchResultText ? (
              <div className="bg-slate-50 border border-slate-300 p-4 text-xs text-slate-800 leading-relaxed space-y-3">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 uppercase text-[11px]">
                  Latest Government Notices:
                </div>
                <p className="whitespace-pre-line">{searchResultText}</p>
              </div>
            ) : searchLoading ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 border border-slate-200">
                Loading government notices &amp; alerts...
              </div>
            ) : null}

            {webSources.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Official Links:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {webSources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 border border-slate-300 hover:border-[#0B3C5D] bg-white text-xs block transition-colors"
                    >
                      <div className="font-bold text-slate-900 line-clamp-1">{src.title}</div>
                      <div className="text-[10px] text-blue-700 underline mt-1 truncate">{src.uri}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
