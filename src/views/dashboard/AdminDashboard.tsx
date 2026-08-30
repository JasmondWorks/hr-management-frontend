import { StatCard } from "./StatCard";
import { AttendanceOverviewChart } from "./components/AttendanceOverviewChart";
import { DashboardAttendanceList } from "./components/DashboardAttendanceList";
import { MyScheduleWidget } from "./components/MyScheduleWidget";
import { useAdminDashboardStats } from "@/features/dashboard/hooks/useDashboard";

export function AdminDashboard() {
  const { data: response, isLoading } = useAdminDashboardStats();
  const stats = response?.data?.stats;
  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Left Column (Main Content) */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            label="Total Employee" 
            value={stats?.totalEmployees?.value ?? 0} 
            delta={stats?.totalEmployees?.delta ?? "0%"} 
            trend={stats?.totalEmployees?.trend ?? "up"} 
            loading={isLoading}
          />
          <StatCard 
            label="Total Applicant" 
            value={stats?.totalApplicants?.value ?? 0} 
            delta={stats?.totalApplicants?.delta ?? "0%"} 
            trend={stats?.totalApplicants?.trend ?? "up"} 
            loading={isLoading}
          />
          <StatCard
            label="Today Attendance"
            value={stats?.todayAttendance?.value ?? 0}
            delta={stats?.todayAttendance?.delta ?? "0%"}
            trend={stats?.todayAttendance?.trend ?? "up"}
            loading={isLoading}
          />
          <StatCard 
            label="Total Projects" 
            value={stats?.totalProjects?.value ?? 0} 
            delta={stats?.totalProjects?.delta ?? "0%"} 
            trend={stats?.totalProjects?.trend ?? "up"} 
            loading={isLoading}
          />
        </div>

        <AttendanceOverviewChart />
        <DashboardAttendanceList />
      </div>

      {/* Right Column (Sidebar) */}
      <div className="w-full xl:w-[350px] shrink-0">
        <MyScheduleWidget />
      </div>
    </div>
  );
}

export default AdminDashboard;
