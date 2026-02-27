import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import DefaultSelect from "@/components/Form/DefaultSelect.jsx";
import InputWithIcon from "@/components/Form/InputWithIcon.jsx";
import { RiTimeLine } from "@remixicon/react";
import DateInput from "@/components/Form/DateInput.jsx";
import UserSelect from "@/components/Form/UserSelect.jsx";
import { useTranslation } from "react-i18next"; // Add this line

function SchedulingMeeting({ isOpen, onClose }) {
  const { t } = useTranslation(); // Add this line

  // const optionsEmployees = employees.map((employee, index) => ({
  //   id: employee.id,
  //   element: (
  //     <div key={index} className="flex items-center gap-2">
  //       <img
  //         src={employee.imageProfile}
  //         className="w-5 h-5 rounded-full"
  //         alt={employee.name}
  //       />
  //       <p className="text-xs">{employee.name}</p>
  //     </div>
  //   ),
  // }));

  return (
    <Modal
      title={t("Scheduling a Meeting")}
      isOpen={isOpen}
      onClose={onClose}
      isBtns={true}
      btnApplyTitle={t("Schedule")}
      onClick={() => { }}
      dir="rtl" // Add RTL direction
      style={{ fontFamily: "Tajawal, sans-serif" }} // Add Arabic font
    >
      <div className={"flex flex-col gap-4"}>
        <InputAndLabel
          title={t("Meeting Name")} // Translate label
          type={"text"}
          name={""}
          value={""}
          placeholder={t("Meeting Name")} // Translate placeholder
        />
        <DefaultSelect
          title={t("Department")} // Translate label
          options={[
            { id: "", value: t("Select Department...") }, // Translate placeholder
          ]}
          onChange={() => { }}
        />
        <UserSelect
          title={t("Employees")} // Translate label
          users={[]}
          isMultiSelect={true}
          onChange={() => { }} />
        <DateInput title={t("Date")} /> {/* Translate label */}
        <InputWithIcon
          title={t("Time")} // Translate label
          type={"time"}
          icon={<RiTimeLine size={"18"} />}
        />
      </div>
    </Modal>
  );
}

SchedulingMeeting.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default SchedulingMeeting;
