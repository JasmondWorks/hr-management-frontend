import { Organization } from "@/entities/organization/organization.types";

export type WorkLocation = "REMOTE" | "HYBRID" | "ON_SITE";
export type ContractType = "FULL_TIME" | "PART_TIME" | "CONTRACT";
export type JobStatus = "OPEN" | "CLOSED";

export interface Department {
  id: string;
  name: string;
  description?: string | null;
  location?: string | null;
  organizationId: string;
}

export interface JobOfficeBranch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  isHeadquarters: boolean;
}

export interface DepartmentDesignation {
  id: string;
  name: string;
  departmentId: string;
}

export interface Job {
  id: string;
  name: string;
  description: string | null;
  amount: number | null;
  workLocation: WorkLocation;
  contractType: ContractType;
  contractDuration: string | null;
  status: JobStatus;
  departmentId: string;
  departmentDesignationId: string;
  officeBranchId: string | null;
  officeBranch?: JobOfficeBranch | null;
  createdAt: string;
  updatedAt: string;
  department?: Department;
  departmentDesignation?: DepartmentDesignation;
  organizationId: string;
  organization?: Organization;
}

export interface JobQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: JobStatus;
  workLocation?: WorkLocation;
  contractType?: ContractType;
  departmentId?: string;
  officeBranchId?: string;
}

export interface JobPaginationResponse {
  data: Job[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
