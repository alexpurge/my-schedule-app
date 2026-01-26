import React from 'react';
import { Download, RefreshCw, Square } from 'lucide-react';
import StatusPill from './StatusPill';

const TopHeader = ({
  activeTab,
  stage,
  isRunning,
  stopPipeline,
  resetAll,
  downloadFinalSpreadsheet,
  finalWorkbookAvailable,
}) => (
  <header className="topHeader">
    <div className="headerLeft">
      <div className="headerTitle">{activeTab === 'settings' ? 'Pipeline Settings' : 'Filtration System'}</div>
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
        disabled={!finalWorkbookAvailable}
        type="button"
        title="Download final spreadsheet"
      >
        <Download size={16} />
        Export
      </button>
    </div>
  </header>
);

export default TopHeader;
