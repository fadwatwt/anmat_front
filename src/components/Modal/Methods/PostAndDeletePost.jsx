
import Modal from "../Modal.jsx";
import PropTypes from "prop-types";
import TabModal from "../TabsContener/TabModal.jsx";
import PostByFile from "./PostByFile.jsx";
import PostManually from "./PostManually.jsx";

function PostAndDeletePost({isOpen, onClose,className}) {
    const tabsData = [
        {
            title: "By File",
            content: <PostByFile />,
        },
        {
            title: "Manually",
            content:<PostManually />,
        },
    ];
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={"Post/Delete Post"} className={className}>
            <TabModal tabs={tabsData}/>
        </Modal>
    );
}

PostAndDeletePost.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    className: PropTypes.string,
}

export default PostAndDeletePost;