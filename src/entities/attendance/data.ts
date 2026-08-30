export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  break: string;
  workingHours: string;
  status: "On Time" | "Late" | "Absent";
}

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: "1", date: "July 01, 2026", checkIn: "09:28 AM", checkOut: "07:00 PM", break: "00:30 Min", workingHours: "09:02 Hrs", status: "On Time" },
  { id: "2", date: "July 02, 2026", checkIn: "09:20 AM", checkOut: "07:00 PM", break: "00:20 Min", workingHours: "09:20 Hrs", status: "On Time" },
  { id: "3", date: "July 03, 2026", checkIn: "09:25 AM", checkOut: "07:00 PM", break: "00:30 Min", workingHours: "09:05 Hrs", status: "On Time" },
  { id: "4", date: "July 04, 2026", checkIn: "09:45 AM", checkOut: "07:00 PM", break: "00:40 Min", workingHours: "08:35 Hrs", status: "Late" },
  { id: "5", date: "July 05, 2026", checkIn: "10:00 AM", checkOut: "07:00 PM", break: "00:30 Min", workingHours: "08:30 Hrs", status: "Late" },
  { id: "6", date: "July 06, 2026", checkIn: "09:28 AM", checkOut: "07:00 PM", break: "00:30 Min", workingHours: "09:02 Hrs", status: "On Time" },
  { id: "7", date: "July 07, 2026", checkIn: "09:30 AM", checkOut: "07:00 PM", break: "00:15 Min", workingHours: "09:15 Hrs", status: "On Time" },
  { id: "8", date: "July 08, 2026", checkIn: "09:52 AM", checkOut: "07:00 PM", break: "00:45 Min", workingHours: "08:23 Hrs", status: "Late" },
  { id: "9", date: "July 09, 2026", checkIn: "09:10 AM", checkOut: "07:00 PM", break: "00:30 Min", workingHours: "09:02 Hrs", status: "On Time" },
  { id: "10", date: "July 10, 2026", checkIn: "09:48 AM", checkOut: "07:00 PM", break: "00:42 Min", workingHours: "08:30 Hrs", status: "Late" },
];
