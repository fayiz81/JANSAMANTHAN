import React from 'react';
import { 
  FileText, 
  Search, 
  Building2, 
  ShieldAlert, 
  BarChart3, 
  Sparkles,
  PhoneCall,
  Languages,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'submit' | 'track' | 'live' | 'grounding' | 'officer' | 'forensics' | 'analytics';
  setActiveTab: (tab: 'submit' | 'track' | 'live' | 'grounding' | 'officer' | 'forensics' | 'analytics') => void;
  lang: 'en' | 'hi';
  setLang: (lang: 'en' | 'hi') => void;
  pendingCount: number;
  criticalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  pendingCount,
  criticalCount
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Gazette / Citizen Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-slate-200">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {lang === 'en' ? 'GOVERNMENT OF INDIA' : 'भारत सरकार'} • {lang === 'en' ? 'CENTRAL RTI & GRIEVANCE DIRECTORY' : 'केंद्रीय आरटीआई एवं लोक शिकायत पोर्टल'}
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">
              {lang === 'en' ? 'Right to Information Act, 2005 (Sec 6 & 7 Compliant)' : 'सूचना का अधिकार अधिनियम, 2005'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a 
              href="tel:1905" 
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'National Helpline: 1905' : 'राष्ट्रीय हेल्पलाइन: 1905'}</span>
            </a>

            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 text-slate-200 bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700 transition-colors cursor-pointer"
              title="Toggle Language"
            >
              <Languages className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'en' ? 'हिंदी (Hindi)' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand & Emblem Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Official Emblem Icon */}
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 p-0.5 shadow-sm flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[7px] flex items-center justify-center text-amber-400">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.4"/>
              </svg>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-serif-gov">
                {lang === 'en' ? 'JanSamadhan AI' : 'जनसमाधान एआई'}
              </h1>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                RTI Auto-Responder
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {lang === 'en'
                ? 'Ministry of Personnel, Public Grievances & Pensions • AI Civic Dispatch & Forensic Registry'
                : 'कार्मिक, लोक शिकायत और पेंशन मंत्रालय • एआई नागरिक प्रेषण एवं फॉरेंसिक रजिस्ट्री'}
            </p>
          </div>
        </div>

        {/* Quick Badges */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="font-semibold text-slate-800">Auto-PIO Routing</div>
              <div className="text-slate-500 text-[10px]">Sec 6(1) Direct Dispatch</div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <div className="font-semibold text-amber-900">Visual Forensics</div>
              <div className="text-amber-700 text-[10px]">Anti-Tamper & Duplicate AI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-1 scrollbar-none" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'submit'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{lang === 'en' ? 'Lodge Grievance' : 'शिकायत दर्ज करें'}</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'track'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>{lang === 'en' ? 'Track Status & RTI Notice' : 'स्थिति एवं आरटीआई सूचना'}</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'live'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{lang === 'en' ? 'Live Govt Issues Feed' : 'लाइव सरकारी फ़ीड'}</span>
            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-300">
              Active
            </span>
          </button>

          <button
            onClick={() => setActiveTab('grounding')}
            className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'grounding'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{lang === 'en' ? 'Maps & Search Grounding' : 'मैप्स व सर्च ग्राउंडिंग'}</span>
            <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-blue-200">
              AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('officer')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap relative ${
              activeTab === 'officer'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{lang === 'en' ? 'Department Desk (CPIO)' : 'विभागीय डेस्क (सीपीआईओ)'}</span>
            {pendingCount > 0 && (
              <span className="ml-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingCount}
              </span>
            )}
            {criticalCount > 0 && (
              <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                {criticalCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('forensics')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'forensics'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>{lang === 'en' ? 'AI Forensics & Duplicates' : 'फॉरेंसिक व डुप्लिकेट लैब'}</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{lang === 'en' ? 'SLA & Transparency' : 'पारदर्शिता आंकड़े'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
