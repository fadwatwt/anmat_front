"use client"


import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import {
  // createEmployee,
} from "@/redux/employees/employeeAPI.js";
import TagInput from "@/components/Form/TagInput";
import DefaultSelect from "@/components/Form/DefaultSelect";
import {useState} from "react";
import Switch2 from "@/components/Form/Switch2";

function CreatePlanModal({ isOpen, onClose }) {

  const formik = useFormik({
    initialValues: {
      plan_name: "",
      price: "",
      features: ""
    },
    validationSchema: Yup.object({
      plan_name: Yup.string().required("Required"),
      price: Yup.string().required("Required"),
      features: Yup.string().required("Required")
    }),
    onSubmit: (values, { resetForm }) => {
      console.log({ values });

      // dispatch(createEmployee(values)); // Send data to API
      resetForm();
      onClose();
    },
  });

  const [countPrices, setCountPrices] = useState([1]);
  const [countFeature, setCountFeature] = useState([1]);


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isBtns={true}
      btnApplyTitle={"Save"}
      onClick={formik.handleSubmit}
      className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12"}
      title={"Add Plan"}
    >
        <div className="flex flex-col gap-4">
          <div className={"px-4"}>
            <InputAndLabel
                title="Plan Name"
                name="plan_name"
                value={formik.values.plan_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder=""
                error={
                  formik.touched.plan_name && formik.errors.plan_name
                      ? formik.errors.plan_name
                      : ""
                }
                isRequired={true}
            />
          </div>

          <div className={"w-full p-1 bg-gray-100 px-4 text-gray-800 text-xs"}>
            Plan Prices
          </div>
          {
            countPrices.map( (_,index) => (
                <div key={index} className={""}>
                  <div className={"px-4 w-full flex gap-3"}>
                    <DefaultSelect title={"Duration Type"} options={["1","2","3"]}  />
                    <InputAndLabel
                        title="Duration Value "
                        name="price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder=""
                        error={
                          formik.touched.price && formik.errors.price
                              ? formik.errors.price
                              : ""
                        }
                        isRequired={true}
                    />
                  </div>

                  <div className={"px-4 w-full flex gap-3"}>
                    <InputAndLabel
                        title="Price"
                        name="price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder=""
                        error={
                          formik.touched.price && formik.errors.price
                              ? formik.errors.price
                              : ""
                        }
                        isRequired={true}
                    />
                    <DefaultSelect title={"Currency"} options={["1","2","3"]}  />
                  </div>
                </div>
            )
            )
          }
          <div className={"px-4"}>
            <button onClick={() => {setCountPrices([...countPrices,countPrices+1])}} className={"w-full bg-blue-50 text-blue-700 py-1 text-sm rounded-md"}>
              + Add New Price
            </button>
          </div>

          <div className={"w-full p-1 bg-gray-100 px-4 text-gray-800 text-xs"}>
            Plans Features
          </div>

          {
            countFeature.map( (_,index) => (
                    <div key={index} className={""}>
                      <div className={"px-4 w-full flex flex-col gap-3"}>
                        <DefaultSelect title={"Duration Type"} options={["1","2","3"]}  />
                        <div className={"w-full flex items-center gap-3"}>
                          <InputAndLabel
                              title="Duration Value "
                              name="price"
                              value={formik.values.price}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              placeholder=""
                              error={
                                formik.touched.price && formik.errors.price
                                    ? formik.errors.price
                                    : ""
                              }
                              isRequired={true}
                          />
                          <DefaultSelect title={"Duration Type"} options={["1","2","3"]}  />
                          <InputAndLabel
                              title="Duration Value "
                              name="price"
                              value={formik.values.price}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              placeholder=""
                              error={
                                formik.touched.price && formik.errors.price
                                    ? formik.errors.price
                                    : ""
                              }
                              isRequired={true}
                          />
                        </div>
                      </div>
                    </div>
                )
            )
          }
          <div className={"px-4"}>
            <button onClick={() => {setCountFeature([...countFeature,countFeature+1])}} className={"w-full bg-blue-50 text-blue-700 py-1 text-sm rounded-md"}>
              + Add New Feature
            </button>
          </div>
              <div className={"flex items-baseline gap-2 px-4 pb-3 "}>
                <Switch2 className={"h-4 w-9"} isOn={true} />
                <div className={"flex flex-col"}>
                <span className={"text-sm text-black"}>Free Trial Status</span>
                <p className={"text-xs text-gray-500"}>Check if you want to activate the free trial or not </p>
                </div>
              </div>

        </div>
    </Modal>
  );
}

CreatePlanModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default CreatePlanModal;
