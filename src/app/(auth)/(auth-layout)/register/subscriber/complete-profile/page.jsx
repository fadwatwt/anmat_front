"use client";
import {useFormik} from "formik";
import InputAndLabel from "@/components/Form/InputAndLabel";
import SelectAndLabel from "@/components/Form/SelectAndLabel";
import * as Yup from 'yup';
import FileUpload from "@/components/Form/FileUpload";
import {t} from "i18next";
import {LiaUser} from "react-icons/lia";
import {IoIosLock} from "react-icons/io";
import {useState} from "react";
import {useSelector} from "react-redux";

const SetupCompanyProfile = () => {

    const formik = useFormik({
        initialValues: {
            full_name: "", phone: "", country: "", city: ""
        }, validationSchema: Yup.object({
            phone: Yup.string().required("Required"),
            country: Yup.string().required("Required"),
            city: Yup.string().required("Required")
        }), onSubmit: () => {
        },
    });

    const countries = ["Palestine", "Syria"];
    const cities = ["Gaza"];
    const [password, setPassword] = useState("");
    const [passwordConf, setPasswordConf] = useState("");
    const { error } = useSelector((state) => state.auth);

    return (<>
            <div className="w-full flex flex-col items-center justify-start gap-8 overflow-hidden overflow-y-auto px-2">
                {/* Title */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex w-20 h-20 justify-center items-center rounded-full bg-[#F3F3F4]">
                        <div className="flex w-12 h-12 justify-center items-center rounded-full bg-white shadow-md">
                            <LiaUser size={30}/>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <sapn className="text-2xl text-gray-900">
                            {`Set up your account`}
                        </sapn>
                        <span className="text-sm text-gray-500">
                        {'Enter your details to sign up'}
                    </span>
                    </div>
                </div>

                {/* Form */}
                <div className="flex flex-col w-full gap-4">
                    <InputAndLabel
                        title="Full Name"
                        name="full_name"
                        value={formik.values.full_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter Full Name..."
                        error={formik.touched.full_name && formik.errors.full_name ? formik.errors.full_name : ""}
                        isRequired={true}
                    />

                    <InputAndLabel
                        title="Phone Number"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter Phone Number..."
                        error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : ""}
                        isRequired={true}
                        type={"text"}
                    />

                    <div className={"flex flex-col gap-2 w-full"}>
                        <label>Password</label>
                        <div className="flex bg-white pl-2 px-2 w-full items-center border-2 rounded-xl">
                            <IoIosLock className="text-gray-500 w-10" size={18}/>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="*"
                                className="w-full py-3 px-2 outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div className={"flex flex-col gap-2 w-full"}>
                        <label>Confirm Password</label>
                        <div className="flex bg-white pl-2 px-2 w-full items-center border-2 rounded-xl">
                            <IoIosLock className="text-gray-500 w-10" size={18}/>
                            <input
                                type="password"
                                value={passwordConf}
                                onChange={(e) => setPasswordConf(e.target.value)}
                                placeholder="*"
                                className="w-full py-3 px-2 outline-none"
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <SelectAndLabel
                        title={"Country"}
                        name="country"
                        value={formik.values.country} // Ensure it’s controlled
                        onChange={(val) => formik.setFieldValue("country", val)} // Send _id
                        onBlur={formik.handleBlur}
                        options={countries} // Ensure _id is used internally but name is displayed
                        error={formik.touched.country && formik.errors.country ? formik.errors.country : ""}
                        placeholder={"Select Country..."}
                        isRequired={true}
                    />

                    <SelectAndLabel
                        title={"City"}
                        name="city"
                        value={formik.values.city} // Ensure it’s controlled
                        onChange={(val) => formik.setFieldValue("city", val)} // Send _id
                        onBlur={formik.handleBlur}
                        options={cities} // Ensure _id is used internally but name is displayed
                        error={formik.touched.city && formik.errors.city ? formik.errors.city : ""}
                        placeholder={"Select City..."}
                        isRequired={true}
                    />

                    <div className={`relative flex flex-col gap-1 w-full items-start`}>
                        <label className="text-gray-900 dark:text-gray-200 text-sm">
                            {t('Avatar')}
                        </label>
                        <FileUpload/>
                    </div>


                </div>

                {/* Buttons */}
                <div className="flex flex-col md:flex-row w-full items-center justify-center gap-8">
                    <div className="bg-primary-500 text-primary-50 text-md w-48 py-2 rounded-xl cursor-pointer
                        hover:bg-primary-600 text-center">
                        Complete Registration
                    </div>
                </div>
            </div>
        </>
    );
}

export default SetupCompanyProfile;