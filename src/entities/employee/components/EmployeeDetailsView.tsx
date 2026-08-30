"use client";

// @ts-nocheck
import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/shad-cn/tabs";
import {
  User,
  Attendance,
  Jobs as BriefcaseIcon,
  Documents as DocumentTextIcon,
  Edit as PencilSquareIcon,
  Mail,
  Secure,
} from "@/shared/ui/icons";

import { EditProfileModal } from "@/features/employee/edit-profile/ui/EditProfileModal";
import { ManageRoleModal } from "@/features/employee/manage-role/ui/ManageRoleModal";
import { AssignDepartmentModal } from "@/features/employee";
import { Building2 } from "lucide-react";
import { AttendanceTable } from "@/entities/attendance/components/AttendanceTable";
import { ProjectsTable } from "@/entities/projects/components/ProjectsTable";
import { LeavesTable } from "@/entities/leaves/components/LeavesTable";

import {
  useEmployee,
} from "@/entities/employee/hooks/useEmployees";
import { useAuth } from "@/features/auth";
import { Button } from "@/shared/ui/shad-cn/button";
import toast from "react-hot-toast";

export function EmployeeDetailsView({ employeeId }: { employeeId: string }) {
  const [activeVerticalTab, setActiveVerticalTab] = useState("profile");
  const [activeProfileTab, setActiveProfileTab] = useState("personal");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isManageRoleOpen, setIsManageRoleOpen] = useState(false);
  const [isAssignDepartmentOpen, setIsAssignDepartmentOpen] = useState(false);

  const { data: response, isLoading, error } = useEmployee(employeeId);
  const employee = response?.data;

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-muted-foreground">
        Loading employee details...
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-red-500">
        Error loading employee details.
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="rounded-xl border border-border bg-card flex flex-col overflow-hidden">
        {/* Header Section */}
        <div className="p-6 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
              {(employee.user as any)?.avatarUrl ? (
                <img
                  src={(employee.user as any).avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  {employee.user?.firstName?.[0]}
                  {employee.user?.lastName?.[0]}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {employee.user?.firstName} {employee.user?.lastName}
              </h2>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <BriefcaseIcon className="w-4 h-4 fill-current" />{" "}
                  {employee.user?.businessRole === "ORGANIZATION_ADMIN"
                    ? "Organization Admin"
                    : employee.user?.businessRole === "DEPARTMENT_ADMIN"
                    ? "Department Admin"
                    : employee.user?.businessRole === "HR"
                    ? "HR"
                    : "Team Member"}
                </span>
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 fill-current" />{" "}
                  {employee.user?.email}
                </span>
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />{" "}
                  {employee.department?.name ?? (
                    <span className="italic">No department assigned</span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <PencilSquareIcon className="w-5 h-5 fill-current" />
              Edit Profile
            </button>
            <button
              onClick={() => setIsAssignDepartmentOpen(true)}
              className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Building2 className="w-5 h-5" />
              {employee.department ? "Change Department" : "Assign Department"}
            </button>
            <button
              onClick={() => setIsManageRoleOpen(true)}
              className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Secure className="w-5 h-5 fill-current" />
              Manage Role
            </button>
          </div>
        </div>

        {/* Main Content with Vertical Tabs */}
        <div className="w-full flex">
          <Tabs
            value={activeVerticalTab}
            onValueChange={setActiveVerticalTab}
            orientation="vertical"
            className="flex flex-col md:flex-row w-full"
          >
            <TabsList className="flex-col w-full md:w-64 shrink-0 h-auto bg-transparent border-r border-border rounded-none p-4 gap-2 justify-start">
              <TabsTrigger
                value="profile"
                className="w-full justify-start gap-3 py-3 data-[state=active]:bg-[#f97316] data-[state=active]:text-white"
              >
                <User className="w-5 h-5 fill-current" /> Profile
              </TabsTrigger>
              <TabsTrigger
                value="attendance"
                className="w-full justify-start gap-3 py-3 data-[state=active]:bg-[#f97316] data-[state=active]:text-white"
              >
                <Attendance className="w-5 h-5 fill-current" /> Attendance
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="w-full justify-start gap-3 py-3 data-[state=active]:bg-[#f97316] data-[state=active]:text-white"
              >
                <BriefcaseIcon className="w-5 h-5 fill-current" /> Projects
              </TabsTrigger>
              <TabsTrigger
                value="leave"
                className="w-full justify-start gap-3 py-3 data-[state=active]:bg-[#f97316] data-[state=active]:text-white"
              >
                <DocumentTextIcon className="w-5 h-5 fill-current" /> Leave
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 p-6 min-w-0">
              <TabsContent value="profile" className="mt-0 outline-none">
                <Tabs
                  value={activeProfileTab}
                  onValueChange={setActiveProfileTab}
                >
                  <TabsList
                    variant="line"
                    className="!flex-row w-full justify-start border-b border-border mb-6 overflow-x-auto gap-6 pb-0 h-auto"
                  >
                    <TabsTrigger
                      value="personal"
                      className="flex items-center gap-2 pb-3 rounded-none data-[state=active]:text-[#f97316] dark:data-[state=active]:text-[#f97316] data-[state=active]:after:bg-[#f97316] dark:data-[state=active]:after:bg-[#f97316] group-data-[orientation=horizontal]/tabs:after:bottom-[-1px] bg-transparent"
                    >
                      <User className="w-4 h-4 fill-current" /> Personal
                      Information
                    </TabsTrigger>
                    <TabsTrigger
                      value="professional"
                      className="flex items-center gap-2 pb-3 rounded-none data-[state=active]:text-[#f97316] dark:data-[state=active]:text-[#f97316] data-[state=active]:after:bg-[#f97316] dark:data-[state=active]:after:bg-[#f97316] group-data-[orientation=horizontal]/tabs:after:bottom-[-1px] bg-transparent"
                    >
                      <BriefcaseIcon className="w-4 h-4 fill-current" />{" "}
                      Professional Information
                    </TabsTrigger>
                    <TabsTrigger
                      value="documents"
                      className="flex items-center gap-2 pb-3 rounded-none data-[state=active]:text-[#f97316] dark:data-[state=active]:text-[#f97316] data-[state=active]:after:bg-[#f97316] dark:data-[state=active]:after:bg-[#f97316] group-data-[orientation=horizontal]/tabs:after:bottom-[-1px] bg-transparent"
                    >
                      <DocumentTextIcon className="w-4 h-4 fill-current" />{" "}
                      Documents
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          First Name
                        </p>
                        <p className="font-medium text-foreground">
                          {employee.user?.firstName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Last Name
                        </p>
                        <p className="font-medium text-foreground">
                          {employee.user?.lastName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Mobile Number
                        </p>
                        <p className="font-medium text-foreground">
                          {employee.user?.phone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Email Address
                        </p>
                        <p className="font-medium text-foreground">
                          {employee.user?.email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Date of Birth
                        </p>
                        <p className="font-medium text-foreground">
                          {(employee as any).dob
                            ? new Date(
                                (employee as any).dob,
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Marital Status
                        </p>
                        <p className="font-medium text-foreground">
                          {(employee as any).maritalStatus || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Gender
                        </p>
                        <p className="font-medium text-foreground">
                          {(employee as any).gender || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Nationality
                        </p>
                        <p className="font-medium text-foreground">
                          {(employee as any).nationality || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Address
                        </p>
                        <p className="font-medium text-foreground">
                          {(employee as any).address || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          City
                        </p>
                        <p className="font-medium text-foreground">
                          {(employee as any).city || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          State
                        </p>
                        <p className="font-medium text-foreground">
                          {(employee as any).state || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          ZIP Code
                        </p>
                        <p className="font-medium text-foreground">
                          {(employee as any).zip || "N/A"}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  {/* Other Profile Tabs content would go here */}
                  <TabsContent
                    value="professional"
                    className="mt-0 text-muted-foreground text-sm"
                  >
                    Professional information content
                  </TabsContent>
                  <TabsContent
                    value="documents"
                    className="mt-0 text-muted-foreground text-sm"
                  >
                    Documents content
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="attendance" className="mt-0">
                <AttendanceTable employeeId={employeeId} />
              </TabsContent>
              <TabsContent value="projects" className="mt-0">
                <ProjectsTable employeeId={employeeId} />
              </TabsContent>
              <TabsContent value="leave" className="mt-0">
                <LeavesTable employeeId={employeeId} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        employeeData={employee as any}
      />
      <AssignDepartmentModal
        isOpen={isAssignDepartmentOpen}
        employee={employee}
        onClose={() => setIsAssignDepartmentOpen(false)}
      />

      <ManageRoleModal
        isOpen={isManageRoleOpen}
        onClose={() => setIsManageRoleOpen(false)}
        employee={employee as any}
      />
    </div>
  );
}
