import { useTheme } from "@/app/providers";
import WordTheMiddleAndLine from "@/components/Subcomponents/WordTheMiddleAndLine.jsx";
import { useFormik } from "formik";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import SelectAndLabel from "@/components/Form/SelectAndLabel.jsx";
import DateInput from "@/components/Form/DateInput.jsx";
import InlineAlert from "@/components/InlineAlert.jsx";
import DefaultButton from "@/components/Form/DefaultButton.jsx";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, selectAuth, setUser } from "@/redux/auth/authSlice";
import { useLazyGetUserQuery, useUpdateAdminAccountMutation, useUpdateUserAccountMutation, useUploadAvatarMutation } from "@/redux/auth/authAPI";
import { useUpdateEmployeeDetailMutation } from "@/redux/employees/employeeAuthRequestsApi";
import * as Yup from "yup";

const countries = [
    { _id: "Egypt", name: "Egypt" },
    { _id: "Saudi Arabia", name: "Saudi Arabia" },
    { _id: "UAE", name: "UAE" },
    { _id: "Jordan", name: "Jordan" }
];

const cities = {
    "Egypt": [
        { _id: "Cairo", name: "Cairo" },
        { _id: "Alexandria", name: "Alexandria" },
        { _id: "Giza", name: "Giza" }
    ],
    "Saudi Arabia": [
        { _id: "Riyadh", name: "Riyadh" },
        { _id: "Jeddah", name: "Jeddah" },
        { _id: "Dammam", name: "Dammam" }
    ],
    "default": [
        { _id: "Dubai", name: "Dubai" },
        { _id: "Amman", name: "Amman" }
    ]
};

function PersonalInformation() {
    const uploadFileInput = useRef(null);
    const { t } = useTranslation();
    const [theme] = useTheme();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const { token } = useSelector(selectAuth);
    const [getUser] = useLazyGetUserQuery();
    const [updateAdminAccount, { isLoading: isAdminUpdating }] = useUpdateAdminAccountMutation();
    const [updateUserAccount, { isLoading: isUserUpdating }] = useUpdateUserAccountMutation();
    const [updateEmployeeDetail, { isLoading: isEmployeeUpdating }] = useUpdateEmployeeDetailMutation();

    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });
    const [uploadAvatar, { isLoading: isAvatarUploading }] = useUploadAvatarMutation();

    const isLoading = isAdminUpdating || isUserUpdating || isEmployeeUpdating || isAvatarUploading;
    const isAdmin = user?.type === "Admin";
    const isEmployee = user?.type === "Employee";
    const employeeDetail = user?.employee_detail || {};

    const handelClickUploadBtn = () => {
        uploadFileInput.current.click();
    };

    const handleFileChange = useCallback(async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append("avatar", file);

            const result = await uploadAvatar(formData).unwrap();
            const newAvatarUrl = result?.data?.avatar;

            if (newAvatarUrl && token) {
                const refreshedUser = await getUser(token).unwrap();
                dispatch(setUser(refreshedUser?.data || refreshedUser));
            }

            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Profile image updated successfully"),
            });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to upload image"),
            });
        }

        if (uploadFileInput.current) {
            uploadFileInput.current.value = "";
        }
    }, [uploadAvatar, token, getUser, dispatch, t]);

    const handleSubmit = async (values) => {
        try {
            let payload;
            if (isEmployee) {
                payload = {
                    name: values.name,
                    phone: values.phone,
                    employee_details: {
                        country: values.country,
                        city: values.city,
                        date_of_birth: values.date_of_birth,
                    },
                };
                await updateEmployeeDetail(payload).unwrap();
            } else {
                payload = { name: values.name, phone: values.phone };
                if (isAdmin) {
                    await updateAdminAccount(payload).unwrap();
                } else {
                    await updateUserAccount(payload).unwrap();
                }
            }

            if (token) {
                const refreshedUser = await getUser(token).unwrap();
                dispatch(setUser(refreshedUser?.data || refreshedUser));
            }

            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Profile updated successfully")
            });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to update profile")
            });
        }
    };

    const validationSchema = isEmployee
        ? Yup.object({
            name: Yup.string().required(t("Required")),
            phone: Yup.string().required(t("Required")),
            country: Yup.string().required(t("Required")),
            city: Yup.string().required(t("Required")),
            date_of_birth: Yup.string().required(t("Required")),
        })
        : Yup.object({
            name: Yup.string().required(t("Required")),
            phone: Yup.string().required(t("Required")),
        });

    const formik = useFormik({
        initialValues: {
            name: user?.name || "",
            phone: user?.phone || user?.phoneNumber || "",
            email: user?.email || "",
            country: employeeDetail?.country || "",
            city: employeeDetail?.city || "",
            date_of_birth: employeeDetail?.date_of_birth ? employeeDetail.date_of_birth.split("T")[0] : "",
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: handleSubmit,
    });

    const countryOptions = countries;
    const cityOptions = cities[formik.values.country] || cities["default"];

    return (<div className={"flex flex-col justify-start gap-1 items-center p-3"}>
        <div className={"w-full flex flex-col justify-start items-center gap-2"}>
            <div className={"w-full flex justify-start items-start gap-4 "}>
                <img className="rounded-full w-16 h-16 object-cover"
                    src={user?.avatar || (theme === "dark" ? "/images/userProfile.dark.png" : "/images/userProfile.png")}
                    alt="user-profile-image" />
                <div className={"flex flex-col gap-2 items-start"}>
                    <div className={"flex flex-col items-start gap-1"}>
                        <p className={"text-md text text-main-100 dark:text-gray-200"}>{t("Upload Image")}</p>
                        <p className={"text-sm text-sub-500 text-wrap text-start dark:text-gray-400"}>{t("Min 400x400px, PNG or JPEG")}</p>
                    </div>
                    <button
                        onClick={handelClickUploadBtn}
                        disabled={isAvatarUploading}
                        className={"p-1.5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 rounded-md text-sm text-sub-500 border border-soft-200"}>{t("Upload")}
                    </button>
                    <input type={"file"} className={"hidden"} ref={uploadFileInput} onChange={handleFileChange} accept="image/png,image/jpeg,image/jpg" />
                </div>
            </div>
        </div>
        <WordTheMiddleAndLine />
        <div className={"w-full form"}>
            <form className={"w-full flex flex-col gap-3"} onSubmit={formik.handleSubmit}>
                <div className={"w-full flex flex-col gap-2 "}>
                    <InputAndLabel title={t("Name")} name="name" isRequired={true}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        error={formik.touched.name && formik.errors.name} />
                    <InputAndLabel title={t("Phone")} name="phone" isRequired={true}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        error={formik.touched.phone && formik.errors.phone} />
                    <InputAndLabel title={t("Email Address")} name="email" disabled={true}
                        value={formik.values.email} />
                    {isEmployee && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <SelectAndLabel
                                    title={t("Country")}
                                    placeholder={t("Select Country")}
                                    isRequired={true}
                                    name="country"
                                    options={countryOptions}
                                    onChange={(val) => {
                                        formik.setFieldValue("country", val);
                                        formik.setFieldValue("city", "");
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
                <div className={"w-full flex flex-col items-start gap-4"}>
                    <InlineAlert type={"info"} text={"This information will appear in your profile."} />
                    <div className={"w-full justify-start flex gap-2"}>
                        <DefaultButton type="button" title={t("Cancel")}
                            className={"font-medium dark:text-gray-200"} />
                        <DefaultButton type="submit" disabled={isLoading}
                            title={t("Apply Changes")}
                            className={"bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white"} />
                    </div>
                </div>
            </form>
        </div>
        <ApiResponseAlert
            isOpen={apiResponse.isOpen}
            status={apiResponse.status}
            message={apiResponse.message}
            onClose={() => setApiResponse({ ...apiResponse, isOpen: false })}
        />
    </div>);
}

export default PersonalInformation;
