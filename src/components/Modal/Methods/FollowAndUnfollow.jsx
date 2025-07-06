import Modal from "../Modal.jsx";
import PropTypes from "prop-types";
import FollowMethod from "./Tabs/Follow.method.jsx";
import TabMethod from "../TabsContener/TabMethod.jsx";
import UnFollowMethod from "./Tabs/UnFollow.method.jsx";

function FollowAndUnfollow({isOpen, onClose,className}) {
    const tabsData = [
        {
            title: "Follow",
            // icon: RiFacebookFill,
            content: <FollowMethod />,
        },
        {
            title: "Unfollow",
            // icon: FaXTwitter,
            content:<UnFollowMethod />,
        },
    ];


    return (
        <Modal isOpen={isOpen} onClose={onClose} title={"Follow/Unfollow"} className={className}>
            <TabMethod tabs={tabsData}/>
        </Modal>
    );
}

FollowAndUnfollow.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    className: PropTypes.string,
}

export default FollowAndUnfollow;