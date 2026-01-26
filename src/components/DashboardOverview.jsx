import React from 'react';
import { Activity, PauseCircle, Sparkles } from 'lucide-react';

const STAGE_LABELS = {
  idle: 'Idle',
  watchdog: 'Bulk initial pull',
  dedup: 'Deduplication',
  purify: 'Purification',
  filter: 'Category filter',
  apify: 'Apify batches',
  fetch: 'Fetching datasets',
  sort: 'Sorting numbers',
  done: 'Complete',
  error: 'Needs attention',
};

const DashboardOverview = ({ isRunning, stage, stats }) => {
  const leadsToday = stats?.apifyItems ?? 0;
  const stageLabel = STAGE_LABELS[stage] || 'Idle';
  const runningLabel = isRunning ? 'Running' : 'Paused';
  const runningDetail = isRunning
    ? `Currently on ${stageLabel}`
    : 'Standing by for the next run.';

  return (
    <div className="dashboardLayout">
      <section className="dashboardPanel">
        <div className="dashboardHero">
          <div className="dashboardHeroEyebrow">System Overview</div>
          <div className="dashboardHeroTitle">Pipeline dashboard</div>
          <div className="dashboardHeroSubtitle">
            Minimal control center for live pipeline health and lead velocity.
          </div>
        </div>

        <div className="dashboardCards">
          <div className="dashboardCard">
            <div className="dashboardCardLabel">Scraper status</div>
            <div className={`dashboardStatus ${isRunning ? 'is-running' : 'is-paused'}`}>
              <span className="dashboardStatusDot" aria-hidden="true" />
              <span className="dashboardStatusLabel">{runningLabel}</span>
              {isRunning ? <Activity size={16} /> : <PauseCircle size={16} />}
            </div>
            <div className="dashboardCardNote">{runningDetail}</div>
          </div>

          <div className="dashboardCard">
            <div className="dashboardCardLabel">Leads gathered today</div>
            <div className="dashboardCardValue">{leadsToday.toLocaleString()}</div>
            <div className="dashboardCardNote">Live count from today’s pipeline activity.</div>
          </div>

          <div className="dashboardCard">
            <div className="dashboardCardLabel">Current step</div>
            <div className="dashboardCardValue">{isRunning ? stageLabel : 'Waiting'}</div>
            <div className="dashboardCardNote">
              {isRunning ? 'Processing the active stage.' : 'No active run at the moment.'}
            </div>
          </div>
        </div>
      </section>

      <section className="dashboardSplinePanel" data-running={isRunning}>
        {isRunning ? (
          <iframe
            title="Interactive AI orb"
            src="https://my.spline.design/interactiveaiwebsite-3w5BVhq8qlQKX5pWGHQkWVGG/"
            frameBorder="0"
            loading="lazy"
            allow="autoplay; fullscreen"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="dashboardSplinePlaceholder">
            <div className="dashboardSplineBadge">
              <Sparkles size={18} />
              <span>Paused</span>
            </div>
            <div className="dashboardSplineHint">Spline animation resumes when the system is running.</div>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardOverview;
