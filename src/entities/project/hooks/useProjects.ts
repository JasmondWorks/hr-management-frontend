import { useCrud } from "@/shared/hooks/useCrud";
import { Project } from "../project.service";

export const {
  useFindAll: useProjects,
  useFindOne: useProject,
  useCreate: useCreateProject,
  useUpdate: useUpdateProject,
  useDelete: useDeleteProject,
} = useCrud<Project, any, any>({
  baseQueryKey: ["projects"],
  endpoint: "/projects",
});
