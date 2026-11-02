import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Building2, 
  RefreshCw, 
  Globe, 
  FileText, 
  Compass, 
  Info,
  ShieldCheck,
  CheckCircle2,
  Navigation
} from 'lucide-react';

interface MapPlace {
  title: string;
  uri: string;
  placeAnswerSources?: any;
}

interface WebSource {
  title: string;
  uri: string;
}

interface CivicGroundingPanelProps {
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
  initialDistrict?: string;
  initialDepartment?: string;
  lang?: 'en' | 'hi';
}

export const CivicGroundingPanel: React.FC<CivicGroundingPanelProps> = ({
  initialLat = 28.6289,
  initialLng = 77.2065,
  initialAddress = 'Outer Ring Road, Nehru Place, South Delhi',
  initialDistrict = 'South Delhi',
  initialDepartment = 'PWD',
  lang = 'en'
}) => {
  const [activeTool, setActiveTool] = useState<'MAPS' | 'SEARCH'>('MAPS');

  // Maps Grounding State
  const [mapsLoading, setMapsLoading] = useState(false);
  const [mapsResultText, setMapsResultText] = useState<string>('');
  const [mapPlaces, setMapPlaces] = useState<MapPlace[]>([]);
  const [customMapsQuery, setCustomMapsQuery] = useState('');

  // Search Grounding State
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResultText, setSearchResultText] = useState<string>('');
  const [webSources, setWebSources] = useState<WebSource[]>([]);
  const [customSearchQuery, setCustomSearchQuery] = useState('');

  // Auto-fetch on mount
  useEffect(() => {
    fetchMapsGrounding();
    fetchSearchGrounding();
  }, [initialLat, initialLng, initialAddress, initialDistrict]);

  const fetchMapsGrounding = async (overrideQuery?: string) => {
    setMapsLoading(true);
    try {
      const res = await fetch('/api/grounding/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: initialLat,
          lng: initialLng,
          address: initialAddress,
          departmentCode: initialDepartment,
          query: overrideQuery || customMapsQuery || undefined,
        }),
      });
      const data = await res.json();
      setMapsResultText(data.text || '');
      setMapPlaces(data.mapPlaces || []);
    } catch (e) {
      console.error('Failed to fetch maps grounding:', e);
    } finally {
      setMapsLoading(false);
    }
  };

  const fetchSearchGrounding = async (overrideQuery?: string) => {
    setSearchLoading(true);
    try {
      const res = await fetch('/api/grounding/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district: initialDistrict,
          category: initialDepartment,
          title: `Civic issues and road/water maintenance in ${initialDistrict}`,
          query: overrideQuery || customSearchQuery || undefined,
        }),
      });
      const data = await res.json();
      setSearchResultText(data.text || '');
      setWebSources(data.sources || []);
    } catch (e) {
      console.error('Failed to fetch search grounding:', e);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
      {/* Header with Tool Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-100 text-blue-800">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'en' ? 'Civic Grounding Intelligence' : 'नागरिक ग्राउंडिंग इंटेलिजेंस'}
            </h3>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-300">
              Gemini 3.8 Flash Powered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time verified information grounded using Google Maps and Google Search
          </p>
        </div>

        {/* Tab selection between Maps Grounding and Search Grounding */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTool('MAPS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTool === 'MAPS'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Google Maps Grounding</span>
          </button>

          <button
            onClick={() => setActiveTool('SEARCH')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTool === 'SEARCH'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span>Google Search Grounding</span>
          </button>
        </div>
      </div>

      {/* TOOL 1: GOOGLE MAPS GROUNDING */}
      {activeTool === 'MAPS' && (
        <div className="space-y-4">
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-950 block">
                  Nearest Government Zonal Offices & Civic Centers (Google Maps Grounded)
                </span>
                <span className="text-rose-800 text-[11px]">
                  Grounded around coordinate: {initialLat}° N, {initialLng}° E ({initialAddress})
                </span>
              </div>
            </div>

            <button
              onClick={() => fetchMapsGrounding()}
              disabled={mapsLoading}
              className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-xs transition-colors shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${mapsLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Maps</span>
            </button>
          </div>

          {/* Search bar inside maps grounding */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customMapsQuery}
              onChange={(e) => setCustomMapsQuery(e.target.value)}
              placeholder={`Ask Gemini for specific offices near ${initialAddress}...`}
              className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              onKeyDown={(e) => {
                if (e.key === 'Enter') fetchMapsGrounding(customMapsQuery);
              }}
            />
            <button
              onClick={() => fetchMapsGrounding(customMapsQuery)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Search Maps
            </button>
          </div>

          {mapsLoading ? (
            <div className="py-8 text-center text-xs text-slate-500 space-y-2">
              <RefreshCw className="w-5 h-5 mx-auto animate-spin text-rose-600" />
              <div>Retrieving nearby government offices & civic depots via Google Maps Grounding...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Grounded Text Overview */}
              {mapsResultText && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {mapsResultText}
                </div>
              )}

              {/* CRITICAL: List of Google Maps links extracted from groundingChunks */}
              <div>
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-rose-600" />
                  <span>Verified Google Maps Locations & Direct Links:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {mapPlaces.map((place, idx) => (
                    <a
                      key={idx}
                      href={place.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3 rounded-xl border border-slate-200 hover:border-rose-400 hover:bg-rose-50/30 transition-all flex flex-col justify-between text-xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900 group-hover:text-rose-700 leading-snug line-clamp-2">
                          {place.title}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 shrink-0 mt-0.5" />
                      </div>

                      <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                        <span>View on Google Maps</span>
                        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                      </div>
                    </a>
                  ))}

                  {mapPlaces.length === 0 && (
                    <div className="col-span-full text-center py-4 text-xs text-slate-400">
                      No Google Maps place markers returned for this coordinate.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 2: GOOGLE SEARCH GROUNDING */}
      {activeTool === 'SEARCH' && (
        <div className="space-y-4">
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Globe className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-blue-950 block">
                  Real-Time Public Advisories & Gazette Orders (Google Search Grounded)
                </span>
                <span className="text-blue-800 text-[11px]">
                  Live web citations regarding municipal maintenance, health circulars, and RTI precedents in {initialDistrict}
                </span>
              </div>
            </div>

            <button
              onClick={() => fetchSearchGrounding()}
              disabled={searchLoading}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${searchLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Search</span>
            </button>
          </div>

          {/* Search bar inside search grounding */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customSearchQuery}
              onChange={(e) => setCustomSearchQuery(e.target.value)}
              placeholder="Search recent gazette notifications, road repair orders, or water warnings..."
              className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              onKeyDown={(e) => {
                if (e.key === 'Enter') fetchSearchGrounding(customSearchQuery);
              }}
            />
            <button
              onClick={() => fetchSearchGrounding(customSearchQuery)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Search Web
            </button>
          </div>

          {searchLoading ? (
            <div className="py-8 text-center text-xs text-slate-500 space-y-2">
              <RefreshCw className="w-5 h-5 mx-auto animate-spin text-blue-600" />
              <div>Grounding live public advisories and municipal circulars via Google Search...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Grounded Summary Text */}
              {searchResultText && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {searchResultText}
                </div>
              )}

              {/* Citations and Web Sources extracted from groundingChunks */}
              <div>
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Verified Public Sources & Gazette Citations:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {webSources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex flex-col justify-between text-xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900 group-hover:text-blue-700 leading-snug line-clamp-2">
                          {source.title}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 mt-0.5" />
                      </div>

                      <div className="text-[11px] font-mono text-slate-500 truncate">
                        {source.uri.replace(/^https?:\/\//, '')}
                      </div>
                    </a>
                  ))}

                  {webSources.length === 0 && (
                    <div className="col-span-full text-center py-4 text-xs text-slate-400">
                      No web citations returned for this query.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
