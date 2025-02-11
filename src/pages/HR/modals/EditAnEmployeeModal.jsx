import Modal from "../../../components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import InputAndLabel from "../../../components/Form/InputAndLabel.jsx";
import {Form, Formik} from "formik";

function EditAnEmployeeModal({isOpen,onClose,employee}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isBtns={true} btnApplyTitle={"Send Invitation"} className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12"} title={"Adding an Employee"} >
            <div className={"px-1"}>
                <Formik
                    initialValues={{
                        email: employee?.email || "",
                        role: employee?.role || "",
                        jobType: employee?.jobType || "",
                        salary: employee?.salary || "",
                        department: employee?.department || "",
                        workingHours: employee?.workingHours || "",
                        workingDays: employee?.workingDays || "",
                        annualLeaveDays: employee?.annualLeaveDays || "",
                        description: employee?.description || "", // إضافة وصف الموظف
                    }}
                    onSubmit={(values) => {
                        console.log("Updated Employee Data:", values);
                        onClose();
                    }}
                >
                    {({ handleChange, values }) => (
                <Form className={"flex flex-col gap-4"}>
                    <InputAndLabel
                        title={"Email"}
                        value={values.email}
                        name={"email"}
                        onChange={handleChange}
                        placeholder={"Enter email"}
                    />
                    <InputAndLabel
                        title={"Role"}
                        value={values.role}
                        name={"role"}
                        onChange={handleChange}
                        placeholder={"Enter Role"}
                    />
                    <InputAndLabel
                        title={"Job Type"}
                        value={values.jobType}
                        name={"jobType"}
                        onChange={handleChange}
                        placeholder={"Enter Job Type"}
                    />
                    <InputAndLabel
                        title={"Salary"}
                        value={values.salary}
                        name={"salary"}
                        onChange={handleChange}
                        placeholder={"Enter Salary"}
                    />
                    <InputAndLabel
                        title={"Department"}
                        value={values.department}
                        name={"department"}
                        onChange={handleChange}
                        placeholder={"Enter Department"}
                    />
                    <InputAndLabel
                        title={"Working Hours"}
                        value={values.workingHours}
                        name={"workingHours"}
                        onChange={handleChange}
                        placeholder={"Enter Working Hours"}
                    />
                    <InputAndLabel
                        title={"Working Days"}
                        value={values.workingDays}
                        name={"workingDays"}
                        onChange={handleChange}
                        placeholder={"Enter Working Days"}
                    />
                    <InputAndLabel
                        title={"Annual Leave Days"}
                        value={values.annualLeaveDays}
                        name={"annualLeaveDays"}
                        onChange={handleChange}
                        placeholder={"Enter Annual Leave Days"}
                    />
                    <InputAndLabel
                        title={"Employee Description"}
                        value={values.description}
                        name={"description"}
                        onChange={handleChange}
                        placeholder={"Enter Employee Description"}
                    />
                </Form>
                    )}
                </Formik>
            </div>

        </Modal>
    );
}

EditAnEmployeeModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    employee: PropTypes.object.isRequired,
};


export default EditAnEmployeeModal;