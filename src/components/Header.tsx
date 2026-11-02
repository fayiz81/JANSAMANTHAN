import React from 'react';
import { AshokaEmblem } from './AshokaEmblem';

interface HeaderProps {
  activeTab: 'submit' | 'track' | 'live' | 'grounding' | 'officer' | 'forensics' | 'analytics';
  setActiveTab: (tab: 'submit' | 'track' | 'live' | 'grounding' | 'officer' | 'forensics' | 'analytics') => void;
  lang: 'en' | 'hi';
  setLang: (lang: 'en' | 'hi') => void;
  pendingCount: number;
  criticalCount: number;
  fontScale: 'normal' | 'large' | 'larger';
  setFontScale: (scale: 'normal' | 'large' | 'larger') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  pendingCount,
  criticalCount,
  fontScale,
  setFontScale
}) => {
  return (
    <header className="bg-white border-b border-slate-300 sticky top-0 z-40 shadow-xs font-sans">
      {/* 1. Indian National Flag Tricolor Ribbon */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-[#FFFFFF] border-y border-slate-200"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* 2. Top Government Gazette & Accessibility Utility Bar */}
      <div className="bg-[#1B2A4A] text-slate-200 text-xs py-1.5 px-4 sm:px-6 border-b border-[#0E1A34]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Official Authority Notice */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
              {lang === 'en' ? 'GOVERNMENT OF INDIA' : 'भारत सरकार'}
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">
              {lang === 'en' 
                ? 'Ministry of Personnel, Public Grievances & Pensions (DARPG)' 
                : 'कार्मिक, लोक शिकायत और पेंशन मंत्रालय (प्रशासनिक सुधार)'}
            </span>
            <span className="hidden lg:inline text-slate-500">•</span>
            <span className="hidden lg:inline text-slate-400 text-[11px]">
              RTI Act 2005 (Sec 6 & 7 Mandate)
            </span>
          </div>

          {/* Right: Accessibility Controls & Language Toggle */}
          <div className="flex items-center gap-3 text-xs">
            {/* National Helpline */}
            <div className="hidden sm:flex items-center gap-1 text-amber-200 font-medium">
              <span>{lang === 'en' ? 'Toll-Free Helpline:' : 'टोल-फ्री हेल्पलाइन:'}</span>
              <a href="tel:1905" className="font-bold underline hover:text-white">1905</a>
            </div>

            <span className="text-slate-500 hidden sm:inline">|</span>

            {/* Font Resize Accessibility (Standard Gov Practice A- / A / A+) */}
            <div className="flex items-center border border-slate-600 rounded bg-[#0f1d38] overflow-hidden" title="Accessibility Font Size Controls">
              <button
                type="button"
                onClick={() => setFontScale('normal')}
                className={`px-1.5 py-0.5 text-[11px] font-bold cursor-pointer transition-colors ${
                  fontScale === 'normal' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                }`}
                title="Default Font Size (A)"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontScale('large')}
                className={`px-1.5 py-0.5 text-xs font-bold border-l border-slate-600 cursor-pointer transition-colors ${
                  fontScale === 'large' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                }`}
                title="Large Font Size (A+)"
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setFontScale('larger')}
                className={`px-1.5 py-0.5 text-xs font-bold border-l border-slate-600 cursor-pointer transition-colors ${
                  fontScale === 'larger' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                }`}
                title="Extra Large Font Size (A++)"
              >
                A++
              </button>
            </div>

            <span className="text-slate-500">|</span>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-2 py-0.5 rounded text-[11px] border border-white/20 transition-colors cursor-pointer"
              title="Change Language / भाषा बदलें"
            >
              {lang === 'en' ? 'हिन्दी (Hindi)' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Official Government Portal Masthead / Branding */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* National Emblem & Ministry Names */}
          <div className="flex items-center gap-3.5">
            <AshokaEmblem className="h-16 w-auto shrink-0 drop-shadow-xs" size={62} />
            <div className="border-l border-slate-300 pl-3.5 py-0.5">
              <div className="text-[#0B3C5D] font-bold text-xs uppercase tracking-wider font-serif">
                {lang === 'en' ? 'Government of India' : 'भारत सरकार'}
              </div>
              <div className="text-slate-700 font-semibold text-xs leading-snug">
                {lang === 'en' 
                  ? 'Ministry of Personnel, Public Grievances & Pensions' 
                  : 'कार्मिक, लोक शिकायत और पेंशन मंत्रालय'}
              </div>
              <div className="text-slate-500 text-[11px]">
                {lang === 'en'
                  ? 'Department of Administrative Reforms and Public Grievances (DARPG)'
                  : 'प्रशासनिक सुधार और लोक शिकायत विभाग'}
              </div>
            </div>
          </div>

          {/* Portal Title & Statutory Recognition */}
          <div className="flex flex-col md:items-end justify-center">
            <div className="flex items-center gap-2">
              <span className="bg-[#0B3C5D] text-white font-extrabold text-sm px-2 py-0.5 rounded tracking-wide">
                CPGRAMS
              </span>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {lang === 'en' 
                  ? 'JanSamadhan National Redressal Portal' 
                  : 'जनसमाधान राष्ट्रीय शिकायत निवारण पोर्टल'}
              </h1>
            </div>
            <div className="text-[11px] text-slate-600 font-medium mt-0.5 flex flex-wrap items-center gap-2">
              <span>Centralized Public Grievance Redress and Monitoring System</span>
              <span className="text-slate-400">•</span>
              <span className="text-[#138808] font-semibold">NIC GIGW Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Official Government Blue Navigation Bar */}
      <div className="bg-[#0B3C5D] text-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          <nav className="flex space-x-0.5 overflow-x-auto scrollbar-none py-0" aria-label="Portal Navigation">
            {/* Tab 1: Lodge Grievance */}
            <button
              type="button"
              onClick={() => setActiveTab('submit')}
              className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border-b-4 ${
                activeTab === 'submit'
                  ? 'border-[#FF9933] bg-[#082D46] text-amber-300 font-bold'
                  : 'border-transparent text-slate-100 hover:bg-[#0e4970] hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Lodge Grievance' : 'शिकायत दर्ज करें'}
            </button>

            {/* Tab 2: Track Status */}
            <button
              type="button"
              onClick={() => setActiveTab('track')}
              className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border-b-4 ${
                activeTab === 'track'
                  ? 'border-[#FF9933] bg-[#082D46] text-amber-300 font-bold'
                  : 'border-transparent text-slate-100 hover:bg-[#0e4970] hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Track Grievance / RTI' : 'स्थिति जांचें / आरटीआई'}
            </button>

            {/* Tab 3: Live Govt Redressal Stream */}
            <button
              type="button"
              onClick={() => setActiveTab('live')}
              className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border-b-4 flex items-center gap-1.5 ${
                activeTab === 'live'
                  ? 'border-[#FF9933] bg-[#082D46] text-amber-300 font-bold'
                  : 'border-transparent text-slate-100 hover:bg-[#0e4970] hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{lang === 'en' ? 'Live Govt Stream (CPGRAMS)' : 'लाइव सरकारी फ़ीड'}</span>
            </button>

            {/* Tab 4: Geographical Jurisdiction */}
            <button
              type="button"
              onClick={() => setActiveTab('grounding')}
              className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border-b-4 ${
                activeTab === 'grounding'
                  ? 'border-[#FF9933] bg-[#082D46] text-amber-300 font-bold'
                  : 'border-transparent text-slate-100 hover:bg-[#0e4970] hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Jurisdiction & Works' : 'अधिकार क्षेत्र व कार्य'}
            </button>

            {/* Tab 5: Department Desk */}
            <button
              type="button"
              onClick={() => setActiveTab('officer')}
              className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border-b-4 flex items-center gap-1.5 ${
                activeTab === 'officer'
                  ? 'border-[#FF9933] bg-[#082D46] text-amber-300 font-bold'
                  : 'border-transparent text-slate-100 hover:bg-[#0e4970] hover:text-white'
              }`}
            >
              <span>{lang === 'en' ? 'Department Desk (CPIO)' : 'विभागीय डेस्क (सीपीआईओ)'}</span>
              {pendingCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded">
                  {pendingCount}
                </span>
              )}
              {criticalCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded">
                  {criticalCount}
                </span>
              )}
            </button>

            {/* Tab 6: Digital Evidence & Audit */}
            <button
              type="button"
              onClick={() => setActiveTab('forensics')}
              className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border-b-4 ${
                activeTab === 'forensics'
                  ? 'border-[#FF9933] bg-[#082D46] text-amber-300 font-bold'
                  : 'border-transparent text-slate-100 hover:bg-[#0e4970] hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Evidence Verification Wing' : 'डिजिटल साक्ष्य सत्यापन'}
            </button>

            {/* Tab 7: SLA & Citizen Charter */}
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border-b-4 ${
                activeTab === 'analytics'
                  ? 'border-[#FF9933] bg-[#082D46] text-amber-300 font-bold'
                  : 'border-transparent text-slate-100 hover:bg-[#0e4970] hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Citizen Charter & SLA' : 'नागरिक अधिकार पत्र'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
