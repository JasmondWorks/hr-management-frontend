export interface EmployeeNamedRef {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  firstName?: string; // Optional since it might be inside user
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;

  departmentId?: string | null;
  designationId?: string | null;
  officeBranchId?: string | null;
  salary?: number | null;
  joiningDate?: string | null;
  employeeType?: "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | null;
  workLocation?: "ON_SITE" | "REMOTE" | "HYBRID" | null;

  department?: EmployeeNamedRef | null;
  // Current job title. Lives on the employee alongside the department it belongs
  // to — there is no separate enrollment record.
  designation?: EmployeeNamedRef | null;
  officeBranch?: (EmployeeNamedRef & { isHeadquarters: boolean }) | null;

  user?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    businessRole?: string;
    avatarUrl?: string;
    // False until the employee has completed their own onboarding — an invited
    // person who accepted but never filled in their details.
    isOnboarded?: boolean;
  };
}

export type UpdateEmployeeDto = Partial<Omit<Employee, "id">>;
