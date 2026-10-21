import { buildTaskUpdatePayload } from "../taskUpdatePayload";

describe("buildTaskUpdatePayload", () => {
  it("preserves evaluated stage data without clearing task history", () => {
    const payload = buildTaskUpdatePayload("task-1", {
      project_id: "project-1",
      department_id: "department-1",
      assignee_id: "employee-1",
      title: "Updated task",
      description: "Description",
      status: "in-progress",
      priority: "high",
      progress: "40",
      is_template: false,
      stages: [
        {
          _id: "stage-1",
          name: "Review",
          description: "Review stage",
          status: "completed",
          rate: 4,
          rate_time: 5,
          rate_content: 4,
          rate_video: 3,
          evaluation_criteria: { quality: 4 },
          comment: "Good",
          attachment: "review.pdf",
        },
      ],
    });

    expect(payload.stages[0]).toEqual(
      expect.objectContaining({
        _id: "stage-1",
        rate: 4,
        rate_time: 5,
        rate_content: 4,
        rate_video: 3,
        evaluation_criteria: { quality: 4 },
        comment: "Good",
        attachment: "review.pdf",
      }),
    );
    expect(payload).not.toHaveProperty("comments");
    expect(payload).not.toHaveProperty("ratings");
    expect(payload).not.toHaveProperty("time_tracks");
  });
});
