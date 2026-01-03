import InputAndLabel from "@/components/Form/InputAndLabel";
import DateInput from "@/components/Form/DateInput";
import ElementsSelect from "@/components/Form/ElementsSelect";
import FileUpload from "@/components/Form/FileUpload";
import Rating from "@/app/(dashboard)/hr/Rating";
import StarRatingInput from "@/components/Form/StarRatingInput";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";

function WorkAndRatingInfoForm() {
    const optionsStatus = [
        { id: "1", element: "Palestine" },
        { id: "2", element: "Palestine" },
        { id: "3", element: "Palestine" },
        { id: "4", element: "Palestine" },
    ];
    return (
        <div className={"flex flex-col gap-4 max-h-full pb-3"}>
            <ElementsSelect
                title="Roles"
                options={optionsStatus}
                defaultValue={[optionsStatus[0]]}
                name="status"
                classNameContainer={"w-full"}
            />
            <ElementsSelect
                title="Department"
                options={optionsStatus}
                defaultValue={[optionsStatus[0]]}
                name="status"
                classNameContainer={"w-full"}
            />
            <ElementsSelect
                title="Position"
                options={optionsStatus}
                defaultValue={[optionsStatus[0]]}
                name="status"
                classNameContainer={"w-full"}
            />
            <InputAndLabel
                type="number"
                title={"Working Hours"}
                isRequired={true}
                placeholder="Online Payment"
            />
            <InputAndLabel
                type="number"
                title={"Salary"}
                isRequired={true}
                placeholder="Credit Card"
            />
            <InputAndLabel
                type="number"
                title={"Yearly Days-Off"}
                isRequired={true}
                placeholder="Credit Card"
            />
            <InputAndLabel
                type="number"
                title={"Weekend Days"}
                isRequired={true}
                placeholder="Credit Card"
            />

            <StarRatingInput title={"Score"}   />
            <StarRatingInput title={"Total"}   />

            <TextAreaWithLabel title={"Description"} placeholder={"Enter description..."} />
        </div>
    );
}

export default WorkAndRatingInfoForm;