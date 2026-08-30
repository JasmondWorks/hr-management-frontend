import { StatCard } from "./StatCard";
import { MyScheduleWidget } from "./components/MyScheduleWidget";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { useCandidateDashboardStats } from "@/features/dashboard/hooks/useDashboard";
import { Skeleton } from "@/shared/ui/skeleton";

export function CandidateDashboard() {
  const { data: response, isLoading, isError } = useCandidateDashboardStats();

  if (isLoading) {
    return (
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
        <div className="w-full xl:w-[350px] shrink-0">
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !response) {
    return <div>Failed to load dashboard data</div>;
  }

  const { stats, recentApplications } = response.data;

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Left Column (Main Content) */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Applications" value={stats.applications} />
          <StatCard label="Interviews" value={stats.interviews} />
          <StatCard label="Open Jobs" value={stats.openJobs} />
        </div>
        
        {/* Recent Applications List */}
        <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-lg font-semibold">Recent Applications</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-muted-foreground border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Applied Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-accent/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{app.role}</td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(app.date).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })}</td>
                    <td className="px-6 py-4">
                      <StatusBadge statusVariant={
                        app.status === "HIRED" || app.status === "ACCEPTED" || app.status === "OFFERED" ? "success" : 
                        app.status === "REJECTED" ? "danger" : "warning"
                      }>
                        {app.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
                {recentApplications.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column (Sidebar) */}
      <div className="w-full xl:w-[350px] shrink-0">
        <MyScheduleWidget />
      </div>
    </div>
  );
}

export default CandidateDashboard;
