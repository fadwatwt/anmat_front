"use client";
import { useFormik } from "formik";
import InputAndLabel from "@/components/Form/InputAndLabel";
import SelectAndLabel from "@/components/Form/SelectAndLabel";
import * as Yup from 'yup';
// import { t } from "i18next";
import { departments } from "@/functions/FactoryData";
import ElementsSelect from "@/components/Form/ElementsSelect";

const SetupEmployeeProfile = () => {

    const formik = useFormik({
        initialValues: {
            phone: "",
            country: "",
            city: "",
            role: "",
            job: "",
            department: ""
        },
        validationSchema: Yup.object({
            phone: Yup.string().required("Required"),
            country: Yup.string().required("Required"),
            city: Yup.string().required("Required"),
            role: Yup.string().required("Required"),
            job: Yup.string().required("Required"),
            department: Yup.string().required("Required")
        }),
        onSubmit: () => { },
    });

    const optionsStatus = [
        { id: "1", element: "role 1" },
        { id: "2", element: "role 2" },
        { id: "3", element: "role 3" },
    ];
    const countries = [{ name: "Palestine", value: "Palestine" }, { name: "Syria", value: "Syria" }];
    const cities = [{ name: "Gaza", value: "Gaza" }];

    return (
        <>
            <div className="flex flex-col items-start justify-start gap-8 overflow-auto">
                {/* Title */}
                <div className="flex flex-col items-start justify-start gap-2">
                    <sapn className="text-2xl text-gray-900">
                        {`Set up your personal profile`}
                    </sapn>
                    <span className="text-sm text-gray-500">
                        Let’s get your personal info set in two minutes.
                    </span>
                </div>

                {/* Form */}
                <div className="flex flex-col gap-4 w-full">
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

                    <div className="flex flex-col items-start ">
                        <ElementsSelect options={optionsStatus} classNameItemSelected={"p-1 px-2 bg-primary-100 text-black rounded-md"} isMultiple={true} isRemoveBtn={false}
                            title={"Roles"} classNameContainer={"w-full"} onChange={() => { }} />
                    </div>

                    <SelectAndLabel
                        title={"Job Type"}
                        name="job"
                        value={formik.values.job} // Ensure it’s controlled
                        onChange={(val) => formik.setFieldValue("job", val)} // Send _id
                        onBlur={formik.handleBlur}
                        options={cities} // Ensure _id is used internally but name is displayed
                        error={
                            formik.touched.job && formik.errors.job
                                ? formik.errors.job
                                : ""
                        }
                        placeholder={"Select Job Type..."}
                        isRequired={true}
                    />

                    <SelectAndLabel
                        title={"Department"}
                        name="department"
                        value={formik.values.department} // Ensure it’s controlled
                        onChange={(val) => formik.setFieldValue("department", val)} // Send _id
                        onBlur={formik.handleBlur}
                        options={departments} // Ensure _id is used internally but name is displayed
                        error={
                            formik.touched.department && formik.errors.department
                                ? formik.errors.department
                                : ""
                        }
                        placeholder={"Select Department..."}
                        isRequired={true}
                    />

                </div>

                {/* Buttons */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
                    <div className="bg-white text-gray-700 text-md w-48 py-2 border border-gray-200 rounded-xl cursor-pointer
                        hover:bg-gray-100 text-center">
                        Skip
                    </div>

                    <div className="bg-primary-500 text-primary-50 text-md w-48 py-2 rounded-xl cursor-pointer
                        hover:bg-primary-600 text-center">
                        Next
                    </div>
                </div>
            </div>
        </>
    );
}

export default SetupEmployeeProfile;