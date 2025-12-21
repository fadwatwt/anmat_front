"use client";
import {useFormik} from "formik";
import InputAndLabel from "@/components/Form/InputAndLabel";
import SelectAndLabel from "@/components/Form/SelectAndLabel";
import * as Yup from 'yup';
import FileUpload from "@/components/Form/FileUpload";
import {t} from "i18next";
import Link from "next/link";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";

const SetupCompanyProfile = () => {

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            website: "",
            phone: "",
            country: "",
            city: "",
            address: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required"),
            email: Yup.string().email("Invalid email").required("Required"),
            website: Yup.string().url("Invalid URL"),
            phone: Yup.string().required("Required"),
            country: Yup.string().required("Required"),
            city: Yup.string().required("Required"),
            address: Yup.string().required("Required"),
        }),
        onSubmit: () => {
        },
    });

    const countries = ["Palestine", "Syria"];
    const cities = ["Gaza"];

    return (
        <>
            <div
                className="flex flex-col items-start justify-start gap-8 overflow-hidden overflow-y-auto p-8 rounded-lg bg-white w-1/3">
                {/* Title */}
                <div className={"flex flex-col items-center text-center justify-start gap-2 w-full"}>
                    <span className={"text-primary-500"}>{`Organization Profile`}</span>
                    <span className="text-2xl text-gray-900">
                        {`Set up your company profile`}
                    </span>
                    <span className="text-sm text-gray-500 ">
                        Let&#39;s get your company info set in two minutes.
                    </span>
                </div>

                {/* Form */}
                <div className="flex flex-col w-full gap-4">
                    <InputAndLabel
                        title="Company Name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter Company Name..."
                        error={
                            formik.touched.name && formik.errors.name
                                ? formik.errors.name
                                : ""
                        }
                        isRequired={true}
                    />

                    <InputAndLabel
                        title="Email Address"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter Email..."
                        error={
                            formik.touched.email && formik.errors.email
                                ? formik.errors.email
                                : ""
                        }
                        isRequired={true}
                    />

                    <InputAndLabel
                        title="Phone Number"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter Phone Number..."
                        error={
                            formik.touched.phone && formik.errors.phone
                                ? formik.errors.phone
                                : ""
                        }
                        isRequired={true}
                    />

                    <InputAndLabel
                        title="Website Link"
                        name="website"
                        value={formik.values.website}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter Website URL..."
                        error={
                            formik.touched.website && formik.errors.website
                                ? formik.errors.website
                                : ""
                        }
                        isRequired={false}
                    />

                    <SelectAndLabel
                        title={"Country"}
                        name="country"
                        value={formik.values.country} // Ensure it’s controlled
                        onChange={(val) => formik.setFieldValue("country", val)} // Send _id
                        onBlur={formik.handleBlur}
                        options={countries} // Ensure _id is used internally but name is displayed
                        error={
                            formik.touched.country && formik.errors.country
                                ? formik.errors.country
                                : ""
                        }
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
                        error={
                            formik.touched.city && formik.errors.city
                                ? formik.errors.city
                                : ""
                        }
                        placeholder={"Select City..."}
                        isRequired={true}
                    />

                    <TextAreaWithLabel
                        title="Address"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter Address..."
                        error={
                            formik.touched.address && formik.errors.address
                                ? formik.errors.address
                                : ""
                        }
                        isRequired={true}
                    />

                    <div className={`relative flex flex-col gap-1 w-full items-start`}>
                        <label className="text-gray-900 dark:text-gray-200 text-sm">
                            {t('Logo')}
                        </label>
                        <FileUpload/>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col md:flex-row w-full items-center justify-center gap-8">
                    <Link href={"/account-setup/subscriber/business-selection"} className="bg-white text-gray-700 text-sm w-32 py-2 border border-gray-200 rounded-xl cursor-pointer
                        hover:bg-gray-100 text-center">
                        Return
                    </Link>

                    <div className="bg-primary-500 text-primary-50 text-md w-48 py-2 rounded-xl cursor-pointer
                        hover:bg-primary-600 text-center">
                        Save Company Profile
                    </div>
                </div>
            </div>
        </>
    );
}

export default SetupCompanyProfile;