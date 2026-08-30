"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { InputField } from "@/shared/ui/InputField";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/shad-cn/card";
import {
  organizationSettingsSchema,
  OrganizationSettingsValues,
} from "../schema";
import { useMyOrganization } from "../api/useMyOrganization";
import { useUpdateMyOrganization } from "../api/useUpdateMyOrganization";

export function OrganizationSettingsBlock() {
  const { data, isLoading } = useMyOrganization();
  const { mutate: updateOrganization, isPending } = useUpdateMyOrganization();

  const organization = data?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<OrganizationSettingsValues>({
    resolver: zodResolver(organizationSettingsSchema),
  });

  useEffect(() => {
    if (organization) {
      reset({
        name: organization.name,
        email: organization.email,
        phone: organization.phone,
        address: organization.address,
        country: organization.country,
        state: organization.state,
        city: organization.city,
        zipCode: organization.zipCode,
        logoUrl: organization.logoUrl,
        websiteUrl: organization.websiteUrl,
        description: organization.description,
        attendanceCheckOutTime: organization.attendanceCheckOutTime,
      });
    }
  }, [organization, reset]);

  if (isLoading) {
    return (
      <Card className="bg-card border-border p-6 flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </Card>
    );
  }

  if (!organization) {
    return null;
  }

  const onSubmit = (values: OrganizationSettingsValues) => {
    updateOrganization(values);
  };

  return (
    <Card className="bg-card border-border p-6 overflow-hidden">
      <div className="flex items-center justify-between py-6 border-b border-border/50">
        <div>
          <h4 className="text-foreground font-medium text-sm">
            Organization Details
          </h4>
          <p className="text-muted-foreground text-sm mt-1">
            Update your organization's core information.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Organization Name"
            {...register("name")}
            errorMessage={errors.name?.message}
          />
          <InputField
            label="Email Address"
            type="email"
            readOnly
            disabled
            {...register("email")}
            errorMessage={errors.email?.message}
          />
          <InputField
            label="Phone Number"
            {...register("phone")}
            errorMessage={errors.phone?.message}
          />
          <InputField
            label="Website URL (Optional)"
            {...register("websiteUrl")}
            errorMessage={errors.websiteUrl?.message}
          />
          <InputField
            label="Address"
            {...register("address")}
            errorMessage={errors.address?.message}
          />
          <InputField
            label="Country"
            {...register("country")}
            errorMessage={errors.country?.message}
          />
          <InputField
            label="State/Province"
            {...register("state")}
            errorMessage={errors.state?.message}
          />
          <InputField
            label="City"
            {...register("city")}
            errorMessage={errors.city?.message}
          />
          <InputField
            label="Zip Code"
            {...register("zipCode")}
            errorMessage={errors.zipCode?.message}
          />
          <InputField
            label="Logo URL (Optional)"
            {...register("logoUrl")}
            errorMessage={errors.logoUrl?.message}
          />
          <div className="col-span-1 md:col-span-2">
            <InputField
              label="Description (Optional)"
              {...register("description")}
              errorMessage={errors.description?.message}
            />
          </div>
        </div>

        <div className="py-6 border-t border-border/50">
          <h4 className="text-foreground font-medium text-sm mb-4">
            Attendance Settings
          </h4>
          <div className="max-w-sm">
            <InputField
              label="Auto Check-Out Time (24h)"
              placeholder="17:00"
              {...register("attendanceCheckOutTime")}
              errorMessage={errors.attendanceCheckOutTime?.message}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border/50">
          <Button type="submit" disabled={!isDirty || isPending}>
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
