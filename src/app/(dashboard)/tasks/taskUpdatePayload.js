const toIsoDate = (value) =>
  value ? new Date(value).toISOString() : undefined;

export function buildTaskUpdatePayload(taskId, values) {
  return {
    id: taskId,
    project_id: values.project_id,
    title: values.title,
    description: values.description,
    department_id: values.department_id || undefined,
    assignee_id: values.assignee_id,
    status: values.status,
    priority: values.priority,
    start_date: toIsoDate(values.start_date),
    due_date: toIsoDate(values.due_date),
    end_date: toIsoDate(values.end_date),
    progress: Number(values.progress) || 0,
    is_template: values.is_template,
    stages: (values.stages || []).map((stage) => ({
      ...(stage._id ? { _id: stage._id } : {}),
      name: stage.name,
      description: stage.description,
      status: stage.status || "pending",
      start_date: toIsoDate(stage.start_date),
      due_date: toIsoDate(stage.due_date),
      ...(stage.rate != null ? { rate: stage.rate } : {}),
      ...(stage.rate_time != null ? { rate_time: stage.rate_time } : {}),
      ...(stage.rate_content != null
        ? { rate_content: stage.rate_content }
        : {}),
      ...(stage.rate_video != null ? { rate_video: stage.rate_video } : {}),
      ...(stage.evaluation_criteria
        ? { evaluation_criteria: stage.evaluation_criteria }
        : {}),
      ...(stage.comment != null ? { comment: stage.comment } : {}),
      ...(stage.attachment != null ? { attachment: stage.attachment } : {}),
    })),
  };
}
