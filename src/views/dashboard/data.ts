// Mock data extracted from dashboard components because there is currently no backend endpoint for them.

export interface ChartData {
  day: string;
  segment1: number; // Bottom (Orange)
  segment2: number; // Middle (Yellow/Light Orange)
  segment3: number; // Top (Red/Pink)
}

export const mockChartData: ChartData[] = [
  { day: "Mon", segment1: 65, segment2: 20, segment3: 10 },
  { day: "Tue", segment1: 60, segment2: 18, segment3: 15 },
  { day: "Wed", segment1: 50, segment2: 25, segment3: 20 },
  { day: "Thu", segment1: 62, segment2: 28, segment3: 5 },
  { day: "Fri", segment1: 75, segment2: 15, segment3: 5 },
  { day: "Sat", segment1: 45, segment2: 35, segment3: 15 },
  { day: "Sun", segment1: 55, segment2: 25, segment3: 15 },
];

export interface ScheduleEvent {
  time: string;
  title: string;
  subtitle: string;
}

export interface ScheduleDay {
  date: string;
  events: ScheduleEvent[];
}

export const mockScheduleData: ScheduleDay[] = [
  {
    date: "Wednesday, 06 July 2026",
    events: [
      { time: "09:30", subtitle: "UI/UX Designer", title: "Practical Task Review" },
      { time: "12:00", subtitle: "Magento Developer", title: "Resume Review" },
      { time: "01:30", subtitle: "Sales Manager", title: "Final HR Round" },
    ]
  },
  {
    date: "Thursday, 07 July 2026",
    events: [
      { time: "09:30", subtitle: "Front end Developer", title: "Practical Task Review" },
      { time: "11:00", subtitle: "React JS", title: "TL Meeting" },
    ]
  }
];
