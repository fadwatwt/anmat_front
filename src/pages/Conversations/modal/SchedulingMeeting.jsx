import Modal from "../../../components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import InputAndLabel from "../../../components/Form/InputAndLabel.jsx";
import DefaultSelect from "../../../components/Form/DefaultSelect.jsx";
import InputWithIcon from "../../../components/Form/InputWithIcon.jsx";
import {RiCalendarLine, RiTimeLine} from "@remixicon/react";
import DateInput from "../../../components/Form/DateInput.jsx";

function SchedulingMeeting({isOpen,onClose}) {
    return (
        <Modal title={"Scheduling a Meeting"} isOpen={isOpen} onClose={onClose} isBtns={true}  btnApplyTitle={"Schedule"} onClick={() => {}}  >
            <div className={"flex flex-col gap-4"}>
                <InputAndLabel title={"Meeting Name"} type={"text"} name={""} value={""} placeholder={"Meeting  Name"}   />
                <DefaultSelect title={"Department"} options={[{id: "", value: "Select Department..."}]}  onChange={() => {}}/>
                <DefaultSelect title={"Employees"} options={[{id: "", value: "Select Employees..."}]}  onChange={() => {}}/>
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