const assignee = {
  open: ["pending", "in-progress", "completed"],
  pending: ["open", "in-progress", "completed"],
  "in-progress": ["pending", "completed"],
  completed: [],
  done: [],
  rejected: ["open", "in-progress"],
  cancelled: [],
};

const manager = {
  open: ["pending", "in-progress", "completed", "done", "rejected", "cancelled"],
  pending: ["open", "in-progress", "completed", "done", "rejected", "cancelled"],
  "in-progress": ["open", "pending", "completed", "done", "rejected", "cancelled"],
  completed: ["in-progress", "done", "rejected"],
  done: ["in-progress"],
  rejected: ["open", "in-progress", "cancelled"],
  cancelled: ["open"],
};

export function availableTaskStatuses(current, canManage) {
  return (canManage ? manager : assignee)[current] || [];
}
