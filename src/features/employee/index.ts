// Public surface of the employee feature. The Employee domain type lives in the
// entity layer; re-exported here so feature services can import it consistently.
export * from "@/entities/employee/types";

export { AssignDepartmentModal } from "./assign-department/ui/AssignDepartmentModal";
export { NoDepartmentNotice } from "./no-department/ui/NoDepartmentNotice";
