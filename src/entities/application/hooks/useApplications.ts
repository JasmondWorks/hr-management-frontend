import { useCrud } from "@/shared/hooks/useCrud";
import { Application } from "../application.service";

export const {
  useFindAll: useApplications,
  useFindOne: useApplication,
  useCreate: useCreateApplication,
  useUpdate: useUpdateApplication,
  useDelete: useDeleteApplication,
} = useCrud<Application, any, any>({
  baseQueryKey: ["applications"],
  endpoint: "/applications",
});
