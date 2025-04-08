import { useState, useEffect } from "react";
import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import DateInput from "@/components/Form/DateInput.jsx";
import { useTranslation } from "react-i18next";

function AddToDoListModal({ isOpen, onClose, onClick, initialData }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    startDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    description: "",
    priority: "Medium",
    employee: "",
    completed: false,
  });

  useEffect(() => {
    if (initialData) {
      // Format dates for the input fields
      const startDate = initialData.startDate
        ? new Date(initialData.startDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      const dueDate = initialData.dueDate
        ? new Date(initialData.dueDate).toISOString().split("T")[0]
        : new Date(Date.now() + 86400000).toISOString().split("T")[0];

      setFormData({
        title: initialData.title || "",
        startDate,
        dueDate,
        description: initialData.description || "",
        priority: initialData.priority || "Medium",
        employee: initialData.employee || "",
        completed: initialData.completed || false,
      });
    } else {
      // Reset form for new todo
      setFormData({
        title: "",
        startDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        description: "",
        priority: "Medium",
        employee: "",
        completed: false,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    // Handle checkbox differently
    if (field === "completed") {
      setFormData((prev) => ({
        ...prev,
        completed: value.target.checked,
      }));
      return;
    }

    // For other fields
    const sanitizedValue = value && value.target ? value.target.value : value;
    setFormData((prev) => ({
      ...prev,
      [field]: sanitizedValue,
    }));
  };

  const handleSubmit = () => {
    // Prepare data for submission - maintain the _id if it exists
    const submissionData = {
      title: formData.title,
      description: formData.description,
      startDate: new Date(formData.startDate),
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      priority: formData.priority,
      employee: formData.employee,
      completed: formData.completed,
      // If initialData has an _id, include it to ensure proper state update
      _id: initialData?._id,
    };

    onClick(submissionData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isBtns={true}
      title={initialData ? t("Edit Todo Item") : t("Adding a To Do list item")}
      btnApplyTitle={initialData ? t("Update") : t("Add")}
      classNameBtns={"mt-5"}
      onClick={handleSubmit}
    >
      <div className={"w-full flex flex-col gap-5"}>
        <InputAndLabel
          title={t("Title")}
          placeholder={t("Enter To Do Title")}
          value={formData.title}
          onChange={(e) => handleChange("title", e)}
          required
        />

        <InputAndLabel
          title={t("Description")}
          placeholder={t("Enter Description (optional)")}
          value={formData.description}
          onChange={(e) => handleChange("description", e)}
          textarea
        />

        <div className="flex gap-5">
          <div className="flex-1">
            <DateInput
              title={t("Start date")}
              value={formData.startDate}
              onChange={(value) => handleChange("startDate", value)}
              required
            />
          </div>
          <div className="flex-1">
            <DateInput
              title={t("Due date")}
              value={formData.dueDate}
              onChange={(value) => handleChange("dueDate", value)}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

AddToDoListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default AddToDoListModal;
