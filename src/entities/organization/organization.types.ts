export interface OrganizationPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  description?: string | null;
  attendanceCheckOutTime?: string;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  description?: string | null;
  attendanceCheckOutTime: string;
  createdAt: string;
  updatedAt: string;
}
