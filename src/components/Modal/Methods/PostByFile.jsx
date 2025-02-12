
import TabMethod from "../TabsContener/TabMethod.jsx";
import PostByFileMethod from "./Tabs/Post/PostByFile.method.jsx";
import DeletePostByFileMethod from "./Tabs/Post/DeletePostByFile.method.jsx";
import {useTranslation} from "react-i18next";

function PostByFile() {
    const {t} = useTranslation()
    const tabsData = [
        {
            title: t("Post"),
            content: <PostByFileMethod />,
        },
        {
            title: t("Delete Post"),
            content:<DeletePostByFileMethod />,
        },
    ];
    return (
        <TabMethod tabs={tabsData}/>
    );
}


export default PostByFile;