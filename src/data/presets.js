// Pre-filled demo scenarios and sample evidence images for quick form testing.

export const DEFAULT_LOCATION = {
  lat: 28.6289,
  lng: 77.2065,
  address: "Outer Ring Road, Block C, Nehru Place",
  landmark: "Opposite Metro Pillar 142",
  wardOrSector: "Ward 48 - South Zone",
  district: "South Delhi",
  state: "Delhi (NCT)",
  pinCode: "110019",
};

export const DEMO_SCENARIOS = [
  {
    label: "Dangerous Road Cave-In",
    tag: "PWD (Life Safety)",
    title: "Deep 4-Foot Crater Near Metro Pillar 142 on Outer Ring Road",
    desc: "Active road collapse on main traffic artery right before evening peak hour. High risk of vehicle overturning.",
    img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    loc: {
      lat: 28.6289,
      lng: 77.2065,
      address: "Outer Ring Road, Opp Metro Pillar 142",
      landmark: "Nehru Place Flyover Base",
      wardOrSector: "Ward 48",
      district: "South Delhi",
      state: "Delhi",
      pinCode: "110019",
    },
  },
  {
    label: "Drinking Water Contamination",
    tag: "Delhi Jal Board",
    title: "Muddy Foul-Smelling Tap Water Seepage in Sector 9",
    desc: "Main potable water pipeline has ruptured and mixed with drainage line. Over 400 families receiving contaminated water.",
    img: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
    loc: {
      lat: 28.5823,
      lng: 77.0601,
      address: "Pocket B, Sector 9 Dwarka",
      landmark: "Near Community Center",
      wardOrSector: "Sector 9",
      district: "South West Delhi",
      state: "Delhi",
      pinCode: "110077",
    },
  },
  {
    label: "Live 11KV Sparking Wire",
    tag: "DISCOM (48h Mandate)",
    title: "High-Tension Power Cable Dangling 7ft Above School Gate",
    desc: "Torn insulation causing sparks whenever wind blows. Located directly above student pedestrian gate of Model School.",
    img: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    loc: {
      lat: 28.6508,
      lng: 77.1724,
      address: "Main Gate, Govt Senior Secondary School",
      landmark: "Shadipur Flyover",
      wardOrSector: "Ward 91",
      district: "West Delhi",
      state: "Delhi",
      pinCode: "110008",
    },
  },
  {
    label: "Evidence Tampering Audit",
    tag: "Vigilance Verification",
    title: "Claimed Toxic Green Chemical Explosion on Pedestrian Street",
    desc: "Suspicious submission claiming radioactive chemical smoke in commercial shopping plaza requiring emergency shutdown.",
    img: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
    loc: {
      lat: 28.6328,
      lng: 77.2197,
      address: "Inner Circle, Connaught Place, Block E",
      landmark: "Central Park Gate 2",
      wardOrSector: "Ward 12",
      district: "Central Delhi",
      state: "Delhi",
      pinCode: "110001",
    },
  },
  {
    label: "Regional Deduplication",
    tag: "Cluster Deduplication",
    title: "Crater and broken asphalt near pillar 142 Outer Ring Road",
    desc: "Huge pothole damaging vehicle rims near Nehru place pillar 142.",
    img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    loc: {
      lat: 28.629,
      lng: 77.2066,
      address: "Outer Ring Road, 30m from Pillar 142",
      landmark: "Nehru Place",
      wardOrSector: "Ward 48",
      district: "South Delhi",
      state: "Delhi",
      pinCode: "110019",
    },
  },
];

export const SAMPLE_EVIDENCE_PHOTOS = [
  {
    label: "Dangerous Pothole",
    url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Contaminated Water",
    url: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Sparking Electric Cable",
    url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Overflowing Garbage",
    url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
  },
];
