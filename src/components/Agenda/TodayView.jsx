"use client";

import HourlyTimeline from "./HourlyTimeline";
import TodayRightPanel from "./TodayRightPanel";
import AgendaSummaryBar from "./AgendaSummaryBar";

function TodayView({ onOpenCreateModal }) {
  return (
    <div className="space-y-4">
      <AgendaSummaryBar />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column — Hourly timeline */}
        <div className="lg:col-span-2">
          <HourlyTimeline />
        </div>

        {/* Right column — Priorities, tasks, notes */}
        <div>
          <TodayRightPanel onOpenCreateModal={onOpenCreateModal} />
        </div>
      </div>
    </div>
  );
}

export default TodayView;
