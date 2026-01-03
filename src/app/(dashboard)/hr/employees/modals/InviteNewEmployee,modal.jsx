'use client'
import Modal from "@/components/Modal/Modal";
import TagInput from "@/components/Form/TagInput";

const employeesFactory = [
    { id: "1", name: "Fatma Ahmed Moh", email: "fatma@example.com", image: "https://images.squarespace-cdn.com/content/v1/58865912a5790a87a29447e5/1501777422700-0WW6HYF16XLP8ZTJ0PMU/Image+Profile+Photography2.jpg" },
    { id: "2", name: "Ali Hassan", email: "ali.hassan@example.com", image: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: "3", name: "Sara Khaled", email: "sara.khaled@gmail.com", image: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: "4", name: "Mona Ali", email: "mona.ali@example.com", image: "https://randomuser.me/api/portraits/women/4.jpg" },
];

function InviteNewEmployeeModal({ isOpen, onClose }) {
    // سنقوم بتجهيز البيانات لتناسب المتطلبات التي يتوقعها TagInput
    // مع إضافة تصميم الـ Checkbox والبريد الإلكتروني داخل خاصية name ليقوم المكون بعرضها
    const formattedSuggestions = employeesFactory.map(emp => ({
        id: emp.id,
        image: emp.image,
        email: emp.email,
        name: emp.name
    }));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            isHideCancel={true}
            btnApplyTitle={"Add"}
            onClick={() => {
                console.log("Submit logic");
            }}
            className={"lg:w-4/12 md:w-8/12 sm:w-10/12 w-11/12"}
            title={"Invite New Employee"}
        >
            <div className="flex flex-col gap-4 px-4">
                <div className="w-full">
                    <TagInput
                        title="Email"
                        placeholder="Enter email or select employee..."
                        apparent={"email"}
                        isRequired={true}
                        suggestions={formattedSuggestions}
                    />
                </div>
            </div>
        </Modal>
    );
}

export default InviteNewEmployeeModal;