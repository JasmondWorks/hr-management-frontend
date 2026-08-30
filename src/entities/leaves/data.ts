export interface LeaveRecord {
  id: string;
  date: string;
  duration: string;
  days: string;
  reportingManager: string;
  status: "Pending" | "Approved" | "Reject";
}

export const MOCK_LEAVES: LeaveRecord[] = [
  { id: "1", date: "July 01, 2026", duration: "July 05 - July 08", days: "3 Days", reportingManager: "Mark Willians", status: "Pending" },
  { id: "2", date: "Apr 05, 2026", duration: "Apr 06 - Apr 10", days: "4 Days", reportingManager: "Mark Willians", status: "Approved" },
  { id: "3", date: "Mar 12, 2026", duration: "Mar 14 - Mar 16", days: "2 Days", reportingManager: "Mark Willians", status: "Approved" },
  { id: "4", date: "Feb 01, 2026", duration: "Feb 02 - Feb 10", days: "8 Days", reportingManager: "Mark Willians", status: "Approved" },
  { id: "5", date: "Jan 01, 2026", duration: "Jan 16 - Jan 19", days: "3 Days", reportingManager: "Mark Willians", status: "Reject" },
];
