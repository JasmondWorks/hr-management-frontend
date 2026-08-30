import React from "react";
import { ChevronDown } from "@/shared/ui/icons";
import { useAdminDashboardStats } from "@/features/dashboard/hooks/useDashboard";

const yAxisLabels = ["100%", "80%", "60%", "40%", "20%", "0"];

export function AttendanceOverviewChart() {
  const { data: response, isLoading } = useAdminDashboardStats();
  const chartData = response?.data?.chartData || [];

  return (
    <div className="rounded-xl border border-border bg-card p-6 flex flex-col h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Attendance Overview</h2>
        <button className="flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-md px-3 py-1 hover:bg-accent/50 transition-colors">
          Today
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex relative">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between items-end pr-4 text-xs text-muted-foreground pb-6 w-12 shrink-0">
          {yAxisLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex-1 relative flex justify-between items-end pb-6 border-b border-border/20">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              Loading chart...
            </div>
          ) : (
            chartData.map((data) => (
              <div key={data.day} className="flex flex-col items-center flex-1 group">
                <div className="w-2.5 sm:w-3.5 h-[250px] relative flex flex-col justify-end gap-1 pb-2">
                  {/* Segments */}
                  <div
                    className="w-full bg-[#f43f5e] rounded-full transition-all duration-300 group-hover:opacity-80"
                    style={{ height: `${data.segment3}%` }}
                  />
                  <div
                    className="w-full bg-[#fbbf24] rounded-full transition-all duration-300 group-hover:opacity-80"
                    style={{ height: `${data.segment2}%` }}
                  />
                  <div
                    className="w-full bg-[#ea580c] rounded-full transition-all duration-300 group-hover:opacity-80"
                    style={{ height: `${data.segment1}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground absolute bottom-0 translate-y-full pt-2">
                  {data.day}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
