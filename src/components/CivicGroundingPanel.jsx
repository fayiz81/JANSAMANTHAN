// Territorial Jurisdiction & Nearby Government Offices lookup panel.

import { useState, useEffect } from "react";
export const CivicGroundingPanel = ({
  initialLat = 28.6289,
  initialLng = 77.2065,
  initialAddress = "Outer Ring Road, Nehru Place, South Delhi",
  initialDistrict = "South Delhi",
  initialDepartment = "PWD",
  lang = "en"
}) => {
  const [activeTool, setActiveTool] = useState("MAPS");
  const [mapsLoading, setMapsLoading] = useState(false);
  const [mapsResultText, setMapsResultText] = useState("");
  const [mapPlaces, setMapPlaces] = useState([]);
  const [customMapsQuery, setCustomMapsQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResultText, setSearchResultText] = useState("");
  const [webSources, setWebSources] = useState([]);
  const [customSearchQuery, setCustomSearchQuery] = useState("");
  useEffect(() => {
    fetchMapsGrounding();
    fetchSearchGrounding();
  }, [initialLat, initialLng, initialAddress, initialDistrict]);
  const fetchMapsGrounding = async (overrideQuery) => {
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
          query: overrideQuery || customMapsQuery || undefined
        })
      });
      const data = await res.json();
      setMapsResultText(data.text || "");
      setMapPlaces(data.mapPlaces || []);
    } catch (e) {
      console.error("Failed to fetch maps grounding:", e);
    } finally {
      setMapsLoading(false);
    }
  };
  const fetchSearchGrounding = async (overrideQuery) => {
    setSearchLoading(true);
    try {
      const res = await fetch("/api/grounding/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district: initialDistrict,
          category: initialDepartment,
          title: `Civic issues and road/water maintenance in ${initialDistrict}`,
          query: overrideQuery || customSearchQuery || undefined
        })
      });
      const data = await res.json();
      setSearchResultText(data.text || "");
      setWebSources(data.webSources || []);
    } catch (e) {
      console.error("Failed to fetch search grounding:", e);
    } finally {
      setSearchLoading(false);
    }
  };
  return <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6 font-sans">
      {/* 1. Official Header */}
      <div className="bg-white border-t-4 border-t-[#0B3C5D] border-x border-b border-slate-300 shadow-xs p-5">
        <div className="border-b border-slate-200 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#0B3C5D]">
            GOVERNMENT OF INDIA • MUNICIPAL TERRITORIAL JURISDICTION & PUBLIC WORKS DIRECTORY
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mt-0.5">
            {lang === "en" ? "Territorial Jurisdiction & Nodal Authority Directory" : "क्षेत्रीय अधिकार क्षेत्र एवं नोडल प्राधिकरण निर्देशिका"}
          </h2>
          <div className="text-xs text-slate-600 mt-0.5">
            Ward boundary mapping, maintenance circle identification, and public works departmental contacts.
          </div>
        </div>

        {/* Selected Zone Context */}
        <div className="mt-3 p-3 bg-slate-50 border border-slate-300 text-xs text-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div>
            <strong>Current Active Zone:</strong> {initialAddress} ({initialDistrict})
          </div>
          <div className="font-mono text-slate-600">
            Coordinates: {initialLat}° N, {initialLng}° E
          </div>
        </div>
      </div>

      {/* 2. Tool Tabs */}
      <div className="bg-white border border-slate-300 shadow-xs p-4 space-y-4">
        <div className="flex border-b border-slate-200 text-xs">
          <button
    type="button"
    onClick={() => setActiveTool("MAPS")}
    className={`py-2 px-4 font-bold uppercase tracking-wider cursor-pointer border-b-2 ${activeTool === "MAPS" ? "border-[#0B3C5D] text-[#0B3C5D] bg-slate-50" : "border-transparent text-slate-600 hover:text-slate-900"}`}
  >
            Nodal Offices & Municipal Depots
          </button>
          <button
    type="button"
    onClick={() => setActiveTool("SEARCH")}
    className={`py-2 px-4 font-bold uppercase tracking-wider cursor-pointer border-b-2 ${activeTool === "SEARCH" ? "border-[#0B3C5D] text-[#0B3C5D] bg-slate-50" : "border-transparent text-slate-600 hover:text-slate-900"}`}
  >
            Gazette Notifications & Public Works Orders
          </button>
        </div>

        {/* MAPS TAB */}
        {activeTool === "MAPS" && <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
    type="text"
    value={customMapsQuery}
    onChange={(e) => setCustomMapsQuery(e.target.value)}
    placeholder="Search municipal offices, police stations, or repair depots..."
    className="w-full px-3 py-1.5 text-xs border border-slate-300 focus:outline-none focus:border-[#0B3C5D]"
  />
              <button
    type="button"
    onClick={() => fetchMapsGrounding()}
    disabled={mapsLoading}
    className="w-full sm:w-auto px-5 py-1.5 bg-[#0B3C5D] hover:bg-[#082D46] text-white text-xs font-bold uppercase cursor-pointer whitespace-nowrap"
  >
                {mapsLoading ? "Querying..." : "Query Jurisdiction"}
              </button>
            </div>

            {mapsResultText ? <div className="bg-slate-50 border border-slate-300 p-4 text-xs text-slate-800 leading-relaxed space-y-3">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 uppercase text-[11px]">
                  Official Ward & Competent Authority Assessment:
                </div>
                <p className="whitespace-pre-line">{mapsResultText}</p>
              </div> : mapsLoading ? <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 border border-slate-200">
                Retrieving official municipal directory records...
              </div> : null}

            {mapPlaces.length > 0 && <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Verified Local Authorities in Vicinity:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {mapPlaces.map((pl, idx) => <a
    key={idx}
    href={pl.uri}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 border border-slate-300 hover:border-[#0B3C5D] bg-white text-xs block transition-colors"
  >
                      <div className="font-bold text-slate-900">{pl.title}</div>
                      <div className="text-[10px] text-blue-700 underline mt-1">View Geographic Registry Entry</div>
                    </a>)}
                </div>
              </div>}
          </div>}

        {/* SEARCH TAB */}
        {activeTool === "SEARCH" && <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
    type="text"
    value={customSearchQuery}
    onChange={(e) => setCustomSearchQuery(e.target.value)}
    placeholder="Search recent municipal tenders, road repair gazettes, or advisory..."
    className="w-full px-3 py-1.5 text-xs border border-slate-300 focus:outline-none focus:border-[#0B3C5D]"
  />
              <button
    type="button"
    onClick={() => fetchSearchGrounding()}
    disabled={searchLoading}
    className="w-full sm:w-auto px-5 py-1.5 bg-[#0B3C5D] hover:bg-[#082D46] text-white text-xs font-bold uppercase cursor-pointer whitespace-nowrap"
  >
                {searchLoading ? "Querying..." : "Query Gazette"}
              </button>
            </div>

            {searchResultText ? <div className="bg-slate-50 border border-slate-300 p-4 text-xs text-slate-800 leading-relaxed space-y-3">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 uppercase text-[11px]">
                  Public Works & Gazette Summary:
                </div>
                <p className="whitespace-pre-line">{searchResultText}</p>
              </div> : searchLoading ? <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 border border-slate-200">
                Searching official government portals & municipal notices...
              </div> : null}

            {webSources.length > 0 && <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Referenced Government Documents & Notices:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {webSources.map((src, idx) => <a
    key={idx}
    href={src.uri}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 border border-slate-300 hover:border-[#0B3C5D] bg-white text-xs block transition-colors"
  >
                      <div className="font-bold text-slate-900 line-clamp-1">{src.title}</div>
                      <div className="text-[10px] text-blue-700 underline mt-1 truncate">{src.uri}</div>
                    </a>)}
                </div>
              </div>}
          </div>}
      </div>
    </div>;
};
