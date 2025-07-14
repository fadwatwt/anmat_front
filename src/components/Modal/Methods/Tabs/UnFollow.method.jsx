import FileUpload from "../../../Form/FileUpload.jsx";
import WordTheMiddleAndLine from "../../../Subcomponents/WordTheMiddleAndLine.jsx";
import DefaultButton from "../../../Form/DefaultButton.jsx";
import InputAndLabel from "../../../Form/InputAndLabel.jsx";

function UnFollowMethod() {
    return (
        <div className={""}>
            <FileUpload/>
            <WordTheMiddleAndLine word={"OR"}/>
            <InputAndLabel type={"text"} title={"Insert link"} placeholder={"Insert link.."}/>
            <WordTheMiddleAndLine />
            <div className={"flex gap-2"}>
                <DefaultButton type={'button'} title={"Cancel"} className={"font-medium dark:text-gray-200"} />
                <DefaultButton type={'button'} title={"Apply"} className={"bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white"} />
            </div>
        </div>
    );
}

export default UnFollowMethod;