import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import SelectAndLabel from "@/components/Form/SelectAndLabel.jsx";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function EditProfileModal({ isOpen, onClose, onClick }) {
    const { t } = useTranslation();

    // Mock data for selects - replace with actual data source
    const countries = [
        { _id: "eg", name: "Egypt" },
        { _id: "sa", name: "Saudi Arabia" }
    ];
    const states = [
        { _id: "cairo", name: "Cairo" },
        { _id: "giza", name: "Giza" }
    ];
    const positions = [
        { _id: "dev", name: "Developer" },
        { _id: "des", name: "Designer" }
    ];
    const departments = [
        { _id: "it", name: "IT" },
        { _id: "hr", name: "HR" }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            title={"Edit Profile"}
            btnApplyTitle={"Update"}
            classNameBtns={"mt-5"}
            onClick={onClick}
        >
            <div className={"w-full grid grid-cols-1 md:grid-cols-2 gap-5"}>
                <InputAndLabel
                    title={"First Name"}
                    placeholder={"First Name"}
                    isRequired={true}
                />
                <InputAndLabel
                    title={"Last Name"}
                    placeholder={"Last Name"}
                    isRequired={true}
                />

                <div className="md:col-span-2">
                    <InputAndLabel
                        title={"Email"}
                        placeholder={"Email"}
                        isRequired={true}
                        type="email"
                    />
                </div>

                <div className="md:col-span-2">
                    <InputAndLabel
                        title={"Address"}
                        placeholder={"Address"}
                        isRequired={true}
                    />
                </div>

                <SelectAndLabel
                    title={"Country"}
                    options={countries}
                    isRequired={true}
                    placeholder={"Select Country"}
                    name="country"
                    value=""
                    onChange={() => { }}
                    onBlur={() => { }}
                />
                <SelectAndLabel
                    title={"State/Region"}
                    options={states}
                    isRequired={true}
                    placeholder={"Select State/Region"}
                    name="state"
                    value=""
                    onChange={() => { }}
                    onBlur={() => { }}
                />

                <div className="md:col-span-2">
                    <InputAndLabel
                        title={"City"}
                        placeholder={"City"}
                    />
                </div>

                <SelectAndLabel
                    title={"Position"}
                    options={positions}
                    isRequired={true}
                    placeholder={"Select Position"}
                    name="position"
                    value=""
                    onChange={() => { }}
                    onBlur={() => { }}
                />
                <SelectAndLabel
                    title={"Department"}
                    options={departments}
                    isRequired={true}
                    placeholder={"Select Department"}
                    name="department"
                    value=""
                    onChange={() => { }}
                    onBlur={() => { }}
                />

            </div>
        </Modal>
    );
}

EditProfileModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onClick: PropTypes.func
}

export default EditProfileModal;