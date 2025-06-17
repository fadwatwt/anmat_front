import TabMethod from "../TabsContener/TabMethod.jsx";
import DeletePostManuallyMethod from "./Tabs/Post/DeletePostManually.method.jsx";
import PostManuallyMethod from "./Tabs/Post/PostManually.method.jsx";
import {useTranslation} from "react-i18next";

function PostManually() {
    const {t} = useTranslation()
    const tabsData = [
        {
            title: t("Post"),
            content: <PostManuallyMethod />,
        },
        {
            title: t("Delete Post"),
            content:<DeletePostManuallyMethod />,
        },
    ];
    return (
        <TabMethod tabs={tabsData}/>
    );
}

export default PostManually;