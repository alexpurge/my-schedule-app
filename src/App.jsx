import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Download,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Filter,
  Facebook,
  Play,
  Loader2,
  AlertTriangle,
  Layers,
  FileDown,
  X,
  Settings,
  Square,
  Moon,
  Sun,
} from 'lucide-react';

/**
 * ============================================================
 *  UI STYLE (SAME APP LOOK) + SUBTLE SHADOWS (PER REQUEST)
 *  - Only shadow intensity changed (reduced)
 *  - Adds Settings page + keeps layout identical otherwise
 * ============================================================
 */
const GlobalStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root{
  --bg-canvas: #0d0d0d;
  --bg-sidebar: #050505;
  --bg-surface: #111111;
  --bg-input: #0a0a0a;
  --border-color: #262626;

  --text-main: #ffffff;
  --text-muted: #a3a3a3;
  --text-subtle: #52525b;

  --color-primary: #f97316;

  --radius-xl: 18px;
  --radius-lg: 14px;
  --radius-md: 12px;

  /* ✅ Subtle shadows (reduced intensity) */
  --shadow-xl: 0 14px 34px rgba(0,0,0,.24);
  --shadow-lg: 0 10px 26px rgba(0,0,0,.20);
  --shadow-md: 0 8px 18px rgba(0,0,0,.16);
}

[data-theme='light']{
  --bg-canvas: #f8fafc;
  --bg-sidebar: #ffffff;
  --bg-surface: #ffffff;
  --bg-input: #f1f5f9;
  --border-color: #e2e8f0;

  --text-main: #0f172a;
  --text-muted: #64748b;
  --text-subtle: #94a3b8;

  /* ✅ Subtle shadows for light mode */
  --shadow-xl: 0 14px 34px rgba(15,23,42,.10);
  --shadow-lg: 0 10px 26px rgba(15,23,42,.08);
  --shadow-md: 0 8px 18px rgba(15,23,42,.06);
}

*{ box-sizing: border-box; }
html, body { height: 100%; }
body{
  background: var(--bg-canvas);
  color: var(--text-main);
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
  transition: background-color .45s cubic-bezier(.4,0,.2,1), color .45s cubic-bezier(.4,0,.2,1);
}
div, button, input, span, svg, textarea, select{
  transition-property: background-color, border-color, color, fill, stroke, box-shadow, transform, opacity;
  transition-duration: .25s;
  transition-timing-function: ease-in-out;
}

::-webkit-scrollbar{ width: 6px; height: 6px; }
::-webkit-scrollbar-track{ background: transparent; }
::-webkit-scrollbar-thumb{ background: var(--text-subtle); border-radius: 3px; opacity: .5; }
::-webkit-scrollbar-thumb:hover{ background: var(--text-muted); }

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active{
  -webkit-box-shadow: 0 0 0 30px var(--bg-input) inset !important;
  -webkit-text-fill-color: var(--text-main) !important;
  transition: background-color 5000s ease-in-out 0s;
}

.pipelineShell{
  width: 100vw;
  height: 100vh;
  display:flex;
  background: var(--bg-canvas);
  color: var(--text-main);
  overflow: hidden;
}

.sidebar{
  width: 260px;
  flex-shrink: 0;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  display:flex;
  flex-direction: column;
  z-index: 20;
}

.brand{
  height: 72px;
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 0 22px;
  border-bottom: 1px solid var(--border-color);
}
.brandLogo{
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display:flex;
  align-items:center;
  justify-content:center;
  background: transparent;
}
.brandLogoImage{
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.brandTitle{
  font-weight: 800;
  letter-spacing: -0.02em;
  font-size: 18px;
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}
.brandTitleStrong{
  font-weight: 900;
}
.brandTitleLight{
  font-weight: 600;
  color: var(--text-subtle);
}
.brandSub{
  color: var(--text-subtle);
  font-weight: 600;
  margin-left: 2px;
}

.nav{
  padding: 18px 0;
  flex: 1;
}
.navSection{
  padding: 0 22px 10px;
  font-size: 10px;
  font-weight: 900;
  color: var(--text-subtle);
  letter-spacing: .12em;
  text-transform: uppercase;
}
.navItem{
  position: relative;
  width: 100%;
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 12px 22px;
  border: 0;
  background: transparent;
  color: var(--text-muted);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
}
.navItem:hover{
  color: var(--text-main);
  background: rgba(255,255,255,.03);
}
[data-theme='light'] .navItem:hover{
  background: rgba(15,23,42,.04);
}
.navItemActive{
  color: var(--text-main);
}
.navItemActive::before{
  content:'';
  position:absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 4px;
  border-radius: 0 8px 8px 0;
  background: var(--color-primary);
  box-shadow: 0 0 8px rgba(249,115,22,.35);
}
.navItemActive::after{
  content:'';
  position:absolute;
  inset:0;
  background: linear-gradient(90deg, rgba(17,17,17,.55), transparent);
  opacity: .55;
  z-index: -1;
}
[data-theme='light'] .navItemActive::after{
  background: linear-gradient(90deg, rgba(241,245,249,.75), transparent);
}
.navIcon{
  width: 18px;
  height: 18px;
  color: var(--text-subtle);
}
.navItemActive .navIcon{
  color: var(--color-primary);
}
.navLabel{
  display:flex;
  align-items:center;
  gap: 8px;
}

.sidebarFooter{
  padding: 14px;
  border-top: 1px solid var(--border-color);
}
.profileCard{
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 10px;
  border-radius: var(--radius-lg);
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  box-shadow: 0 6px 14px rgba(0,0,0,.12); /* ✅ reduced */
}
.avatar{
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: #1f2937;
  display:flex;
  align-items:center;
  justify-content:center;
  color: white;
  font-weight: 900;
  font-size: 12px;
  flex-shrink: 0;
}
[data-theme='light'] .avatar{ background: #0f172a; }
.profileMeta{ min-width: 0; flex: 1; }
.profileName{
  font-size: 12px;
  font-weight: 800;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.profileSub{
  font-size: 10px;
  color: var(--text-subtle);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.themeBtn{
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--bg-canvas);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  cursor: pointer;
  display:flex;
  align-items:center;
  justify-content:center;
}
.themeBtn:hover{
  color: var(--color-primary);
  border-color: rgba(249,115,22,.5);
}

.main{
  flex: 1;
  display:flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-canvas);
}

.topHeader{
  height: 64px;
  border-bottom: 1px solid var(--border-color);
  display:flex;
  align-items:center;
  justify-content: space-between;
  padding: 0 28px;
  background: color-mix(in srgb, var(--bg-canvas) 92%, transparent);
  backdrop-filter: blur(10px);
  z-index: 10;
}
.headerLeft{
  display:flex;
  align-items:center;
  gap: 14px;
  min-width: 0;
}
.headerTitle{
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--text-main);
  white-space: nowrap;
}
.headerSep{
  width: 1px;
  height: 22px;
  background: var(--border-color);
}
.headerRight{
  display:flex;
  align-items:center;
  gap: 10px;
}

.pill{
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
  display:inline-flex;
  align-items:center;
  gap: 8px;
}
.pillDot{
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--text-subtle);
}
.pillSuccess{
  border-color: rgba(16,185,129,.25);
  background: rgba(16,185,129,.10);
  color: #10b981;
}
.pillSuccess .pillDot{ background:#10b981; box-shadow: 0 0 8px rgba(16,185,129,.18); }

.pillRunning{
  border-color: rgba(59,130,246,.25);
  background: rgba(59,130,246,.10);
  color: #3b82f6;
}
.pillRunning .pillDot{ background:#3b82f6; box-shadow: 0 0 8px rgba(59,130,246,.18); }

.pillProcessing{
  border-color: rgba(249,115,22,.25);
  background: rgba(249,115,22,.10);
  color: var(--color-primary);
}
.pillProcessing .pillDot{ background: var(--color-primary); box-shadow: 0 0 8px rgba(249,115,22,.18); }

.pillAttention{
  border-color: rgba(245,158,11,.25);
  background: rgba(245,158,11,.10);
  color: #f59e0b;
}
.pillAttention .pillDot{ background:#f59e0b; box-shadow: 0 0 8px rgba(245,158,11,.18); }

.btn{
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-main);
  border-radius: 14px;
  padding: 9px 12px;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
  display:inline-flex;
  align-items:center;
  gap: 8px;
  cursor:pointer;
  box-shadow: 0 6px 14px rgba(0,0,0,.12); /* ✅ reduced */
}
.btn:hover{
  border-color: rgba(249,115,22,.6);
  color: var(--color-primary);
}
.btn:disabled{
  opacity: .5;
  cursor:not-allowed;
  box-shadow: none;
}
.btnSmall{
  padding: 7px 10px;
  font-size: 10px;
  letter-spacing: .06em;
}
.btnSmall svg{
  width: 14px;
  height: 14px;
}
.btnPrimary{
  border-color: rgba(249,115,22,.35);
  background: var(--color-primary);
  color: white;
  box-shadow: 0 0 16px rgba(249,115,22,.22); /* ✅ reduced */
}
.btnPrimary:hover{
  filter: brightness(.98);
  color: white;
  border-color: rgba(249,115,22,.6);
}
.btnDanger:hover{
  border-color: rgba(239,68,68,.55);
  color: #ef4444;
}

.toggleRow{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
}
.toggleMeta{
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.toggleLabel{
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.toggleHint{
  font-size: 11px;
  color: var(--text-subtle);
}
.switch{
  position: relative;
  width: 48px;
  height: 26px;
  flex-shrink: 0;
}
.switch input{
  opacity: 0;
  width: 0;
  height: 0;
}
.switchSlider{
  position: absolute;
  inset: 0;
  background: var(--text-subtle);
  border-radius: 999px;
  cursor: pointer;
  transition: background .2s ease;
}
.switchSlider::before{
  content: '';
  position: absolute;
  height: 20px;
  width: 20px;
  left: 3px;
  top: 3px;
  background: #ffffff;
  border-radius: 50%;
  transition: transform .2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,.25);
}
.switch input:checked + .switchSlider{
  background: var(--color-primary);
}
.switch input:checked + .switchSlider::before{
  transform: translateX(22px);
}

.progressWrap{
  padding: 14px 28px 0;
}
.progressTop{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 12px;
}
.progressStatus{
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
}
.progressPct{
  color: var(--text-subtle);
  font-size: 11px;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace;
}
.progressTrack{
  margin-top: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  overflow:hidden;
}
.progressFill{
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, var(--color-primary), rgba(249,115,22,.55));
  transition: width .25s ease;
}

.workspace{
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px 28px;
}
.container{
  width: min(1280px, 100%);
  margin: 0 auto;
}

.grid{
  display:grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 18px;
}
.leftCol{ grid-column: span 12; }
.rightCol{ grid-column: span 12; }

@media (min-width: 1024px){
  .leftCol{ grid-column: span 4; }
  .rightCol{ grid-column: span 8; }
}

.card{
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 22px;
  box-shadow: var(--shadow-md); /* ✅ reduced via variables */
  overflow:hidden;
}
.cardHeader{
  padding: 14px 18px;
  border-bottom: 1px solid var(--border-color);
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 12px;
}
.cardHeaderTitle{
  display:flex;
  align-items:center;
  gap: 10px;
  font-weight: 900;
  font-size: 12px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.cardBody{
  padding: 18px;
}
.cardAccent{
  border-color: rgba(249,115,22,.30);
  box-shadow: var(--shadow-lg); /* ✅ reduced via variables */
  position: relative;
}
.cardAccent::before{
  content:'';
  position:absolute;
  top:0; left:0; bottom:0;
  width: 4px;
  background: var(--color-primary);
}

.label{
  display:block;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-subtle);
  margin: 0 0 8px 6px;
}
.input, .select, .textarea{
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  border-radius: var(--radius-lg);
  padding: 10px 12px;
  font-size: 13px;
  outline: none;
}
.textarea{
  resize: none;
  min-height: 140px;
  line-height: 1.35;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace;
  font-size: 11px;
}
.input::placeholder, .textarea::placeholder{ color: var(--text-subtle); }
.input:focus, .select:focus, .textarea:focus{
  border-color: rgba(249,115,22,.65);
  box-shadow: 0 0 0 3px rgba(249,115,22,.14);
}

.smallNote{
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 16px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.4;
}
.smallNote b{ color: var(--text-main); }

.tiles{
  display:grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 12px;
}
@media (max-width: 860px){
  .tiles{ grid-template-columns: 1fr; }
}
.tile{
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  padding: 14px;
}
.tileK{
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.tileV{
  margin-top: 8px;
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--text-main);
}
.tileV.orange{ color: var(--color-primary); }
.tileV.red{ color: #ef4444; }
.tileSub{
  margin-top: 6px;
  font-size: 10px;
  color: var(--text-subtle);
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace;
}

.breakGrid{
  margin-top: 14px;
  display:grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 12px;
}
@media (max-width: 860px){
  .breakGrid{ grid-template-columns: 1fr; }
}
.breakItem{
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  padding: 14px;
}
.breakH{
  font-weight: 900;
  color: var(--text-main);
  font-size: 13px;
  margin-bottom: 10px;
}
.breakLine{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
  color: var(--text-muted);
  font-size: 11px;
}
.mono{
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","CourierNew", monospace;
  color: var(--text-main);
}

.sortPills{
  margin-top: 12px;
  display:grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 10px;
}
@media (max-width: 560px){
  .sortPills{ grid-template-columns: 1fr; }
}
.sortPill{
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  padding: 12px;
}
.sortK{
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.sortV{
  margin-top: 8px;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--text-main);
}

.console{
  height: 260px;
  display:flex;
  flex-direction: column;
}
.consoleBody{
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  background: var(--bg-input);
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","CourierNew", monospace;
  font-size: 11px;
  line-height: 1.45;
}
.logLine{
  display:flex;
  gap: 10px;
  margin: 2px 0;
  word-break: break-word;
}
.logTime{
  color: var(--text-subtle);
  flex-shrink: 0;
  user-select: none;
}
.logMsg{ color: var(--text-muted); }
.logMsg.info{ color: var(--text-muted); }
.logMsg.success{ color: #10b981; }
.logMsg.warning{ color: #f59e0b; }
.logMsg.error{ color: #fb7185; }
.logMsg.system{ color: rgba(249,115,22,.85); }

.notice{
  margin-top: 12px;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid rgba(239,68,68,.25);
  background: rgba(239,68,68,.08);
  display:flex;
  gap: 10px;
  align-items:flex-start;
}
.notice.ok{
  border-color: rgba(16,185,129,.25);
  background: rgba(16,185,129,.08);
}
.noticeTitle{
  font-weight: 900;
  font-size: 12px;
  color: var(--text-main);
}
.noticeDesc{
  margin-top: 4px;
  font-size: 11px;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","CourierNew", monospace;
}

.tableWrap{
  overflow:auto;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
}
.table{
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.th, .td{
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255,255,255,.04);
  text-align: left;
  vertical-align: top;
}
[data-theme='light'] .th, [data-theme='light'] .td{
  border-bottom: 1px solid rgba(15,23,42,.06);
}
.th{
  font-size: 10px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-subtle);
  background: color-mix(in srgb, var(--bg-input) 88%, transparent);
  position: sticky;
  top: 0;
  z-index: 1;
}
.badge{
  display:inline-flex;
  align-items:center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-muted);
}
.badge.running{ border-color: rgba(59,130,246,.25); background: rgba(59,130,246,.10); color: #3b82f6; }
.badge.success{ border-color: rgba(16,185,129,.25); background: rgba(16,185,129,.10); color: #10b981; }
.badge.warn{ border-color: rgba(245,158,11,.25); background: rgba(245,158,11,.10); color: #f59e0b; }
.badge.fail{ border-color: rgba(239,68,68,.25); background: rgba(239,68,68,.10); color: #ef4444; }
.badge.pending{ border-color: rgba(148,163,184,.25); background: rgba(148,163,184,.10); color: var(--text-subtle); }

.spin{ animation: spin 1s linear infinite; }
@keyframes spin{ to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce){
  .spin{ animation: none; }
  .progressFill{ transition: none; }
}
      `,
    }}
  />
);

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

const buildExcelXmlWorkbook = ({ sheets, headers, fileBaseName }) => {
  const xmlHeader = `<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>`;

  const styles = `
    <Styles>
      <Style ss:ID="Default" ss:Name="Normal">
        <Alignment ss:Vertical="Bottom"/>
        <Borders/>
        <Font/>
        <Interior/>
        <NumberFormat/>
        <Protection/>
      </Style>
      <Style ss:ID="sHeader">
        <Font ss:Bold="1"/>
        <Interior ss:Color="#E5E7EB" ss:Pattern="Solid"/>
      </Style>
    </Styles>
  `.trim();

  const worksheetXml = sheets
    .map(({ name, rows }) => {
      const sheetName = sanitizeSheetName(name);

      const headerRow =
        `<Row>` +
        headers
          .map((h) => `<Cell ss:StyleID="sHeader"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`)
          .join('') +
        `</Row>`;

      const bodyRows = rows
        .map((row) => {
          const cells = headers
            .map((h) => `<Cell><Data ss:Type="String">${escapeXml(safeToString(row[h]))}</Data></Cell>`)
            .join('');
          return `<Row>${cells}</Row>`;
        })
        .join('');

      return `
        <Worksheet ss:Name="${escapeXml(sheetName)}">
          <Table>
            ${headerRow}
            ${bodyRows}
          </Table>
        </Worksheet>
      `.trim();
    })
    .join('\n');

  const workbook = `
    <Workbook
      xmlns="urn:schemas-microsoft-com:office:spreadsheet"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
      xmlns:html="http://www.w3.org/TR/REC-html40"
    >
      <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
        <Author>Local Pipeline</Author>
        <LastAuthor>Local Pipeline</LastAuthor>
        <Created>${new Date().toISOString()}</Created>
        <Company>${escapeXml(fileBaseName || 'Pipeline')}</Company>
        <Version>16.00</Version>
      </DocumentProperties>
      ${styles}
      ${worksheetXml}
    </Workbook>
  `.trim();

  return `${xmlHeader}\n${workbook}`;
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

const StatusPill = ({ stage, isRunning }) => {
  let label = 'IDLE';
  let cls = '';

  if (stage === 'done') {
    label = 'SUCCEEDED';
    cls = 'pillSuccess';
  } else if (stage === 'error') {
    label = 'FAILED';
    cls = 'pillAttention';
  } else if (isRunning && (stage === 'watchdog' || stage === 'apify' || stage === 'fetch')) {
    label = 'RUNNING';
    cls = 'pillRunning';
  } else if (isRunning) {
    label = 'PROCESSING';
    cls = 'pillProcessing';
  } else if (stage === 'ready') {
    label = 'READY';
    cls = 'pillRunning';
  } else {
    label = 'IDLE';
    cls = '';
  }

  return (
    <div className={`pill ${cls}`}>
      <span className="pillDot" />
      {label}
    </div>
  );
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
   *  APIFY AUTH (UNCHANGED)
   * ============================================================
   */
  const [apiToken, setApiToken] = useState('');
  const [memory, setMemory] = useState(4096);
  const [customProxy, setCustomProxy] = useState('');

  /**
   * ============================================================
   *  WATCHDOG CONFIG (NEW STEP 1)
   *  (Functionality preserved from your Watchdog app; UI adapted)
   * ============================================================
   */
  const [watchdogActorId, setWatchdogActorId] = useState(WATCHDOG_DEFAULT_ACTOR_ID);
  const [watchdogProxyType, setWatchdogProxyType] = useState('apify'); // apify | custom
  const [watchdogKeywordsInput, setWatchdogKeywordsInput] = useState('');
  const [watchdogCountry, setWatchdogCountry] = useState('ALL');
  const [watchdogActiveStatus, setWatchdogActiveStatus] = useState('active');
  const [watchdogMinDate, setWatchdogMinDate] = useState('');
  const [watchdogMaxDate, setWatchdogMaxDate] = useState('');
  const [watchdogMaxItems, setWatchdogMaxItems] = useState(100);
  const [watchdogMaxRuntime, setWatchdogMaxRuntime] = useState('');
  const [watchdogMaxConcurrency, setWatchdogMaxConcurrency] = useState(5);
  const [dateViolationEnabled, setDateViolationEnabled] = useState(true);

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
  const [status, setStatus] = useState('Configure Watchdog inputs, then run.');
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
    setStatus('Configure Watchdog inputs, then run.');
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
  const abortWatchdogJob = useCallback(
    async (job, reason) => {
      if (!job?.runId) return;
      try {
        await fetch(`https://api.apify.com/v2/acts/${watchdogActorId}/runs/${job.runId}/abort?token=${apiToken}`, {
          method: 'POST',
        });
        updateWatchdogJob(job.id, { status: 'ABORTED', failReason: reason });
        addLog(`[WATCHDOG ABORT] "${job.keyword}" - ${reason}`, 'error');
      } catch (e) {
        // Preserve original behaviour: ignore abort failure silently, but we can log a warning safely
        addLog(`[WATCHDOG] Abort failed for "${job.keyword}".`, 'warning');
      }
    },
    [addLog, apiToken, updateWatchdogJob, watchdogActorId]
  );

  /**
   * ============================================================
   *  WATCHDOG: RUN + EXPORT (INTERNAL; NO DOWNLOAD; CONTINUES PIPELINE)
   *  - Functionality preserved from provided Watchdog app
   * ============================================================
   */
  const runWatchdogAndExportRows = useCallback(async () => {
    const apiKey = apiToken.trim();
    if (!apiKey) throw new Error('API Key is required!');
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

    addLog(`Watchdog Started. Queue size: ${newJobs.length}. Concurrency: ${watchdogMaxConcurrency}`, 'success');

    // Helper: retry logic (preserved)
    const handleRetryOrFail = async (job, reason) => {
      // If running on Apify, abort first
      if (job.status === 'RUNNING' && job.runId) {
        try {
          await fetch(`https://api.apify.com/v2/acts/${watchdogActorId}/runs/${job.runId}/abort?token=${apiKey}`, {
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
        proxyConfiguration:
          watchdogProxyType === 'apify'
            ? { useApifyProxy: true, apifyProxyGroups: ['RESIDENTIAL'] }
            : { useApifyProxy: false, proxyUrls: [customProxy] },
      };

      if (watchdogMinDate) inputBody.searchStartDate = watchdogMinDate;
      if (watchdogMaxDate) inputBody.searchEndDate = watchdogMaxDate;

      const options = new URLSearchParams();
      if (memory) options.append('memory', memory);
      if (watchdogMaxRuntime) options.append('timeout', parseInt(watchdogMaxRuntime) * 60);

      try {
        const tryNum = (job.retryCount || 0) + 1;
        addLog(`Starting Watchdog run for "${job.keyword}" (Attempt ${tryNum})...`, 'info');

        const response = await fetch(
          `https://api.apify.com/v2/acts/${watchdogActorId}/runs?token=${apiKey}&${options.toString()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputBody),
          }
        );

        if (!response.ok) throw new Error(`API Error ${response.status}`);

        const data = await response.json();
        updateWatchdogJob(job.id, {
          status: 'RUNNING',
          runId: data.data.id,
          datasetId: data.data.defaultDatasetId,
        });

        addLog(`Watchdog Run Started for "${job.keyword}" (ID: ${data.data.id})`, 'success');
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
          const runRes = await fetch(`https://api.apify.com/v2/acts/${watchdogActorId}/runs/${job.runId}?token=${apiKey}`);
          const runData = await runRes.json();
          const runStatus = runData?.data?.status;

          let reportedCount = runData?.data?.stats?.itemCount || 0;

          // B) dataset truth
          const datasetRes = await fetch(
            `https://api.apify.com/v2/datasets/${job.datasetId}/items?token=${apiKey}&limit=50&desc=true&clean=true`
          );
          const items = await datasetRes.json();
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
              const cutoffTime = new Date(watchdogMinDate).getTime();

              const offender = items.find((item) => {
                const { time: itemTime } = parseStartDateValue(item.start_date);
                if (!itemTime) return false;

                if (isNaN(itemTime) || isNaN(cutoffTime)) return false;
                return itemTime < cutoffTime;
              });

              if (offender) {
                const nextStreak = (job.dateViolationStreak || 0) + 1;
                const { display: offenderDate } = parseStartDateValue(offender.start_date);
                updateWatchdogJob(job.id, { dateViolationStreak: nextStreak });

                if (nextStreak >= 10) {
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
        addLog('All Watchdog jobs completed.', 'success');
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
    addLog('Watchdog Export: analyzing schema...', 'system');

    const jobsWithData = finalJobs.filter((j) => j.datasetId);
    if (jobsWithData.length === 0) {
      setWatchdogExporting(false);
      setWatchdogExportStatus('');
      throw new Error('No datasets found to export.');
    }

    // Phase 1: Discover headers (double-pass strategy) — preserved
    const masterHeaders = new Set();
    const SCHEMA_BATCH = 10;

    for (let i = 0; i < jobsWithData.length; i += SCHEMA_BATCH) {
      const batch = jobsWithData.slice(i, i + SCHEMA_BATCH);

      await Promise.all(
        batch.map(async (job) => {
          try {
            const res = await fetch(
              `https://api.apify.com/v2/datasets/${job.datasetId}/items?token=${apiKey}&limit=100&clean=false`
            );
            if (!res.ok) return;
            const items = await res.json();
            if (Array.isArray(items) && items.length > 0) {
              items.forEach((item) => {
                const flattened = flattenRecord(item);
                Object.keys(flattened).forEach((k) => masterHeaders.add(k));
              });
            }
          } catch {
            /* ignore */
          }
        })
      );

      if (stopRef.current) break;
    }

    masterHeaders.add('keywords');
    const exportedHeaders = Array.from(masterHeaders);

    setWatchdogExportStatus('Fetching dataset items...');
    addLog(`Watchdog Export: fetching datasets (${jobsWithData.length})...`, 'system');

    // Phase 2: Stream fetch (memory-safe pattern preserved; single CSV internal)
    const DATA_BATCH = 5;
    const allRows = [];
    let processedCount = 0;

    for (let i = 0; i < jobsWithData.length; i += DATA_BATCH) {
      const batch = jobsWithData.slice(i, i + DATA_BATCH);

      const batchResults = await Promise.all(
        batch.map(async (job) => {
          try {
            const res = await fetch(`https://api.apify.com/v2/datasets/${job.datasetId}/items?token=${apiKey}&clean=false`);
            if (!res.ok) return null;
            return { items: await res.json(), keyword: job.keyword };
          } catch {
            return null;
          }
        })
      );

      for (const result of batchResults) {
        if (!result || !Array.isArray(result.items)) continue;

        for (const item of result.items) {
          const rowObj = {};
          // Inject keywords column (preserved)
          const enriched = { ...item, keywords: result.keyword };
          const flattened = flattenRecord(enriched);

          for (const fieldName of exportedHeaders) {
            const val = flattened[fieldName] ?? '';
            rowObj[fieldName] = safeToString(val).replace(/\r?\n/g, ' ');
          }

          allRows.push(rowObj);
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
    if (allRows.length === 0) throw new Error('Watchdog export produced 0 rows.');

    // Store exported "CSV" (internally) as pipeline input
    setHeaders(exportedHeaders);
    setRows(allRows);
    setSourceBaseName(`watchdog_export_${new Date().toISOString().slice(0, 10)}`);

    setStats((s) => ({
      ...s,
      watchdogExportedRows: allRows.length,
      inputRows: allRows.length,
    }));

    addLog(`Watchdog Export complete: ${allRows.length} row(s).`, 'success');

    return { exportedHeaders, allRows };
  }, [
    abortWatchdogJob,
    addLog,
    allowSet,
    apiToken,
    customProxy,
    dateViolationEnabled,
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
    watchdogProxyType,
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
            useApifyProxy: false,
          },
        };

        if (customProxy.trim()) {
          inputPayload.proxyConfiguration.proxyUrls = [customProxy.trim()];
        }

        const token = encodeURIComponent(apiToken.trim());
        const startUrl = `https://api.apify.com/v2/acts/api-empire~facebook-pages-scraper/runs?token=${token}&memory=${memory}`;
        const startResponse = await fetch(startUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inputPayload),
        });

        if (!startResponse.ok) {
          const errText = await startResponse.text();
          throw new Error(`Batch ${batchIndex + 1} failed start: ${startResponse.status} - ${errText}`);
        }

        const startData = await startResponse.json();
        const runId = startData?.data?.id;
        const datasetId = startData?.data?.defaultDatasetId;

        addLog(`Batch ${batchIndex + 1} started (ID: ${(runId || '').slice(0, 8)}...)`, 'info');

        let status = 'RUNNING';
        while (status === 'RUNNING' || status === 'READY') {
          if (stopRef.current) throw new Error('Stopped by user.');
          await sleep(5000 + Math.random() * 2000);
          const statusRes = await fetch(
            `https://api.apify.com/v2/acts/api-empire~facebook-pages-scraper/runs/${runId}?token=${token}`
          );
          if (statusRes.ok) {
            const statusData = await statusRes.json();
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
    [addLog, apiToken, customProxy, memory]
  );

  const extractUrls = useCallback(
    (dataRows) => {
      const out = [];
      const seen = new Set();

      for (const row of dataRows) {
        const raw = safeToString(row[urlColumn]).trim();
        if (!raw) continue;

        const parts = raw
          .split(/[\s,]+/)
          .map((p) => p.trim())
          .filter(Boolean);

        for (const p of parts) {
          const looksLikeUrl = /^https?:\/\//i.test(p) || /facebook\.com/i.test(p);
          if (!looksLikeUrl) continue;

          let normalized = p;
          if (!/^https?:\/\//i.test(normalized) && /facebook\.com/i.test(normalized)) {
            normalized = normalized.replace(/^\/+/, '');
            normalized = `https://${normalized}`;
          }

          if (!seen.has(normalized)) {
            seen.add(normalized);
            out.push(normalized);
          }
        }
      }

      return out;
    },
    [urlColumn]
  );

  /**
   * ============================================================
   *  STOP (PRESERVES WATCHDOG "STOP ALL" FUNCTIONALITY)
   * ============================================================
   */
  const stopPipeline = useCallback(async () => {
    if (!isRunning) return;
    stopRef.current = true;
    setStatus('Stopping... aborting active Watchdog runs.');
    addLog('STOP requested by user. Attempting to abort active Watchdog runs...', 'warning');

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

    // Guard rails (NO POPUPS)
    if (!apiToken.trim()) {
      setError('Apify API Token is required.');
      setStage('error');
      setStatus('Missing Apify token.');
      return;
    }

    setIsRunning(true);
    setStage('watchdog');
    setStatus('Running Apify Bulk Watchdog...');
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

      if (!hasDedup) throw new Error(`Deduplicate column not found in Watchdog export: "${dedupColumn}"`);
      if (!hasFilter) throw new Error(`Master Filter column not found in Watchdog export: "${filterColumn}"`);
      if (!hasUrl) throw new Error(`URL column not found in Watchdog export: "${urlColumn}"`);

      // -----------------------------
      // 1) DEDUPLICATE
      // -----------------------------
      setStage('dedup');
      setStatus('Deduplicating CSV...');
      setProgress(35);

      const seen = new Set();
      const deduped = [];
      let dupRemoved = 0;

      for (const row of allRows) {
        if (stopRef.current) throw new Error('Stopped by user.');
        const key = safeToString(row[dedupColumn]).trim();
        if (seen.has(key)) dupRemoved++;
        else {
          seen.add(key);
          deduped.push(row);
        }
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
        `CSV Purifier: removed ${purifierRemoved} row(s) containing foreign script.`,
        purifierRemoved ? 'warning' : 'success'
      );

      // -----------------------------
      // 3) MASTER FILTER (HARD-CODED KEYWORDS)
      // -----------------------------
      setStage('filter');
      setStatus('Master Filtering (hard-coded keywords)...');
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
        `CSV Master Filter: kept ${kept.length}, removed ${masterFilterRemoved} (column "${filterColumn}", mode "${matchMode}").`,
        kept.length ? 'success' : 'warning'
      );

      if (kept.length === 0) {
        throw new Error('Master Filter produced 0 rows. Nothing to send to Apify.');
      }

      // -----------------------------
      // 4) APIFY RUNNER (PAGES SCRAPER)
      // -----------------------------
      setStage('apify');
      setStatus('Running Apify batches...');
      setProgress(55);

      const allUrls = extractUrls(kept);
      setStats((s) => ({ ...s, urlsForApify: allUrls.length }));

      if (!allUrls.length) throw new Error(`No URLs detected in column "${urlColumn}".`);

      addLog(`Apify: extracted ${allUrls.length} URL(s) from "${urlColumn}".`, 'info');

      const chunkSize = 10;
      const batches = [];
      for (let i = 0; i < allUrls.length; i += chunkSize) batches.push(allUrls.slice(i, i + chunkSize));

      setBatchProgress({ total: batches.length, completed: 0, active: 0 });
      setStats((s) => ({ ...s, batchesTotal: batches.length }));

      addLog(`Apify: splitting into ${batches.length} batch(es) (max 10 URLs/batch).`, 'info');
      addLog(`Apify: queue configured for max 10 concurrent runs.`, 'info');

      const maxConcurrent = 10;
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

      const token = encodeURIComponent(apiToken.trim());
      let allItems = [];

      for (let i = 0; i < validIds.length; i++) {
        if (stopRef.current) throw new Error('Stopped by user.');
        const dsId = validIds[i];
        const url = `https://api.apify.com/v2/datasets/${dsId}/items?token=${token}&format=json`;
        const res = await fetch(url);
        if (res.ok) {
          const items = await res.json();
          if (Array.isArray(items) && items.length) allItems = allItems.concat(items);
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
    apiToken,
    dedupColumn,
    extractUrls,
    filterColumn,
    matchMode,
    runSingleBatch,
    runWatchdogAndExportRows,
    sourceBaseName,
    urlColumn,
    setDedupRows,
    setFilteredRows,
    setPurifiedRows,
  ]);

  /**
   * ============================================================
   *  DOWNLOAD FINAL
   * ============================================================
   */
  const downloadFinalSpreadsheet = useCallback(() => {
    if (!finalWorkbook) return;

    const xml = buildExcelXmlWorkbook(finalWorkbook);
    const date = new Date().toISOString().slice(0, 10);
    const filename = `${finalWorkbook.fileBaseName || 'pipeline'}_Sorted_${date}.xls`;

    const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
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

  /**
   * ============================================================
   *  SETTINGS PAGE FIELD RENDERER
   * ============================================================
   */
  const ColumnField = ({ label, value, onChange, placeholder }) => {
    const canDropdown = headers && headers.length > 0;
    const found = canDropdown ? headers.includes(value) : true;

    return (
      <div style={{ marginBottom: 14 }}>
        <label className="label">{label}</label>
        {canDropdown ? (
          <select className="select" value={value} onChange={(e) => onChange(e.target.value)} disabled={isRunning}>
            {headers.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        ) : (
          <input
            className="input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isRunning}
            placeholder={placeholder}
          />
        )}

        {canDropdown && !found && (
          <div className="smallNote">
            <b>Note:</b> This column isn’t present in the latest Watchdog export.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pipelineShell" data-theme={theme}>
      <GlobalStyles />

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brandLogo" title="Purge Digital">
            <img
              className="brandLogoImage"
              src="https://i.imgur.com/QjjDjuU.png"
              alt="Purge Digital logo"
            />
          </div>
          <div className="brandTitle">
            <span className="brandTitleStrong">Purge</span>
            <span className="brandTitleLight">Digital</span>
          </div>
        </div>

        <div className="nav">
          <div className="navSection">Platform</div>

          <button
            className={`navItem ${activeTab === 'dashboard' ? 'navItemActive' : ''}`}
            type="button"
            onClick={() => setActiveTab('dashboard')}
          >
            <Layers className="navIcon" />
            <span className="navLabel">Dashboard</span>
          </button>

          <button
            className={`navItem ${activeTab === 'settings' ? 'navItemActive' : ''}`}
            type="button"
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="navIcon" />
            <span className="navLabel">Settings</span>
          </button>
        </div>

        <div className="sidebarFooter">
          <div className="profileCard">
            <div className="avatar">PL</div>
            <div className="profileMeta">
              <div className="profileName">Local Pipeline</div>
              <div className="profileSub">End-to-end workflow</div>
            </div>
            <button
              className="themeBtn"
              type="button"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <section className="main">
        {/* Top Header */}
        <header className="topHeader">
          <div className="headerLeft">
            <div className="headerTitle">
              {activeTab === 'settings' ? 'Pipeline Settings' : 'Watchdog → Filter → Apify → AU Sorter'}
            </div>
            <div className="headerSep" />
            <StatusPill stage={stage} isRunning={isRunning} />
          </div>

          <div className="headerRight">
            {isRunning && (
              <button className="btn btnDanger" onClick={stopPipeline} type="button" title="Stop">
                <Square size={16} />
                Stop
              </button>
            )}

            <button className="btn btnDanger" onClick={resetAll} disabled={isRunning} type="button" title="Reset">
              <RefreshCw size={16} />
              Reset
            </button>

            <button
              className="btn"
              onClick={downloadFinalSpreadsheet}
              disabled={!finalWorkbook}
              type="button"
              title="Download final spreadsheet"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </header>

        {/* Progress */}
        <div className="progressWrap">
          <div className="progressTop">
            <div className="progressStatus">
              {status}
              {watchdogExporting && watchdogExportStatus ? ` • ${watchdogExportStatus}` : ''}
            </div>
            <div className="progressPct">
              {Math.round(progress)}%{' '}
              {batchProgress.total > 0 && (stage === 'apify' || stage === 'fetch')
                ? `• Batches ${batchProgress.completed}/${batchProgress.total}${batchProgress.active ? ` • ${batchProgress.active} Active` : ''}`
                : ''}
            </div>
          </div>
          <div className="progressTrack">
            <div className="progressFill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Workspace */}
        <main className="workspace">
          <div className="container">
            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="grid">
                <div className="leftCol" style={{ gridColumn: 'span 12' }}>
                  <div className="card cardAccent">
                    <div className="cardHeader">
                      <div className="cardHeaderTitle">
                        <Settings size={16} style={{ color: 'var(--color-primary)' }} />
                        Column Presets
                      </div>
                      <div className="cardHeaderTitle" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
                        Preset by default • Editable anytime
                      </div>
                    </div>

                    <div className="cardBody">
                      <ColumnField
                        label="Deduplicate by column"
                        value={dedupColumn}
                        onChange={setDedupColumn}
                        placeholder={PRESET_DEDUP_COLUMN}
                      />
                      <ColumnField
                        label="Master Filter column"
                        value={filterColumn}
                        onChange={setFilterColumn}
                        placeholder={PRESET_FILTER_COLUMN}
                      />
                      <ColumnField
                        label="URL column for Apify"
                        value={urlColumn}
                        onChange={setUrlColumn}
                        placeholder={PRESET_URL_COLUMN}
                      />

                      <div style={{ marginBottom: 14 }}>
                        <label className="label">Match mode</label>
                        <select className="select" value={matchMode} onChange={(e) => setMatchMode(e.target.value)} disabled={isRunning}>
                          <option value="exact">Exact</option>
                          <option value="contains">Contains</option>
                        </select>
                      </div>

                      <div className="smallNote">
                        <b>Preset defaults:</b>
                        <div className="mono" style={{ marginTop: 6 }}>
                          Dedup: {PRESET_DEDUP_COLUMN}
                          <br />
                          Filter: {PRESET_FILTER_COLUMN}
                          <br />
                          URL: {PRESET_URL_COLUMN}
                          <br />
                          Mode: Contains
                        </div>
                      </div>

                      <button
                        className="btn"
                        type="button"
                        disabled={isRunning}
                        onClick={() => {
                          setDedupColumn(PRESET_DEDUP_COLUMN);
                          setFilterColumn(PRESET_FILTER_COLUMN);
                          setUrlColumn(PRESET_URL_COLUMN);
                          setMatchMode(PRESET_MATCH_MODE);
                        }}
                        style={{ marginTop: 14 }}
                      >
                        <RefreshCw size={16} />
                        Reset to Presets
                      </button>
                    </div>
                  </div>

                  <div className="card" style={{ marginTop: 16 }}>
                    <div className="cardHeader">
                      <div className="cardHeaderTitle">
                        <AlertTriangle size={16} style={{ color: 'var(--color-primary)' }} />
                        Note
                      </div>
                      <div className="cardHeaderTitle" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
                        Columns populate after Watchdog export
                      </div>
                    </div>
                    <div className="cardBody">
                      <div className="smallNote" style={{ marginTop: 0 }}>
                        If you run the pipeline once, this page will switch to dropdown selectors using the exported schema. Until then,
                        these fields are editable text presets.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <div className="grid">
                {/* LEFT COLUMN */}
                <div className="leftCol">
                  {/* Watchdog Config (NEW) */}
                  <div className="card cardAccent" style={{ marginBottom: 16 }}>
                    <div className="cardHeader">
                      <div className="cardHeaderTitle">
                        <Layers size={16} style={{ color: 'var(--color-primary)' }} />
                        Apify Bulk Watchdog
                      </div>
                      <div className="cardHeaderTitle" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
                        Export auto-continues
                      </div>
                    </div>

                    <div className="cardBody">
                      <label className="label">Keyword list (one per line)</label>
                      <textarea
                        className="textarea"
                        value={watchdogKeywordsInput}
                        onChange={(e) => setWatchdogKeywordsInput(e.target.value)}
                        disabled={isRunning}
                        placeholder={`Keyword 1\nKeyword 2\nKeyword 3`}
                      />

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
                        <div>
                          <label className="label">Target Country</label>
                          <select
                            className="select"
                            value={watchdogCountry}
                            onChange={(e) => setWatchdogCountry(e.target.value)}
                            disabled={isRunning}
                          >
                            <option value="ALL">All Countries</option>
                            <option value="AU">Australia</option>
                            <option value="US">United States</option>
                            <option value="GB">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="DE">Germany</option>
                          </select>
                        </div>

                        <div>
                          <label className="label">Active Status</label>
                          <select
                            className="select"
                            value={watchdogActiveStatus}
                            onChange={(e) => setWatchdogActiveStatus(e.target.value)}
                            disabled={isRunning}
                          >
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                            <option value="all">All</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
                        <div>
                          <label className="label">Minimum Date (Required)</label>
                          <input
                            className="input"
                            type="date"
                            value={watchdogMinDate}
                            onChange={(e) => setWatchdogMinDate(e.target.value)}
                            disabled={isRunning}
                          />
                        </div>

                        <div>
                          <label className="label">Maximum Date (Optional)</label>
                          <input
                            className="input"
                            type="date"
                            value={watchdogMaxDate}
                            onChange={(e) => setWatchdogMaxDate(e.target.value)}
                            disabled={isRunning}
                          />
                        </div>
                      </div>

                      <div className="toggleRow" style={{ marginTop: 14 }}>
                        <div className="toggleMeta">
                          <div className="toggleLabel">Date Violation Guard</div>
                          <div className="toggleHint">
                            {dateViolationEnabled ? 'On' : 'Off'} • Abort after 10 invalid dates
                          </div>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={dateViolationEnabled}
                            onChange={(e) => setDateViolationEnabled(e.target.checked)}
                          />
                          <span className="switchSlider" />
                        </label>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
                        <div>
                          <label className="label">Max Items</label>
                          <input
                            className="input"
                            type="number"
                            value={watchdogMaxItems}
                            onChange={(e) => setWatchdogMaxItems(Number(e.target.value) || 0)}
                            disabled={isRunning}
                          />
                        </div>

                        <div>
                          <label className="label">Concurrency</label>
                          <input
                            className="input"
                            type="number"
                            value={watchdogMaxConcurrency}
                            onChange={(e) => {
                              const v = Number(e.target.value) || 1;
                              setWatchdogMaxConcurrency(Math.min(100, Math.max(1, v)));
                            }}
                            disabled={isRunning}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
                        <div>
                          <label className="label">Proxy Configuration</label>
                          <select
                            className="select"
                            value={watchdogProxyType}
                            onChange={(e) => setWatchdogProxyType(e.target.value)}
                            disabled={isRunning}
                          >
                            <option value="apify">Apify Proxy (Residential)</option>
                            <option value="custom">Custom Proxy</option>
                          </select>
                        </div>

                        <div>
                          <label className="label">Max Runtime (Minutes)</label>
                          <input
                            className="input"
                            type="number"
                            value={watchdogMaxRuntime}
                            onChange={(e) => setWatchdogMaxRuntime(e.target.value)}
                            disabled={isRunning}
                            placeholder="(optional)"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Apify Sign-In */}
                  <div className="card" style={{ marginBottom: 16 }}>
                    <div className="cardHeader">
                      <div className="cardHeaderTitle">
                        <Facebook size={16} style={{ color: 'var(--color-primary)' }} />
                        Apify Sign-In
                      </div>
                      <div className="cardHeaderTitle" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
                        One token • Full run • No interruptions
                      </div>
                    </div>

                    <div className="cardBody">
                      <div>
                        <label className="label">Apify API Token</label>
                        <input
                          className="input"
                          type="password"
                          value={apiToken}
                          onChange={(e) => setApiToken(e.target.value)}
                          disabled={isRunning}
                          placeholder="apify_api_..."
                        />
                      </div>

                      <div style={{ marginTop: 14 }}>
                        <label className="label">Memory Limit (MB)</label>
                        <input
                          className="input"
                          type="number"
                          value={memory}
                          onChange={(e) => setMemory(Number(e.target.value) || 0)}
                          disabled={isRunning}
                        />
                      </div>

                      <div style={{ marginTop: 14 }}>
                        <label className="label">Custom Proxy (Optional)</label>
                        <input
                          className="input"
                          type="text"
                          value={customProxy}
                          onChange={(e) => setCustomProxy(e.target.value)}
                          disabled={isRunning}
                          placeholder="http://user:pass@host:port"
                        />
                        <div className="smallNote" style={{ marginTop: 10 }}>
                          <AlertTriangle
                            size={14}
                            style={{ marginRight: 6, verticalAlign: 'text-bottom', color: 'var(--color-primary)' }}
                          />
                          Pages Scraper: Apify Proxy is disabled (custom proxy only). Watchdog proxy mode is selectable above.
                        </div>
                      </div>

                      <button
                        className="btn btnPrimary"
                        onClick={runPipeline}
                        disabled={isRunning}
                        type="button"
                        style={{ width: '100%', marginTop: 14, justifyContent: 'center' }}
                      >
                        {isRunning ? (
                          <>
                            <Loader2 size={16} className="spin" />
                            Running Pipeline
                          </>
                        ) : (
                          <>
                            <Play size={16} />
                            Run Full Pipeline
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Console */}
                  <div className="card console">
                    <div className="cardHeader">
                      <div className="cardHeaderTitle">
                        <Layers size={16} style={{ color: 'var(--color-primary)' }} />
                        System Output
                      </div>
                      <div className="cardHeaderTitle" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
                        {logs.length ? `${logs.length} log line(s)` : 'Waiting for input...'}
                      </div>
                    </div>

                    <div className="consoleBody" ref={logRef}>
                      {logs.length === 0 && (
                        <div className="logLine">
                          <span className="logTime">[--:--:--]</span>
                          <span className="logMsg info" style={{ fontStyle: 'italic' }}>
                            System ready. Waiting for input...
                          </span>
                        </div>
                      )}

                      {logs.map((log, idx) => (
                        <div key={idx} className="logLine">
                          <span className="logTime">[{log.timestamp}]</span>
                          <span className={`logMsg ${log.type}`}>{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="rightCol">
                  {/* Summary */}
                  <div className="card" style={{ boxShadow: 'var(--shadow-xl)' }}>
                    <div className="cardHeader">
                      <div className="cardHeaderTitle">
                        <Filter size={16} style={{ color: 'var(--color-primary)' }} />
                        Pipeline Summary
                      </div>
                      <div className="cardHeaderTitle" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
                        {keywordCount} master filter keywords loaded
                      </div>
                    </div>

                    <div className="cardBody">
                      <div className="tiles">
                        <div className="tile">
                          <div className="tileK">Watchdog Rows</div>
                          <div className="tileV">{stats.watchdogExportedRows}</div>
                          <div className="tileSub">Auto-exported into pipeline</div>
                        </div>

                        <div className="tile">
                          <div className="tileK">Filtered Out</div>
                          <div className="tileV red">{filteredOutTotal}</div>
                          <div className="tileSub">Dedup + Purify + Master</div>
                        </div>

                        <div className="tile">
                          <div className="tileK">Apify Records</div>
                          <div className="tileV orange">{stats.apifyItems}</div>
                          <div className="tileSub">Merged dataset items</div>
                        </div>
                      </div>

                      <div className="breakGrid">
                        <div className="breakItem">
                          <div className="breakH">0) Watchdog</div>
                          <div className="breakLine">
                            <span>Keywords</span> <span className="mono">{stats.watchdogKeywords}</span>
                          </div>
                          <div className="breakLine" style={{ marginTop: 8 }}>
                            <span>Jobs</span>
                            <span className="mono">
                              {stats.watchdogSucceeded} ok / {stats.watchdogFailed} fail / {stats.watchdogAborted} aborted
                            </span>
                          </div>
                          <button
                            className="btn btnSmall"
                            type="button"
                            style={{ marginTop: 10, width: '100%', justifyContent: 'center' }}
                            onClick={() => downloadCsvSnapshot('watchdog', rows)}
                            disabled={!rows.length}
                            title="Download Watchdog export CSV"
                          >
                            <Download size={14} />
                            Download CSV
                          </button>
                        </div>

                        <div className="breakItem">
                          <div className="breakH">1) Deduplicator</div>
                          <div className="breakLine">
                            <span>Removed</span> <span className="mono">{stats.dedupRemoved}</span>
                          </div>
                          <div className="breakLine" style={{ marginTop: 8 }}>
                            <span>Remaining</span> <span className="mono">{stats.afterDedup}</span>
                          </div>
                          <button
                            className="btn btnSmall"
                            type="button"
                            style={{ marginTop: 10, width: '100%', justifyContent: 'center' }}
                            onClick={() => downloadCsvSnapshot('deduplicated', dedupRows)}
                            disabled={!dedupRows.length}
                            title="Download deduplicated CSV"
                          >
                            <Download size={14} />
                            Download CSV
                          </button>
                        </div>

                        <div className="breakItem">
                          <div className="breakH">2) CSV Purifier</div>
                          <div className="breakLine">
                            <span>Removed</span> <span className="mono">{stats.purifierRemoved}</span>
                          </div>
                          <div className="breakLine" style={{ marginTop: 8 }}>
                            <span>Remaining</span> <span className="mono">{stats.afterPurify}</span>
                          </div>
                          <button
                            className="btn btnSmall"
                            type="button"
                            style={{ marginTop: 10, width: '100%', justifyContent: 'center' }}
                            onClick={() => downloadCsvSnapshot('purified', purifiedRows)}
                            disabled={!purifiedRows.length}
                            title="Download purified CSV"
                          >
                            <Download size={14} />
                            Download CSV
                          </button>
                        </div>

                        <div className="breakItem">
                          <div className="breakH">3) Master Filter</div>
                          <div className="breakLine">
                            <span>Removed</span> <span className="mono">{stats.masterFilterRemoved}</span>
                          </div>
                          <div className="breakLine" style={{ marginTop: 8 }}>
                            <span>Remaining</span> <span className="mono">{stats.afterMasterFilter}</span>
                          </div>
                          <button
                            className="btn btnSmall"
                            type="button"
                            style={{ marginTop: 10, width: '100%', justifyContent: 'center' }}
                            onClick={() => downloadCsvSnapshot('master_filter', filteredRows)}
                            disabled={!filteredRows.length}
                            title="Download master filter CSV"
                          >
                            <Download size={14} />
                            Download CSV
                          </button>
                        </div>

                        <div className="breakItem">
                          <div className="breakH">4) Apify Runner</div>
                          <div className="breakLine">
                            <span>URLs</span> <span className="mono">{stats.urlsForApify}</span>
                          </div>
                          <div className="breakLine" style={{ marginTop: 8 }}>
                            <span>Batches</span>
                            <span className="mono">
                              {stats.batchesSucceeded} ok / {stats.batchesFailed} fail
                            </span>
                          </div>
                        </div>

                        <div className="breakItem">
                          <div className="breakH">Settings</div>
                          <div className="breakLine">
                            <span>Dedup</span> <span className="mono">{dedupColumn}</span>
                          </div>
                          <div className="breakLine" style={{ marginTop: 8 }}>
                            <span>Filter</span> <span className="mono">{filterColumn}</span>
                          </div>
                        </div>
                      </div>

                      <div className="breakItem" style={{ marginTop: 12 }}>
                        <div className="breakH">5) AU Number Sorter</div>
                        <div className="sortPills">
                          <div className="sortPill">
                            <div className="sortK">Mobiles</div>
                            <div className="sortV" style={{ color: '#10b981' }}>
                              {stats.sorterMobile}
                            </div>
                          </div>
                          <div className="sortPill">
                            <div className="sortK">Landlines</div>
                            <div className="sortV" style={{ color: 'var(--color-primary)' }}>
                              {stats.sorterLandline}
                            </div>
                          </div>
                          <div className="sortPill">
                            <div className="sortK">Others</div>
                            <div className="sortV">{stats.sorterOther}</div>
                          </div>
                        </div>
                      </div>

                      <button
                        className="btn"
                        onClick={downloadFinalSpreadsheet}
                        disabled={!finalWorkbook}
                        type="button"
                        style={{ width: '100%', marginTop: 14, justifyContent: 'center' }}
                        title="Download final spreadsheet"
                      >
                        {finalWorkbook ? (
                          <>
                            <FileDown size={16} />
                            Download Final Spreadsheet (.xls)
                          </>
                        ) : (
                          <>
                            <Download size={16} />
                            Download (available after completion)
                          </>
                        )}
                      </button>

                      {error && (
                        <div className="notice" style={{ marginTop: 14 }}>
                          <AlertCircle size={18} style={{ color: '#fb7185' }} />
                          <div>
                            <div className="noticeTitle">SYSTEM ERROR</div>
                            <div className="noticeDesc">{error}</div>
                          </div>
                        </div>
                      )}

                      {stage === 'done' && (
                        <div className="notice ok" style={{ marginTop: 14 }}>
                          <CheckCircle size={18} style={{ color: '#10b981' }} />
                          <div>
                            <div className="noticeTitle">COMPLETE</div>
                            <div className="noticeDesc">Export is ready. No popups, no interruptions.</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Watchdog Queue (preserved functionality: per-job status + stop) */}
                  <div className="card" style={{ marginTop: 16 }}>
                    <div className="cardHeader">
                      <div className="cardHeaderTitle">
                        <Layers size={16} style={{ color: 'var(--color-primary)' }} />
                        Watchdog Queue
                      </div>
                      <div className="cardHeaderTitle" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
                        {watchdogUiStats.total
                          ? `${watchdogUiStats.succeeded}/${watchdogUiStats.total} complete • ${watchdogUiStats.running} active`
                          : 'No jobs yet'}
                      </div>
                    </div>

                    <div className="cardBody">
                      <div className="tiles" style={{ marginBottom: 12 }}>
                        <div className="tile">
                          <div className="tileK">Total</div>
                          <div className="tileV">{watchdogUiStats.total}</div>
                          <div className="tileSub">Keywords queued</div>
                        </div>
                        <div className="tile">
                          <div className="tileK">Running</div>
                          <div className="tileV orange">{watchdogUiStats.running}</div>
                          <div className="tileSub">Starting / Running</div>
                        </div>
                        <div className="tile">
                          <div className="tileK">Retrying</div>
                          <div className="tileV">{watchdogUiStats.retrying}</div>
                          <div className="tileSub">Queued retries</div>
                        </div>
                      </div>

                      <div className="tableWrap" style={{ maxHeight: 340 }}>
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="th">Keyword</th>
                              <th className="th">Status</th>
                              <th className="th">Items</th>
                              <th className="th">Last Date</th>
                              <th className="th" style={{ textAlign: 'right' }}>
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {watchdogJobs.length === 0 && (
                              <tr>
                                <td className="td" colSpan={5} style={{ color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                                  No Watchdog jobs yet. Run the pipeline to start.
                                </td>
                              </tr>
                            )}

                            {watchdogJobs.map((job) => {
                              const badgeCls =
                                job.status === 'RUNNING' || job.status === 'STARTING'
                                  ? 'running'
                                  : job.status === 'SUCCEEDED'
                                  ? 'success'
                                  : job.status === 'PENDING_RETRY'
                                  ? 'warn'
                                  : job.status === 'FAILED' || job.status === 'ABORTED'
                                  ? 'fail'
                                  : 'pending';

                              return (
                                <tr key={job.id}>
                                  <td className="td">
                                    <div style={{ fontWeight: 900, color: 'var(--text-main)' }}>{job.keyword}</div>
                                    {job.retryCount > 0 && (
                                      <div className="mono" style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 4 }}>
                                        Retry {job.retryCount}
                                      </div>
                                    )}
                                    {job.failReason && (
                                      <div className="mono" style={{ fontSize: 10, color: '#fb7185', marginTop: 4 }}>
                                        {job.failReason}
                                      </div>
                                    )}
                                  </td>
                                  <td className="td">
                                    <span className={`badge ${badgeCls}`}>{job.status}</span>
                                  </td>
                                  <td className="td mono">{job.itemCount || 0}</td>
                                  <td className="td mono">{job.lastDate || '-'}</td>
                                  <td className="td" style={{ textAlign: 'right' }}>
                                    {job.status === 'RUNNING' && (
                                      <button
                                        className="btn"
                                        style={{ padding: '7px 10px' }}
                                        type="button"
                                        disabled={!apiToken.trim() || isRunning === false ? false : false}
                                        onClick={() => abortWatchdogJob(job, 'Manual Stop')}
                                      >
                                        <X size={14} />
                                        Stop
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="smallNote">
                        <b>Note:</b> Export happens automatically once all jobs are done (single CSV internally), then the pipeline continues.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
