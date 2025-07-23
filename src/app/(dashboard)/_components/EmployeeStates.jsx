import StatusActions from "@/components/Dropdowns/StatusActions";
import {FaCircleCheck} from "react-icons/fa6";
import {FiEye} from "react-icons/fi";
import {VscPreview} from "react-icons/vsc";
import PropTypes from "prop-types";
import {IoTime} from "react-icons/io5";
import {useTranslation} from "react-i18next";

function EmployeeStates({actualRowIndex}) {
    const {t, i18n} = useTranslation();
    const statesActions = [
        {
            text: "View", icon: <FiEye className="text-blue-500"/>, onClick: () => {
                console.log(actualRowIndex)
            }
        },
        {
            text: "Active", icon: <FaCircleCheck className="text-green-600"/>, onClick: () => {
                console.log(actualRowIndex)
            },
        },
        {
            text: "In Review", icon: <VscPreview className="text-yellow-500"/>, onClick: () => {
                console.log(actualRowIndex)
            },
        },
        {
            text: "In Progress", icon: <IoTime className="text-red-500"/>, onClick: () => {
                console.log(actualRowIndex)
            },
        }
    ]
    return (
        <StatusActions states={statesActions}  className={`${
            i18n.language === "ar" ? "left-0" : "right-0"
        }`}/>
    );
}

EmployeeStates.propTypes = {
    actualRowIndex: PropTypes.number.isRequired,
}

export default EmployeeStates;