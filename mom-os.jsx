import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

/* ============================================================================
   MOM-OS — Mind-Oriented Machine Operating System
   Multi-language build: English, Hindi (हिन्दी), Tamil (தமிழ்), Malayalam (മലയാളം)
   ============================================================================ */

// ─── Icon System (feather-style stroke SVGs) ───────────────────────────────
const ICON_PATHS = {
  search: (<><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>),
  home: (<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>),
  brush: (<><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" /><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" /></>),
  lock: (<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>),
  cpu: (<><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></>),
  monitor: (<><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>),
  volume: (<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></>),
  wifi: (<><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></>),
  settings: (<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></>),
  code: (<><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>),
  terminal: (<><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></>),
  folder: (<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />),
  globe: (<><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>),
  shoppingBag: (<><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></>),
  power: (<><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" /></>),
  star: (<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />),
  pc: (<><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>),
  trash: (<><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>),
  file: (<><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></>),
  fileText: (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>),
  fileCode: (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><polyline points="10 13 8 15 10 17" /><polyline points="14 13 16 15 14 17" /></>),
  gitBranch: (<><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></>),
  box: (<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>),
  hexagon: (<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />),
  penTool: (<><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></>),
  user: (<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>),
  zap: (<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />),
  check: (<polyline points="20 6 9 17 4 12" />),
  loader: (<><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" /></>),
  flower: (<><circle cx="12" cy="12" r="2.2" /><circle cx="12" cy="6.5" r="2.2" /><circle cx="12" cy="17.5" r="2.2" /><circle cx="6.5" cy="12" r="2.2" /><circle cx="17.5" cy="12" r="2.2" /></>),
};

function Icon({ name, size = 16, color = "currentColor", strokeWidth = 1.8, style = {} }) {
  const content = ICON_PATHS[name];
  if (!content) return null;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}

// ─── i18n: translation dictionary ──────────────────────────────────────────
const LANGS = {
  en: { label: "English", native: "English" },
  hi: { label: "Hindi", native: "हिन्दी" },
  ta: { label: "Tamil", native: "தமிழ்" },
  ml: { label: "Malayalam", native: "മലയാളം" },
};

const STRINGS = {
  // Login screen
  signIn: { en: "Sign In", hi: "साइन इन करें", ta: "உள்நுழைக", ml: "സൈൻ ഇൻ ചെയ്യുക" },
  createAccount: { en: "Create Account", hi: "खाता बनाएं", ta: "கணக்கை உருவாக்கு", ml: "അക്കൗണ്ട് ഉണ്ടാക്കുക" },
  fullName: { en: "Full Name", hi: "पूरा नाम", ta: "முழு பெயர்", ml: "മുഴുവൻ പേര്" },
  emailAddress: { en: "Email address", hi: "ईमेल पता", ta: "மின்னஞ்சல் முகவரி", ml: "ഇമെയിൽ വിലാസം" },
  password: { en: "Password", hi: "पासवर्ड", ta: "கடவுச்சொல்", ml: "പാസ്‌വേഡ്" },
  signingIn: { en: "Signing in…", hi: "साइन इन हो रहा है…", ta: "உள்நுழைகிறது…", ml: "സൈൻ ഇൻ ചെയ്യുന്നു…" },
  signInBtn: { en: "Sign in", hi: "साइन इन करें", ta: "உள்நுழைக", ml: "സൈൻ ഇൻ ചെയ്യുക" },
  createAccountBtn: { en: "Create account", hi: "खाता बनाएं", ta: "கணக்கை உருவாக்கு", ml: "അക്കൗണ്ട് ഉണ്ടാക്കുക" },
  or: { en: "or", hi: "या", ta: "அல்லது", ml: "അല്ലെങ്കിൽ" },
  signInGoogle: { en: "Sign in with Google", hi: "Google से साइन इन करें", ta: "Google மூலம் உள்நுழைக", ml: "Google ഉപയോഗിച്ച് സൈൻ ഇൻ ചെയ്യുക" },
  connecting: { en: "Connecting…", hi: "कनेक्ट हो रहा है…", ta: "இணைக்கிறது…", ml: "കണക്റ്റ് ചെയ്യുന്നു…" },
  demoCreds: { en: "Demo:", hi: "डेमो:", ta: "டெமோ:", ml: "ഡെമോ:" },
  fillAllFields: { en: "Please fill all fields.", hi: "कृपया सभी फ़ील्ड भरें।", ta: "அனைத்து புலங்களையும் நிரப்பவும்.", ml: "എല്ലാ ഫീൽഡുകളും പൂരിപ്പിക്കുക." },
  invalidCreds: { en: "Invalid credentials.", hi: "गलत जानकारी।", ta: "தவறான தகவல்.", ml: "തെറ്റായ വിവരങ്ങൾ." },
  emailExists: { en: "Email already registered.", hi: "यह ईमेल पहले से पंजीकृत है।", ta: "இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது.", ml: "ഈ ഇമെയിൽ നേരത്തെ രജിസ്റ്റർ ചെയ്തിട്ടുണ്ട്." },

  // Boot screen
  bootWelcome: { en: "All systems nominal. Welcome, developer.", hi: "सभी सिस्टम सामान्य हैं। स्वागत है, डेवलपर।", ta: "அனைத்து அமைப்புகளும் இயல்பானவை. வரவேற்கிறோம், டெவலப்பர்.", ml: "എല്ലാ സിസ്റ്റങ്ങളും സാധാരണമാണ്. സ്വാഗതം, ഡെവലപ്പർ." },

  // Top panel / desktop
  activities: { en: "Activities", hi: "गतिविधियाँ", ta: "செயல்பாடுகள்", ml: "പ്രവർത്തനങ്ങൾ" },
  searchPlaceholder: { en: "Search Mom.os…", hi: "Mom.os में खोजें…", ta: "Mom.os இல் தேடு…", ml: "Mom.os തിരയുക…" },
  noResults: { en: "No results found", hi: "कोई परिणाम नहीं मिला", ta: "முடிவுகள் இல்லை", ml: "ഫലങ്ങളൊന്നും കണ്ടെത്തിയില്ല" },
  application: { en: "Application", hi: "एप्लिकेशन", ta: "பயன்பாடு", ml: "ആപ്ലിക്കേഷൻ" },
  thisPC: { en: "This PC", hi: "यह पीसी", ta: "இந்த PC", ml: "ഈ പിസി" },
  recycleBin: { en: "Recycle Bin", hi: "रीसायकल बिन", ta: "குப்பைத்தொட்டி", ml: "റീസൈക്കിൾ ബിൻ" },
  home: { en: "Home", hi: "होम", ta: "முகப்பு", ml: "ഹോം" },

  // Start menu / taskbar
  pinned: { en: "PINNED", hi: "पिन किया गया", ta: "பின் செய்யப்பட்டவை", ml: "പിൻ ചെയ്തവ" },
  signOut: { en: "Sign out", hi: "साइन आउट", ta: "வெளியேறு", ml: "സൈൻ ഔട്ട്" },

  // Settings app
  systemSettings: { en: "System Settings", hi: "सिस्टम सेटिंग्स", ta: "கணினி அமைப்புகள்", ml: "സിസ്റ്റം ക്രമീകരണങ്ങൾ" },
  darkMode: { en: "Dark Mode", hi: "डार्क मोड", ta: "இருண்ட பயன்முறை", ml: "ഡാർക്ക് മോഡ്" },
  darkModeSub: { en: "Reduces eye strain in low light", hi: "कम रोशनी में आँखों पर ज़ोर कम करता है", ta: "குறைந்த வெளிச்சத்தில் கண் அழுத்தத்தை குறைக்கிறது", ml: "കുറഞ്ഞ വെളിച്ചത്തിൽ കണ്ണിന്റെ ആയാസം കുറയ്ക്കുന്നു" },
  particleFx: { en: "Particle Effects", hi: "पार्टिकल इफ़ेक्ट्स", ta: "துகள் விளைவுகள்", ml: "പാർട്ടിക്കിൾ ഇഫക്റ്റുകൾ" },
  particleFxSub: { en: "Anti-gravity cursor particles", hi: "एंटी-ग्रैविटी कर्सर पार्टिकल्स", ta: "எதிர்-ஈர்ப்பு கர்சர் துகள்கள்", ml: "ആന്റി-ഗ്രാവിറ്റി കഴ്‌സർ കണങ്ങൾ" },
  ollamaDaemon: { en: "Ollama AI Daemon", hi: "Ollama AI डेमन", ta: "Ollama AI டீமான்", ml: "Ollama AI ഡെമൺ" },
  ollamaDaemonSub: { en: "Local LLM on port 11434", hi: "पोर्ट 11434 पर लोकल LLM", ta: "போர்ட் 11434 இல் லோக்கல் LLM", ml: "പോർട്ട് 11434-ൽ ലോക്കൽ LLM" },
  notifications: { en: "Notifications", hi: "सूचनाएं", ta: "அறிவிப்புகள்", ml: "അറിയിപ്പുകൾ" },
  notificationsSub: { en: "App alerts and updates", hi: "ऐप अलर्ट और अपडेट", ta: "செயலி எச்சரிக்கைகள் மற்றும் புதுப்பிப்புகள்", ml: "ആപ്പ് അലേർട്ടുകളും അപ്ഡേറ്റുകളും" },
  language: { en: "Language", hi: "भाषा", ta: "மொழி", ml: "ഭാഷ" },
  languageSub: { en: "Choose your interface language", hi: "अपनी इंटरफ़ेस भाषा चुनें", ta: "உங்கள் இடைமுக மொழியைத் தேர்ந்தெடுக்கவும்", ml: "നിങ്ങളുടെ ഇന്റർഫേസ് ഭാഷ തിരഞ്ഞെടുക്കുക" },

  // Sidebar nav (settings)
  navHome: { en: "Home", hi: "होम", ta: "முகப்பு", ml: "ഹോം" },
  navPersonalization: { en: "Personalization", hi: "व्यक्तिगतकरण", ta: "தனிப்பயனாக்கம்", ml: "വ്യക്തിഗതമാക്കൽ" },
  navPrivacy: { en: "Privacy", hi: "गोपनीयता", ta: "தனியுரிமை", ml: "സ്വകാര്യത" },
  navAI: { en: "AI & Assistants", hi: "AI और सहायक", ta: "AI மற்றும் உதவியாளர்கள்", ml: "AI, സഹായികൾ" },
  navDisplay: { en: "Display", hi: "डिस्प्ले", ta: "காட்சி", ml: "ഡിസ്‌പ്ലേ" },
  navSound: { en: "Sound", hi: "ध्वनि", ta: "ஒலி", ml: "ശബ്ദം" },
  navNetwork: { en: "Network", hi: "नेटवर्क", ta: "நெட்வொர்க்", ml: "നെറ്റ്‌വർക്ക്" },

  // File explorer
  fileExplorer: { en: "File Explorer", hi: "फ़ाइल एक्सप्लोरर", ta: "கோப்பு எக்ஸ்புளோரர்", ml: "ഫയൽ എക്സ്പ്ലോറർ" },
  quickAccess: { en: "Quick Access", hi: "त्वरित पहुँच", ta: "விரைவு அணுகல்", ml: "ക്വിക്ക് ആക്സസ്" },
  network: { en: "Network", hi: "नेटवर्क", ta: "நெட்வொர்க்", ml: "നെറ്റ്‌വർക്ക്" },
  items: { en: "items", hi: "आइटम", ta: "உருப்படிகள்", ml: "ഇനങ്ങൾ" },

  // Package manager
  packageManager: { en: "Package Manager", hi: "पैकेज मैनेजर", ta: "தொகுப்பு மேலாளர்", ml: "പാക്കേജ് മാനേജർ" },
  searchPackages: { en: "Search packages...", hi: "पैकेज खोजें...", ta: "தொகுப்புகளைத் தேடு...", ml: "പാക്കേജുകൾ തിരയുക..." },
  all: { en: "all", hi: "सभी", ta: "அனைத்தும்", ml: "എല്ലാം" },
  installed: { en: "installed", hi: "इंस्टॉल किया गया", ta: "நிறுவப்பட்டது", ml: "ഇൻസ്റ്റാൾ ചെയ്തത്" },
  updates: { en: "updates", hi: "अपडेट", ta: "புதுப்பிப்புகள்", ml: "അപ്ഡേറ്റുകൾ" },
  install: { en: "Install", hi: "इंस्टॉल करें", ta: "நிறுவு", ml: "ഇൻസ്റ്റാൾ ചെയ്യുക" },

  // Terminal
  terminalWelcome: { en: "Welcome, developer.", hi: "स्वागत है, डेवलपर।", ta: "வரவேற்கிறோம், டெவலப்பர்.", ml: "സ്വാഗതം, ഡെവലപ്പർ." },

  // App names (catalog + window titles)
  appVSCode: { en: "VS Code", hi: "VS Code", ta: "VS Code", ml: "VS Code" },
  appTerminal: { en: "Terminal", hi: "टर्मिनल", ta: "டெர்மினல்", ml: "ടെർമിനൽ" },
  appCursor: { en: "Cursor.sh", hi: "Cursor.sh", ta: "Cursor.sh", ml: "Cursor.sh" },
  appOllama: { en: "Ollama", hi: "Ollama", ta: "Ollama", ml: "Ollama" },
  appFiles: { en: "Files", hi: "फ़ाइलें", ta: "கோப்புகள்", ml: "ഫയലുകൾ" },
  appBrowser: { en: "Browser", hi: "ब्राउज़र", ta: "உலாவி", ml: "ബ്രൗസർ" },
  appSettings: { en: "Settings", hi: "सेटिंग्स", ta: "அமைப்புகள்", ml: "ക്രമീകരണങ്ങൾ" },
  appPackages: { en: "Packages", hi: "पैकेज", ta: "தொகுப்புகள்", ml: "പാക്കേജുകൾ" },

  osVersionLine: { en: "MOM-OS · Linux 6.8.0-mom-kernel · x86_64", hi: "MOM-OS · Linux 6.8.0-mom-kernel · x86_64", ta: "MOM-OS · Linux 6.8.0-mom-kernel · x86_64", ml: "MOM-OS · Linux 6.8.0-mom-kernel · x86_64" },
};

const LangContext = createContext({ lang: "en", setLang: () => {}, t: (k) => k });

function useT() {
  return useContext(LangContext);
}

function t(key, lang) {
  const entry = STRINGS[key];
  if (!entry) return key;
  return entry[lang] || entry.en;
}

// Font stacks per language — Devanagari/Tamil/Malayalam need matching web-safe fonts
const FONT_STACK = {
  en: "'Segoe UI','Ubuntu',sans-serif",
  hi: "'Noto Sans Devanagari','Segoe UI','Ubuntu',sans-serif",
  ta: "'Noto Sans Tamil','Segoe UI','Ubuntu',sans-serif",
  ml: "'Noto Sans Malayalam','Segoe UI','Ubuntu',sans-serif",
};

// ─── Language Switcher (small pill, reusable) ──────────────────────────────
function LanguageSwitcher({ compact = false }) {
  const { lang, setLang } = useT();
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {Object.keys(LANGS).map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          style={{
            padding: compact ? "3px 9px" : "6px 14px",
            borderRadius: 20,
            border: `1px solid ${lang === code ? "#0078d4" : "#555"}`,
            background: lang === code ? "rgba(0,120,212,0.18)" : "transparent",
            color: lang === code ? "#4fc3f7" : "#999",
            fontSize: compact ? 11 : 12,
            cursor: "pointer",
            fontFamily: FONT_STACK[code],
          }}
        >
          {LANGS[code].native}
        </button>
      ))}
    </div>
  );
}

// ─── Mom.os Logo SVG ──────────────────────────────────────────────────────
function MomLogo({ size = 80 }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="42" rx="24" ry="26" fill="#f5e6d8" />
      <ellipse cx="50" cy="23" rx="22" ry="12" fill="#c8c8c8" />
      <path d="M28 28 Q22 18 30 14 Q36 10 40 16" stroke="#8b1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M72 28 Q78 18 70 14 Q64 10 60 16" stroke="#8b1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M34 16 Q40 8 50 10 Q60 8 66 16" stroke="#8b1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="14" rx="10" ry="7" fill="#c8c8c8" />
      <path d="M44 12 Q50 8 56 12" stroke="#8b1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="26" cy="44" rx="4" ry="5" fill="#f0d8c8" />
      <ellipse cx="74" cy="44" rx="4" ry="5" fill="#f0d8c8" />
      <circle cx="26" cy="50" r="2.5" fill="#8b1a1a" />
      <circle cx="74" cy="50" r="2.5" fill="#8b1a1a" />
      <circle cx="41" cy="43" r="9" stroke="#1a1a1a" strokeWidth="2.2" fill="rgba(200,220,255,0.15)" />
      <circle cx="59" cy="43" r="9" stroke="#1a1a1a" strokeWidth="2.2" fill="rgba(200,220,255,0.15)" />
      <line x1="50" y1="42" x2="50" y2="44" stroke="#1a1a1a" strokeWidth="1.8" />
      <path d="M34 36 Q41 33 47 35" stroke="#7a6060" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M53 35 Q59 33 66 36" stroke="#7a6060" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M42 56 Q50 63 58 56" stroke="#8b1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M44 58 Q50 62 56 58" fill="#8b1a1a" opacity="0.6" />
      <path d="M48 49 Q50 54 52 49" stroke="#c09080" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M26 82 Q30 68 50 66 Q70 68 74 82 L80 100 L20 100 Z" fill="#8b1a1a" />
      <path d="M36 68 Q50 75 64 68" stroke="#d4a017" strokeWidth="1" fill="none" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const angle = -40 + i * 10;
        const rad = (angle * Math.PI) / 180;
        const cx = 50 + 18 * Math.sin(rad);
        const cy = 71 + 7 * (1 - Math.cos(rad));
        return <circle key={i} cx={cx} cy={cy} r="2.2" fill="#d4a017" />;
      })}
    </svg>
  );
}

// ─── Particle System ────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 70; i++) {
      particles.current.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        hue: 200 + Math.random() * 40,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach((p) => {
        const dx = p.x - mouse.current.x, dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) { const f = (120 - dist) / 120; p.vx += (dx / dist) * f * 0.4; p.vy += (dy / dist) * f * 0.4; }
        p.vx *= 0.97; p.vy *= 0.97; p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,80%,${p.alpha})`; ctx.fill();
      });
      raf.current = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

const BOOT_LINES_KEY = [
  "Mom.os v1.0.0 — Universal Open-Source OS",
  "Kernel: mom-kernel 6.8.0-LTS",
  "Arch: x86_64 | arm64 | riscv64",
  "Loading modules: [anti-gravity] [ollama] [dev-tools]",
];

// ─── Terminal ───────────────────────────────────────────────────────────────
const FS = { "~": ["Desktop", "Documents", "Downloads", "Projects", "mom.config"] };

function Terminal() {
  const { lang } = useT();
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("~");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const prompt = `user@mom-os:${cwd}$ `;

  useEffect(() => {
    setLines([
      ...BOOT_LINES_KEY.map((l) => ({ type: "sys", text: l })),
      { type: "sys", text: t("terminalWelcome", lang) },
    ]);
  }, [lang]);

  const push = (text, type = "out") => setLines((l) => [...l, { type, text }]);

  const run = useCallback((cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    push(prompt + trimmed, "cmd");
    const [base, ...args] = trimmed.split(/\s+/);
    switch (base) {
      case "help": push("ls cd pwd clear echo neofetch uname whoami date lang"); break;
      case "ls": (FS[cwd] || []).forEach((f) => push(f, "file")); break;
      case "pwd": push(cwd.replace("~", "/home/user")); break;
      case "clear": setLines([]); break;
      case "echo": push(args.join(" ")); break;
      case "uname": push(`Mom.os 6.8.0-mom-kernel #1 SMP ${new Date().toDateString()} x86_64 GNU/Linux`); break;
      case "whoami": push("developer"); break;
      case "date": push(new Date().toString()); break;
      case "lang": push(`Current language: ${LANGS[lang].native} (${lang})`); break;
      case "neofetch":
        ["Mom.os 1.0", `Kernel: 6.8.0-mom`, `Lang: ${LANGS[lang].native}`].forEach((l) => push(l, "neo"));
        break;
      default: push(`bash: ${base}: command not found`, "err");
    }
  }, [cwd, prompt, lang]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);
  const colors = { sys: "#5af", cmd: "#8f8", out: "#ccc", err: "#f55", file: "#aaa", neo: "#f9a" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "'Cascadia Code','Consolas',monospace", background: "#0c0c0c" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px", cursor: "text" }} onClick={() => inputRef.current?.focus()}>
        {lines.map((l, i) => <div key={i} style={{ color: colors[l.type] || "#ccc", fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{l.text}</div>)}
        <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
          <span style={{ color: "#8f8", fontSize: 12, whiteSpace: "nowrap" }}>{prompt}</span>
          <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { run(input); setInput(""); } }}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#ccc", fontSize: 12, fontFamily: "inherit" }}
            autoFocus spellCheck={false} />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ─── Window Chrome ──────────────────────────────────────────────────────────
function AppWindow({ title, icon, children, onClose, onMin, zIndex, onFocus, x, y, w, h }) {
  const [pos, setPos] = useState({ x, y });
  const [maximized, setMaximized] = useState(false);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    if (maximized) return;
    onFocus();
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    const onMove = (ev) => { if (dragging.current) setPos({ x: ev.clientX - offset.current.x, y: ev.clientY - offset.current.y }); };
    const onUp = () => { dragging.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const style = maximized
    ? { position: "fixed", left: 0, top: 30, right: 0, bottom: 40, width: "100vw", height: "calc(100vh - 70px)", zIndex, display: "flex", flexDirection: "column" }
    : { position: "fixed", left: pos.x, top: pos.y, width: w, height: h, zIndex, display: "flex", flexDirection: "column", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" };

  return (
    <div onMouseDown={onFocus} style={{ ...style, overflow: "hidden", border: "1px solid #3a3a3a" }}>
      <div onMouseDown={onMouseDown} style={{ height: 32, background: "#1f1f1f", display: "flex", alignItems: "center", paddingLeft: 10, gap: 8, userSelect: "none", cursor: maximized ? "default" : "move", borderBottom: "1px solid #333", flexShrink: 0 }}>
        <Icon name={icon} size={14} color="#d0d0d0" />
        <span style={{ flex: 1, fontSize: 12, color: "#d0d0d0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
        <button onClick={onMin} style={{ width: 46, height: 32, background: "transparent", border: "none", color: "#c0c0c0", cursor: "pointer", fontSize: 18 }}>─</button>
        <button onClick={() => setMaximized((m) => !m)} style={{ width: 46, height: 32, background: "transparent", border: "none", color: "#c0c0c0", cursor: "pointer", fontSize: 13 }}>{maximized ? "⧉" : "□"}</button>
        <button onClick={onClose} style={{ width: 46, height: 32, background: "transparent", border: "none", color: "#c0c0c0", cursor: "pointer", fontSize: 18 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#c42b1c"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c0c0c0"; }}>✕</button>
      </div>
      <div style={{ flex: 1, overflow: "hidden", background: "#181818" }}>{children}</div>
    </div>
  );
}

// ─── Settings App (with language picker) ───────────────────────────────────
function SettingsApp() {
  const { lang } = useT();
  const [dark, setDark] = useState(true);
  const [grav, setGrav] = useState(true);
  const [notifs, setNotifs] = useState(true);
  const [ai, setAi] = useState(true);
  const [navTab, setNavTab] = useState("home");

  const Toggle = ({ val, set }) => (
    <div onClick={() => set(!val)} style={{ width: 38, height: 20, borderRadius: 10, background: val ? "#0078d4" : "#3a3a3a", cursor: "pointer", position: "relative" }}>
      <div style={{ position: "absolute", top: 2, left: val ? 20 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
    </div>
  );

  const navItems = [
    ["home", "navHome", "home"],
    ["brush", "navPersonalization", "personalization"],
    ["lock", "navPrivacy", "privacy"],
    ["cpu", "navAI", "ai"],
    ["monitor", "navDisplay", "display"],
    ["volume", "navSound", "sound"],
    ["wifi", "navNetwork", "network"],
  ];

  return (
    <div style={{ height: "100%", background: "#202020", fontFamily: FONT_STACK[lang], display: "flex" }}>
      <div style={{ width: 210, background: "#1a1a1a", borderRight: "1px solid #333", padding: "12px 0" }}>
        {navItems.map(([ic, key, id]) => (
          <div key={id} onClick={() => setNavTab(id)} style={{ padding: "8px 16px", fontSize: 12, color: navTab === id ? "#0078d4" : "#888", cursor: "pointer", display: "flex", gap: 10, alignItems: "center", background: navTab === id ? "rgba(0,120,212,0.1)" : "transparent" }}>
            <Icon name={ic} size={14} />{t(key, lang)}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        <div style={{ fontSize: 20, color: "#e2e8f0", fontWeight: 300, marginBottom: 20 }}>{t("systemSettings", lang)}</div>

        {/* Language row — first and prominent */}
        <div style={{ padding: "14px 16px", background: "#252525", borderRadius: 6, marginBottom: 8, border: "1px solid #333" }}>
          <div style={{ fontSize: 13, color: "#e2e8f0", marginBottom: 2 }}>{t("language", lang)}</div>
          <div style={{ fontSize: 11, color: "#666", marginBottom: 10 }}>{t("languageSub", lang)}</div>
          <LanguageSwitcher />
        </div>

        {[[dark, setDark, "darkMode", "darkModeSub"], [grav, setGrav, "particleFx", "particleFxSub"], [ai, setAi, "ollamaDaemon", "ollamaDaemonSub"], [notifs, setNotifs, "notifications", "notificationsSub"]].map(([val, set, labelKey, subKey]) => (
          <div key={labelKey} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "#252525", borderRadius: 6, marginBottom: 8, border: "1px solid #333" }}>
            <div><div style={{ fontSize: 13, color: "#e2e8f0" }}>{t(labelKey, lang)}</div><div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{t(subKey, lang)}</div></div>
            <Toggle val={val} set={set} />
          </div>
        ))}
        <div style={{ fontSize: 12, color: "#555", marginTop: 16 }}>{t("osVersionLine", lang)}</div>
      </div>
    </div>
  );
}

// ─── Files App ──────────────────────────────────────────────────────────────
function FilesApp() {
  const { lang } = useT();
  const dirs = ["Desktop", "Documents", "Downloads", "Projects", "Music", "Pictures"];
  const files = ["main.py", "README.md", "mom.config"];
  return (
    <div style={{ height: "100%", background: "#202020", color: "#e2e8f0", fontFamily: FONT_STACK[lang], display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#2d2d2d", borderBottom: "1px solid #3a3a3a", padding: "6px 12px", display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ flex: 1, background: "#3a3a3a", border: "1px solid #555", borderRadius: 3, padding: "3px 10px", fontSize: 12, color: "#aaa", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="folder" size={12} color="#ca8a04" />
          <span>/home/user</span>
        </div>
      </div>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ width: 150, background: "#252525", borderRight: "1px solid #333", padding: "8px 0", fontSize: 12, color: "#888" }}>
          <div style={{ padding: "5px 12px", display: "flex", gap: 8, alignItems: "center" }}><Icon name="star" size={13} /><span>{t("quickAccess", lang)}</span></div>
          <div style={{ padding: "5px 12px", display: "flex", gap: 8, alignItems: "center" }}><Icon name="pc" size={13} /><span>{t("thisPC", lang)}</span></div>
          <div style={{ padding: "5px 12px", display: "flex", gap: 8, alignItems: "center" }}><Icon name="globe" size={13} /><span>{t("network", lang)}</span></div>
          <div style={{ padding: "5px 12px", display: "flex", gap: 8, alignItems: "center" }}><Icon name="trash" size={13} /><span>{t("recycleBin", lang)}</span></div>
        </div>
        <div style={{ flex: 1, padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(88px,1fr))", gap: 8, overflowY: "auto", alignContent: "start" }}>
          {dirs.map((d) => (
            <div key={d} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", padding: 8, borderRadius: 4 }}>
              <Icon name="folder" size={34} color="#f5b350" strokeWidth={1.4} />
              <span style={{ fontSize: 10, color: "#ccc", textAlign: "center" }}>{d}</span>
            </div>
          ))}
          {files.map((f) => (
            <div key={f} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", padding: 8, borderRadius: 4 }}>
              {f.endsWith(".py")
                ? <Icon name="fileCode" size={34} color="#4fc3f7" strokeWidth={1.4} />
                : f.endsWith(".md")
                  ? <Icon name="fileText" size={34} color="#94a3b8" strokeWidth={1.4} />
                  : <Icon name="file" size={34} color="#94a3b8" strokeWidth={1.4} />}
              <span style={{ fontSize: 10, color: "#999", textAlign: "center" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "#2d2d2d", borderTop: "1px solid #333", padding: "3px 12px", fontSize: 11, color: "#666" }}>
        {dirs.length + files.length} {t("items", lang)}
      </div>
    </div>
  );
}

// ─── Package Manager ────────────────────────────────────────────────────────
function AppStoreApp() {
  const { lang } = useT();
  const apps = [
    { name: "Git", icon: "gitBranch", desc: "Version control", size: "4.2 MB" },
    { name: "Docker", icon: "box", desc: "Containers", size: "312 MB" },
    { name: "Node.js", icon: "hexagon", desc: "JS runtime", size: "28 MB" },
    { name: "Neovim", icon: "penTool", desc: "Modal editor", size: "6.8 MB" },
  ];
  const [installed, setInstalled] = useState(new Set(["Git"]));
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const filtered = apps.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ height: "100%", background: "#1a1a1a", fontFamily: FONT_STACK[lang], display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "10px 14px", background: "#252525", borderBottom: "1px solid #333", display: "flex", gap: 10, alignItems: "center" }}>
        <Icon name="shoppingBag" size={14} color="#e2e8f0" />
        <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{t("packageManager", lang)}</span>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchPackages", lang)} style={{ marginLeft: "auto", background: "#333", border: "1px solid #555", borderRadius: 4, padding: "5px 10px", color: "#e2e8f0", fontSize: 12, outline: "none", width: 160 }} />
      </div>
      <div style={{ display: "flex", background: "#202020", borderBottom: "1px solid #333" }}>
        {["all", "installed", "updates"].map((tab_) => (
          <div key={tab_} onClick={() => setTab(tab_)} style={{ padding: "8px 16px", fontSize: 12, cursor: "pointer", color: tab === tab_ ? "#007acc" : "#888", borderBottom: `2px solid ${tab === tab_ ? "#007acc" : "transparent"}` }}>{t(tab_, lang)}</div>
        ))}
      </div>
      <div style={{ overflowY: "auto", padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {filtered.filter((a) => (tab === "installed" ? installed.has(a.name) : tab === "updates" ? false : true)).map((app) => (
          <div key={app.name} style={{ background: "#252525", border: "1px solid #333", borderRadius: 6, padding: 10, display: "flex", gap: 10, alignItems: "center" }}>
            <Icon name={app.icon} size={28} color="#a0a0a0" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{app.name}</div>
              <div style={{ fontSize: 10, color: "#666" }}>{app.desc} · {app.size}</div>
            </div>
            {!installed.has(app.name) ? (
              <button onClick={() => setInstalled((s) => new Set([...s, app.name]))} style={{ background: "#007acc", border: "none", borderRadius: 4, padding: "4px 10px", color: "#fff", cursor: "pointer", fontSize: 11 }}>{t("install", lang)}</button>
            ) : (
              <Icon name="check" size={16} color="#4ade80" strokeWidth={2.5} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Simple placeholder apps (kept in English — code/technical content) ───
function VSCodeApp() {
  return (
    <div style={{ height: "100%", background: "#1e1e1e", color: "#d4d4d4", fontFamily: "'Cascadia Code',monospace", fontSize: 13, padding: 16, whiteSpace: "pre-wrap" }}>
{`# Welcome to Mom.os!
def greet(name):
    return f"Hello from Mom.os, {name}!"

print(greet("Developer"))`}
    </div>
  );
}
function BrowserApp() {
  const { lang } = useT();
  return (
    <div style={{ height: "100%", background: "#202020", display: "flex", flexDirection: "column", fontFamily: FONT_STACK[lang] }}>
      <div style={{ padding: "8px 12px", background: "#2d2d2d", borderBottom: "1px solid #3a3a3a", fontSize: 12, color: "#4ade80", display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="lock" size={12} color="#4ade80" />
        <span>mom-os://home</span>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: 13 }}>
        {LANGS[lang].native} · Mom Browser
      </div>
    </div>
  );
}

const APP_COMPONENTS = {
  vscode: { comp: VSCodeApp, titleKey: "appVSCode", w: 700, h: 460 },
  terminal: { comp: Terminal, titleKey: "appTerminal", w: 640, h: 420 },
  files: { comp: FilesApp, titleKey: "appFiles", w: 620, h: 440 },
  browser: { comp: BrowserApp, titleKey: "appBrowser", w: 680, h: 460 },
  settings: { comp: SettingsApp, titleKey: "appSettings", w: 640, h: 500 },
  appstore: { comp: AppStoreApp, titleKey: "appPackages", w: 600, h: 460 },
};

// icon field now references ICON_PATHS keys instead of emojis
const AppCatalog = [
  { id: "vscode", icon: "code", color: "#0078d4", titleKey: "appVSCode" },
  { id: "terminal", icon: "terminal", color: "#0c0c0c", titleKey: "appTerminal" },
  { id: "files", icon: "folder", color: "#ca8a04", titleKey: "appFiles" },
  { id: "browser", icon: "globe", color: "#1d4ed8", titleKey: "appBrowser" },
  { id: "settings", icon: "settings", color: "#374151", titleKey: "appSettings" },
  { id: "appstore", icon: "shoppingBag", color: "#7e22ce", titleKey: "appPackages" },
];

// ─── Clock ──────────────────────────────────────────────────────────────────
function Clock() {
  const [t_, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return <span style={{ fontSize: 12, color: "#ccc", lineHeight: 1.2, textAlign: "right" }}>{t_.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}</span>;
}

// ─── Login Screen ───────────────────────────────────────────────────────────
const DEMO_USERS = [
  { email: "mom@mom.os", password: "matri123", name: "Mom" },
  { email: "user@mom.os", password: "shakti123", name: "Developer" },
];

function LoginScreen({ onLogin }) {
  const { lang } = useT();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState("");
  const [mode, setMode] = useState("login"); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(DEMO_USERS);

  const handleLogin = () => {
    setError(""); if (!email || !password) { setError(t("fillAllFields", lang)); return; }
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) { setError(t("invalidCreds", lang)); return; }
    setLoading(true); setTimeout(() => onLogin({ name: found.name, email: found.email }), 900);
  };
  const handleSignup = () => {
    setError(""); if (!name || !email || !password) { setError(t("fillAllFields", lang)); return; }
    if (users.find((u) => u.email === email)) { setError(t("emailExists", lang)); return; }
    setUsers((u) => [...u, { email, password, name }]);
    setLoading(true); setTimeout(() => onLogin({ name, email }), 900);
  };

  const inp = { width: "100%", padding: "9px 12px", borderRadius: 4, border: "1px solid #555", background: "#2a2a2a", fontSize: 13, color: "#e2e8f0", outline: "none", fontFamily: FONT_STACK[lang], boxSizing: "border-box" };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "linear-gradient(135deg,#0a1628 0%,#0d2240 40%,#071828 70%,#0a0a1a 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_STACK[lang], position: "relative", overflow: "hidden" }}>
      <ParticleCanvas />
      <div style={{ position: "absolute", opacity: 0.05, pointerEvents: "none" }}><MomLogo size={400} /></div>

      <div style={{ width: 400, background: "rgba(28,28,28,0.97)", borderRadius: 8, boxShadow: "0 24px 80px rgba(0,0,0,0.8)", padding: "36px 32px 28px", position: "relative", zIndex: 1, border: "1px solid #3a3a3a" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
          <MomLogo size={64} />
          <div style={{ fontSize: 22, fontWeight: 300, marginTop: 10, letterSpacing: 1, fontFamily: FONT_STACK.en }}>
            <span style={{ color: "#fff" }}>mom</span><span style={{ color: "#0078d4" }}>.OS</span>
          </div>
        </div>

        {/* Language picker on login screen */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <LanguageSwitcher compact />
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid #333", marginBottom: 20, gap: 4 }}>
          {["login", "signup"].map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, padding: "8px 0", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: m === mode ? 600 : 400, color: m === mode ? "#0078d4" : "#666", borderBottom: `2px solid ${m === mode ? "#0078d4" : "transparent"}`, fontFamily: "inherit" }}>
              {m === "login" ? t("signIn", lang) : t("createAccount", lang)}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mode === "signup" && <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("fullName", lang)} style={inp} />}
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("emailAddress", lang)} type="email" style={inp} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("password", lang)} type="password"
            onKeyDown={(e) => e.key === "Enter" && (mode === "login" ? handleLogin() : handleSignup())} style={inp} />
          {error && <div style={{ fontSize: 12, color: "#f87171", background: "rgba(248,113,113,0.1)", padding: "7px 10px", borderRadius: 4 }}>{error}</div>}
          <button onClick={mode === "login" ? handleLogin : handleSignup} disabled={loading}
            style={{ width: "100%", padding: "10px 0", borderRadius: 4, border: "none", cursor: loading ? "not-allowed" : "pointer", background: loading ? "#1a3a5a" : "#0078d4", color: "#fff", fontSize: 14, fontWeight: 600, marginTop: 4, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading && <Icon name="loader" size={14} color="#fff" />}
            {loading ? t("signingIn", lang) : (mode === "login" ? t("signInBtn", lang) : t("createAccountBtn", lang))}
          </button>
        </div>
        <div style={{ marginTop: 16, padding: "8px 12px", background: "rgba(0,120,212,0.08)", borderRadius: 4, fontSize: 11, color: "#555", textAlign: "center", lineHeight: 1.6, border: "1px solid rgba(0,120,212,0.15)" }}>
          <strong style={{ color: "#666" }}>{t("demoCreds", lang)}</strong> mom@mom.os / matri123 &nbsp;·&nbsp; user@mom.os / shakti123
        </div>
      </div>
    </div>
  );
}

// ─── Main OS ────────────────────────────────────────────────────────────────
function MomOSInner() {
  const { lang } = useT();
  const [windows, setWindows] = useState([]);
  const [minimized, setMinimized] = useState(new Set());
  const [topZ, setTopZ] = useState(10);
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [bootIdx, setBootIdx] = useState(0);
  const [spotlight, setSpotlight] = useState(false);
  const [spotQuery, setSpotQuery] = useState("");
  const [startMenu, setStartMenu] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);
  const handleLogin = (u) => { setUser(u); setBooting(true); setBootIdx(0); };

  useEffect(() => {
    if (!user) return;
    if (bootIdx < BOOT_LINES_KEY.length + 1) { const tt = setTimeout(() => setBootIdx((i) => i + 1), 350); return () => clearTimeout(tt); }
    else { const tt = setTimeout(() => setBooting(false), 500); return () => clearTimeout(tt); }
  }, [bootIdx, user]);

  const openApp = (id) => {
    if (windows.find((w) => w.id === id)) { setMinimized((m) => { const n = new Set(m); n.delete(id); return n; }); focusApp(id); return; }
    const z = topZ + 1; setTopZ(z);
    setWindows((ws) => [...ws, { id, z, x: 100 + Math.random() * 160, y: 55 + Math.random() * 60 }]);
    setStartMenu(false);
  };
  const closeApp = (id) => setWindows((ws) => ws.filter((w) => w.id !== id));
  const minApp = (id) => setMinimized((m) => { const n = new Set(m); n.add(id); return n; });
  const focusApp = (id) => { const z = topZ + 1; setTopZ(z); setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, z } : w))); };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  if (booting) {
    const displayLines = [...BOOT_LINES_KEY, t("bootWelcome", lang)];
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Cascadia Code',monospace" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, padding: 30 }}>
          {displayLines.slice(0, bootIdx).map((l, i) => (
            <div key={i} style={{ color: i === bootIdx - 1 ? "#4ade80" : "#2a6a2a", fontSize: 13, lineHeight: 1.9, fontFamily: i === displayLines.length - 1 ? FONT_STACK[lang] : "'Cascadia Code',monospace", display: "flex", alignItems: "center", gap: 6 }}>
              <span>[{i < bootIdx - 1 ? "  OK  " : "  **  "}]</span>
              <span>{l}</span>
              {i === displayLines.length - 1 && <Icon name="flower" size={14} color="#4ade80" />}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "absolute", bottom: 80 }}>
          <MomLogo size={56} />
          <div style={{ fontSize: 18, fontWeight: 300, marginTop: 8, color: "#4ade80", letterSpacing: 4 }}>mom<span style={{ color: "#0078d4" }}>.OS</span></div>
        </div>
      </div>
    );
  }

  const spotFiltered = AppCatalog.filter((a) => t(a.titleKey, lang).toLowerCase().includes(spotQuery.toLowerCase()));

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", userSelect: "none", fontFamily: FONT_STACK[lang] }} onClick={() => setStartMenu(false)}>
      <div style={{ position: "fixed", inset: 0, background: "linear-gradient(135deg,#071428 0%,#0d2144 25%,#091e3a 50%,#050e20 75%,#080818 100%)", zIndex: -2 }} />
      <ParticleCanvas />

      {/* Top panel */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 30, background: "rgba(18,18,18,0.92)", zIndex: 999, display: "flex", alignItems: "center", padding: "0 10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={() => setSpotlight((s) => !s)} style={{ background: "none", border: "none", color: "#aaa", fontSize: 12, cursor: "pointer", padding: "0 10px", fontFamily: "inherit" }}>{t("activities", lang)}</button>
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", fontSize: 12, color: "#ccc" }}>
          {time.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "2px 8px", borderRadius: 20, background: "rgba(255,255,255,0.06)" }}>
            <Icon name="user" size={13} color="#ccc" />
            <span style={{ fontSize: 11, color: "#ccc" }}>{user?.name}</span>
            <button onClick={() => { setUser(null); setWindows([]); }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", marginLeft: 4 }}>
              <Icon name="power" size={12} color="#888" />
            </button>
          </div>
        </div>
      </div>

      {/* Spotlight */}
      {spotlight && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => { setSpotlight(false); setSpotQuery(""); }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 560, background: "rgba(28,28,28,0.98)", borderRadius: 8, border: "1px solid #3a3a3a", overflow: "hidden", marginTop: "-15vh" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 10, borderBottom: "1px solid #333" }}>
              <Icon name="search" size={16} color="#0078d4" />
              <input autoFocus value={spotQuery} onChange={(e) => setSpotQuery(e.target.value)} placeholder={t("searchPlaceholder", lang)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e2e8f0", fontSize: 16, fontFamily: FONT_STACK[lang] }} />
            </div>
            {spotFiltered.map((app) => (
              <div key={app.id} onClick={() => { openApp(app.id); setSpotlight(false); setSpotQuery(""); }} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 16px", cursor: "pointer" }}>
                <div style={{ width: 34, height: 34, borderRadius: 6, background: app.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={app.icon} size={16} color="#fff" />
                </div>
                <div><div style={{ fontSize: 13, color: "#e2e8f0" }}>{t(app.titleKey, lang)}</div><div style={{ fontSize: 11, color: "#555" }}>{t("application", lang)}</div></div>
              </div>
            ))}
            {spotFiltered.length === 0 && <div style={{ padding: 20, color: "#555", textAlign: "center", fontSize: 13 }}>{t("noResults", lang)}</div>}
          </div>
        </div>
      )}

      {/* Windows */}
      {windows.map((w) => {
        const meta = APP_COMPONENTS[w.id];
        const Comp = meta.comp;
        if (minimized.has(w.id)) return null;
        const appDef = AppCatalog.find((a) => a.id === w.id);
        return (
          <AppWindow key={w.id} title={t(meta.titleKey, lang)} icon={appDef?.icon} onClose={() => closeApp(w.id)} onMin={() => minApp(w.id)} zIndex={w.z} onFocus={() => focusApp(w.id)} x={w.x} y={w.y + 30} w={meta.w} h={meta.h}>
            <Comp />
          </AppWindow>
        );
      })}

      {/* Taskbar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 44, background: "rgba(22,22,22,0.88)", zIndex: 998, display: "flex", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={(e) => { e.stopPropagation(); setStartMenu((s) => !s); }} style={{ width: 44, height: 44, background: startMenu ? "rgba(255,255,255,0.12)" : "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="0" y="0" width="8" height="8" rx="1" fill="#4fc3f7" /><rect x="10" y="0" width="8" height="8" rx="1" fill="#4fc3f7" />
            <rect x="0" y="10" width="8" height="8" rx="1" fill="#4fc3f7" /><rect x="10" y="10" width="8" height="8" rx="1" fill="#4fc3f7" />
          </svg>
        </button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          {AppCatalog.map((app) => {
            const isOpen = windows.find((w) => w.id === app.id);
            const isMin = minimized.has(app.id);
            return (
              <div key={app.id} onClick={() => { if (isOpen && !isMin) minApp(app.id); else openApp(app.id); }}
                style={{ width: 44, height: 44, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 6, cursor: "pointer", position: "relative", background: isOpen && !isMin ? "rgba(255,255,255,0.1)" : "transparent" }}>
                <div style={{ width: 26, height: 26, borderRadius: 5, background: app.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={app.icon} size={14} color="#fff" />
                </div>
                <div style={{ position: "absolute", bottom: 3, width: isOpen ? 16 : 4, height: 3, borderRadius: 2, background: isOpen ? "#0078d4" : "transparent" }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", paddingRight: 8, gap: 4 }}>
          <div style={{ padding: "0 10px" }}><Clock /></div>
        </div>
      </div>

      {/* Start Menu */}
      {startMenu && (
        <div onClick={(e) => e.stopPropagation()} style={{ position: "fixed", bottom: 50, left: 8, width: 420, background: "rgba(28,28,28,0.97)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", zIndex: 997, padding: 20 }}>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>{t("pinned", lang)}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, marginBottom: 20 }}>
            {AppCatalog.map((app) => (
              <div key={app.id} onClick={() => openApp(app.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "10px 4px", borderRadius: 6, cursor: "pointer" }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: app.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={app.icon} size={20} color="#fff" />
                </div>
                <span style={{ fontSize: 11, color: "#ccc", textAlign: "center" }}>{t(app.titleKey, lang)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #333", paddingTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="user" size={22} color="#ccc" />
            <div><div style={{ fontSize: 13, color: "#e2e8f0" }}>{user?.name}</div><div style={{ fontSize: 11, color: "#555" }}>{user?.email}</div></div>
            <button onClick={() => { setUser(null); setWindows([]); setStartMenu(false); }}
              style={{ marginLeft: "auto", background: "rgba(255,255,255,0.06)", border: "1px solid #333", borderRadius: 6, padding: "6px 14px", color: "#ccc", cursor: "pointer", fontSize: 12, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="power" size={12} color="#ccc" />
              {t("signOut", lang)}
            </button>
          </div>
        </div>
      )}

      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:2px;}`}</style>
    </div>
  );
}

// ─── Root export with language provider ────────────────────────────────────
export default function MomOS() {
  const [lang, setLang] = useState("en");
  return (
    <LangContext.Provider value={{ lang, setLang, t: (k) => t(k, lang) }}>
      <MomOSInner />
    </LangContext.Provider>
  );
}
