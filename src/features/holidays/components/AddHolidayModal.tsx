"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/ui/shad-cn/dialog";
import { Button } from "@/shared/ui/shad-cn/button";
import { InputField } from "@/shared/ui";
import { holidaySchema, type HolidayFormValues } from "../schema";

interface AddHolidayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; date: string }) => void;
}

export function AddHolidayModal({ isOpen, onClose, onSubmit }: AddHolidayModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HolidayFormValues>({
    resolver: zodResolver(holidaySchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      date: "",
    },
  });

  const submit = (data: HolidayFormValues) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-[#1A1A1A] border-border rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Holiday</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)}>
          <div className="flex flex-col gap-4 py-4">
            <InputField 
              label="Holiday Name"
              placeholder="e.g. Christmas" 
              {...register("name")}
              errorMessage={errors.name?.message}
            />
            <InputField 
              label="Date"
              type="date"
              {...register("date")}
              errorMessage={errors.date?.message}
              className="w-full block [color-scheme:dark]"
            />
          </div>
          <DialogFooter className="flex space-x-2 mt-4 sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="bg-transparent border-border hover:bg-white/5">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
