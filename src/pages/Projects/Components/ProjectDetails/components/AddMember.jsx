import Modal from "../../../../../components/Modal/Modal.jsx";
import UserSelect from "../../../../../components/Form/UserSelect.jsx";
import PropTypes from "prop-types";
import WordTheMiddleAndLine from "../../../../../components/Subcomponents/WordTheMiddleAndLine.jsx";

function AddMember({isOpen, onClose}) {
    const users = [
        {
            id: 1,
            name: "Yara Nabil",
            username: "Yara",
            image: "https://assets.entrepreneur.com/content/3x2/2000/20150406145944-dos-donts-taking-perfect-linkedin-profile-picture-selfie-mobile-camera-2.jpeg?format=pjeg&auto=webp&crop=1:1",
        },
        {
            id: 2,
            name: "Ahmed Khalil",
            username: "Ahmed",
            image: "https://media.istockphoto.com/id/1199100409/photo/portrait-of-successful-businessman.jpg?s=612x612&w=0&k=20&c=U7fzV2RqONjttzqr4r_cGHWueUN3SP8BOH4mn0hiw4E=",
        },
        {
            id: 3,
            name: "Ali Farouk",
            username: "Ali",
            image: "https://media.istockphoto.com/id/1303206558/photo/headshot-portrait-of-smiling-businessman-talk-on-video-call.jpg?s=612x612&w=0&k=20&c=hMJhVHKeTIznZgOKhtlPQEdZqb0lJ5Nekz1A9f8sPV8=",
        },
        {
            id: 4,
            name: "Mohamed El-Sayed",
            username: "Mohamed",
            image: "https://assets.entrepreneur.com/content/3x2/2000/20150406145944-dos-donts-taking-perfect-linkedin-profile-picture-selfie-mobile-camera-2.jpeg?format=pjeg&auto=webp&crop=1:1",
        },
    ];
    return (
        <Modal isOpen={isOpen} onClose={onClose} isBtns={true} title={"Adding a Member"} btnApplyTitle={"Add"} >
            <UserSelect users={users} title={"Member Name"} onChange={() => {}}  isMultiSelect={false} classNameContainer={" h-16"} isViewIcon={true} />
            <WordTheMiddleAndLine />
        </Modal>
    );
}

AddMember.propTypes = {
    isOpen:PropTypes.bool,
    onClose:PropTypes.func,
}

export default AddMember;