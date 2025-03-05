import Modal from "../../../components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import InputAndLabel from "../../../components/Form/InputAndLabel.jsx";
import DefaultSelect from "../../../components/Form/DefaultSelect.jsx";
import InputWithIcon from "../../../components/Form/InputWithIcon.jsx";
import { RiTimeLine} from "@remixicon/react";
import DateInput from "../../../components/Form/DateInput.jsx";
import ElementsSelect from "../../../components/Form/ElementsSelect.jsx";
import {employees} from "../../../functions/FactoryData.jsx";
import UserSelect from "../../../components/Form/UserSelect.jsx";

function SchedulingMeeting({isOpen,onClose}) {
    const optionsEmployees = employees.map((employee, index) => ({
        id: employee.id,
        element: (
            <div key={index} className="flex items-center gap-2">
                <img src={employee.imageProfile} className="w-5 h-5 rounded-full" alt={employee.name} />
                <p className="text-xs">{employee.name}</p>
            </div>
        ),
    }));


    return (
        <Modal title={"Scheduling a Meeting"} isOpen={isOpen} onClose={onClose} isBtns={true}  btnApplyTitle={"Schedule"} onClick={() => {}}  >
            <div className={"flex flex-col gap-4"}>
                <InputAndLabel title={"Meeting Name"} type={"text"} name={""} value={""} placeholder={"Meeting  Name"}   />
                <DefaultSelect title={"Department"} options={[{id: "", value: "Select Department..."}]}  onChange={() => {}}/>
                <UserSelect title={"Employees"} users={employees} isMultiSelect={true}  />
                <DateInput title={"Date"} />
                <InputWithIcon title={"Time"} type={"time"} icon={<RiTimeLine size={"18"} />}  />
            </div>
        </Modal>
    );
}

SchedulingMeeting.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
}

export default SchedulingMeeting;