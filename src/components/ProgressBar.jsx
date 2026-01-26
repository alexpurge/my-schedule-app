import React from 'react';

const ProgressBar = ({ status, watchdogExporting, watchdogExportStatus, progress, batchProgress, stage }) => (
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
);

export default ProgressBar;
