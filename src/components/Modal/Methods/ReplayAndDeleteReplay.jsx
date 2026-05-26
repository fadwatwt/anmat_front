import TabMethod from "../TabsContener/TabMethod.jsx";
import Modal from "../Modal.jsx";
import ReplayMethod from "./Tabs/Replay.method.jsx";
import DeleteReplayMethod from "./Tabs/DeleteReplay.method.jsx";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";


function ReplayAndDeleteReplay({isOpen, onClose,className}) {
    const { t } = useTranslation();

    const tabsData = [
        {
            title: t("Replay"),
            content: <ReplayMethod />,
        },
        {
            title: t("Delete Replay"),
            content:<DeleteReplayMethod />,
        },
    ];
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t("Replay/Delete Replay")} className={className}>
            <TabMethod tabs={tabsData}/>
        </Modal>
    );
}

ReplayAndDeleteReplay.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    className: PropTypes.string,
}

export default ReplayAndDeleteReplay;