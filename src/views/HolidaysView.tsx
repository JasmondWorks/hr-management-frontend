"use client";

import { useState } from "react";
import { useHolidays, useCreateHoliday } from "@/features/holidays";
import { Search, Plus } from "lucide-react";
import { Input } from "@/shared/ui/shad-cn/input";
import { Card } from "@/shared/ui/shad-cn/card";
import Table from "@/shared/ui/Table";
import { TableColumn } from "@/shared/ui/Table/types";
import { Button } from "@/shared/ui/shad-cn/button";
import { AddHolidayModal } from "@/features/holidays/components/AddHolidayModal";
import toast from "react-hot-toast";

export function HolidaysView() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useHolidays({ limit: 100 });

  const createHolidayMutation = useCreateHoliday();

  const holidays = data?.data || [];

  const columns: TableColumn<any>[] = [
    {
      key: "date",
      label: "Date",
      render: (row) => {
        const dateObj = new Date(row.date);
        const dateStr = dateObj.toLocaleDateString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
        });
        const isPast = dateObj < new Date();
        const dotColor = isPast ? "bg-muted-foreground" : "bg-primary";

        return (
          <div className="pl-6 relative">
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 ${dotColor} rounded-r-md`}
            ></div>
            {dateStr}
          </div>
        );
      },
    },
    {
      key: "day",
      label: "Day",
      render: (row) =>
        new Date(row.date).toLocaleDateString("en-US", { weekday: "long" }),
    },
    {
      key: "holidayName",
      label: "Holiday Name",
      render: (row) => row.name,
    },
  ];

  const handleAddHoliday = (data: { name: string; date: string }) => {
    // Check if valid date
    const d = new Date(data.date);
    if (!isNaN(d.getTime())) {
      createHolidayMutation.mutate(
        { name: data.name, date: d.toISOString() },
        {
          onSuccess: () => {
            toast.success("Holiday created successfully");
            setIsModalOpen(false);
          },
          onError: (error: Error) =>
            toast.error(error.message || "Failed to create holiday"),
        },
      );
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Holidays</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All Holiday Lists
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="pl-9 bg-card border-border h-10"
            />
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Holiday
          </Button>
        </div>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <Table
          columns={columns}
          data={holidays}
          loading={isLoading}
          hasHeaders={true}
          isPaginated={false}
        />
        <div className="p-4 border-t border-border/50 flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2 text-foreground font-medium">
            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
            <span>Upcoming</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground"></div>
            <span>Past Holidays</span>
          </div>
        </div>
      </Card>

      <AddHolidayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddHoliday}
      />
    </div>
  );
}

export default HolidaysView;
