import Modal from "../Modal.jsx";
import PropTypes from "prop-types";
import TabMethod from "../TabsContener/TabMethod.jsx";
import LikeMethod from "./Tabs/Like.method.jsx";
import UnLikeMethod from "./Tabs/UnLike.method.jsx";
import { useTranslation } from "react-i18next";

function LikeAndUnLike({isOpen, onClose,className}) {
    const { t } = useTranslation();
    const tabsData = [
        {
            title: t("Like"),
            content: <LikeMethod />,
        },
        {
            title: t("UnLike"),
            content:<UnLikeMethod />,
        },
    ];


    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t("Like/Unlike")} className={className}>
            <TabMethod tabs={tabsData}/>
        </Modal>
    );
}

LikeAndUnLike.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    className: PropTypes.string,
}

export default LikeAndUnLike;