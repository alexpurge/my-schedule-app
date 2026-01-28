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

.pipelineShell:not(.authShell):not(.welcomeShell){
  --bg-canvas: #0f1116;
  --bg-sidebar: #141820;
  --bg-surface: #1b202a;
  --bg-input: #222734;
  --border-color: #2e3543;

  --text-main: #f5f7fa;
  --text-muted: #b3bac7;
  --text-subtle: #7d8594;

  --color-primary: #0a84ff;

  --radius-xl: 22px;
  --radius-lg: 18px;
  --radius-md: 14px;

  --shadow-xl: 0 26px 60px rgba(0,0,0,.45);
  --shadow-lg: 0 18px 42px rgba(0,0,0,.35);
  --shadow-md: 0 12px 28px rgba(0,0,0,.3);

  font-family: "SF Pro Text","SF Pro Display",-apple-system,BlinkMacSystemFont,"Inter",system-ui,sans-serif;
}

.pipelineShell:not(.authShell):not(.welcomeShell)[data-theme='light']{
  --bg-canvas: #f5f5f7;
  --bg-sidebar: #ffffff;
  --bg-surface: #ffffff;
  --bg-input: #f1f2f4;
  --border-color: #e5e7eb;

  --text-main: #0f172a;
  --text-muted: #64748b;
  --text-subtle: #94a3b8;

  --color-primary: #007aff;

  --shadow-xl: 0 24px 50px rgba(15,23,42,.12);
  --shadow-lg: 0 16px 34px rgba(15,23,42,.1);
  --shadow-md: 0 10px 24px rgba(15,23,42,.08);
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

.welcomeShell{
  align-items: center;
  justify-content: center;
  background: #000;
}

.welcomeOverlay{
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
}

.welcomeOverlay.is-visible{
  opacity: 1;
}

.welcomeOverlay.fade-in{
  animation: welcomeFadeIn .5s ease forwards;
}

.welcomeOverlay.fade-out{
  animation: welcomeFadeOut .5s ease forwards;
}

.welcomeOverlayText{
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  color: #fff;
  font-size: clamp(20px, 4vw, 36px);
  letter-spacing: 0.02em;
  text-align: center;
}

@keyframes welcomeFadeIn{
  from{ opacity: 0; }
  to{ opacity: 1; }
}

@keyframes welcomeFadeOut{
  from{ opacity: 1; }
  to{ opacity: 0; }
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

.authLoginStack{
  position: absolute;
  left: clamp(148px, 21vw, 304px);
  top: clamp(420px, 66vh, 640px);
  transform: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  width: min(320px, 70vw);
  z-index: 2;
}

@media (max-width: 900px){
  .authLoginStack{
    left: 50%;
    top: auto;
    bottom: clamp(48px, 12vh, 120px);
    transform: translateX(-50%);
    align-items: center;
    width: min(320px, 80vw);
  }
}

.authGoogleButton{
  position: relative;
  transform: none;
  width: min(320px, 90vw);
  min-height: 40px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #3c4043;
  font-family: "Roboto", "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  padding: 10px 16px;
  text-align: center;
  transition: background-color 150ms ease, box-shadow 150ms ease, border-color 150ms ease;
}

.authGoogleButton:hover{
  background-color: #f8f9fa;
  border-color: #dadce0;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 1px 3px rgba(60, 64, 67, 0.15);
}

.authGoogleButton:disabled{
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
}

.authGoogleButton:focus-visible{
  outline: 2px solid #4285f4;
  outline-offset: 2px;
}

.authGoogleButtonIcon{
  display: inline-flex;
  width: 18px;
  height: 18px;
}

.authGoogleButtonIcon svg{
  width: 100%;
  height: 100%;
}

.authGoogleButtonLabel{
  font-size: 14px;
  letter-spacing: 0.2px;
}

.authGoogleButtonMeta{
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.authGoogleButtonFrame{
  width: min(320px, 90vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.authGoogleButtonGsi{
  width: 100%;
  display: flex;
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
  width: 280px;
  flex-shrink: 0;
  background: var(--bg-sidebar);
  border-right: 1px solid color-mix(in srgb, var(--border-color) 85%, transparent);
  display:flex;
  flex-direction: column;
  z-index: 20;
}

.brand{
  height: 88px;
  display:flex;
  align-items:center;
  gap: 14px;
  padding: 0 26px;
  border-bottom: 1px solid color-mix(in srgb, var(--border-color) 80%, transparent);
}
.brandLogo{
  width: 66px;
  height: 66px;
  border-radius: 18px;
  display:flex;
  align-items:center;
  justify-content:center;
  background: color-mix(in srgb, var(--bg-surface) 70%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 70%, transparent);
}
.brandLogoImage{
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.brandTitle{
  font-weight: 700;
  letter-spacing: -0.01em;
  font-size: 26px;
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}
.brandTitleStrong{
  font-weight: 700;
}
.brandTitleLight{
  font-weight: 500;
  color: var(--text-subtle);
}
.brandSub{
  color: var(--text-subtle);
  font-weight: 600;
  margin-left: 2px;
}

.nav{
  padding: 14px 0 20px;
  flex: 1;
}
.navSection{
  padding: 8px 26px 12px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: .06em;
  text-transform: none;
}
.navItem{
  position: relative;
  width: 100%;
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 10px 14px;
  margin: 4px 12px;
  border-radius: 12px;
  border: 0;
  background: transparent;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
}
.navItem:hover{
  color: var(--text-main);
  background: color-mix(in srgb, var(--bg-input) 60%, transparent);
}
[data-theme='light'] .navItem:hover{
  background: color-mix(in srgb, var(--bg-input) 80%, transparent);
}
.navItemActive{
  color: var(--text-main);
  background: color-mix(in srgb, var(--color-primary) 18%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-primary) 30%, transparent);
}
.navItemActive::before{
  content:'';
  display: none;
}
.navItemActive::after{
  content:'';
  display: none;
}
[data-theme='light'] .navItemActive::after{
  background: none;
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
  padding: 16px;
  border-top: 1px solid color-mix(in srgb, var(--border-color) 80%, transparent);
}
.profileCard{
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--bg-input) 90%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 85%, transparent);
  box-shadow: 0 10px 20px rgba(0,0,0,.12);
}
.avatar{
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--bg-surface) 85%, #0f172a 15%);
  display:flex;
  align-items:center;
  justify-content:center;
  color: var(--text-main);
  font-weight: 700;
  font-size: 11px;
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
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--bg-input) 70%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 80%, transparent);
  color: var(--text-muted);
  cursor: pointer;
  display:flex;
  align-items:center;
  justify-content:center;
}
.themeBtn:hover{
  color: var(--color-primary);
  border-color: color-mix(in srgb, var(--color-primary) 60%, transparent);
}

.main{
  flex: 1;
  display:flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-canvas);
}

.topHeader{
  height: 72px;
  border-bottom: 1px solid color-mix(in srgb, var(--border-color) 80%, transparent);
  display:flex;
  align-items:center;
  justify-content: space-between;
  padding: 0 32px;
  background: color-mix(in srgb, var(--bg-canvas) 85%, transparent);
  backdrop-filter: blur(18px);
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
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text-main);
  white-space: nowrap;
}
.headerSep{
  width: 1px;
  height: 22px;
  background: color-mix(in srgb, var(--border-color) 85%, transparent);
}
.headerRight{
  display:flex;
  align-items:center;
  gap: 10px;
}

.pill{
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: color-mix(in srgb, var(--bg-input) 75%, transparent);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: none;
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
  border: 1px solid color-mix(in srgb, var(--border-color) 80%, transparent);
  background: color-mix(in srgb, var(--bg-input) 85%, transparent);
  color: var(--text-main);
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .02em;
  text-transform: none;
  display:inline-flex;
  align-items:center;
  gap: 8px;
  cursor:pointer;
  box-shadow: 0 8px 18px rgba(0,0,0,.14);
}
.btn:hover{
  border-color: color-mix(in srgb, var(--color-primary) 45%, transparent);
  color: var(--color-primary);
}
.btn:disabled{
  opacity: .5;
  cursor:not-allowed;
  box-shadow: none;
}
.btnSmall{
  padding: 6px 10px;
  font-size: 11px;
  letter-spacing: .02em;
}
.btnSmall svg{
  width: 14px;
  height: 14px;
}
.btnPrimary{
  border-color: color-mix(in srgb, var(--color-primary) 60%, transparent);
  background: var(--color-primary);
  color: white;
  box-shadow: 0 12px 26px rgba(10,132,255,.22);
}
.btnPrimary:hover{
  filter: brightness(1.05);
  color: white;
  border-color: color-mix(in srgb, var(--color-primary) 70%, transparent);
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
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--border-color) 85%, transparent);
  background: color-mix(in srgb, var(--bg-input) 80%, transparent);
}
.toggleMeta{
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.toggleLabel{
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .01em;
  text-transform: none;
}
.toggleHint{
  font-size: 12px;
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
  background: color-mix(in srgb, var(--text-subtle) 70%, transparent);
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
  box-shadow: 0 2px 6px rgba(0,0,0,.22);
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
  background: color-mix(in srgb, var(--bg-input) 80%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 80%, transparent);
  overflow:hidden;
}
.progressFill{
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 40%, transparent));
  transition: width .25s ease;
}

.workspace{
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px 36px;
}
.workspace--static{
  overflow: hidden;
}
.container{
  width: min(1280px, 100%);
  margin: 0 auto;
}

.dashboardLayout{
  --dashboard-gap: 24px;
  --dashboard-panel-overlap: 0px;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--dashboard-gap);
  min-height: min(720px, 100%);
  align-items: stretch;
}
.dashboardPanel{
  background: color-mix(in srgb, var(--bg-surface) 92%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 80%, transparent);
  border-radius: 26px;
  padding: 32px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.dashboardHero{
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dashboardHeroEyebrow{
  text-transform: none;
  letter-spacing: .08em;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-subtle);
}
.dashboardHeroTitle{
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 600;
}
.dashboardHeroSubtitle{
  color: var(--text-muted);
  max-width: 520px;
  font-size: 14px;
}
.dashboardCards{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.dashboardCard{
  padding: 18px;
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, var(--border-color) 80%, transparent);
  background: color-mix(in srgb, var(--bg-input) 82%, transparent);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dashboardCardLabel{
  font-size: 12px;
  text-transform: none;
  letter-spacing: .04em;
  color: var(--text-subtle);
  font-weight: 600;
}
.dashboardCardValue{
  font-size: 26px;
  font-weight: 600;
}
.dashboardCardNote{
  font-size: 13px;
  color: var(--text-muted);
}
.dashboardStatus{
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--border-color) 80%, transparent);
  font-weight: 600;
  background: color-mix(in srgb, var(--bg-surface) 85%, transparent);
}
.dashboardStatusDot{
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #f87171;
  box-shadow: 0 0 12px rgba(248,113,113,.65);
}
.dashboardStatus.is-running .dashboardStatusDot{
  background: #34d399;
  box-shadow: 0 0 12px rgba(52,211,153,.6);
}
.dashboardStatusLabel{
  font-size: 14px;
}
.dashboardSplinePanel{
  position: relative;
left: -100px; 
transform: scale(1.5); 
  border-radius: 0;
  border: none;
  background: transparent;
  box-shadow: none;
  overflow: hidden;
  min-height: 600px;
}
.dashboardSplinePanel iframe{
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
  transform: translateY(-90%, -10%) scale(1.1);
  transform-origin: center;
  pointer-events: auto;
  opacity: 0;
  transition: opacity 0.6s ease;
  will-change: opacity;
}
.dashboardSplinePanel[data-running="true"][data-loaded="true"] iframe{
  opacity: 1;
}

@media (min-width: 1024px){
  .dashboardLayout{
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    min-height: calc(100vh - 260px);
    --dashboard-panel-overlap: 30%;
  }

  .dashboardPanel{
    width: calc(100% + var(--dashboard-panel-overlap));
    margin-right: calc(-1 * var(--dashboard-panel-overlap));
  }
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
  background: color-mix(in srgb, var(--bg-surface) 94%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 82%, transparent);
  border-radius: 20px;
  box-shadow: var(--shadow-md); /* ✅ reduced via variables */
  overflow:hidden;
}
.cardHeader{
  padding: 16px 20px;
  border-bottom: 1px solid color-mix(in srgb, var(--border-color) 80%, transparent);
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 12px;
}
.cardHeaderTitle{
  display:flex;
  align-items:center;
  gap: 10px;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: .03em;
  text-transform: none;
  color: var(--text-muted);
}
.cardBody{
  padding: 20px;
}
.cardAccent{
  border-color: color-mix(in srgb, var(--color-primary) 45%, transparent);
  box-shadow: var(--shadow-lg); /* ✅ reduced via variables */
  position: relative;
}
.cardAccent::before{
  content:'';
  position:absolute;
  top:0; left:0; bottom:0;
  width: 3px;
  background: var(--color-primary);
}

.label{
  display:block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .02em;
  text-transform: none;
  color: var(--text-subtle);
  margin: 0 0 8px 6px;
}
.input, .select, .textarea{
  width: 100%;
  background: color-mix(in srgb, var(--bg-input) 85%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 85%, transparent);
  color: var(--text-main);
  border-radius: 14px;
  padding: 11px 12px;
  font-size: 13px;
  outline: none;
}
.select{
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image:
    linear-gradient(45deg, transparent 50%, var(--text-muted) 50%),
    linear-gradient(135deg, var(--text-muted) 50%, transparent 50%);
  background-position:
    calc(100% - 18px) 50%,
    calc(100% - 12px) 50%;
  background-size: 6px 6px, 6px 6px;
  background-repeat: no-repeat;
  padding-right: 32px;
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
  border-color: color-mix(in srgb, var(--color-primary) 70%, transparent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 18%, transparent);
}

.smallNote{
  margin-top: 10px;
  padding: 12px 14px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--bg-input) 80%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 85%, transparent);
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.4;
}
.smallNote b{ color: var(--text-main); }

.diagList{
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.diagRow{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 16px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  font-size: 11px;
  color: var(--text-muted);
}
.diagMeta{
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.diagTitle{
  font-weight: 700;
  color: var(--text-main);
}
.diagDetail{
  color: var(--text-muted);
}
.diagStatus{
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 800;
  color: var(--text-subtle);
}
.diagRow.diag-success .diagStatus{
  color: #34d399;
}
.diagRow.diag-error .diagStatus{
  color: #f87171;
}
.diagRow.diag-warning .diagStatus{
  color: #fbbf24;
}
.diagRow.diag-in-progress .diagStatus{
  color: var(--color-primary);
}
.diagLink{
  align-self: center;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 700;
  font-size: 11px;
}
.diagLink:hover{
  text-decoration: underline;
}

.tiles{
  display:grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 12px;
}
@media (max-width: 860px){
  .tiles{ grid-template-columns: 1fr; }
}
.tile{
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--border-color) 82%, transparent);
  background: color-mix(in srgb, var(--bg-input) 82%, transparent);
  padding: 12px;
}
.tileK{
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .03em;
  text-transform: none;
  color: var(--text-muted);
}
.tileV{
  margin-top: 8px;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text-main);
}
.tileV.orange{ color: var(--color-primary); }
.tileV.red{ color: #ef4444; }
.tileSub{
  margin-top: 6px;
  font-size: 11px;
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
.summaryStrip{
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}
.summaryStripCompact{
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}
@media (max-width: 860px){
  .summaryStrip{ grid-template-columns: 1fr; }
}
.summaryStat{
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--border-color) 82%, transparent);
  background: color-mix(in srgb, var(--bg-input) 82%, transparent);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.summaryStat span{
  font-size: 12px;
  color: var(--text-muted);
}
.summaryStat strong{
  font-size: 20px;
  font-weight: 600;
  color: var(--text-main);
}
.summaryAccent{
  color: var(--color-primary);
}
.summaryNegative{
  color: #ef4444;
}

.historyList{
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.historyEmpty{
  padding: 14px;
  border-radius: 14px;
  border: 1px dashed color-mix(in srgb, var(--border-color) 70%, transparent);
  color: var(--text-subtle);
  font-size: 12px;
}
.historyItem{
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--border-color) 82%, transparent);
  background: color-mix(in srgb, var(--bg-input) 88%, transparent);
  padding: 14px;
}
.historyHeader{
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.historyTitle{
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}
.historyMeta{
  margin-top: 4px;
  font-size: 11px;
  color: var(--text-subtle);
}
.historyStats{
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  min-width: 280px;
}
@media (max-width: 860px){
  .historyStats{
    grid-template-columns: 1fr;
    width: 100%;
  }
}
.historyStat{
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--border-color) 80%, transparent);
  background: color-mix(in srgb, var(--bg-surface) 88%, transparent);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.historyStat span{
  font-size: 11px;
  color: var(--text-muted);
}
.historyStat strong{
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
}
.historyDisclosure{
  margin-top: 12px;
}
.historyActions{
  display: flex;
  justify-content: flex-end;
}

.disclosure{
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--border-color) 82%, transparent);
  background: color-mix(in srgb, var(--bg-surface) 88%, transparent);
  padding: 6px 12px 12px;
  margin-bottom: 16px;
}
.disclosure summary{
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
}
.disclosure summary::-webkit-details-marker{
  display: none;
}
.disclosure summary::after{
  content: '▾';
  font-size: 14px;
  color: var(--text-subtle);
  transition: transform .2s ease;
}
.disclosure[open] summary::after{
  transform: rotate(180deg);
}
.disclosureBody{
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 4px 0;
}
.breakItem{
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--border-color) 82%, transparent);
  background: color-mix(in srgb, var(--bg-input) 80%, transparent);
  padding: 14px;
}
.breakH{
  font-weight: 600;
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
  font-size: 12px;
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
  border: 1px solid color-mix(in srgb, var(--border-color) 82%, transparent);
  background: color-mix(in srgb, var(--bg-surface) 85%, transparent);
  padding: 12px;
}
.sortK{
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .03em;
  text-transform: none;
  color: var(--text-muted);
}
.sortV{
  margin-top: 8px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
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
  background: color-mix(in srgb, var(--bg-input) 82%, transparent);
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
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid rgba(239,68,68,.2);
  background: rgba(239,68,68,.06);
  display:flex;
  gap: 10px;
  align-items:flex-start;
}
.notice.ok{
  border-color: rgba(16,185,129,.2);
  background: rgba(16,185,129,.06);
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
  border: 1px solid color-mix(in srgb, var(--border-color) 82%, transparent);
  background: color-mix(in srgb, var(--bg-input) 82%, transparent);
}
.table{
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.th, .td{
  padding: 10px 12px;
  border-bottom: 1px solid color-mix(in srgb, var(--border-color) 50%, transparent);
  text-align: left;
  vertical-align: top;
}
[data-theme='light'] .th, [data-theme='light'] .td{
  border-bottom: 1px solid rgba(15,23,42,.06);
}
.th{
  font-size: 11px;
  letter-spacing: .04em;
  text-transform: none;
  color: var(--text-subtle);
  background: color-mix(in srgb, var(--bg-input) 90%, transparent);
  position: sticky;
  top: 0;
  z-index: 1;
}
.badge{
  display:inline-flex;
  align-items:center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .02em;
  text-transform: none;
  border: 1px solid color-mix(in srgb, var(--border-color) 80%, transparent);
  background: color-mix(in srgb, var(--bg-surface) 85%, transparent);
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
