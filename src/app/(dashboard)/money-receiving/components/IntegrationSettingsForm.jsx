import InputAndLabel from "@/components/Form/InputAndLabel";

function IntegrationSettingsForm() {
    return (
        <div className={"flex flex-col gap-4 max-h-full pb-3"}>
            <InputAndLabel
                type="text"
                title={"Account Email / ID"}
                isRequired={true}
                placeholder="Account Email"
            />
            <InputAndLabel
                type="text"
                title={"Client ID"}
                isRequired={true}
                placeholder="Client ID"
            />

            <InputAndLabel
                type="text"
                title={"Client Secret"}
                isRequired={true}
                placeholder="Client Secret"
            />
            <InputAndLabel
                type="text"
                title={"Mode"}
                isRequired={true}
                placeholder="Mode"
            />
            <InputAndLabel
                type="text"
                title={"Webhook URL"}
                isRequired={true}
                placeholder="Webhook URL"
            />
            <InputAndLabel
                type="text"
                title={"Callback URL"}
                isRequired={true}
                placeholder="Callback URL"
            />

        </div>
    );
}

export default IntegrationSettingsForm;