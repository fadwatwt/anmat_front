import PropTypes from "prop-types";
import BtnAddOutline from "../../../../../components/Form/BtnAddOutline.jsx";
import {useTranslation} from "react-i18next";
import {PiDotsThreeVerticalBold} from "react-icons/pi";
import useDropdown from "../../../../../Hooks/useDropdown.js";
import ActionsBtns from "../../../../../components/ActionsBtns.jsx";
import {useState} from "react";
import AddMember from "./AddMember.jsx";


function ProjectMembers({members}) {
    const {t} = useTranslation()
    const [dropdownOpen, setDropdownOpen] = useDropdown();
    const [addMemberModal, setAddMemberModal] = useState(false);
    const getBadge = (rule) => {
        switch (rule) {
            case "Manager":
                return <span className="px-2 py-0.5 rounded-full text-teal-700 border border-teal-700 text-[11px]">{t("Manager")}</span>;
            case "Team lead":
                return <span className="px-2 py-0.5 rounded-full text-purple-700 border border-purple-700 text-[11px]">{t("Team lead")}</span>;
            default:
                return null;
        }
    };
    const handleDropdownToggle = (index) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };

    const handelAddMemberModal = () => {
        setAddMemberModal(!addMemberModal)
    }
    return (
        <>
        <div className={"flex flex-col w-full p-4 rounded-2xl items-start gap-3 bg-white dark:bg-white-0"}>
            <p className={"text-lg dark:text-gray-200"}>{t("Project Members")}</p>
            <div className={"flex flex-col gap-3 w-full "}>
                {
                    members.map((member,index) => (
                        <div key={index} className={"flex justify-between items-center"}>
                            <div className={"flex gap-3 items-center"}>
                                <div className={"w-10 h-10"}>
                                    <img
                                        src={member.imageProfile}
                                        alt={"image member"}
                                        className={"max-w-full rounded-full w-10 h-10 object-cover"}/>
                                </div>
                                <div className={"nameAndWork flex flex-col gap-1 items-start"}>
                                    <div className={"nameAndRule flex gap-1"}>
                                        <p className={"text-sm dark:text-gray-200"}>{member.name}</p>
                                        {
                                            getBadge(member.rule)
                                        }
                                    </div>
                                    <p className={"text-xs text-sub-500 dark:text-sub-300"}>{member.work}</p>
                                </div>
                            </div>
                            <div className="relative cursor-pointer flex-1 flex justify-end dropdown-container"
                                 onClick={() => handleDropdownToggle(index)}>
                                <PiDotsThreeVerticalBold/>
                                {dropdownOpen  === index &&  <ActionsBtns className={"mt-5"} isEditBtn={false} handleDelete={() => {}}/>}
                            </div>
                        </div>
                    ))
                }
                <BtnAddOutline onClick={handelAddMemberModal} title={"Add a member"}/>
            </div>
        </div>

    <AddMember isOpen={addMemberModal} onClose={handelAddMemberModal} />

    </>
    );
}

ProjectMembers.propTypes = {
    members: PropTypes.array.isRequired
}

export default ProjectMembers;