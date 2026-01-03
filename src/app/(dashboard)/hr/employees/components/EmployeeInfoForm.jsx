import InputAndLabel from "@/components/Form/InputAndLabel";
import ElementsSelect from "@/components/Form/ElementsSelect";
import DateInput from "@/components/Form/DateInput";
import FileUpload from "@/components/Form/FileUpload";


function EmployeeInfoForm() {
    const optionsStatus = [
        { id: "1", element: "Palestine" },
        { id: "2", element: "Palestine" },
        { id: "3", element: "Palestine" },
        { id: "4", element: "Palestine" },
    ];
    return (
        <div className={"flex flex-col gap-4 max-h-full pb-3"}>
            <InputAndLabel
                type="text"
                title={"Full Name"}
                isRequired={true}
                placeholder="Online Payment"
            />
            <InputAndLabel
                type="text"
                title={"Email"}
                isRequired={true}
                placeholder="Credit Card"
            />
            <DateInput title={"Date of Birth"} />
            <ElementsSelect
                title="Cuntry"
                options={optionsStatus}
                defaultValue={[optionsStatus[0]]}
                name="status"
                classNameContainer={"w-full"}
            />
            <ElementsSelect
                title="City"
                options={optionsStatus}
                defaultValue={[optionsStatus[0]]}
                name="status"
                classNameContainer={"w-full"}
            />

            <FileUpload title={"Avatar"}  />
        </div>
    );
}

export default EmployeeInfoForm;