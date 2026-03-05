import { useState, useEffect } from "react";
import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";

import InputAndLabel from "@/components/Form/InputAndLabel";
import IconPicker from "@/components/Form/IconPicker";
import Switch2 from "@/components/Form/Switch2";

function CreateIndustryModal({ isOpen, onClose, onClick, item }) {
    const [name, setName] = useState("");
    const [icon, setIcon] = useState("");
    const [isAllowed, setIsAllowed] = useState(true);

    useEffect(() => {
        if (item) {
            setName(item.name || "");
            setIcon(item.icon_name || "");
            setIsAllowed(item.is_allowed !== undefined ? item.is_allowed : true);
        } else {
            setName("");
            setIcon("");
            setIsAllowed(true);
        }
    }, [item, isOpen]);

    const handleApply = () => {
        onClick && onClick({
            name,
            icon_name: icon,
            is_allowed: isAllowed,
            ...(item?._id ? { _id: item._id } : {})
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            title={item ? "Edit Industry" : "Add New Industry"}
            btnApplyTitle={item ? "Update" : "Add"}
            classNameBtns={"mt-5"}
            onClick={handleApply}
        >
            <div className={"w-full flex flex-col gap-6"}>
                <InputAndLabel
                    title={"Industry Name"}
                    placeholder={"Enter name..."}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <IconPicker
                    title={"Choose Icon"}
                    value={icon}
                    onChange={setIcon}
                />
                <div className="flex items-center justify-between p-4 bg-status-bg rounded-2xl border border-status-border">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-cell-primary">Is Allowed</span>
                        <span className="text-xs text-cell-secondary">Enable or disable this industry</span>
                    </div>
                    <Switch2 isOn={isAllowed} handleToggle={() => setIsAllowed(!isAllowed)} />
                </div>
            </div>
        </Modal>
    );
}

CreateIndustryModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onClick: PropTypes.func,
    item: PropTypes.object
}

export default CreateIndustryModal;

