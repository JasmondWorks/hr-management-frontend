import { useCrud } from "@/shared/hooks/useCrud";
import { AttendanceRecord } from "../attendance.service";

export const {
  useFindAll: useAttendances,
  useFindOne: useAttendance,
  useCreate: useCreateAttendance,
  useUpdate: useUpdateAttendance,
  useDelete: useDeleteAttendance,
} = useCrud<AttendanceRecord, any, any>({
  baseQueryKey: ["attendance"],
  endpoint: "/attendance",
});
