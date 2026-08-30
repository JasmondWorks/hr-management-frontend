import React from "react";
import { ChevronLeft, ChevronRight, Calendar, MoreVertical, Loader2 } from "lucide-react";
import { useAdminDashboardStats } from "@/features/dashboard/hooks/useDashboard";



export function MyScheduleWidget() {
  const { data: response, isLoading } = useAdminDashboardStats();
  const scheduleEvents = response?.data?.scheduleEvents || [];

  return (
    <div className="rounded-xl border border-border bg-card p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">My Schedule</h2>
        <button className="w-8 h-8 flex items-center justify-center rounded-md bg-accent text-muted-foreground hover:text-foreground transition-colors">
          <Calendar className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button className="w-7 h-7 flex items-center justify-center rounded bg-[#ea580c] text-white hover:bg-[#c2410c] transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-semibold text-sm">July, 2026</span>
        <button className="w-7 h-7 flex items-center justify-center rounded bg-[#ea580c] text-white hover:bg-[#c2410c] transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-y-4 mb-8 text-center text-xs">
        {/* Days */}
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
          <div key={day} className="text-muted-foreground font-medium">{day}</div>
        ))}
        {/* Empty cells for padding */}
        <div /> <div /> <div /> <div /> <div /> 
        <div>1</div> <div>2</div>
        {/* Week 2 */}
        <div>3</div> <div>4</div> <div>5</div>
        <div className="mx-auto w-6 h-6 flex items-center justify-center rounded-full bg-[#ea580c] text-white font-medium shadow-md shadow-[#ea580c]/20">6</div>
        <div>7</div>
        <div className="mx-auto w-6 h-6 flex items-center justify-center rounded-full bg-[#ea580c] text-white font-medium shadow-md shadow-[#ea580c]/20">8</div>
        <div>9</div>
        {/* Week 3 */}
        <div>10</div> <div>11</div> <div>12</div> <div>13</div> <div>14</div> <div>15</div> <div>16</div>
        {/* Week 4 */}
        <div>17</div> <div>18</div> <div>19</div> <div>20</div> <div>21</div> <div>22</div> <div>23</div>
        {/* Week 5 */}
        <div>24</div> <div>25</div> <div>26</div> <div>27</div> <div>28</div> <div>29</div> <div>30</div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading schedule...
          </div>
        ) : scheduleEvents.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground pt-10">
            No upcoming events found.
          </div>
        ) : (
          scheduleEvents.map((day, dayIdx) => (
            <div key={dayIdx}>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span>{day.date}</span>
                <button className="hover:text-foreground">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {day.events.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="text-sm font-bold w-12 shrink-0">{event.time}</span>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">{event.subtitle}</span>
                      <span className="text-sm font-semibold">{event.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
