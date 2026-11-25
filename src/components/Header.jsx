// Official Government Portal Header with tricolor strip, font resize, Hindi/English toggle, and navigation.

import { AshokaEmblem } from "./AshokaEmblem";
export const Header = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  pendingCount,
  criticalCount,
  fontScale,
  setFontScale,
  onOpenHelp
}) => {
  const isOfficerTab = ["officer", "forensics", "grounding", "analytics"].includes(activeTab);
  return <header className="bg-white border-b border-slate-300 sticky top-0 z-40 shadow-xs font-sans">
      {/* 1. Indian National Flag Tricolor Ribbon */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-[#FFFFFF] border-y border-slate-200" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* 2. Top Government Gazette & Accessibility Utility Bar */}
      <div className="bg-[#1B2A4A] text-slate-200 text-xs py-1.5 px-4 sm:px-6 border-b border-[#0E1A34]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Official Authority Notice */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              {lang === "en" ? "GOVERNMENT OF INDIA" : "भारत सरकार"}
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">
              {lang === "en" ? "Ministry of Personnel, Public Grievances & Pensions (DARPG)" : "कार्मिक, लोक शिकायत और पेंशन मंत्रालय (प्रशासनिक सुधार)"}
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
              <span>{lang === "en" ? "Toll-Free Helpline:" : "टोल-फ्री हेल्पलाइन:"}</span>
              <a href="tel:1905" className="font-bold underline hover:text-white">1905</a>
            </div>

            <span className="text-slate-500 hidden sm:inline">|</span>

            {/* Quick Citizen Help Button */}
            {onOpenHelp && <button
    type="button"
    onClick={onOpenHelp}
    className="text-amber-300 hover:text-white underline font-semibold text-[11px] cursor-pointer"
    title="Citizen Help & Instructions"
  >
                {lang === "en" ? "Help & Guide" : "सहायता मार्गदर्शिका"}
              </button>}

            <span className="text-slate-500 hidden sm:inline">|</span>

            {/* Font Resize Accessibility (Standard Gov Practice A- / A / A+) */}
            <div className="flex items-center border border-slate-600 rounded bg-[#0f1d38] overflow-hidden" title="Accessibility Font Size Controls">
              <button
    type="button"
    onClick={() => setFontScale("normal")}
    className={`px-1.5 py-0.5 text-[11px] font-bold cursor-pointer transition-colors ${fontScale === "normal" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-300 hover:text-white"}`}
    title="Default Font Size (A)"
  >
                A
              </button>
              <button
    type="button"
    onClick={() => setFontScale("large")}
    className={`px-1.5 py-0.5 text-xs font-bold border-l border-slate-600 cursor-pointer transition-colors ${fontScale === "large" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-300 hover:text-white"}`}
    title="Large Font Size (A+)"
  >
                A+
              </button>
              <button
    type="button"
    onClick={() => setFontScale("larger")}
    className={`px-1.5 py-0.5 text-xs font-bold border-l border-slate-600 cursor-pointer transition-colors ${fontScale === "larger" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-300 hover:text-white"}`}
    title="Extra Large Font Size (A++)"
  >
                A++
              </button>
            </div>

            <span className="text-slate-500">|</span>

            {/* Language Switcher */}
            <button
    type="button"
    onClick={() => setLang(lang === "en" ? "hi" : "en")}
    className="bg-white/10 hover:bg-white/20 text-white font-semibold px-2 py-0.5 rounded text-[11px] border border-white/20 transition-colors cursor-pointer"
    title="Change Language / भाषा बदलें"
  >
              {lang === "en" ? "हिन्दी (Hindi)" : "English"}
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
                {lang === "en" ? "Government of India" : "भारत सरकार"}
              </div>
              <div className="text-slate-700 font-semibold text-xs leading-snug">
                {lang === "en" ? "Ministry of Personnel, Public Grievances & Pensions" : "कार्मिक, लोक शिकायत और पेंशन मंत्रालय"}
              </div>
              <div className="text-slate-500 text-[11px]">
                {lang === "en" ? "Department of Administrative Reforms and Public Grievances (DARPG)" : "प्रशासनिक सुधार और लोक शिकायत विभाग"}
              </div>
            </div>
          </div>

          {/* Portal Title & Fast-Track Helpline Badge */}
          <div className="flex flex-col md:items-end justify-center">
            <div className="flex items-center gap-2">
              <span className="bg-[#0B3C5D] text-white font-extrabold text-sm px-2 py-0.5 rounded tracking-wide">
                CPGRAMS
              </span>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {lang === "en" ? "JanSamadhan National Redressal Portal" : "जनसमाधान राष्ट्रीय शिकायत निवारण पोर्टल"}
              </h1>
            </div>
            <div className="text-[11px] text-slate-600 font-medium mt-0.5 flex flex-wrap items-center gap-2">
              <span>Central Public Grievance Redress & Monitoring System</span>
              <span className="text-slate-400">•</span>
              <span className="text-[#138808] font-semibold">Toll-Free 1905</span>
              <span className="text-slate-400">•</span>
              <span className="text-blue-700 font-semibold">NIC GIGW 3.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Streamlined Citizen-First Navigation Bar */}
      <div className="bg-[#0B3C5D] text-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 flex flex-col md:flex-row md:items-center justify-between">
          {/* Main Citizen Tabs */}
          <nav className="flex space-x-1 overflow-x-auto scrollbar-none py-0" aria-label="Citizen Services">
            {/* Tab 1: Lodge Grievance */}
            <button
    type="button"
    onClick={() => setActiveTab("submit")}
    className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border-b-4 flex items-center gap-1.5 ${activeTab === "submit" ? "border-[#FF9933] bg-[#082D46] text-amber-300" : "border-transparent text-slate-100 hover:bg-[#0e4970] hover:text-white"}`}
  >
              <span>{lang === "en" ? "Lodge Grievance" : "शिकायत दर्ज करें"}</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 px-1 py-0.2 rounded font-black">
                FREE
              </span>
            </button>

            {/* Tab 2: Track Status */}
            <button
    type="button"
    onClick={() => setActiveTab("track")}
    className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border-b-4 flex items-center gap-1.5 ${activeTab === "track" ? "border-[#FF9933] bg-[#082D46] text-amber-300" : "border-transparent text-slate-100 hover:bg-[#0e4970] hover:text-white"}`}
  >
              <span>{lang === "en" ? "Track Status & RTI" : "स्थिति जांचें / आरटीआई"}</span>
            </button>

            {/* Tab 3: Live Govt Redressal Stream */}
            <button
    type="button"
    onClick={() => setActiveTab("live")}
    className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border-b-4 flex items-center gap-1.5 ${activeTab === "live" ? "border-[#FF9933] bg-[#082D46] text-amber-300" : "border-transparent text-slate-100 hover:bg-[#0e4970] hover:text-white"}`}
  >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{lang === "en" ? "Live Govt Feed" : "लाइव सरकारी फ़ीड"}</span>
            </button>
          </nav>

          {/* Department & Officer Administrative Suite */}
          <div className="flex items-center overflow-x-auto scrollbar-none py-1.5 md:py-0 border-t md:border-t-0 border-[#1B4B6E]">
            <span className="text-[10px] uppercase font-bold text-slate-300 px-2 hidden lg:inline">
              Officer Section:
            </span>

            {/* Department Desk */}
            <button
    type="button"
    onClick={() => setActiveTab("officer")}
    className={`py-2 px-3 text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap rounded flex items-center gap-1.5 ${activeTab === "officer" ? "bg-amber-400 text-slate-950 font-bold" : "text-slate-200 hover:bg-white/10"}`}
    title="Central Public Information Officer Desk"
  >
              <span>{lang === "en" ? "CPIO Desk" : "सीपीआईओ डेस्क"}</span>
              {pendingCount > 0 && <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${activeTab === "officer" ? "bg-slate-950 text-white" : "bg-amber-400 text-slate-950"}`}>
                  {pendingCount}
                </span>}
              {criticalCount > 0 && <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded">
                  {criticalCount}
                </span>}
            </button>

            {/* Evidence Verification Wing */}
            <button
    type="button"
    onClick={() => setActiveTab("forensics")}
    className={`py-2 px-3 text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap rounded ${activeTab === "forensics" ? "bg-amber-400 text-slate-950 font-bold" : "text-slate-200 hover:bg-white/10"}`}
    title="Section 65B Digital Evidence Verification"
  >
              {lang === "en" ? "Evidence Lab" : "साक्ष्य सत्यापन"}
            </button>

            {/* Jurisdiction & Grounding */}
            <button
    type="button"
    onClick={() => setActiveTab("grounding")}
    className={`py-2 px-3 text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap rounded ${activeTab === "grounding" ? "bg-amber-400 text-slate-950 font-bold" : "text-slate-200 hover:bg-white/10"}`}
    title="Territorial Jurisdiction & Municipal Grounding"
  >
              {lang === "en" ? "Jurisdiction" : "अधिकार क्षेत्र"}
            </button>

            {/* Citizen Charter & SLA */}
            <button
    type="button"
    onClick={() => setActiveTab("analytics")}
    className={`py-2 px-3 text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap rounded ${activeTab === "analytics" ? "bg-amber-400 text-slate-950 font-bold" : "text-slate-200 hover:bg-white/10"}`}
    title="Citizen Charter & Statutory SLA Compliance"
  >
              {lang === "en" ? "SLA Charter" : "नागरिक चार्टर"}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Citizen Friendly Quick Helper Banner */}
      <div className="bg-[#FFFDF2] border-b border-[#E6D8A8] px-4 sm:px-6 py-2 text-xs text-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#8A5A00] flex items-center gap-1">
              <span>★</span> {lang === "en" ? "Easy Citizen Lodging:" : "सरल नागरिक पंजीकरण:"}
            </span>
            <span className="text-slate-700">
              {lang === "en" ? "Report any civic defect in 3 simple steps. Auto-routed to PWD, Jal Board, Discom & Municipal Corp." : "3 सरल चरणों में किसी भी नागरिक समस्या की रिपोर्ट करें। स्वचालित रूप से संबंधित विभाग को प्रेषित।"}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            <span className="text-slate-600">
              {lang === "en" ? "Life/Safety SLA: " : "जीवन/सुरक्षा गारंटी: "}
              <strong className="text-red-700">48 Hours (RTI Sec 7)</strong>
            </span>
            <span className="text-slate-400">•</span>
            <button
    type="button"
    onClick={() => setActiveTab("track")}
    className="text-[#0B3C5D] font-bold underline hover:text-[#082D46] cursor-pointer"
  >
              {lang === "en" ? "Track Existing Docket" : "पुरानी शिकायत जांचें"}
            </button>
          </div>
        </div>
      </div>
    </header>;
};
