import React from 'react';
import { AlertTriangle, RefreshCw, Settings } from 'lucide-react';

const ColumnField = ({ label, value, onChange, placeholder, headers, isRunning }) => {
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
          <b>Note:</b> This column isn’t present in the latest bulk initial pull export.
        </div>
      )}
    </div>
  );
};

const SettingsPanel = ({
  headers,
  isRunning,
  dedupColumn,
  setDedupColumn,
  filterColumn,
  setFilterColumn,
  urlColumn,
  setUrlColumn,
  matchMode,
  setMatchMode,
  presetDedupColumn,
  presetFilterColumn,
  presetUrlColumn,
  presetMatchMode,
  sheetSyncEnabled,
  sheetTabPrefix,
  setSheetTabPrefix,
  sheetAppendMode,
  setSheetAppendMode,
  sheetAutoClear,
  setSheetAutoClear,
  sheetStatus,
  refreshSheetStatus,
}) => (
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
            placeholder={presetDedupColumn}
            headers={headers}
            isRunning={isRunning}
          />
          <ColumnField
            label="Category Filter column"
            value={filterColumn}
            onChange={setFilterColumn}
            placeholder={presetFilterColumn}
            headers={headers}
            isRunning={isRunning}
          />
          <ColumnField
            label="URL column for Apify"
            value={urlColumn}
            onChange={setUrlColumn}
            placeholder={presetUrlColumn}
            headers={headers}
            isRunning={isRunning}
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
              Dedup: {presetDedupColumn}
              <br />
              Filter: {presetFilterColumn}
              <br />
              URL: {presetUrlColumn}
              <br />
              Mode: Contains
            </div>
          </div>

          <button
            className="btn"
            type="button"
            disabled={isRunning}
            onClick={() => {
              setDedupColumn(presetDedupColumn);
              setFilterColumn(presetFilterColumn);
              setUrlColumn(presetUrlColumn);
              setMatchMode(presetMatchMode);
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
            <Settings size={16} style={{ color: 'var(--color-primary)' }} />
            Google Sheets Sync (Advanced)
          </div>
          <div className="cardHeaderTitle" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
            Tune sheet behavior for bulk initial pull runs
          </div>
        </div>
        <div className="cardBody">
          <div className="smallNote" style={{ marginTop: 0 }}>
            Enable Sheets Sync in the Bulk Initial Pull panel to use these options.
          </div>

          <div style={{ marginTop: 0 }}>
            <label className="label">Sheet tab prefix (optional)</label>
            <input
              className="input"
              value={sheetTabPrefix}
              onChange={(e) => setSheetTabPrefix(e.target.value)}
              placeholder="e.g. Run 2024-05-10"
              disabled={!sheetSyncEnabled || isRunning}
            />
          </div>

          <div style={{ marginTop: 14 }}>
            <label className="label">Write mode</label>
            <select
              className="select"
              value={sheetAppendMode}
              onChange={(e) => setSheetAppendMode(e.target.value)}
              disabled={!sheetSyncEnabled || isRunning}
            >
              <option value="append">Append rows</option>
              <option value="overwrite">Overwrite sheet</option>
            </select>
          </div>

          <div className="toggleRow" style={{ marginTop: 14 }}>
            <div className="toggleMeta">
              <div className="toggleLabel">Reduce local memory usage</div>
              <div className="toggleHint">
                {sheetAutoClear ? 'Clear local stage data after sync' : 'Keep local stage data'}
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={sheetAutoClear}
                onChange={(e) => setSheetAutoClear(e.target.checked)}
                disabled={!sheetSyncEnabled || isRunning}
              />
              <span className="switchSlider" />
            </label>
          </div>

          <div className="smallNote" style={{ marginTop: 14 }}>
            <b>Status:</b>{' '}
            {sheetStatus?.configured
              ? sheetStatus.mode === 'user'
                ? `Connected as ${sheetStatus.accountEmail || 'signed-in user'}`
                : `Service account ready (${sheetStatus.serviceAccountEmail || 'service account'})`
              : 'Not connected yet'}
          </div>

          <button
            className="btn"
            type="button"
            onClick={refreshSheetStatus}
            disabled={isRunning}
            style={{ marginTop: 12 }}
          >
            Refresh Sheets Status
          </button>

          {sheetStatus?.mode === 'service_account' && (
            <div className="smallNote" style={{ marginTop: 12 }}>
              <b>Reminder:</b> Share the spreadsheet with the service account email above so it can write to new tabs.
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="cardHeader">
          <div className="cardHeaderTitle">
            <AlertTriangle size={16} style={{ color: 'var(--color-primary)' }} />
            Note
          </div>
          <div className="cardHeaderTitle" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
            Columns populate after bulk initial pull export
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
);

export default SettingsPanel;
