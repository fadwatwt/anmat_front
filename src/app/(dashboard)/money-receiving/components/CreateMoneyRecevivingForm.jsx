import InputAndLabel from "@/components/Form/InputAndLabel";
import ElementsSelect from "@/components/Form/ElementsSelect";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status";
import TagInput from "@/components/Form/TagInput";
import DefaultSelect from "@/components/Form/DefaultSelect";

function CreateMoneyRecevivingForm() {
    const optionsStatus = [
        { id: "1", element: <Status type={"Scheduled"} title={"Scheduled"} /> },
        { id: "2", element: <Status type={"Delayed"} title={"Delayed"} /> },
        { id: "3", element: <Status type={"Inactive"} title={"Inactive"} /> },
        { id: "4", element: <Status type={"Active"} title={"Active"} /> },
    ];
    const handleSelectChange = (name, value) => {
        console.log(name, value);
    };
    const suggestionsCurrancy = [
        { id: "1", name: "USD" },
        { id: "2", name: "SAR" },
    ]
    return (
        <div className={"flex flex-col gap-4 max-h-full pb-3"}>
            <InputAndLabel
                type="text"
                title={"Money Receiving Method Name"}
                isRequired={true}
                placeholder="Online Payment"
            />
            <InputAndLabel
                type="text"
                title={"Type"}
                isRequired={true}
                placeholder="Credit Card"
            />
            <ElementsSelect
                title="Provider"
                options={optionsStatus}
                defaultValue={[optionsStatus[0]]}
                name="status"
                classNameContainer={"w-full"}
            />

            <InputAndLabel
                type="text"
                title={"Fees"}
                disabled={true}
                isRequired={true}
                placeholder="22%"
            />
            <TagInput suggestions={suggestionsCurrancy}
                      title={"Currency"}
                      isRequired={true} placeholder={""} />
            <DefaultSelect title={"Country"} options={[
                {_id:"1",value:"Palestine"},
                {_id:"2",value:"Palestine"},
                {_id:"3",value:"Palestine"},
                {_id:"4",value:"Palestine"}
            ]} onChange={() => {}} />
            <DefaultSelect title={"Address"} options={[
                {_id:"1",value:"Palestine"},
                {_id:"2",value:"Palestine"},
                {_id:"3",value:"Palestine"},
                {_id:"4",value:"Palestine"}
            ]} onChange={() => {}} />

            <div className={"flex items-start gap-2"}>
                <div className={"pt-1 border-box"}>
                    <input type={"checkbox"} onChange={() => { }} checked={true} className={" checkbox-custom"}/>
                </div>
                <div className={"text-gray-800 dark:text-gray-200 flex flex-col text-sm"}>
                    Set this receiving method as default
                    <span className={"text-gray-400 text-xs"}>It will save your payment method as the default option.</span>
                </div>
            </div>

        </div>
    );
}

export default CreateMoneyRecevivingForm;