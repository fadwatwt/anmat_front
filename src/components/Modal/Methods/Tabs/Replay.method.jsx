import FileUpload from "../../../Form/FileUpload.jsx";
import WordTheMiddleAndLine from "../../../Subcomponents/WordTheMiddleAndLine.jsx";
import InputAndLabel from "../../../Form/InputAndLabel.jsx";
import DefaultButton from "../../../Form/DefaultButton.jsx";

function ReplayMethod() {
    return (
        <div className={"flex flex-col gap-2"}>
            <InputAndLabel type={"text"} title={"Insert Post Link"} placeholder={"Insert link.."} className={"mb-2"}/>
            <FileUpload/>
            <WordTheMiddleAndLine/>
            <div className={"flex gap-2"}>
                <DefaultButton type={'button'} title={"Cancel"} className={"font-medium dark:text-gray-200 "} />
                <DefaultButton type={'button'} title={"Apply"} className={"bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white"} />
            </div>
        </div>
    );
}

export default ReplayMethod;