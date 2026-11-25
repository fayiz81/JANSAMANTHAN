// Help & Citizen Charter Guide popup modal.

export const CitizenGuideModal = ({
  isOpen,
  onClose,
  lang
}) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
      <div className="bg-white max-w-2xl w-full border-t-4 border-t-[#0B3C5D] border-x border-b border-slate-300 shadow-xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#0B3C5D] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded">
              CITIZEN GUIDE
            </span>
            <h3 className="font-bold text-sm sm:text-base">
              {lang === "en" ? "How JanSamadhan Works (Citizen Charter & Guide)" : "जनसमाधान नागरिक मार्गदर्शिका"}
            </h3>
          </div>
          <button
    type="button"
    onClick={onClose}
    className="text-white hover:text-amber-300 text-lg font-bold px-2 cursor-pointer"
    aria-label="Close dialog"
  >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-800 leading-relaxed">
          {/* 3 Simple Steps */}
          <div>
            <h4 className="font-bold text-[#0B3C5D] uppercase tracking-wide text-xs border-b border-slate-200 pb-1 mb-3">
              {lang === "en" ? "Lodge Any Civic Grievance in 3 Simple Steps" : "3 सरल चरणों में शिकायत दर्ज करें"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-none">
                <div className="w-6 h-6 rounded-full bg-[#0B3C5D] text-white font-bold flex items-center justify-center text-xs mb-2">
                  1
                </div>
                <div className="font-bold text-slate-900 mb-1">
                  {lang === "en" ? "Describe & Photograph" : "विवरण एवं फ़ोटो"}
                </div>
                <p className="text-slate-600 text-[11px]">
                  {lang === "en" ? "Enter the problem title, details, and attach a clear photo of the civic defect." : "समस्या का शीर्षक, विवरण लिखें और स्थल की स्पष्ट तस्वीर संलग्न करें।"}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-none">
                <div className="w-6 h-6 rounded-full bg-[#0B3C5D] text-white font-bold flex items-center justify-center text-xs mb-2">
                  2
                </div>
                <div className="font-bold text-slate-900 mb-1">
                  {lang === "en" ? "Location & Ward" : "स्थान व वार्ड"}
                </div>
                <p className="text-slate-600 text-[11px]">
                  {lang === "en" ? 'Click "Use Live GPS" to automatically pin the exact road or enter street & landmark.' : '"लाइव जीपीएस" पर क्लिक कर सटीक स्थान चुनें अथवा सड़क व लैंडमार्क दर्ज करें।'}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-none">
                <div className="w-6 h-6 rounded-full bg-[#0B3C5D] text-white font-bold flex items-center justify-center text-xs mb-2">
                  3
                </div>
                <div className="font-bold text-slate-900 mb-1">
                  {lang === "en" ? "Track & Redress" : "ट्रैकिंग एवं निवारण"}
                </div>
                <p className="text-slate-600 text-[11px]">
                  {lang === "en" ? "Receive your official CPGRAMS Docket Number and track inspection & field crew live." : "आधिकारिक सीपीजीआरएएमएस डॉकेट नंबर प्राप्त करें और फ़ील्ड टीम की प्रगति लाइव देखें।"}
                </p>
              </div>
            </div>
          </div>

          {/* Department Auto-Routing Explanation */}
          <div className="bg-[#FFFDF2] border border-[#E6D8A8] p-3.5 space-y-1.5">
            <div className="font-bold text-[#8A5A00] flex items-center gap-1.5">
              <span>ℹ️</span>
              <span>{lang === "en" ? "Zero Confusion: Automated Department Allocation" : "स्वचालित विभाग आवंटन"}</span>
            </div>
            <p className="text-slate-700 text-[11px] sm:text-xs">
              {lang === "en" ? "Citizens do not need to figure out which municipal body or ministry owns the road or pipeline. Our central intake engine evaluates the photo, description, and municipal ward coordinates to automatically route the grievance to PWD, Delhi Jal Board, Municipal Corporation (MCD), or the Power DISCOM." : "नागरिकों को यह जानने की आवश्यकता नहीं है कि सड़क या पाइपलाइन किस विभाग की है। हमारा पोर्टल विवरण व स्थान के आधार पर स्वतः लोक निर्माण विभाग (PWD), दिल्ली जल बोर्ड, नगर निगम या बिजली वितरण कंपनी को शिकायत अग्रेषित कर देता है।"}
            </p>
          </div>

          {/* Statutory SLA Guarantees */}
          <div>
            <h4 className="font-bold text-[#0B3C5D] uppercase tracking-wide text-xs border-b border-slate-200 pb-1 mb-2">
              {lang === "en" ? "Statutory Time-Bound Resolution Standards (Citizen Charter)" : "समयबद्ध समाधान गारंटी (नागरिक चार्टर)"}
            </h4>
            <div className="border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2">Category of Civic Defect</th>
                    <th className="p-2">Responsible Authority</th>
                    <th className="p-2">Statutory Resolution Window</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  <tr>
                    <td className="p-2 font-medium text-red-700">Live Wire / Life Hazard / Gas Leak</td>
                    <td className="p-2">Power DISCOM / Emergency</td>
                    <td className="p-2 font-bold text-red-700">48 Hours (RTI Sec 7 Proviso)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Deep Pothole / Main Arterial Collapse</td>
                    <td className="p-2">PWD Civil Division</td>
                    <td className="p-2 font-bold text-slate-900">3 Days (Rapid Action Force)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Sewage Overflow / Contaminated Water</td>
                    <td className="p-2">Delhi Jal Board (DJB)</td>
                    <td className="p-2 font-bold text-slate-900">4 Days</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Garbage Dump / Drainage Clog</td>
                    <td className="p-2">Municipal Sanitation Wing</td>
                    <td className="p-2 font-bold text-slate-900">48-72 Hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Citizen Rights & First Appeal */}
          <div className="bg-slate-50 border border-slate-200 p-3">
            <div className="font-bold text-slate-900 mb-1">
              {lang === "en" ? "What if my grievance is not resolved within the SLA?" : "यदि निर्धारित समय में समाधान न हो तो क्या करें?"}
            </div>
            <p className="text-slate-600 text-[11px]">
              {lang === "en" ? "Under Section 19(1) of the Right to Information Act 2005, every citizen has the statutory right to file a First Appeal before the First Appellate Authority (FAA) named in your Docket slip. JanSamadhan automatically stamps the Appellate Authority details and legal notice onto every receipt." : "सूचना का अधिकार अधिनियम 2005 की धारा 19(1) के तहत नागरिक प्रथम अपीलीय प्राधिकारी (FAA) के समक्ष निःशुल्क प्रथम अपील दायर कर सकते हैं। प्रत्येक रसीद पर अपीलीय अधिकारी का नाम व संपर्क स्वतः मुद्रित होता है।"}
            </p>
          </div>

          {/* Toll Free Emergency Helpline Numbers */}
          <div>
            <h4 className="font-bold text-[#0B3C5D] uppercase tracking-wide text-xs mb-2">
              {lang === "en" ? "Direct Toll-Free Citizen Helplines" : "टोल-फ्री नागरिक हेल्पलाइन"}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-blue-50 border border-blue-200">
                <div className="text-[10px] text-blue-900 font-semibold">Central Grievance</div>
                <div className="font-bold text-blue-950 text-sm">1905</div>
              </div>
              <div className="p-2 bg-amber-50 border border-amber-200">
                <div className="text-[10px] text-amber-900 font-semibold">National Emergency</div>
                <div className="font-bold text-amber-950 text-sm">112</div>
              </div>
              <div className="p-2 bg-emerald-50 border border-emerald-200">
                <div className="text-[10px] text-emerald-900 font-semibold">Power Outage / Sparks</div>
                <div className="font-bold text-emerald-950 text-sm">1912</div>
              </div>
              <div className="p-2 bg-cyan-50 border border-cyan-200">
                <div className="text-[10px] text-cyan-900 font-semibold">Water Supply / DJB</div>
                <div className="font-bold text-cyan-950 text-sm">1916</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-3 border-t border-slate-200 flex justify-end">
          <button
    type="button"
    onClick={onClose}
    className="px-5 py-2 bg-[#0B3C5D] hover:bg-[#082D46] text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
  >
            {lang === "en" ? "Got It / Close Guide" : "समझ गया / बंद करें"}
          </button>
        </div>
      </div>
    </div>;
};
