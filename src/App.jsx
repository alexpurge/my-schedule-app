import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DashboardPanel from './components/DashboardPanel';
import GlobalStyles from './components/GlobalStyles';
import ProgressBar from './components/ProgressBar';
import SettingsPanel from './components/SettingsPanel';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';

const DEFAULT_DATE_VIOLATION_STREAK_LIMIT = 5;

/**
 * ============================================================
 *  HARD-CODED MASTER FILTER KEYWORDS (ONE PER LINE)
 * ============================================================
 */
const MASTER_FILTER_KEYWORDS_RAW = `Air Conditioner
Electrician
Plumber
Locksmith
Pest Control
Cleaner
Cleaning
Builder
Roofing
Roofer
Concreter
Concrete
Fencing
Landscaper
Landscaping
Removalist
Rubbish Removal
Skip Bin Hire
Gutter Cleaning
Window Cleaning
Commercial Cleaning
Carpet Cleaning
Pressure Cleaning
House Washing
Waterproofing
Bathroom Renovations
Kitchen Renovations
Renovations
Painting
Painter
Tiler
Tiling
Electrician Brisbane
Plumber Brisbane
Locksmith Brisbane
Air Conditioning Brisbane
Roofing Brisbane
Pest Control Brisbane
Cleaning Brisbane
Air Conditioner Installation
Air Conditioning Installation
Air Conditioner Repair
Air Conditioning Repair
Air Conditioning Cleaning
Ducted Air Conditioning
Split System Installation
Hot Water Systems
Hot Water Repairs
Hot Water Installation
Electrical Repairs
Switchboard Upgrades
Safety Switch Testing
Test And Tag Services
Smoke Alarm Installation
Emergency Lighting Testing
Fire Extinguisher Inspection
Fire Safety Compliance Audit
Fire Alarm Maintenance
Fire Door Installation
Drain Repairs
Blocked Drains
Blocked Toilet
Leak Detection
Tap Repairs
Toilet Repairs
Emergency Plumber
Emergency Electrician
Emergency Locksmith
Lockout Service
Rekey Locks
CCTV Installation
Security Systems
Access Control
Automatic Gates
Gate Installation
Gate Repair
Fence Installation
Fence Repairs
Colorbond Fencing
Roof Repairs
Roof Restoration
Roof Cleaning
Roof Painting
Re Roofing
Demolition
Excavation
Earthmoving
Concrete Cutting
Concrete Removal
Concrete Repair
Concrete Resurfacing
Epoxy Flooring
Termite Treatment
Termite Inspection
End Of Lease Cleaning
Bond Cleaning
Mould Removal
Asbestos Removal
Asbestos Testing
Home improvement
Construction company
Plumbing service
Cleaning service
Carpenter
Landscape company
Gardener
Property
Local service
Contractor
Construction
Product/service
Heating, ventilating and air conditioning service
Vehicle detailing service
Fence and gate contractor
Concrete contractor
Home Repair
Roofing service
Photographer
Entrepreneur
Car wash
Business
Demolition & excavation company
Waste management company
Vehicle, aircraft and boat
Commercial and industrial equipment supplier
Tree cutting service
Building Materials
Vehicle window tinting service
Kitchen and bathroom contractor
Auto Detailing Service
Pest control service
Deck & Patio Builder
Business service
Commercial and industrial
Automotive Repair Shop
Vehicle repair shop
Local business
Rental shop
Carpet and flooring shop
Storage and removals service
Transport service
Architectural designer
Fence & Gate Contractor
Designer
Appliance Repair
Automotives
Structural engineer
Heating, Ventilating & Air Conditioning Service
Home Mover
Gutter cleaning service
Interior design studio
Solar energy service
Swimming pool cleaner
Home decor
Home Care
Water treatment service
Damage restoration service
Awning supplier
Agriculture
House painting
Home security company
Security guard service
Swimming Pool & Hot Tub Service
Swimming pool and hot tub service
Home Inspector
Tiling service
Garage door service
Vehicle restoration service
Carpet Cleaner
Boiler installation & repair service
Metal fabricator
Bicycle Shop
Furniture
Sandblasting service
Refrigeration service
Home & Garden
Window Installation Service`;

/**
 * ============================================================
 *  SETTINGS PRESETS (PER YOUR INSTRUCTIONS)
 * ============================================================
 */
const PRESET_DEDUP_COLUMN = 'snapshot/page_profile_uri';
const PRESET_FILTER_COLUMN = 'snapshot/page_categories/0';
const PRESET_URL_COLUMN = 'snapshot/page_profile_uri';
const PRESET_MATCH_MODE = 'contains'; // Contains

/**
 * ============================================================
 *  WATCHDOG ACTOR (PER PROVIDED APP)
 * ============================================================
 */
const WATCHDOG_DEFAULT_ACTOR_ID = 'bo5X18oGenWEV9vVo';

/**
 * ============================================================
 *  AU NUMBER SORTER REGEX (UNCHANGED)
 * ============================================================
 */
const RX_MOBILE = /(?:^|[^0-9])((?:\+?61|0)[\s\-]*4(?:[\s\-]*\d){8})(?![0-9])/g;
const RX_LANDLINE_GEO = /(?:^|[^0-9])((?:\+?61|0)[\s\-]*[2378](?:[\s\-]*\d){8})(?![0-9])/g;
const RX_LANDLINE_BIZ = /(?:^|[^0-9])((?:1300|1800)(?:[\s\-]*\d){6}|(?:13)(?:[\s\-]*\d){4})(?![0-9])/g;

/**
 * ============================================================
 *  HELPERS
 * ============================================================
 */
const safeToString = (v) => {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean' || typeof v === 'bigint') return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
};

const flattenRecord = (value, prefix = '', out = {}) => {
  if (value === null || value === undefined) {
    if (prefix) out[prefix] = '';
    return out;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const nextPrefix = prefix ? `${prefix}/${index}` : String(index);
      flattenRecord(item, nextPrefix, out);
    });
    return out;
  }

  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => {
      const nextPrefix = prefix ? `${prefix}/${key}` : key;
      flattenRecord(item, nextPrefix, out);
    });
    return out;
  }

  if (prefix) out[prefix] = value;
  return out;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Purifier logic (unchanged)
 */
const isEnglishOrEmoji = (char) => {
  const code = char.codePointAt(0);

  return (
    code <= 127 ||
    (code >= 0x00a0 && code <= 0x00ff) ||
    code === 0x00d7 ||
    code === 0x00f7 ||
    (code >= 0x1d400 && code <= 0x1d7ff) ||
    (code >= 0xfff0 && code <= 0xffff) ||
    code === 0xff1a ||
    code === 0x30b7 ||
    code === 0x30c4 ||
    (code >= 0x2000 && code <= 0x2bff) ||
    (code >= 0x2e00 && code <= 0x2e7f) ||
    (code >= 0xfe00 && code <= 0xfe0f) ||
    (code >= 0x1f000 && code <= 0x1ffff)
  );
};

const rowHasForeignScript = (rowObj) => {
  for (const key of Object.keys(rowObj)) {
    const str = safeToString(rowObj[key]);
    for (const ch of str) {
      if (!isEnglishOrEmoji(ch)) return true;
    }
  }
  return false;
};

/**
 * AU sorter helpers (unchanged)
 */
const findMatches = (text, regex) => {
  if (!text) return [];
  const str = String(text);
  const matches = [];
  const rx = new RegExp(regex);
  let match;
  while ((match = rx.exec(str)) !== null) matches.push(match[1].trim());
  return matches;
};

const sanitizeSheetName = (name) => {
  const cleaned = String(name || 'Sheet')
    .replace(/[:\\/?*\[\]]/g, ' ')
    .trim()
    .slice(0, 31);
  return cleaned || 'Sheet';
};

const escapeXml = (unsafe) =>
  String(unsafe ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/\r\n/g, '&#10;')
    .replace(/\n/g, '&#10;')
    .replace(/\r/g, '&#10;');

const columnLetter = (index) => {
  let column = '';
  let n = index + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    column = String.fromCharCode(65 + rem) + column;
    n = Math.floor((n - 1) / 26);
  }
  return column;
};

const buildWorksheetXml = (headers, rows) => {
  const allRows = [
    headers,
    ...rows.map((row) => headers.map((header) => safeToString(row[header]))),
  ];
  const rowXml = allRows
    .map((row, rowIndex) => {
      const cells = row
        .map((value, colIndex) => {
          const cellRef = `${columnLetter(colIndex)}${rowIndex + 1}`;
          const safeValue = escapeXml(safeToString(value));
          return `<c r="${cellRef}" t="inlineStr"><is><t>${safeValue}</t></is></c>`;
        })
        .join('');
      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join('');

  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
    `<sheetData>${rowXml}</sheetData>`,
    '</worksheet>',
  ].join('');
};

const buildWorkbookXml = (sheetNames) => {
  const sheetsXml = sheetNames
    .map(
      (name, index) =>
        `<sheet name="${escapeXml(name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`
    )
    .join('');

  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"',
    ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">',
    `<sheets>${sheetsXml}</sheets>`,
    '</workbook>',
  ].join('');
};

const buildWorkbookRelsXml = (sheetCount) => {
  const relsXml = Array.from({ length: sheetCount })
    .map(
      (_, index) =>
        `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`
    )
    .join('');

  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    relsXml,
    '</Relationships>',
  ].join('');
};

const buildRootRelsXml = () =>
  [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>',
    '</Relationships>',
  ].join('');

const buildContentTypesXml = (sheetCount) => {
  const sheetOverrides = Array.from({ length: sheetCount })
    .map(
      (_, index) =>
        `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
    )
    .join('');

  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
    '<Default Extension="xml" ContentType="application/xml"/>',
    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>',
    sheetOverrides,
    '</Types>',
  ].join('');
};

const getCrcTable = (() => {
  let table = null;
  return () => {
    if (table) return table;
    table = new Uint32Array(256);
    for (let i = 0; i < 256; i += 1) {
      let c = i;
      for (let j = 0; j < 8; j += 1) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      table[i] = c >>> 0;
    }
    return table;
  };
})();

const crc32 = (data) => {
  const table = getCrcTable();
  let crc = 0xffffffff;
  data.forEach((byte) => {
    const idx = (crc ^ byte) & 0xff;
    crc = table[idx] ^ (crc >>> 8);
  });
  return (crc ^ 0xffffffff) >>> 0;
};

const toUint8Array = (value) => {
  if (value instanceof Uint8Array) return value;
  return new TextEncoder().encode(value);
};

const uint16LE = (num) => new Uint8Array([num & 0xff, (num >> 8) & 0xff]);
const uint32LE = (num) =>
  new Uint8Array([num & 0xff, (num >> 8) & 0xff, (num >> 16) & 0xff, (num >> 24) & 0xff]);

const concatUint8 = (chunks) => {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  chunks.forEach((chunk) => {
    output.set(chunk, offset);
    offset += chunk.length;
  });
  return output;
};

const createZip = (files) => {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  files.forEach(({ name, content }) => {
    const nameBytes = toUint8Array(name);
    const dataBytes = toUint8Array(content);
    const crc = crc32(dataBytes);
    const localHeader = concatUint8([
      new Uint8Array([0x50, 0x4b, 0x03, 0x04]),
      uint16LE(20),
      uint16LE(0),
      uint16LE(0),
      uint16LE(0),
      uint16LE(0),
      uint32LE(crc),
      uint32LE(dataBytes.length),
      uint32LE(dataBytes.length),
      uint16LE(nameBytes.length),
      uint16LE(0),
      nameBytes,
    ]);

    localParts.push(localHeader, dataBytes);

    const centralHeader = concatUint8([
      new Uint8Array([0x50, 0x4b, 0x01, 0x02]),
      uint16LE(20),
      uint16LE(20),
      uint16LE(0),
      uint16LE(0),
      uint16LE(0),
      uint16LE(0),
      uint32LE(crc),
      uint32LE(dataBytes.length),
      uint32LE(dataBytes.length),
      uint16LE(nameBytes.length),
      uint16LE(0),
      uint16LE(0),
      uint16LE(0),
      uint16LE(0),
      uint32LE(0),
      uint32LE(offset),
      nameBytes,
    ]);

    centralParts.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  });

  const centralDir = concatUint8(centralParts);
  const endRecord = concatUint8([
    new Uint8Array([0x50, 0x4b, 0x05, 0x06]),
    uint16LE(0),
    uint16LE(0),
    uint16LE(files.length),
    uint16LE(files.length),
    uint32LE(centralDir.length),
    uint32LE(offset),
    uint16LE(0),
  ]);

  return concatUint8([...localParts, centralDir, endRecord]);
};

const buildXlsxFile = ({ sheets, headers }) => {
  const normalizedSheets = sheets.map(({ name, rows }) => ({
    name: sanitizeSheetName(name),
    rows,
  }));
  const sheetNames = normalizedSheets.map((sheet) => sheet.name);
  const files = [
    { name: '[Content_Types].xml', content: buildContentTypesXml(normalizedSheets.length) },
    { name: '_rels/.rels', content: buildRootRelsXml() },
    { name: 'xl/workbook.xml', content: buildWorkbookXml(sheetNames) },
    { name: 'xl/_rels/workbook.xml.rels', content: buildWorkbookRelsXml(normalizedSheets.length) },
    ...normalizedSheets.map((sheet, index) => ({
      name: `xl/worksheets/sheet${index + 1}.xml`,
      content: buildWorksheetXml(headers, sheet.rows),
    })),
  ];

  return createZip(files);
};

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

const buildCsvContent = (headers, rows) => {
  const escapeCell = (value) => {
    const str = safeToString(value ?? '');
    if (/["\n,]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [headers.map(escapeCell).join(',')];
  rows.forEach((row) => {
    const line = headers.map((header) => escapeCell(row[header])).join(',');
    lines.push(line);
  });
  return lines.join('\n');
};

export default function App() {
  /**
   * ============================================================
   *  THEME (UNCHANGED)
   * ============================================================
   */
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('pipeline_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem('pipeline_theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /**
   * ============================================================
   *  AUTH (GOOGLE SIGN-IN GATE)
   * ============================================================
   */
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [googleScriptReady, setGoogleScriptReady] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [googleButtonReady, setGoogleButtonReady] = useState(false);
  const googleButtonRef = useRef(null);
  const [authState, setAuthState] = useState({
    loading: true,
    authenticated: false,
    error: null,
  });
  const [authUser, setAuthUser] = useState(null);
  const [welcomePhase, setWelcomePhase] = useState('idle');
  const [welcomeText, setWelcomeText] = useState('');
  const welcomeStartedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const res = await fetch('/auth/me', { credentials: 'include' });
        if (!res.ok) {
          if (isMounted) {
            setAuthState({ loading: false, authenticated: false, error: null });
          }
          return;
        }
        const data = await res.json();
        if (isMounted) {
          setAuthState({
            loading: false,
            authenticated: Boolean(data.authenticated),
            error: null,
          });
          if (data.authenticated) {
            setAuthUser(data.name || data.email || null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setAuthState({
            loading: false,
            authenticated: false,
            error: 'Unable to check authentication status.',
          });
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (authState.authenticated) return;
    if (document.getElementById('google-identity-script')) {
      setGoogleScriptReady(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-identity-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleScriptReady(true);
    script.onerror = () => {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: 'Failed to load Google Sign In.',
      }));
    };
    document.body.appendChild(script);
  }, [authState.authenticated]);

  const handleGoogleCredential = useCallback(async (response) => {
    if (!response?.credential) {
      setAuthState({ loading: false, authenticated: false, error: 'Google Sign In failed.' });
      return;
    }
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: response.credential }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Sign in was not authorized.');
      }
      setAuthState({ loading: false, authenticated: true, error: null });
      setAuthUser(data.name || data.email || null);
    } catch (err) {
      setAuthState({
        loading: false,
        authenticated: false,
        error: err instanceof Error ? err.message : 'Sign in failed.',
      });
    }
  }, []);

  useEffect(() => {
    if (!authState.authenticated || welcomeStartedRef.current) return;
    welcomeStartedRef.current = true;
    setWelcomeText('');
    setWelcomePhase('fade-in');
  }, [authState.authenticated]);

  useEffect(() => {
    if (welcomePhase !== 'fade-in') return;
    const timer = setTimeout(() => {
      setWelcomePhase('typing');
    }, 500);
    return () => clearTimeout(timer);
  }, [welcomePhase]);

  useEffect(() => {
    if (welcomePhase !== 'typing') return undefined;
    const name = authUser || 'there';
    const fullText = `Welcome ${name}`;
    let index = 0;
    setWelcomeText('');
    const interval = setInterval(() => {
      index += 1;
      setWelcomeText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(interval);
        setWelcomePhase('hold');
      }
    }, 50);
    return () => clearInterval(interval);
  }, [welcomePhase, authUser]);

  useEffect(() => {
    if (welcomePhase !== 'hold') return;
    const timer = setTimeout(() => {
      setWelcomePhase('fade-out');
    }, 500);
    return () => clearTimeout(timer);
  }, [welcomePhase]);

  useEffect(() => {
    if (welcomePhase !== 'fade-out') return;
    const timer = setTimeout(() => {
      setWelcomePhase('done');
    }, 500);
    return () => clearTimeout(timer);
  }, [welcomePhase]);

  useEffect(() => {
    if (authState.authenticated || !googleScriptReady) return;
    if (!googleClientId) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: 'Missing Google client ID configuration. Set VITE_GOOGLE_CLIENT_ID in the front-end .env file.',
      }));
      return;
    }
    const google = window.google;
    if (!google?.accounts?.id) return;
    google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredential,
    });
    setGoogleReady(true);
  }, [authState.authenticated, googleClientId, googleScriptReady, handleGoogleCredential]);

  const renderGoogleButton = useCallback(() => {
    const container = googleButtonRef.current;
    const google = window.google;
    if (!container || !google?.accounts?.id) return;
    const width = Math.max(200, Math.floor(container.offsetWidth || 0));
    container.innerHTML = '';
    google.accounts.id.renderButton(container, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'pill',
      width,
    });
    setGoogleButtonReady(true);
  }, []);

  useEffect(() => {
    if (!googleReady) return;
    renderGoogleButton();
    const handleResize = () => renderGoogleButton();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [googleReady, renderGoogleButton]);

  const handleLoginClick = useCallback(() => {
    if (googleButtonReady) return;
    if (!googleReady) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: 'Google Sign In is still loading. Please wait a moment and try again.',
      }));
      return;
    }
    const google = window.google;
    if (!google?.accounts?.id) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: 'Google Sign In is unavailable right now.',
      }));
      return;
    }
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: 'Google Sign In was closed or blocked. Please try again.',
        }));
      }
    });
  }, [googleButtonReady, googleReady]);

  /**
   * ============================================================
   *  NAV (NEW: SETTINGS PAGE)
   * ============================================================
   */
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | settings

  /**
   * ============================================================
   *  PIPELINE SETTINGS (PRESET + EDITABLE IN SETTINGS PAGE)
   * ============================================================
   */
  const [dedupColumn, setDedupColumn] = useState(PRESET_DEDUP_COLUMN);
  const [filterColumn, setFilterColumn] = useState(PRESET_FILTER_COLUMN);
  const [urlColumn, setUrlColumn] = useState(PRESET_URL_COLUMN);
  const [matchMode, setMatchMode] = useState(PRESET_MATCH_MODE); // exact | contains

  /**
   * ============================================================
   *  APIFY (SERVER-SUPPLIED)
   * ============================================================
   */
  const [memory, setMemory] = useState(128);

  const apifyRequest = useCallback(async ({ path, method = 'GET', query, body }) => {
    const res = await fetch('/apify/request', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path,
        method,
        query,
        body,
      }),
    });

    const contentType = res.headers.get('content-type') || '';
    let payload = null;
    if (contentType.includes('application/json')) {
      try {
        payload = await res.json();
      } catch {
        payload = null;
      }
    } else {
      payload = await res.text();
    }
    return { ok: res.ok, status: res.status, data: payload };
  }, []);

  /**
   * ============================================================
   *  WATCHDOG CONFIG (NEW STEP 1)
   *  (Functionality preserved from your Watchdog app; UI adapted)
   * ============================================================
   */
  const [watchdogActorId, setWatchdogActorId] = useState(WATCHDOG_DEFAULT_ACTOR_ID);
  const [watchdogKeywordsInput, setWatchdogKeywordsInput] = useState('');
  const [watchdogCountry, setWatchdogCountry] = useState('AU');
  const [watchdogActiveStatus, setWatchdogActiveStatus] = useState('active');
  const [watchdogMinDate, setWatchdogMinDate] = useState('');
  const [watchdogMaxDate, setWatchdogMaxDate] = useState(() => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  });
  const [watchdogMaxItems, setWatchdogMaxItems] = useState(100);
  const [watchdogMaxRuntime, setWatchdogMaxRuntime] = useState('');
  const [watchdogMaxConcurrency, setWatchdogMaxConcurrency] = useState(100);
  const [dateViolationEnabled, setDateViolationEnabled] = useState(true);
  const [dateViolationStreakLimit, setDateViolationStreakLimit] = useState(DEFAULT_DATE_VIOLATION_STREAK_LIMIT);

  const [watchdogJobs, setWatchdogJobs] = useState([]);
  const watchdogJobsRef = useRef([]);
  const [watchdogExporting, setWatchdogExporting] = useState(false);
  const [watchdogExportStatus, setWatchdogExportStatus] = useState('');

  const setWatchdogJobsSafe = useCallback((next) => {
    watchdogJobsRef.current = next;
    setWatchdogJobs(next);
  }, []);

  const updateWatchdogJob = useCallback(
    (id, updates) => {
      const next = watchdogJobsRef.current.map((job) => (job.id === id ? { ...job, ...updates } : job));
      setWatchdogJobsSafe(next);
    },
    [setWatchdogJobsSafe]
  );

  /**
   * ============================================================
   *  PIPELINE DATA (FROM WATCHDOG EXPORT)
   * ============================================================
   */
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [dedupRows, setDedupRows] = useState([]);
  const [purifiedRows, setPurifiedRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [sourceBaseName, setSourceBaseName] = useState('pipeline');

  /**
   * ============================================================
   *  RUNTIME STATE
   * ============================================================
   */
  const [isRunning, setIsRunning] = useState(false);
  const [stage, setStage] = useState('idle'); // idle | watchdog | export | dedup | purify | filter | apify | fetch | sort | done | error
  const [status, setStatus] = useState('Configure bulk initial pull inputs, then run.');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const stopRef = useRef(false);

  /**
   * ============================================================
   *  LOGS
   * ============================================================
   */
  const [logs, setLogs] = useState([]);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const addLog = useCallback((message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { message, type, timestamp }]);
  }, []);

  /**
   * ============================================================
   *  APIFY (PAGES SCRAPER) PROGRESS
   * ============================================================
   */
  const [batchProgress, setBatchProgress] = useState({ total: 0, completed: 0, active: 0 });

  useEffect(() => {
    if (stage !== 'apify') return;
    if (!batchProgress.total) return;
    // Keep same concept; ranges adjusted to follow watchdog stages
    const base = 55;
    const weight = 25; // 55 -> 80
    const pct = base + (batchProgress.completed / batchProgress.total) * weight;
    setProgress(Math.min(80, Math.max(base, pct)));
  }, [stage, batchProgress]);

  /**
   * ============================================================
   *  FINAL RESULTS
   * ============================================================
   */
  const [finalWorkbook, setFinalWorkbook] = useState(null);

  const [stats, setStats] = useState({
    // Watchdog stats
    watchdogKeywords: 0,
    watchdogTotalJobs: 0,
    watchdogSucceeded: 0,
    watchdogFailed: 0,
    watchdogAborted: 0,
    watchdogExportedRows: 0,

    // Pipeline stats
    inputRows: 0,

    dedupRemoved: 0,
    afterDedup: 0,

    purifierRemoved: 0,
    afterPurify: 0,

    masterFilterRemoved: 0,
    afterMasterFilter: 0,

    urlsForApify: 0,
    batchesTotal: 0,
    batchesSucceeded: 0,
    batchesFailed: 0,

    apifyItems: 0,

    sorterMobile: 0,
    sorterLandline: 0,
    sorterOther: 0,
  });

  const filteredOutTotal = stats.dedupRemoved + stats.purifierRemoved + stats.masterFilterRemoved;

  /**
   * ============================================================
   *  MASTER FILTER SET (UNCHANGED)
   * ============================================================
   */
  const allowSet = useMemo(() => {
    const list = MASTER_FILTER_KEYWORDS_RAW.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    return new Set(list.map((s) => s.toLowerCase()));
  }, []);

  const keywordCount = useMemo(() => allowSet.size, [allowSet]);

  /**
   * ============================================================
   *  RESET (DOES NOT TOUCH SETTINGS VALUES)
   * ============================================================
   */
  const resetAll = useCallback(() => {
    stopRef.current = false;

    setHeaders([]);
    setRows([]);
    setDedupRows([]);
    setPurifiedRows([]);
    setFilteredRows([]);
    setSourceBaseName('pipeline');

    setIsRunning(false);
    setStage('idle');
    setStatus('Configure bulk initial pull inputs, then run.');
    setProgress(0);
    setError(null);

    setLogs([]);
    setBatchProgress({ total: 0, completed: 0, active: 0 });

    setFinalWorkbook(null);

    setWatchdogJobsSafe([]);
    setWatchdogExporting(false);
    setWatchdogExportStatus('');

    setStats({
      watchdogKeywords: 0,
      watchdogTotalJobs: 0,
      watchdogSucceeded: 0,
      watchdogFailed: 0,
      watchdogAborted: 0,
      watchdogExportedRows: 0,

      inputRows: 0,

      dedupRemoved: 0,
      afterDedup: 0,

      purifierRemoved: 0,
      afterPurify: 0,

      masterFilterRemoved: 0,
      afterMasterFilter: 0,

      urlsForApify: 0,
      batchesTotal: 0,
      batchesSucceeded: 0,
      batchesFailed: 0,

      apifyItems: 0,

      sorterMobile: 0,
      sorterLandline: 0,
      sorterOther: 0,
    });
  }, [setWatchdogJobsSafe]);

  const downloadCsvSnapshot = useCallback(
    (label, dataRows) => {
      if (!headers.length || !dataRows.length) return;
      const csv = buildCsvContent(headers, dataRows);
      const date = new Date().toISOString().slice(0, 10);
      const filename = `${sourceBaseName || 'pipeline'}_${label}_${date}.csv`;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      downloadBlob(blob, filename);
      addLog(`Downloaded: ${filename}`, 'success');
    },
    [addLog, headers, sourceBaseName]
  );

  /**
   * ============================================================
   *  WATCHDOG: MANUAL ABORT (FUNCTIONALITY PRESERVED)
   * ============================================================
   */
  const waitForWatchdogFinalStatus = useCallback(
    async (runId, { timeoutMs = 20000, intervalMs = 1500 } = {}) => {
      const startedAt = Date.now();
      let lastStatus = null;

      while (Date.now() - startedAt < timeoutMs) {
        try {
          const statusRes = await apifyRequest({ path: `/v2/acts/${watchdogActorId}/runs/${runId}` });
          if (statusRes.ok) {
            const statusData = statusRes.data;
            const status = statusData?.data?.status || null;
            lastStatus = status;
            if (['ABORTED', 'FAILED', 'SUCCEEDED'].includes(status)) {
              return status;
            }
          }
        } catch {
          /* ignore */
        }

        await sleep(intervalMs);
      }

      return lastStatus;
    },
    [apifyRequest, watchdogActorId]
  );

  const abortWatchdogJob = useCallback(
    async (job, reason) => {
      if (!job?.runId) return;
      let finalStatus = null;

      try {
        const maxAttempts = 3;

        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
          await apifyRequest({
            path: `/v2/acts/${watchdogActorId}/runs/${job.runId}/abort`,
            method: 'POST',
          });

          finalStatus = await waitForWatchdogFinalStatus(job.runId, {
            timeoutMs: 20000,
            intervalMs: 1500,
          });

          if (finalStatus === 'ABORTED' || finalStatus === 'FAILED' || finalStatus === 'SUCCEEDED') {
            break;
          }

          await sleep(1000);
        }

        if (finalStatus === 'ABORTED') {
          updateWatchdogJob(job.id, { status: 'ABORTED', failReason: reason });
          addLog(`[WATCHDOG ABORT] "${job.keyword}" - ${reason}`, 'error');
          return;
        }

        if (finalStatus === 'FAILED' || finalStatus === 'SUCCEEDED') {
          updateWatchdogJob(job.id, { status: finalStatus });
          addLog(
            `[WATCHDOG] Abort requested for "${job.keyword}", but run finished with status: ${finalStatus}.`,
            'warning'
          );
          return;
        }

        addLog(`[WATCHDOG] Abort requested for "${job.keyword}", but confirmation timed out.`, 'warning');
      } catch (e) {
        // Preserve original behaviour: ignore abort failure silently, but we can log a warning safely
        addLog(`[WATCHDOG] Abort failed for "${job.keyword}".`, 'warning');
      }
    },
    [addLog, apifyRequest, updateWatchdogJob, waitForWatchdogFinalStatus, watchdogActorId]
  );

  /**
   * ============================================================
   *  WATCHDOG: RUN + EXPORT (INTERNAL; NO DOWNLOAD; CONTINUES PIPELINE)
   *  - Functionality preserved from provided Watchdog app
   * ============================================================
   */
  const runWatchdogAndExportRows = useCallback(async () => {
    if (!watchdogMinDate) throw new Error('Minimum Date is CRITICAL. Please set it.');
    if (!watchdogKeywordsInput.trim()) throw new Error('Please enter at least one keyword.');

    const keywords = watchdogKeywordsInput
      .split('\n')
      .map((k) => k.trim())
      .filter((k) => k);

    if (keywords.length === 0) throw new Error('No valid keywords found.');

    // Init queue (same fields)
    const newJobs = keywords.map((keyword) => ({
      id: (globalThis.crypto && crypto.randomUUID && crypto.randomUUID()) || `${Date.now()}-${Math.random()}`,
      keyword,
      status: 'PENDING', // PENDING, PENDING_RETRY, STARTING, RUNNING, SUCCEEDED, ABORTED, FAILED
      runId: null,
      datasetId: null,
      lastDate: null,
      failReason: null,
      retryCount: 0,
      startTime: null,
      itemCount: 0,
      dateViolationStreak: 0,
    }));

    setWatchdogJobsSafe(newJobs);

    setStats((s) => ({
      ...s,
      watchdogKeywords: keywords.length,
      watchdogTotalJobs: keywords.length,
      watchdogSucceeded: 0,
      watchdogFailed: 0,
      watchdogAborted: 0,
      watchdogExportedRows: 0,
    }));

    addLog(`Bulk initial pull started. Queue size: ${newJobs.length}. Concurrency: ${watchdogMaxConcurrency}`, 'success');

    // Helper: retry logic (preserved)
    const handleRetryOrFail = async (job, reason) => {
      // If running on Apify, abort first
      if (job.status === 'RUNNING' && job.runId) {
        try {
          await apifyRequest({
            path: `/v2/acts/${watchdogActorId}/runs/${job.runId}/abort`,
            method: 'POST',
          });
        } catch (e) {
          /* ignore */
        }
      }

      const currentRetries = job.retryCount || 0;

      if (currentRetries < 2) {
        const nextRetry = currentRetries + 1;
        updateWatchdogJob(job.id, {
          status: 'PENDING_RETRY',
          retryCount: nextRetry,
          failReason: `Retry #${nextRetry}: ${reason}`,
          runId: null,
          datasetId: null,
          startTime: null,
          itemCount: 0,
        });
        addLog(`Queueing Retry #${nextRetry} for "${job.keyword}". Reason: ${reason}`, 'warning');
      } else {
        updateWatchdogJob(job.id, {
          status: 'FAILED',
          failReason: `${reason} (Max Retries Exceeded)`,
        });
        addLog(`Job "${job.keyword}" Failed permanently after 3 attempts.`, 'error');
      }
    };

    // Job starter (preserved)
    const triggerJobRun = async (job) => {
      updateWatchdogJob(job.id, {
        status: 'STARTING',
        startTime: Date.now(),
        itemCount: 0,
      });

      const inputBody = {
        maxItems: parseInt(watchdogMaxItems) || 100,
        query: job.keyword,
        country: watchdogCountry,
        category: 'all',
        mediaType: 'all',
        sortBy: 'mostRecent',
        activeStatus: watchdogActiveStatus,
        advertisers: [],
        proxyConfiguration: { useApifyProxy: true, apifyProxyGroups: ['RESIDENTIAL'] },
      };

      if (watchdogMinDate) inputBody.searchStartDate = watchdogMinDate;
      if (watchdogMaxDate) inputBody.searchEndDate = watchdogMaxDate;

      const query = {};
      if (memory) query.memory = memory;
      if (watchdogMaxRuntime) query.timeout = parseInt(watchdogMaxRuntime) * 60;

      try {
        const tryNum = (job.retryCount || 0) + 1;
        addLog(`Starting bulk initial pull run for "${job.keyword}" (Attempt ${tryNum})...`, 'info');

        const response = await apifyRequest({
          path: `/v2/acts/${watchdogActorId}/runs`,
          method: 'POST',
          query,
          body: inputBody,
        });

        if (!response.ok) throw new Error(`API Error ${response.status}`);

        const data = response.data;
        updateWatchdogJob(job.id, {
          status: 'RUNNING',
          runId: data.data.id,
          datasetId: data.data.defaultDatasetId,
        });

        addLog(`Bulk initial pull run started for "${job.keyword}" (ID: ${data.data.id})`, 'success');
      } catch (error) {
        await handleRetryOrFail(job, `Start Failed: ${error.message}`);
      }
    };

    // Watchdog monitor (preserved)
    const checkActiveJobs = async () => {
      const jobsNow = watchdogJobsRef.current;
      const runningJobs = jobsNow.filter((j) => j.status === 'RUNNING' && j.runId && j.datasetId);
      if (runningJobs.length === 0) return;

      for (const job of runningJobs) {
        if (stopRef.current) return;

        try {
          // A) status & stats
          const runRes = await apifyRequest({
            path: `/v2/acts/${watchdogActorId}/runs/${job.runId}`,
          });
          const runData = runRes.data;
          const runStatus = runData?.data?.status;

          let reportedCount = runData?.data?.stats?.itemCount || 0;

          // B) dataset truth
          const datasetRes = await apifyRequest({
            path: `/v2/datasets/${job.datasetId}/items`,
            query: { limit: 50, desc: true, clean: true },
          });
          const items = datasetRes.data;
          const hasActualItems = Array.isArray(items) && items.length > 0;

          const displayCount = Math.max(reportedCount, hasActualItems ? (reportedCount || items.length) : 0);
          updateWatchdogJob(job.id, { itemCount: displayCount });

          // RETRY RULE 1: timeout no results
          const runDuration = Date.now() - (job.startTime || Date.now());
          if (!hasActualItems && runDuration > 60000) {
            await handleRetryOrFail(job, 'Timeout (60s) with 0 results');
            continue;
          }

          // RETRY RULE 2: finished empty
          if (['SUCCEEDED'].includes(runStatus)) {
            if (!hasActualItems) {
              await handleRetryOrFail(job, 'Finished with 0 results');
            } else {
              updateWatchdogJob(job.id, { status: 'SUCCEEDED', itemCount: displayCount });
            }
            continue;
          }

          if (['FAILED', 'ABORTED'].includes(runStatus)) {
            updateWatchdogJob(job.id, { status: runStatus });
            continue;
          }

          // C) dataset dates kill switch
          if (hasActualItems) {
            const parseStartDateValue = (raw) => {
              if (raw === null || raw === undefined || raw === '') return { time: null, display: '' };
              const rawString = String(raw).trim();
              if (!rawString) return { time: null, display: '' };

              const numericOnly = /^\d+$/.test(rawString);
              if (numericOnly) {
                if (rawString.length === 13) {
                  const ts = Number(rawString);
                  return { time: ts, display: new Date(ts).toISOString().split('T')[0] };
                }
                if (rawString.length === 10) {
                  const ts = Number(rawString) * 1000;
                  return { time: ts, display: new Date(ts).toISOString().split('T')[0] };
                }
                if (rawString.length === 8) {
                  const year = rawString.slice(0, 4);
                  const month = rawString.slice(4, 6);
                  const day = rawString.slice(6, 8);
                  const isoDate = `${year}-${month}-${day}`;
                  const parsed = Date.parse(isoDate);
                  if (!isNaN(parsed)) {
                    return { time: parsed, display: isoDate };
                  }
                }

                const numericValue = Number(rawString);
                if (!isNaN(numericValue)) {
                  const ts = numericValue > 100000000000 ? numericValue : numericValue * 1000;
                  return { time: ts, display: new Date(ts).toISOString().split('T')[0] };
                }
              }

              const parsed = Date.parse(rawString);
              if (!isNaN(parsed)) {
                return { time: parsed, display: new Date(parsed).toISOString().split('T')[0] };
              }

              return { time: null, display: '' };
            };

            const latestItem = items[0];
            const { display: displayDate } = parseStartDateValue(latestItem?.start_date);

            updateWatchdogJob(job.id, { lastDate: displayDate });

            if (dateViolationEnabled) {
              const minimumDate = new Date(watchdogMinDate);
              minimumDate.setDate(minimumDate.getDate() - 1);
              const targetDate = minimumDate.toISOString().split('T')[0];

              const offender = items.find((item) => {
                const { display: itemDate } = parseStartDateValue(item.start_date);
                if (!itemDate) return false;
                return itemDate === targetDate;
              });

              if (offender) {
                const nextStreak = (job.dateViolationStreak || 0) + 1;
                const { display: offenderDate } = parseStartDateValue(offender.start_date);
                updateWatchdogJob(job.id, { dateViolationStreak: nextStreak });

                const safeStreakLimit = Math.max(1, Number(dateViolationStreakLimit) || 1);
                if (nextStreak >= safeStreakLimit) {
                  await abortWatchdogJob(job, `Date Violation: ${offenderDate}`);
                }
              } else if (job.dateViolationStreak) {
                updateWatchdogJob(job.id, { dateViolationStreak: 0 });
              }
            } else if (job.dateViolationStreak) {
              updateWatchdogJob(job.id, { dateViolationStreak: 0 });
            }
          }
        } catch (e) {
          // Preserve: monitor glitches ignored
        }
      }
    };

    // Main scheduler loop (preserved behaviour)
    while (!stopRef.current) {
      const jobsNow = watchdogJobsRef.current;

      const activeCount = jobsNow.filter((j) => j.status === 'RUNNING' || j.status === 'STARTING').length;

      const retryJobs = jobsNow.filter((j) => j.status === 'PENDING_RETRY');
      const pendingJobs = jobsNow.filter((j) => j.status === 'PENDING');

      if (activeCount < watchdogMaxConcurrency) {
        const slotsAvailable = watchdogMaxConcurrency - activeCount;
        let slotsFilled = 0;

        while (slotsFilled < slotsAvailable && retryJobs.length > 0) {
          const job = retryJobs.shift();
          await triggerJobRun(job);
          slotsFilled++;
        }

        while (slotsFilled < slotsAvailable && pendingJobs.length > 0) {
          const job = pendingJobs.shift();
          await triggerJobRun(job);
          slotsFilled++;
        }
      }

      // Progress update (UI-only)
      const doneCount = jobsNow.filter((j) => ['SUCCEEDED', 'FAILED', 'ABORTED'].includes(j.status)).length;
      const total = Math.max(1, jobsNow.length);
      const pct = (doneCount / total) * 25; // 0 -> 25
      setProgress(Math.min(25, Math.max(0, pct)));

      // Done condition matches original: no active + no pending + no retry + jobs exist
      const activeNow = watchdogJobsRef.current.filter((j) => j.status === 'RUNNING' || j.status === 'STARTING').length;
      const retryNow = watchdogJobsRef.current.filter((j) => j.status === 'PENDING_RETRY').length;
      const pendingNow = watchdogJobsRef.current.filter((j) => j.status === 'PENDING').length;

      if (activeNow === 0 && retryNow === 0 && pendingNow === 0 && watchdogJobsRef.current.length > 0) {
        addLog('All bulk initial pull jobs completed.', 'success');
        break;
      }

      await checkActiveJobs();

      const dynamicInterval = Math.max(3000, activeNow * 200);
      await sleep(dynamicInterval);
    }

    if (stopRef.current) throw new Error('Stopped by user.');

    // Compute watchdog completion stats (UI tiles)
    const finalJobs = watchdogJobsRef.current;
    const succeeded = finalJobs.filter((j) => j.status === 'SUCCEEDED').length;
    const failed = finalJobs.filter((j) => j.status === 'FAILED').length;
    const aborted = finalJobs.filter((j) => j.status === 'ABORTED').length;

    setStats((s) => ({
      ...s,
      watchdogSucceeded: succeeded,
      watchdogFailed: failed,
      watchdogAborted: aborted,
    }));

    // -------- EXPORT (Single CSV internally; continues pipeline) --------
    setWatchdogExporting(true);
    setWatchdogExportStatus('Analyzing schema...');
    addLog('Bulk initial pull export: analyzing schema...', 'system');

    const jobsWithData = finalJobs.filter((j) => j.datasetId);
    if (jobsWithData.length === 0) {
      setWatchdogExporting(false);
      setWatchdogExportStatus('');
      throw new Error('No datasets found to export.');
    }

    // Phase 1: Discover headers (double-pass strategy) — preserved
    const masterHeaders = new Set();
    const SCHEMA_BATCH = 2;
    const SCHEMA_PAGE_SIZE = 25;
    const SCHEMA_ITEM_LIMIT = 100;

    for (let i = 0; i < jobsWithData.length; i += SCHEMA_BATCH) {
      const batch = jobsWithData.slice(i, i + SCHEMA_BATCH);

      await Promise.all(
        batch.map(async (job) => {
          try {
            for (let offset = 0; offset < SCHEMA_ITEM_LIMIT; offset += SCHEMA_PAGE_SIZE) {
              if (stopRef.current) break;
              const res = await apifyRequest({
                path: `/v2/datasets/${job.datasetId}/items`,
                query: { limit: SCHEMA_PAGE_SIZE, offset, clean: false },
              });
              if (!res.ok) break;
              const items = res.data;
              if (Array.isArray(items) && items.length > 0) {
                items.forEach((item) => {
                  const flattened = flattenRecord(item);
                  Object.keys(flattened).forEach((k) => masterHeaders.add(k));
                });
              }
              if (!Array.isArray(items) || items.length < SCHEMA_PAGE_SIZE) break;
            }
          } catch {
            /* ignore */
          }
        })
      );

      if (stopRef.current) break;
    }

    masterHeaders.add('keyword');
    const exportedHeaders = Array.from(masterHeaders);

    setWatchdogExportStatus('Fetching dataset items...');
    addLog(`Bulk initial pull export: fetching datasets (${jobsWithData.length})...`, 'system');

    // Phase 2: Stream fetch (memory-safe pattern preserved; single CSV internal)
    const DATA_BATCH = 2;
    const DATA_PAGE_SIZE = 200;
    const allRows = [];
    let processedCount = 0;

    for (let i = 0; i < jobsWithData.length; i += DATA_BATCH) {
      const batch = jobsWithData.slice(i, i + DATA_BATCH);

      for (const job of batch) {
        try {
          for (let offset = 0; ; offset += DATA_PAGE_SIZE) {
            if (stopRef.current) break;
            const res = await apifyRequest({
              path: `/v2/datasets/${job.datasetId}/items`,
              query: { clean: false, limit: DATA_PAGE_SIZE, offset },
            });
            if (!res.ok) break;
            const items = res.data;
            if (!Array.isArray(items) || items.length === 0) break;

            for (const item of items) {
              const rowObj = {};
              // Inject keyword column (preserved)
              const enriched = { ...item, keyword: job.keyword };
              const flattened = flattenRecord(enriched);

              for (const fieldName of exportedHeaders) {
                const val = flattened[fieldName] ?? '';
                rowObj[fieldName] = safeToString(val).replace(/\r?\n/g, ' ');
              }

              allRows.push(rowObj);
            }

            if (items.length < DATA_PAGE_SIZE) break;
          }
        } catch {
          /* ignore */
        }
      }

      processedCount += batch.length;
      setWatchdogExportStatus(`Processed ${processedCount}/${jobsWithData.length} datasets...`);
      // UI progress export 25 -> 35
      setProgress(25 + (processedCount / Math.max(1, jobsWithData.length)) * 10);

      if (stopRef.current) break;
    }

    setWatchdogExporting(false);
    setWatchdogExportStatus('');

    if (stopRef.current) throw new Error('Stopped by user.');
    if (allRows.length === 0) throw new Error('Bulk initial pull export produced 0 rows.');

    // Store exported "CSV" (internally) as pipeline input
    setHeaders(exportedHeaders);
    setRows(allRows);
    setSourceBaseName(`watchdog_export_${new Date().toISOString().slice(0, 10)}`);

    setStats((s) => ({
      ...s,
      watchdogExportedRows: allRows.length,
      inputRows: allRows.length,
    }));

    addLog(`Bulk initial pull export complete: ${allRows.length} row(s).`, 'success');

    return { exportedHeaders, allRows };
  }, [
    abortWatchdogJob,
    addLog,
    allowSet,
    apifyRequest,
    dateViolationEnabled,
    dateViolationStreakLimit,
    memory,
    setWatchdogJobsSafe,
    updateWatchdogJob,
    watchdogActiveStatus,
    watchdogActorId,
    watchdogCountry,
    watchdogKeywordsInput,
    watchdogMaxConcurrency,
    watchdogMaxDate,
    watchdogMaxItems,
    watchdogMaxRuntime,
    watchdogMinDate,
  ]);

  /**
   * ============================================================
   *  PAGES SCRAPER (UNCHANGED)
   * ============================================================
   */
  const runSingleBatch = useCallback(
    async (batchUrls, batchIndex) => {
      try {
        const inputPayload = {
          startUrls: batchUrls,
          proxyConfiguration: {
            useApifyProxy: true,
            apifyProxyGroups: ['RESIDENTIAL'],
          },
        };

        const query = {};
        if (memory) query.memory = memory;
        const startResponse = await apifyRequest({
          path: '/v2/acts/api-empire~facebook-pages-scraper/runs',
          method: 'POST',
          query,
          body: inputPayload,
        });

        if (!startResponse.ok) {
          const errText =
            typeof startResponse.data === 'string' ? startResponse.data : JSON.stringify(startResponse.data || {});
          throw new Error(`Batch ${batchIndex + 1} failed start: ${startResponse.status} - ${errText}`);
        }

        const startData = startResponse.data;
        const runId = startData?.data?.id;
        const datasetId = startData?.data?.defaultDatasetId;

        addLog(`Batch ${batchIndex + 1} started (ID: ${(runId || '').slice(0, 8)}...)`, 'info');

        let status = 'RUNNING';
        while (status === 'RUNNING' || status === 'READY') {
          if (stopRef.current) throw new Error('Stopped by user.');
          await sleep(5000 + Math.random() * 2000);
          const statusRes = await apifyRequest({
            path: `/v2/acts/api-empire~facebook-pages-scraper/runs/${runId}`,
          });
          if (statusRes.ok) {
            const statusData = statusRes.data;
            status = statusData?.data?.status;
          } else {
            addLog(`Batch ${batchIndex + 1}: status check failed (${statusRes.status}). Retrying...`, 'warning');
          }
        }

        if (status === 'SUCCEEDED') {
          addLog(`Batch ${batchIndex + 1} completed successfully.`, 'success');
          return datasetId;
        }

        throw new Error(`Batch ${batchIndex + 1} finished with status: ${status}`);
      } catch (err) {
        addLog(`Error in Batch ${batchIndex + 1}: ${err.message}`, 'error');
        return null;
      }
    },
    [addLog, apifyRequest, memory]
  );

  const normalizeUrl = useCallback((raw) => {
    const trimmed = safeToString(raw).trim();
    if (!trimmed) return '';

    const looksLikeUrl = /^https?:\/\//i.test(trimmed) || /facebook\.com/i.test(trimmed);
    if (!looksLikeUrl) return '';

    if (!/^https?:\/\//i.test(trimmed) && /facebook\.com/i.test(trimmed)) {
      return `https://${trimmed.replace(/^\/+/, '')}`;
    }

    return trimmed;
  }, []);

  const extractUrlsFromRow = useCallback(
    (row) => {
      const raw = safeToString(row[urlColumn]).trim();
      if (!raw) return [];

      const parts = raw
        .split(/[\s,]+/)
        .map((p) => p.trim())
        .filter(Boolean);

      const urls = [];
      for (const p of parts) {
        const normalized = normalizeUrl(p);
        if (normalized) urls.push(normalized);
      }

      return urls;
    },
    [normalizeUrl, urlColumn]
  );

  const extractUrls = useCallback(
    (dataRows) => {
      const out = [];
      const seen = new Set();

      for (const row of dataRows) {
        const urls = extractUrlsFromRow(row);
        for (const normalized of urls) {
          if (!seen.has(normalized)) {
            seen.add(normalized);
            out.push(normalized);
          }
        }
      }

      return out;
    },
    [extractUrlsFromRow]
  );

  const getKeywordColumns = useCallback((dataRows) => {
    let maxIndex = 0;

    for (const row of dataRows) {
      for (const key of Object.keys(row || {})) {
        if (key === 'keyword') {
          maxIndex = Math.max(maxIndex, 1);
          continue;
        }

        if (key.startsWith('keyword_')) {
          const suffix = Number(key.replace('keyword_', ''));
          if (!Number.isNaN(suffix)) maxIndex = Math.max(maxIndex, suffix);
        }
      }
    }

    if (maxIndex === 0) return [];

    return Array.from({ length: maxIndex }, (_, idx) => (idx === 0 ? 'keyword' : `keyword_${idx + 1}`));
  }, []);

  const extractKeywordsFromRow = useCallback((row, keywordColumns) => {
    const keywords = [];
    for (const key of keywordColumns) {
      const value = safeToString(row?.[key]).trim();
      if (value) keywords.push(value);
    }
    return keywords;
  }, []);

  const buildUrlKeywordMap = useCallback(
    (dataRows, keywordColumns) => {
      const map = new Map();

      for (const row of dataRows) {
        const urls = extractUrlsFromRow(row);
        if (!urls.length) continue;

        const keywordValues = extractKeywordsFromRow(row, keywordColumns);
        for (const url of urls) {
          if (!map.has(url)) map.set(url, new Set());
          const keywordSet = map.get(url);
          for (const keyword of keywordValues) keywordSet.add(keyword);
        }
      }

      return map;
    },
    [extractKeywordsFromRow, extractUrlsFromRow]
  );

  const resolveItemUrl = useCallback(
    (item, urlKeywordMap) => {
      if (!item) return '';
      const keys = Object.keys(item);

      for (const key of keys) {
        if (!/url/i.test(key)) continue;
        const candidate = normalizeUrl(item[key]);
        if (candidate && urlKeywordMap.has(candidate)) return candidate;
      }

      for (const value of Object.values(item)) {
        if (typeof value !== 'string') continue;
        if (!/facebook\.com/i.test(value)) continue;
        const candidate = normalizeUrl(value);
        if (candidate && urlKeywordMap.has(candidate)) return candidate;
      }

      return '';
    },
    [normalizeUrl]
  );

  /**
   * ============================================================
   *  STOP (PRESERVES WATCHDOG "STOP ALL" FUNCTIONALITY)
   * ============================================================
   */
  const stopPipeline = useCallback(async () => {
    if (!isRunning) return;
    stopRef.current = true;
    setStatus('Stopping... aborting active bulk initial pull runs.');
    addLog('STOP requested by user. Attempting to abort active bulk initial pull runs...', 'warning');

    // Abort active Watchdog runs (preserved)
    const activeJobs = watchdogJobsRef.current.filter((j) => j.status === 'RUNNING' || j.status === 'STARTING');
    await Promise.all(activeJobs.map((j) => abortWatchdogJob(j, 'System Manual Stop')));

    // If pipeline is beyond watchdog, we just stop local processing.
    setIsRunning(false);
    setStage('idle');
  }, [abortWatchdogJob, addLog, isRunning]);

  /**
   * ============================================================
   *  FULL PIPELINE (WATCHDOG -> DEDUP -> PURIFY -> MASTER FILTER -> APIFY -> SORT)
   *  - Input CSV upload removed (per request)
   * ============================================================
   */
  const runPipeline = useCallback(async () => {
    setError(null);
    setFinalWorkbook(null);
    setLogs([]);
    setBatchProgress({ total: 0, completed: 0, active: 0 });
    setDedupRows([]);
    setPurifiedRows([]);
    setFilteredRows([]);

    stopRef.current = false;

    setIsRunning(true);
    setStage('watchdog');
    setStatus('Running Bulk Initial Pull...');
    setProgress(1);
    addLog('--- PIPELINE START ---', 'system');

    try {
      // -----------------------------
      // 0) WATCHDOG BULK RUN + INTERNAL EXPORT
      // -----------------------------
      const { allRows } = await runWatchdogAndExportRows();

      if (stopRef.current) throw new Error('Stopped by user.');

      // Validate column settings exist (settings are preset; can be changed in Settings page)
      // (This is runtime validation only; does not modify settings.)
      const hasDedup = allRows.length ? Object.prototype.hasOwnProperty.call(allRows[0], dedupColumn) : false;
      const hasFilter = allRows.length ? Object.prototype.hasOwnProperty.call(allRows[0], filterColumn) : false;
      const hasUrl = allRows.length ? Object.prototype.hasOwnProperty.call(allRows[0], urlColumn) : false;

      if (!hasDedup) throw new Error(`Deduplicate column not found in bulk initial pull export: "${dedupColumn}"`);
      if (!hasFilter) throw new Error(`Category Filter column not found in bulk initial pull export: "${filterColumn}"`);
      if (!hasUrl) throw new Error(`URL column not found in bulk initial pull export: "${urlColumn}"`);

      // -----------------------------
      // 1) DEDUPLICATE
      // -----------------------------
      setStage('dedup');
      setStatus('Deduplicating CSV...');
      setProgress(35);

      const keywordColumn = 'keyword';
      const keywordColumns = getKeywordColumns(allRows);
      const keywordColumnsToUse = keywordColumns.length ? keywordColumns : [keywordColumn];
      const seen = new Set();
      const deduped = [];
      const dedupedMap = new Map();
      let maxKeywords = 0;
      let dupRemoved = 0;

      for (const row of allRows) {
        if (stopRef.current) throw new Error('Stopped by user.');
        const key = safeToString(row[dedupColumn]).trim();
        const rowKeywords = extractKeywordsFromRow(row, keywordColumnsToUse);
        if (seen.has(key)) {
          dupRemoved++;
          const existing = dedupedMap.get(key);
          if (existing && rowKeywords.length) {
            rowKeywords.forEach((keyword) => existing.keywords.add(keyword));
          }
        } else {
          seen.add(key);
          const keywordSet = new Set();
          rowKeywords.forEach((keyword) => keywordSet.add(keyword));
          dedupedMap.set(key, { row: { ...row }, keywords: keywordSet });
        }
      }

      for (const { row, keywords } of dedupedMap.values()) {
        const list = Array.from(keywords);
        maxKeywords = Math.max(maxKeywords, list.length);
        const updatedRow = { ...row };
        updatedRow[keywordColumn] = list[0] || '';
        for (let i = 1; i < list.length; i += 1) {
          updatedRow[`${keywordColumn}_${i + 1}`] = list[i];
        }
        deduped.push(updatedRow);
      }

      if (maxKeywords > 1) {
        setHeaders((prev) => {
          const baseHeaders = prev.filter(
            (header) => header !== keywordColumn && !header.startsWith(`${keywordColumn}_`)
          );
          const keywordHeaders = Array.from({ length: maxKeywords }, (_, idx) =>
            idx === 0 ? keywordColumn : `${keywordColumn}_${idx + 1}`
          );
          return [...baseHeaders, ...keywordHeaders];
        });
      }

      setStats((s) => ({
        ...s,
        dedupRemoved: dupRemoved,
        afterDedup: deduped.length,
      }));
      setDedupRows(deduped);

      addLog(`Deduplicator: removed ${dupRemoved} duplicates (by "${dedupColumn}").`, dupRemoved ? 'warning' : 'success');

      // -----------------------------
      // 2) PURIFY
      // -----------------------------
      setStage('purify');
      setStatus('Purifying (removing foreign script rows)...');
      setProgress(40);

      const purified = [];
      let purifierRemoved = 0;
      const chunk = 250;

      for (let i = 0; i < deduped.length; i++) {
        if (stopRef.current) throw new Error('Stopped by user.');
        const rowObj = deduped[i];
        if (rowHasForeignScript(rowObj)) purifierRemoved++;
        else purified.push(rowObj);

        if (i % chunk === 0) {
          await sleep(0);
          const pct = 40 + (i / Math.max(1, deduped.length)) * 8; // 40 -> 48
          setProgress(Math.min(48, Math.max(40, pct)));
        }
      }

      setStats((s) => ({
        ...s,
        purifierRemoved,
        afterPurify: purified.length,
      }));
      setPurifiedRows(purified);

      addLog(
        `Foreign Language Detector: removed ${purifierRemoved} row(s) containing foreign script.`,
        purifierRemoved ? 'warning' : 'success'
      );

      // -----------------------------
      // 3) MASTER FILTER (HARD-CODED KEYWORDS)
      // -----------------------------
      setStage('filter');
      setStatus('Category Filtering (hard-coded keywords)...');
      setProgress(48);

      const kept = [];
      let masterFilterRemoved = 0;

      if (matchMode === 'contains') {
        const keywords = Array.from(allowSet);
        for (let i = 0; i < purified.length; i++) {
          if (stopRef.current) throw new Error('Stopped by user.');
          const rowObj = purified[i];
          const raw = safeToString(rowObj[filterColumn]).trim();
          const val = raw.toLowerCase();

          const hit = keywords.some((k) => k && val.includes(k));
          if (hit) kept.push(rowObj);
          else masterFilterRemoved++;

          if (i % chunk === 0) {
            await sleep(0);
            const pct = 48 + (i / Math.max(1, purified.length)) * 7; // 48 -> 55
            setProgress(Math.min(55, Math.max(48, pct)));
          }
        }
      } else {
        for (let i = 0; i < purified.length; i++) {
          if (stopRef.current) throw new Error('Stopped by user.');
          const rowObj = purified[i];
          const raw = safeToString(rowObj[filterColumn]).trim();
          const val = raw.toLowerCase();

          if (allowSet.has(val)) kept.push(rowObj);
          else masterFilterRemoved++;

          if (i % chunk === 0) {
            await sleep(0);
            const pct = 48 + (i / Math.max(1, purified.length)) * 7; // 48 -> 55
            setProgress(Math.min(55, Math.max(48, pct)));
          }
        }
      }

      setStats((s) => ({
        ...s,
        masterFilterRemoved,
        afterMasterFilter: kept.length,
      }));
      setFilteredRows(kept);

      addLog(
        `Category Filter: kept ${kept.length}, removed ${masterFilterRemoved} (column "${filterColumn}", mode "${matchMode}").`,
        kept.length ? 'success' : 'warning'
      );

      if (kept.length === 0) {
        throw new Error('Category Filter produced 0 rows. Nothing to send to Apify.');
      }

      // -----------------------------
      // 4) APIFY RUNNER (PAGES SCRAPER)
      // -----------------------------
      setStage('apify');
      setStatus('Running Apify batches...');
      setProgress(55);

      const apifyKeywordColumns = getKeywordColumns(kept);
      const urlKeywordMap = buildUrlKeywordMap(kept, apifyKeywordColumns);
      const allUrls = urlKeywordMap.size ? Array.from(urlKeywordMap.keys()) : extractUrls(kept);
      setStats((s) => ({ ...s, urlsForApify: allUrls.length }));

      if (!allUrls.length) throw new Error(`No URLs detected in column "${urlColumn}".`);

      addLog(`Apify: extracted ${allUrls.length} URL(s) from "${urlColumn}".`, 'info');

      const chunkSize = 10;
      const batches = [];
      for (let i = 0; i < allUrls.length; i += chunkSize) batches.push(allUrls.slice(i, i + chunkSize));

      setBatchProgress({ total: batches.length, completed: 0, active: 0 });
      setStats((s) => ({ ...s, batchesTotal: batches.length }));

      const maxConcurrent = Math.max(1, watchdogMaxConcurrency);

      addLog(`Apify: splitting into ${batches.length} batch(es) (max 10 URLs/batch).`, 'info');
      addLog(`Apify: queue configured for max ${maxConcurrent} concurrent runs.`, 'info');
      const results = [];
      const executing = [];

      for (let i = 0; i < batches.length; i++) {
        if (stopRef.current) throw new Error('Stopped by user.');
        const batch = batches[i];

        setBatchProgress((prev) => ({ ...prev, active: prev.active + 1 }));

        const p = runSingleBatch(batch, i).then((dsId) => {
          setBatchProgress((prev) => ({
            ...prev,
            completed: prev.completed + 1,
            active: Math.max(0, prev.active - 1),
          }));
          return dsId;
        });

        results.push(p);
        executing.push(p);

        const cleanup = () => executing.splice(executing.indexOf(p), 1);
        p.then(cleanup).catch(cleanup);

        if (executing.length >= maxConcurrent) {
          addLog(`Apify: concurrency limit reached (${maxConcurrent}). Waiting for a slot...`, 'warning');
          await Promise.race(executing);
        }
      }

      const finalIds = await Promise.all(results);
      const validIds = finalIds.filter((id) => id !== null);

      const batchesSucceeded = validIds.length;
      const batchesFailed = batches.length - batchesSucceeded;

      setStats((s) => ({ ...s, batchesSucceeded, batchesFailed }));

      if (!validIds.length) throw new Error('All Apify batches failed. Check logs.');

      addLog(`Apify: all batches finished. ${batchesSucceeded}/${batches.length} successful.`, 'success');

      // -----------------------------
      // 5) FETCH DATASETS
      // -----------------------------
      setStage('fetch');
      setStatus('Fetching Apify datasets...');
      setProgress(80);

      addLog(`Fetching dataset items from ${validIds.length} dataset(s)...`, 'info');

      let allItems = [];

      for (let i = 0; i < validIds.length; i++) {
        if (stopRef.current) throw new Error('Stopped by user.');
        const dsId = validIds[i];
        const res = await apifyRequest({
          path: `/v2/datasets/${dsId}/items`,
          query: { format: 'json' },
        });
        if (res.ok) {
          const items = res.data;
          if (Array.isArray(items) && items.length) {
            const enriched = items.map((item) => {
              const matchedUrl = resolveItemUrl(item, urlKeywordMap);
              const keywords = matchedUrl ? Array.from(urlKeywordMap.get(matchedUrl) || []) : [];
              const enrichedItem = { ...item };

              if (apifyKeywordColumns.length > 0) {
                apifyKeywordColumns.forEach((col, idx) => {
                  enrichedItem[col] = keywords[idx] || '';
                });
              }

              return enrichedItem;
            });

            allItems = allItems.concat(enriched);
          }
          addLog(`Dataset ${i + 1}/${validIds.length}: ${Array.isArray(items) ? items.length : 0} item(s).`, 'info');
        } else {
          addLog(`Failed to fetch dataset ${dsId} (${res.status}).`, 'error');
        }

        const pct = 80 + ((i + 1) / validIds.length) * 10; // 80 -> 90
        setProgress(Math.min(90, Math.max(80, pct)));
        await sleep(0);
      }

      if (!allItems.length) throw new Error('No data found in datasets.');

      setStats((s) => ({ ...s, apifyItems: allItems.length }));
      addLog(`Apify: merged ${allItems.length} total record(s).`, 'success');

      // -----------------------------
      // 6) AU NUMBER SORTER
      // -----------------------------
      setStage('sort');
      setStatus('Sorting Australian numbers...');
      setProgress(92);

      const allKeys = [];
      const keySet = new Set();
      for (const it of allItems) {
        for (const k of Object.keys(it || {})) {
          if (!keySet.has(k)) {
            keySet.add(k);
            allKeys.push(k);
          }
        }
      }

      if (apifyKeywordColumns.length > 0) {
        for (const col of apifyKeywordColumns) {
          if (!keySet.has(col)) {
            keySet.add(col);
            allKeys.push(col);
          }
        }
      }

      const guessedPhoneCol =
        allKeys.find((h) => /phone|mobile|cell/i.test(h)) || allKeys.find((h) => /contact/i.test(h)) || 'Phone';

      if (!keySet.has(guessedPhoneCol)) {
        allKeys.push(guessedPhoneCol);
        keySet.add(guessedPhoneCol);
      }

      const mobileList = [];
      const landlineList = [];
      const otherList = [];

      const sortChunk = 250;

      for (let idx = 0; idx < allItems.length; idx++) {
        if (stopRef.current) throw new Error('Stopped by user.');
        const row = allItems[idx] || {};

        const uniqueMobilesFound = new Set();
        for (const k of Object.keys(row)) {
          const cellVal = safeToString(row[k]);
          const matches = findMatches(cellVal, RX_MOBILE);
          for (const m of matches) uniqueMobilesFound.add(m);
        }

        if (uniqueMobilesFound.size > 0) {
          const existingMasterVal = safeToString(row[guessedPhoneCol] || '');
          let newMasterVal = existingMasterVal;

          uniqueMobilesFound.forEach((num) => {
            if (!existingMasterVal.includes(num)) {
              newMasterVal = newMasterVal ? `${newMasterVal}, ${num}` : num;
            }
          });

          mobileList.push({ ...row, [guessedPhoneCol]: newMasterVal });
        } else {
          let hasLandline = false;
          for (const k of Object.keys(row)) {
            const cellVal = safeToString(row[k]);
            const geoMatches = findMatches(cellVal, RX_LANDLINE_GEO);
            const bizMatches = findMatches(cellVal, RX_LANDLINE_BIZ);
            if (geoMatches.length > 0 || bizMatches.length > 0) {
              hasLandline = true;
              break;
            }
          }
          if (hasLandline) landlineList.push(row);
          else otherList.push(row);
        }

        if (idx % sortChunk === 0) {
          await sleep(0);
          const pct = 92 + (idx / Math.max(1, allItems.length)) * 6; // 92 -> 98
          setProgress(Math.min(98, Math.max(92, pct)));
        }
      }

      setStats((s) => ({
        ...s,
        sorterMobile: mobileList.length,
        sorterLandline: landlineList.length,
        sorterOther: otherList.length,
      }));

      addLog(
        `Number Sorter: mobiles ${mobileList.length}, landlines ${landlineList.length}, others ${otherList.length}.`,
        'success'
      );

      // -----------------------------
      // 7) READY TO DOWNLOAD
      // -----------------------------
      setStage('done');
      setStatus('Complete. Ready to download final spreadsheet.');
      setProgress(100);

      setFinalWorkbook({
        headers: allKeys,
        fileBaseName: sourceBaseName || 'pipeline',
        sheets: [
          { name: 'Mobiles', rows: mobileList },
          { name: 'Landlines', rows: landlineList },
          { name: 'Others', rows: otherList },
        ],
      });

      addLog('--- PIPELINE COMPLETE ---', 'success');
    } catch (err) {
      setStage('error');
      setStatus(stopRef.current ? 'Stopped.' : 'Pipeline failed.');
      setError(err.message || 'Pipeline failed.');
      setProgress(0);
      addLog(`PIPELINE ERROR: ${err.message}`, 'error');
    } finally {
      stopRef.current = false;
      setIsRunning(false);
    }
  }, [
    abortWatchdogJob,
    addLog,
    allowSet,
    apifyRequest,
    buildUrlKeywordMap,
    dedupColumn,
    extractUrls,
    filterColumn,
    getKeywordColumns,
    matchMode,
    resolveItemUrl,
    runSingleBatch,
    runWatchdogAndExportRows,
    sourceBaseName,
    urlColumn,
    setDedupRows,
    setFilteredRows,
    setPurifiedRows,
    watchdogMaxConcurrency,
  ]);

  /**
   * ============================================================
   *  DOWNLOAD FINAL
   * ============================================================
   */
  const downloadFinalSpreadsheet = useCallback(() => {
    if (!finalWorkbook) return;

    const xlsxData = buildXlsxFile(finalWorkbook);
    const date = new Date().toISOString().slice(0, 10);
    const filename = `${finalWorkbook.fileBaseName || 'pipeline'}_Sorted_${date}.xlsx`;

    const blob = new Blob([xlsxData], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    downloadBlob(blob, filename);

    addLog(`Downloaded: ${filename}`, 'success');
  }, [addLog, finalWorkbook]);

  /**
   * ============================================================
   *  WATCHDOG UI STATS (FOR TABLE + SUMMARY)
   * ============================================================
   */
  const watchdogUiStats = useMemo(() => {
    const j = watchdogJobs || [];
    return {
      total: j.length,
      pending: j.filter((x) => x.status === 'PENDING').length,
      retrying: j.filter((x) => x.status === 'PENDING_RETRY').length,
      running: j.filter((x) => x.status === 'RUNNING' || x.status === 'STARTING').length,
      succeeded: j.filter((x) => x.status === 'SUCCEEDED').length,
      abortedFailed: j.filter((x) => x.status === 'ABORTED' || x.status === 'FAILED').length,
    };
  }, [watchdogJobs]);

  const showWelcomeOverlay = welcomePhase !== 'idle' && welcomePhase !== 'done';
  const welcomeOverlayClassName = [
    'welcomeOverlay',
    welcomePhase === 'fade-in' ? 'fade-in' : '',
    welcomePhase === 'fade-out' ? 'fade-out' : '',
    welcomePhase === 'typing' || welcomePhase === 'hold' ? 'is-visible' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (!authState.authenticated) {
    return (
      <div className="pipelineShell authShell" data-theme={theme}>
        <GlobalStyles />
        <div className="authSplineFrame" aria-hidden="true">
          <iframe
            title="Reactive Orb background"
            src="https://my.spline.design/reactiveorb-3gF6RAL6Ew7QKrNvj2iYlMvu/"
            loading="eager"
            referrerPolicy="no-referrer"
            allow="autoplay; fullscreen"
          />
        </div>
        {(authState.loading || authState.error) && (
          <div className="authNotice" role="status" aria-live="polite">
            {authState.loading && <div className="authStatus">Checking authentication…</div>}
            {authState.error && <div className="authError">{authState.error}</div>}
          </div>
        )}
        <div className="authLoginStack">
          <div
            className="authSplineLoginHitbox"
            role="button"
            tabIndex={0}
            onClick={handleLoginClick}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleLoginClick();
              }
            }}
            aria-label="Sign in with Google"
          >
            <div className="authGoogleButton" ref={googleButtonRef} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pipelineShell" data-theme={theme}>
      <GlobalStyles />
      {showWelcomeOverlay && (
        <div className={welcomeOverlayClassName} aria-live="polite" aria-label="Welcome message">
          <div className="welcomeOverlayText">{welcomeText}</div>
        </div>
      )}

      {/* SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />

      {/* MAIN */}
      <section className="main">
        {/* Top Header */}
        <TopHeader
          activeTab={activeTab}
          stage={stage}
          isRunning={isRunning}
          stopPipeline={stopPipeline}
          resetAll={resetAll}
          downloadFinalSpreadsheet={downloadFinalSpreadsheet}
          finalWorkbook={finalWorkbook}
        />

        {/* Progress */}
        <ProgressBar
          status={status}
          watchdogExporting={watchdogExporting}
          watchdogExportStatus={watchdogExportStatus}
          progress={progress}
          batchProgress={batchProgress}
          stage={stage}
        />

        {/* Workspace */}
        <main className="workspace">
          <div className="container">
            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <SettingsPanel
                headers={headers}
                isRunning={isRunning}
                dedupColumn={dedupColumn}
                setDedupColumn={setDedupColumn}
                filterColumn={filterColumn}
                setFilterColumn={setFilterColumn}
                urlColumn={urlColumn}
                setUrlColumn={setUrlColumn}
                matchMode={matchMode}
                setMatchMode={setMatchMode}
                presetDedupColumn={PRESET_DEDUP_COLUMN}
                presetFilterColumn={PRESET_FILTER_COLUMN}
                presetUrlColumn={PRESET_URL_COLUMN}
                presetMatchMode={PRESET_MATCH_MODE}
              />
            )}

            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <DashboardPanel
                watchdogKeywordsInput={watchdogKeywordsInput}
                setWatchdogKeywordsInput={setWatchdogKeywordsInput}
                watchdogCountry={watchdogCountry}
                setWatchdogCountry={setWatchdogCountry}
                watchdogActiveStatus={watchdogActiveStatus}
                setWatchdogActiveStatus={setWatchdogActiveStatus}
                watchdogMinDate={watchdogMinDate}
                setWatchdogMinDate={setWatchdogMinDate}
                watchdogMaxDate={watchdogMaxDate}
                setWatchdogMaxDate={setWatchdogMaxDate}
                dateViolationEnabled={dateViolationEnabled}
                setDateViolationEnabled={setDateViolationEnabled}
                dateViolationStreakLimit={dateViolationStreakLimit}
                setDateViolationStreakLimit={setDateViolationStreakLimit}
                defaultDateViolationStreakLimit={DEFAULT_DATE_VIOLATION_STREAK_LIMIT}
                watchdogMaxItems={watchdogMaxItems}
                setWatchdogMaxItems={setWatchdogMaxItems}
                watchdogMaxConcurrency={watchdogMaxConcurrency}
                setWatchdogMaxConcurrency={setWatchdogMaxConcurrency}
                watchdogMaxRuntime={watchdogMaxRuntime}
                setWatchdogMaxRuntime={setWatchdogMaxRuntime}
                memory={memory}
                setMemory={setMemory}
                isRunning={isRunning}
                runPipeline={runPipeline}
                logs={logs}
                logRef={logRef}
                stats={stats}
                filteredOutTotal={filteredOutTotal}
                keywordCount={keywordCount}
                downloadCsvSnapshot={downloadCsvSnapshot}
                rows={rows}
                dedupRows={dedupRows}
                purifiedRows={purifiedRows}
                filteredRows={filteredRows}
                dedupColumn={dedupColumn}
                filterColumn={filterColumn}
                finalWorkbook={finalWorkbook}
                downloadFinalSpreadsheet={downloadFinalSpreadsheet}
                error={error}
                stage={stage}
                watchdogUiStats={watchdogUiStats}
                watchdogJobs={watchdogJobs}
                abortWatchdogJob={abortWatchdogJob}
              />
            )}
          </div>
        </main>

        {/* Source markers (comment only):
            Watchdog functionality: :contentReference[oaicite:0]{index=0}
            Visual/layout reference: :contentReference[oaicite:1]{index=1}
        */}
      </section>
    </div>
  );
}
