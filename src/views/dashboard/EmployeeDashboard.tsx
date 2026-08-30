import { StatCard } from "./StatCard";
import { MyScheduleWidget } from "./components/MyScheduleWidget";
import { DashboardAttendanceList } from "./components/DashboardAttendanceList";

export function EmployeeDashboard() {
  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Left Column (Main Content) */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="My Attendance" value="98%" trend="up" delta="2%" />
          <StatCard label="Leave Balance" value="12" />
          <StatCard label="My Projects" value={4} />
          <StatCard label="Payslips" value={12} />
        </div>
        
        {/* We can reuse the DashboardAttendanceList for now, or imagine it's filtered for the employee */}
        <DashboardAttendanceList />
      </div>

      {/* Right Column (Sidebar) */}
      <div className="w-full xl:w-[350px] shrink-0">
        <MyScheduleWidget />
      </div>
    </div>
  );
}

export default EmployeeDashboard;
