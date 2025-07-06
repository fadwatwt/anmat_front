import Modal from "../Modal.jsx";
import PropTypes from "prop-types";
import TabMethod from "../TabsContener/TabMethod.jsx";
import LikeMethod from "./Tabs/Like.method.jsx";
import UnLikeMethod from "./Tabs/UnLike.method.jsx";

function LikeAndUnLike({isOpen, onClose,className}) {
    const tabsData = [
        {
            title: "Like",
            content: <LikeMethod />,
        },
        {
            title: "UnLike",
            content:<UnLikeMethod />,
        },
    ];


    return (
        <Modal isOpen={isOpen} onClose={onClose} title={"Like/Unlike"} className={className}>
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