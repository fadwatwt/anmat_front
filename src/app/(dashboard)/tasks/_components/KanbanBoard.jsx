"use client";

import { useMemo, useState, useCallback } from "react";
import { DndContext, DragOverlay, PointerSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
import PropTypes from "prop-types";
import KanbanColumn from "./KanbanColumn";
import KanbanTaskCard from "./KanbanTaskCard";
import { KANBAN_COLUMNS } from "./kanbanConstants";

function KanbanBoard({ tasks = [], onStatusChange }) {
  const [activeTask, setActiveTask] = useState(null);
  const [optimisticTasks, setOptimisticTasks] = useState({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const tasksByStatus = useMemo(() => {
    const grouped = {};
    KANBAN_COLUMNS.forEach((col) => {
      grouped[col.id] = [];
    });
    tasks.forEach((task) => {
      const overriddenStatus = optimisticTasks[task._id];
      const status = overriddenStatus || task.status || "open";
      if (grouped[status]) {
        grouped[status].push({ ...task, status });
      } else {
        grouped["open"].push({ ...task, status: "open" });
      }
    });
    return grouped;
  }, [tasks, optimisticTasks]);

  const handleDragStart = useCallback((event) => {
    const { active } = event;
    const task = tasks.find((t) => t._id === active.id);
    if (task) {
      setActiveTask(task);
    }
  }, [tasks]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    if (task.status === newStatus) return;

    setOptimisticTasks((prev) => ({ ...prev, [taskId]: newStatus }));

    if (onStatusChange) {
      const promise = onStatusChange(taskId, newStatus);
      if (promise && typeof promise.catch === "function") {
        promise.catch(() => {
          setOptimisticTasks((prev) => {
            const next = { ...prev };
            delete next[taskId];
            return next;
          });
        });
      }
    }
  }, [tasks, onStatusChange]);

  const handleDragCancel = useCallback(() => {
    setActiveTask(null);
  }, []);

  return (
    <div className="w-full">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scroll">
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasksByStatus[column.id] || []}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="w-[270px] opacity-90 rotate-2">
              <KanbanTaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

KanbanBoard.propTypes = {
  tasks: PropTypes.array,
  onStatusChange: PropTypes.func,
};

export default KanbanBoard;
