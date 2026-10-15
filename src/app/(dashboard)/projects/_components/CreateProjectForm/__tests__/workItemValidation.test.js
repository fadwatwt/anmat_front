import { createProjectValidationSchema, createTaskValidationSchema } from "../workItemValidation";
import { describe, expect, it } from "@jest/globals";

const t = (key) => key;

describe("work item validation", () => {
  it("accepts a valid project and rejects an invalid date range", async () => {
    const schema = createProjectValidationSchema(t);
    await expect(schema.isValid({ name: "Website", progress: 25, start_date: "2026-10-10", due_date: "2026-10-11" })).resolves.toBe(true);
    await expect(schema.isValid({ name: "Website", progress: 25, start_date: "2026-10-12", due_date: "2026-10-11" })).resolves.toBe(false);
  });

  it("requires the core task fields and limits progress", async () => {
    const schema = createTaskValidationSchema(t);
    await expect(schema.isValid({ project_id: "project-1", title: "Prepare report", assignee_id: "employee-1", progress: 100 })).resolves.toBe(true);
    await expect(schema.isValid({ project_id: "", title: "", assignee_id: "", progress: 101 })).resolves.toBe(false);
  });
});
