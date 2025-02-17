import Modal from "../../../../components/Modal/Modal";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types"; // Import prop-types
import ElementsSelect from "../../../../components/Form/ElementsSelect.jsx";
import InputAndLabel from "../../../../components/Form/InputAndLabel.jsx";

const EditPermissionModal = ({
                                isOpen,
                                onClose,
                                permissionName,
                                setPermissionName,
                                category,
                                setCategory,
                                permissions,
                                setPermissions,
                            }) => {
    const { t } = useTranslation();

    const optionsStatus = [
        { id: "1", element: <p className={"py-1 px-3 rounded-lg bg-blue-200 text-xs"}>permission 1</p> },
        {id: "2", element: <p className={"py-1 px-3 rounded-lg bg-blue-200 text-xs"}>permission 2</p>},
        {id: "3", element: <p className={"py-1 px-3 rounded-lg bg-blue-200 text-xs"}>permission 3</p>},
    ];

    // Handle multi-select changes
    const handleCategoryChange = (e) => {
        const selectedOptions = e.target.value;
        setCategory(selectedOptions);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t("Add a Permission")}
            isBtns={true}
            btnApplyTitle={t("Add")}
            onClick={() => {
                // Handle Add action here
                onClose();
            }}
        >
            <div className="flex flex-col gap-4 p-4">
                {/* Permission Name */}
                <InputAndLabel title={"Permission Name"}  />

                {/* Categories */}
                <div className="flex flex-col items-start ">
                    <ElementsSelect options={optionsStatus} classNameItemSelected={""} isMultiple={true} isRemoveBtn={false} defaultValue={optionsStatus[0]}
                                    title={"Categories"} classNameContainer={"w-full"} onChange={handleCategoryChange}/>
                </div>

                {/* Permissions */}
                <div className="flex flex-col items-start ">
                    <ElementsSelect options={optionsStatus} isMultiple={true} isRemoveBtn={false} classNameItemSelected={""} defaultValue={optionsStatus[0]}
                                    title={"Permissions"} classNameContainer={"w-full"} onChange={handleCategoryChange}/>
                </div>
            </div>
        </Modal>
    );
};

export default EditPermissionModal;

EditPermissionModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    permissionName: PropTypes.string.isRequired,
    setPermissionName: PropTypes.func.isRequired,
    category: PropTypes.arrayOf(PropTypes.string).isRequired,
    setCategory: PropTypes.func.isRequired,
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    setPermissions: PropTypes.func.isRequired,
};
