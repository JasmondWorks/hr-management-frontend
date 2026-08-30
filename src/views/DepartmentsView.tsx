"use client";

import { useState } from "react";
import { useDepartments, AddDepartmentModal } from "@/features/department";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/shad-cn/card";
import { Search, ChevronRight, Loader2, Plus } from "lucide-react";
import { Input } from "@/shared/ui/shad-cn/input";
import { Button } from "@/shared/ui/shad-cn/button";
import { EmptyState } from "@/shared/ui";
import { useAuth } from "@/features/auth";
import { APP_ROLES } from "@/shared/lib/roles";
import Link from "next/link";

export function DepartmentsView() {
  const [addOpen, setAddOpen] = useState(false);
  const { appRole } = useAuth();
  const { data, isLoading } = useDepartments({ limit: 100 });
  const canAdd = appRole === APP_ROLES.ORGANIZATION_ADMIN || appRole === APP_ROLES.DEPARTMENT_ADMIN;

  return (
    <div className="flex flex-col gap-8 h-full pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">All Departments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All Departments Information
          </p>
        </div>
        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search" 
            className="pl-9 bg-card border-border h-10" 
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !data?.data?.length ? (
        <EmptyState
          icon={<Search />}
          title="No Departments Found"
          description="There are currently no departments in your organization. Get started by adding your first department."
          action={
            canAdd ? (
              <Button onClick={() => setAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Department
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {data.data.map((dept) => (
            <Card key={dept.id} className="bg-card border-border h-fit">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{dept.name}</CardTitle>
                <Link 
                  href={`/departments/${dept.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  View All
                </Link>
              </CardHeader>
              <CardContent>
                {dept.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {dept.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <span>{dept.employees?.length || 0} Members</span>
                  {dept.location && (
                    <span className="flex items-center gap-1">
                      &bull; {dept.location}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col space-y-4">
                  {dept.employees?.slice(0, 5).map((emp) => (
                    <Link href={`/departments/${dept.id}`} key={emp.id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold">
                          {emp.user?.firstName?.[0]}{emp.user?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none text-foreground group-hover:text-primary transition-colors">
                            {emp.user?.firstName} {emp.user?.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {emp.user?.businessRole || "Employee"}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddDepartmentModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

export default DepartmentsView;
