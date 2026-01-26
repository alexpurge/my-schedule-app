import React from 'react';

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

.authShell{
  align-items: center;
  justify-content: center;
  padding: 32px;
  position: relative;
  overflow: hidden;
}

.authSplineFrame{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.authSplineFrame iframe{
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
  transform: translateZ(0);
}

.authNotice{
  position: absolute;
  right: 32px;
  bottom: 32px;
  z-index: 1;
  background: color-mix(in srgb, var(--bg-surface) 80%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 70%, transparent);
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: min(320px, 80vw);
  text-align: left;
}

.authSplineLoginHitbox{
  position: absolute;
  left: 50%;
  bottom: 120px;
  transform: translateX(-50%);
  width: min(240px, 70vw);
  height: 64px;
  border: none;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.authSplineLoginHitbox:focus-visible{
  outline: 2px solid color-mix(in srgb, var(--accent) 65%, #fff);
  outline-offset: 4px;
}

.authGoogleButton{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.authStatus{
  color: var(--text-muted);
  font-size: 13px;
}

.authError{
  color: #f87171;
  font-size: 13px;
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
  font-size: 27px;
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
.noticeTitleLarge{
  font-size: 16px;
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

export default GlobalStyles;
