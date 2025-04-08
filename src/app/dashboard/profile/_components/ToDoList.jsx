import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ActionsBtns from "@/components/ActionsBtns.jsx";
import useDropdown from "@/Hooks/useDropdown.js";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";
import AddToDoListModal from "@/app/dashboard/profile/_modals/AddToDoList.modal.jsx";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTodosByEmployee,
  createTodo,
  updateTodo,
  deleteTodo,
} from "@/redux/todos/todoSlice";

function ToDoList({ employeeId, isActions = true, className }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { todos = [], loading, error } = useSelector((state) => state.todos);
  const [dropdownOpen, setDropdownOpen] = useDropdown();
  const [isAddToDoModal, setIsAddToDoModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchTodosByEmployee(employeeId));
    }
  }, [dispatch, employeeId]);

  const handleDropdownToggle = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleAddToDoListModal = (todo = null) => {
    setSelectedTodo(todo);
    setIsAddToDoModal(!isAddToDoModal);
  };

  const handleAddTodo = async (todoData) => {
    if (isSubmitting) return; // Prevent duplicate submissions

    setIsSubmitting(true);
    try {
      if (selectedTodo) {
        // Update existing todo
        await dispatch(
          updateTodo({
            todoId: selectedTodo._id,
            todoData: {
              ...todoData,
              // Preserve the ID to ensure proper state update
              _id: selectedTodo._id,
            },
          })
        ).unwrap();
      } else {
        // Create new todo
        await dispatch(createTodo({ employeeId, todoData })).unwrap();
      }

      // Close modal and reset selection
      setIsAddToDoModal(false);
      setSelectedTodo(null);
    } catch (error) {
      console.error("Failed to save todo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await dispatch(deleteTodo(todoId)).unwrap();
      // Reset dropdown after deletion
      setDropdownOpen(null);
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      await dispatch(
        updateTodo({
          todoId: todo._id,
          todoData: {
            ...todo,
            completed: !todo.completed,
            // Ensure ID is included for state update
            _id: todo._id,
          },
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  if (loading && todos.length === 0) {
    return <div className="text-center p-4">Loading todos...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading todos: {error}
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl p-4 w-full gap-4 flex flex-col dark:bg-gray-800 ${className}`}
    >
      <div className={"w-full flex items-center justify-between"}>
        <p className={"text-lg text-start dark:text-gray-200"}>
          {t("To Do List")}
        </p>
        <div className={"flex items-center gap-2"}>
          <div
            className={"flex gap-1 items-center cursor-pointer"}
            onClick={() => handleAddToDoListModal()}
          >
            <FiPlus
              className={"text-primary-base dark:text-primary-200"}
              size={15}
            />
            <span className={"text-primary-base dark:text-primary-200"}>
              {t("Add")}
            </span>
          </div>
        </div>
      </div>
      <div className={"flex flex-col w-full gap-6"}>
        {todos.length > 0 ? (
          todos.map((todo, index) => (
            <div
              className={"flex w-full justify-between items-center relative"}
              key={todo._id || `todo-${index}`}
            >
              <div className={"flex items-center gap-2"}>
                <input
                  type={"checkbox"}
                  className={"checkbox-custom"}
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo)}
                  disabled={loading}
                />
                <p
                  className={`text-sm text-wrap dark:text-gray-300 ${
                    todo.completed
                      ? "line-through text-gray-400"
                      : "text-sub-500"
                  }`}
                >
                  {todo.title}
                </p>
              </div>
              {isActions && (
                <div className={"dropdown-container"}>
                  <PiDotsThreeVerticalBold
                    className="cursor-pointer"
                    onClick={() => handleDropdownToggle(index)}
                  />
                  {dropdownOpen === index && (
                    <ActionsBtns
                      handleEdit={() => handleAddToDoListModal(todo)}
                      handleDelete={() => handleDeleteTodo(todo._id)}
                    />
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            {t("No todos available")}
          </div>
        )}
      </div>
      <AddToDoListModal
        isOpen={isAddToDoModal}
        onClose={() => handleAddToDoListModal()}
        onClick={handleAddTodo}
        initialData={selectedTodo}
      />
    </div>
  );
}

ToDoList.propTypes = {
  employeeId: PropTypes.string.isRequired,
  isActions: PropTypes.bool,
  className: PropTypes.string,
};

export default ToDoList;
