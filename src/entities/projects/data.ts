export interface ProjectRecord {
  id: string;
  serial: number;
  name: string;
  startDate: string;
  finishDate: string;
  status: "Completed" | "In Process";
}

export const MOCK_PROJECTS: ProjectRecord[] = [
  { id: "1", serial: 1, name: "Amongus - Discovery Phase", startDate: "Feb 01, 2026", finishDate: "Mar 05, 2026", status: "Completed" },
  { id: "2", serial: 2, name: "Wildcare - Development Project", startDate: "Feb 12, 2026", finishDate: "April 20, 2026", status: "Completed" },
  { id: "3", serial: 3, name: "Hingutsan Web Development", startDate: "April 05, 2026", finishDate: "October 05, 2026", status: "In Process" },
  { id: "4", serial: 4, name: "Montilisy Ecommerce Platform", startDate: "May 12, 2026", finishDate: "August 12, 2026", status: "In Process" },
];
