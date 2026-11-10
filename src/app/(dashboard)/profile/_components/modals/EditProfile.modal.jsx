import { getCountryOptions, getCityOptions } from "@/data/countriesAndCities";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import SelectAndLabel from "@/components/Form/SelectAndLabel.jsx";
import DateInput from "@/components/Form/DateInput.jsx";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetUserQuery } from "@/redux/auth/authAPI";
import { setUser, selectAuth } from "@/redux/auth/authSlice";
import { useProcessing } from "@/app/providers";

function EditProfileModal({ isOpen, onClose, user, updateProfile, isLoading }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { token } = useSelector(selectAuth);
    const [getUser] = useLazyGetUserQuery();

    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });
    const [showApproval, setShowApproval] = useState(false);

    const isEmployee = user?.type === "Employee";

    const formik = useFormik({
        initialValues: {
            name: user?.name || "",
            phone: user?.phone || user?.phoneNumber || "",
            country: user?.employee_detail?.country || "",
            city: user?.employee_detail?.city || "",
            date_of_birth: user?.employee_detail?.date_of_birth ? user.employee_detail.date_of_birth.split("T")[0] : "",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required(t("Required")),
            phone: Yup.string().required(t("Required")),
            country: isEmployee ? Yup.string().required(t("Required")) : Yup.string(),
            city: isEmployee ? Yup.string().required(t("Required")) : Yup.string(),
            date_of_birth: isEmployee ? Yup.string().required(t("Required")) : Yup.string(),
        }),
        onSubmit: () => {
            setShowApproval(true);
        },
    });

    const { showProcessing, hideProcessing } = useProcessing();

    const handleConfirmUpdate = async () => {
        setShowApproval(false);
        showProcessing(t("Updating profile..."));
        try {
            let payload = {
                name: formik.values.name,
                phone: formik.values.phone,
            };

            if (isEmployee) {
                payload.employee_details = {
                    country: formik.values.country,
                    city: formik.values.city,
                    date_of_birth: formik.values.date_of_birth
                };
            }

            await updateProfile(payload).unwrap();

            // Refresh user info after successful update
            if (token) {
                const refreshedUser = await getUser(token).unwrap();
                dispatch(setUser(refreshedUser?.data || refreshedUser));
            }

            hideProcessing();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Profile updated successfully")
            });
        } catch (error) {
            hideProcessing();
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to update profile")
            });
        }
    };

    const countryOptions = getCountryOptions();
    if (formik.values.country && !countryOptions.some(item => item._id === formik.values.country)) countryOptions.push({ _id: formik.values.country, name: formik.values.country });
    const cityOptions = getCityOptions(formik.values.country);
    if (formik.values.city && !cityOptions.some(item => item._id === formik.values.city)) cityOptions.push({ _id: formik.values.city, name: formik.values.city });

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isBtns={true}
                title={t("Edit Profile")}
                btnApplyTitle={t("Update")}
                classNameBtns={"mt-5"}
                onClick={formik.handleSubmit}
                isLoading={isLoading}
            >
                <div className={"w-full flex flex-col gap-5"}>
                    <InputAndLabel
                        title={t("Name")}
                        placeholder={t("Name")}
                        isRequired={true}
                        name="name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        error={formik.touched.name && formik.errors.name}
                    />

                    <InputAndLabel
                        title={t("Phone")}
                        placeholder={t("Phone")}
                        isRequired={true}
                        name="phone"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        error={formik.touched.phone && formik.errors.phone}
                    />

                    {isEmployee && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <SelectAndLabel
                                    title={t("Country")}
                                    placeholder={t("Select Country")}
                                    isRequired={true}
                                    name="country"
                                    options={countryOptions}
                                    onChange={(val) => {
                                        formik.setFieldValue("country", val);
                                        formik.setFieldValue("city", ""); // Reset city on country change
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.country}
                                    error={formik.touched.country && formik.errors.country}
                                />
                                <SelectAndLabel
                                    title={t("City")}
                                    placeholder={t("Select City")}
                                    isRequired={true}
                                    name="city"
                                    options={cityOptions}
                                    onChange={(val) => formik.setFieldValue("city", val)}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.city}
                                    error={formik.touched.city && formik.errors.city}
                                />
                            </div>

                            <DateInput
                                title={t("Date of Birth")}
                                isRequired={true}
                                name="date_of_birth"
                                onChange={formik.handleChange}
                                value={formik.values.date_of_birth}
                            />
                        </>
                    )}
                </div>
            </Modal>

            <ApprovalAlert
                isOpen={showApproval}
                onClose={() => setShowApproval(false)}
                onConfirm={handleConfirmUpdate}
                title={t("Confirm Update")}
                message={t("Are you sure you want to update your profile information?")}
                confirmBtnText={t("Confirm")}
                cancelBtnText={t("Cancel")}
                type="info"
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => {
                    if (apiResponse.status === "success") onClose();
                    setApiResponse({ ...apiResponse, isOpen: false });
                }}
            />
        </>
    );
}

EditProfileModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    user: PropTypes.object,
    updateProfile: PropTypes.func,
    isLoading: PropTypes.bool
}

export default EditProfileModal;