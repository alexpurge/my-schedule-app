import React from 'react';

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

export default StatusPill;
