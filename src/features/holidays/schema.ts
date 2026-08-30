import * as z from "zod";

export const holidaySchema = z.object({
  name: z.string().min(1, "Holiday Name is required"),
  date: z.string().min(1, "Date is required"),
});

export type HolidayFormValues = z.infer<typeof holidaySchema>;
