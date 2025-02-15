import WordTheMiddleAndLine from "../../../../../components/Subcomponents/WordTheMiddleAndLine.jsx";
import { Form, Formik } from "formik";
import DefaultButton from "../../../../../components/Form/DefaultButton.jsx";
import { RiCheckboxCircleFill, RiCloseCircleFill, RiLock2Line } from "@remixicon/react";
import PasswordInput from "../../../../../components/Form/PasswordInput.jsx";
import { useState } from "react";

function ChangePassword() {
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        number: false,
    });

    const validatePassword = (password) => {
        const strength = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
        };
        setPasswordStrength(strength);
    };


    return (
        <div className="flex flex-col justify-start gap-1 items-center p-3">
            <div className="w-full flex flex-col items-start gap-2">
                <p className="text-md text-main-100">Change Password</p>
                <p className="text-sm text-sub-500">Update password for enhanced account security.</p>
            </div>
            <WordTheMiddleAndLine />
            <div className="w-full form">
                <Formik initialValues={{}} onSubmit={() => {}}>
                    {({ values, handleChange, handleSubmit }) => (
                        <Form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
                            <div className="w-full flex flex-col gap-2">
                                <PasswordInput
                                    isRequired={true}
                                    icon={<RiLock2Line />}
                                    title="Current Password"
                                    name="currentPassword"
                                    onChange={handleChange}
                                    value={values.currentPassword}
                                />
                                <PasswordInput
                                    isRequired={true}
                                    icon={<RiLock2Line />}
                                    onChange={(e) => {
                                        handleChange(e);
                                        validatePassword(e.target.value);
                                    }}
                                    title="New Password"
                                    name="newPassword"
                                    value={values.newPassword}
                                />
                                <PasswordInput
                                    isRequired={true}
                                    icon={<RiLock2Line />}
                                    title="Confirm New Password"
                                    name="confirmPassword"
                                    onChange={handleChange}
                                    value={values.confirmPassword}
                                />
                            </div>

                            <div className="flex flex-col items-start gap-2">
                                <div className="w-full flex justify-center items-center gap-1 h-1">
                                    <div
                                        className={`flex-1 h-full rounded-2xl ${passwordStrength.length ? "bg-red-500" : "bg-gray-200"}`}></div>
                                    <div
                                        className={`flex-1 h-full rounded-2xl ${passwordStrength.length && passwordStrength.uppercase ? "bg-yellow-500" : "bg-gray-200"}`}></div>
                                    <div
                                        className={`flex-1 h-full rounded-2xl ${passwordStrength.length && passwordStrength.uppercase && passwordStrength.number ? "bg-green-500" : "bg-gray-200"}`}></div>
                                </div>

                                {/* 🔹 شروط كلمة المرور */}
                                <p className="text-xs text-sub-500">Password must contain:</p>

                                <div className="flex items-center gap-1">
                                    {passwordStrength.uppercase ?
                                        <RiCheckboxCircleFill size="15" className="text-green-600"/> :
                                        <RiCloseCircleFill size="15" className="text-gray-500"/>
                                    }
                                    <span
                                        className={`text-xs ${passwordStrength.uppercase ? "text-green-600" : "text-gray-500"}`}>
                                        At least 1 uppercase letter
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    {passwordStrength.number ?
                                        <RiCheckboxCircleFill size="15" className="text-green-600"/> :
                                        <RiCloseCircleFill size="15" className="text-gray-500"/>
                                    }
                                    <span
                                        className={`text-xs ${passwordStrength.number ? "text-green-600" : "text-gray-500"}`}>
                                        At least 1 number
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    {passwordStrength.length ?
                                        <RiCheckboxCircleFill size="15" className="text-green-600"/> :
                                        <RiCloseCircleFill size="15" className="text-gray-500"/>
                                    }
                                    <span
                                        className={`text-xs ${passwordStrength.length ? "text-green-600" : "text-gray-500"}`}>
                                        At least 8 characters
                                    </span>
                                </div>
                            </div>

                            {/* 🔘 الأزرار */}
                            <div className="w-full flex flex-col items-start gap-4">
                                <div className="w-full justify-start flex gap-2">
                                    <DefaultButton type="button" title="Cancel"
                                                   className="font-medium dark:text-gray-200"/>
                                    <DefaultButton type="button" onClick={() => {
                                    }}
                                                   title="Apply Changes"
                                                   className="bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white"
                                    />
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default ChangePassword;
