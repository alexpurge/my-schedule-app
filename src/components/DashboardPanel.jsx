import React from 'react';
import { AlertCircle, CheckCircle, Download, FileDown, Filter, Layers, Loader2, Play, X } from 'lucide-react';

const DashboardPanel = ({
  watchdogKeywordsInput,
  setWatchdogKeywordsInput,
  watchdogCountry,
  setWatchdogCountry,
  watchdogActiveStatus,
  setWatchdogActiveStatus,
  watchdogMinDate,
  setWatchdogMinDate,
  watchdogMaxDate,
  setWatchdogMaxDate,
  dateViolationEnabled,
  setDateViolationEnabled,
  dateViolationStreakLimit,
  setDateViolationStreakLimit,
  defaultDateViolationStreakLimit,
  watchdogMaxItems,
  setWatchdogMaxItems,
  watchdogMaxConcurrency,
  setWatchdogMaxConcurrency,
  watchdogMaxRuntime,
  setWatchdogMaxRuntime,
  memory,
  setMemory,
  isRunning,
  runPipeline,
  logs,
  logRef,
  stats,
  filteredOutTotal,
  keywordCount,
  downloadCsvSnapshot,
  filteredRows,
  prePullReady,
  dedupColumn,
  filterColumn,
  finalWorkbookAvailable,
  downloadFinalSpreadsheet,
  error,
  stage,
  watchdogUiStats,
  watchdogJobs,
  abortWatchdogJob,
}) => {
  return (
    <div className="grid">
    {/* LEFT COLUMN */}
    <div className="leftCol">
      {/* Watchdog Config (NEW) */}
      <div className="card cardAccent" style={{ marginBottom: 16 }}>
        <div className="cardHeader">
          <div className="cardHeaderTitle">
            <Layers size={16} style={{ color: 'var(--color-primary)' }} />
            Bulk Initial Pull
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
                {dateViolationEnabled ? 'On' : 'Off'} • Abort after {dateViolationStreakLimit} consecutive day-before-minimum dates
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
            <div>
              <label className="label">Abort After X Consecutive Days</label>
              <input
                className="input"
                type="number"
                min="1"
                step="1"
                value={dateViolationStreakLimit}
                onChange={(e) => {
                  const nextValue = Number(e.target.value);
                  if (!Number.isFinite(nextValue)) {
                    setDateViolationStreakLimit(defaultDateViolationStreakLimit);
                    return;
                  }
                  setDateViolationStreakLimit(Math.max(1, Math.floor(nextValue)));
                }}
                disabled={isRunning}
              />
            </div>
            <div />
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

            <div>
              <label className="label">Memory Limit (MB)</label>
              <input
                className="input"
                type="number"
                value={memory}
                onChange={(e) => setMemory(Number(e.target.value) || 0)}
                disabled={isRunning}
              />
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
            {keywordCount} category filter keywords loaded
          </div>
        </div>

        <div className="cardBody">
          <div className="summaryStrip">
            <div className="summaryStat">
              <span>Bulk pull rows</span>
              <strong>{stats.watchdogExportedRows}</strong>
            </div>
            <div className="summaryStat">
              <span>Filtered out</span>
              <strong className="summaryNegative">{filteredOutTotal}</strong>
            </div>
            <div className="summaryStat">
              <span>Apify records</span>
              <strong>{stats.apifyItems}</strong>
            </div>
          </div>

          <details className="disclosure">
            <summary>View pipeline breakdown</summary>
            <div className="disclosureBody">
              <div className="tiles">
                <div className="tile">
                  <div className="tileK">Bulk Initial Pull Rows</div>
                  <div className="tileV">{stats.watchdogExportedRows}</div>
                  <div className="tileSub">Auto-exported into pipeline</div>
                </div>

                <div className="tile">
                  <div className="tileK">Filtered Out</div>
                  <div className="tileV red">{filteredOutTotal}</div>
                  <div className="tileSub">Dedup + Foreign Language + Category</div>
                </div>

                <div className="tile">
                  <div className="tileK">Apify Records</div>
                  <div className="tileV orange">{stats.apifyItems}</div>
                  <div className="tileSub">Merged dataset items</div>
                </div>
              </div>

              <div className="breakGrid">
                <div className="breakItem">
                  <div className="breakH">Bulk Initial Pull</div>
                  <div className="breakLine">
                    <span>Keywords</span> <span className="mono">{stats.watchdogKeywords}</span>
                  </div>
                  <div className="breakLine" style={{ marginTop: 8 }}>
                    <span>Jobs</span>
                    <span className="mono">
                      {stats.watchdogSucceeded} ok / {stats.watchdogFailed} fail / {stats.watchdogAborted} aborted
                    </span>
                  </div>
                </div>

                <div className="breakItem">
                  <div className="breakH">Deduplicator</div>
                  <div className="breakLine">
                    <span>Removed</span> <span className="mono">{stats.dedupRemoved}</span>
                  </div>
                  <div className="breakLine" style={{ marginTop: 8 }}>
                    <span>Remaining</span> <span className="mono">{stats.afterDedup}</span>
                  </div>
                </div>

                <div className="breakItem">
                  <div className="breakH">Foreign Language Detector</div>
                  <div className="breakLine">
                    <span>Removed</span> <span className="mono">{stats.purifierRemoved}</span>
                  </div>
                  <div className="breakLine" style={{ marginTop: 8 }}>
                    <span>Remaining</span> <span className="mono">{stats.afterPurify}</span>
                  </div>
                </div>

                <div className="breakItem">
                  <div className="breakH">Category Filter</div>
                  <div className="breakLine">
                    <span>Removed</span> <span className="mono">{stats.masterFilterRemoved}</span>
                  </div>
                  <div className="breakLine" style={{ marginTop: 8 }}>
                    <span>Remaining</span> <span className="mono">{stats.afterMasterFilter}</span>
                  </div>
                </div>

                <div className="breakItem">
                  <div className="breakH">Pre-Pulled Master</div>
                  <div className="breakLine">
                    <span>Rows</span> <span className="mono">{stats.afterMasterFilter}</span>
                  </div>
                  <div className="breakLine" style={{ marginTop: 8 }}>
                    <span>Status</span>
                    <span className="mono">{prePullReady ? 'Ready' : 'Pending'}</span>
                  </div>
                  <button
                    className="btn btnSmall"
                    type="button"
                    style={{ marginTop: 10, width: '100%', justifyContent: 'center' }}
                    onClick={() => downloadCsvSnapshot('pre_pulled_master', filteredRows)}
                    disabled={!prePullReady}
                    title="Download pre-pulled master CSV"
                  >
                    <Download size={14} />
                    Download CSV
                  </button>
                </div>

                <div className="breakItem">
                  <div className="breakH">Profile Puller</div>
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
                <div className="breakH">AU Number Sorter</div>
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
            </div>
          </details>

          <button
            className="btn"
            onClick={downloadFinalSpreadsheet}
            disabled={!finalWorkbookAvailable}
            type="button"
            style={{ width: '100%', marginTop: 14, justifyContent: 'center' }}
            title="Download final spreadsheet"
          >
            {finalWorkbookAvailable ? (
              <>
                <FileDown size={16} />
                Download Final Spreadsheet (.xlsx)
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
                <div className="noticeTitle noticeTitleLarge">COMPLETE</div>
                <div className="noticeDesc">Export is ready.</div>
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
            Bulk Initial Pull Queue
          </div>
          <div className="cardHeaderTitle" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
            {watchdogUiStats.total
              ? `${watchdogUiStats.succeeded}/${watchdogUiStats.total} complete • ${watchdogUiStats.running} active`
              : 'No jobs yet'}
          </div>
        </div>

        <div className="cardBody">
          <div className="summaryStrip summaryStripCompact">
            <div className="summaryStat">
              <span>Total queued</span>
              <strong>{watchdogUiStats.total}</strong>
            </div>
            <div className="summaryStat">
              <span>Running</span>
              <strong className="summaryAccent">{watchdogUiStats.running}</strong>
            </div>
            <div className="summaryStat">
              <span>Retrying</span>
              <strong>{watchdogUiStats.retrying}</strong>
            </div>
          </div>

          <details className="disclosure">
            <summary>View queue details</summary>
            <div className="disclosureBody">
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
                          No bulk initial pull jobs yet. Run the pipeline to start.
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
            </div>
          </details>

          <div className="smallNote">
            <b>Note:</b> Export happens automatically once all jobs are done (single CSV internally), then the pipeline continues.
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DashboardPanel;
