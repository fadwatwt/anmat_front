import * as Yup from "yup";

const optionalDate = () => Yup.date()
  .transform((value, originalValue) => originalValue === "" ? null : value)
  .nullable();

const progress = (t) => Yup.number()
  .typeError(t("Progress must be a number"))
  .min(0, t("Progress cannot be less than 0"))
  .max(100, t("Progress cannot exceed 100"));

export const createProjectValidationSchema = (t) => Yup.object({
  name: Yup.string().trim().min(2, t("Project name must be at least 2 characters")).max(100, t("Project name cannot exceed 100 characters")).required(t("Project name is required")),
  start_date: optionalDate(),
  due_date: optionalDate().min(Yup.ref("start_date"), t("Due date cannot be before start date")),
  started_in: optionalDate(),
  finished_in: optionalDate().min(Yup.ref("started_in"), t("Finish date cannot be before started date")),
  progress: progress(t),
});

export const createTaskValidationSchema = (t) => Yup.object({
  project_id: Yup.string().required(t("Project is required")),
  title: Yup.string().trim().min(2, t("Task title must be at least 2 characters")).max(150, t("Task title cannot exceed 150 characters")).required(t("Task title is required")),
  assignee_id: Yup.string().required(t("Assignee is required")),
  start_date: optionalDate(),
  due_date: optionalDate().min(Yup.ref("start_date"), t("Due date cannot be before start date")),
  end_date: optionalDate().min(Yup.ref("start_date"), t("End date cannot be before start date")),
  progress: progress(t),
});
