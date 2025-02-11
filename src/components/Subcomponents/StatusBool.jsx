import {FaCircleCheck} from "react-icons/fa6";
import PropTypes from "prop-types";
import {MdError} from "react-icons/md";

function StatusBool({status,titleTrue,titleFalse}) {
    return (
        <>
        {
            status ?
                    <div className={"flex gap-2 text-xs items-center text-black dark:text-gray-300"}>
                        <FaCircleCheck className={"text-green-600"}/>
                        {titleTrue}
                    </div>
                :
                    <div className={"flex gap-2 text-xs items-center text-black dark:text-gray-300"}>
                        <MdError  className={"text-red-600 "}/>
                        {titleFalse}
                    </div>
        }
        </>
    );
}

StatusBool.propTypes = {
    status: PropTypes.bool.isRequired,
    titleTrue: PropTypes.string,
    titleFalse: PropTypes.string,

}

export default StatusBool;