import ElementsSelect from "@/components/Form/ElementsSelect";
import Modal from "@/components/Modal/Modal";
import InputAndLabel from "@/components/Form/InputAndLabel";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";

function SendNotificationModal({isOpen, onClose}) {
    const employeesFactory = [
        {
            id: "1",
            name: "Fatma Ahmed Moh",
            email: "fatma@example.com",
            image: "https://images.squarespace-cdn.com/content/v1/58865912a5790a87a29447e5/1501777422700-0WW6HYF16XLP8ZTJ0PMU/Image+Profile+Photography2.jpg"
        },
        {
            id: "2",
            name: "Ali Hassan",
            email: "ali.hassan@example.com",
            image: "https://randomuser.me/api/portraits/men/1.jpg"
        },
        {
            id: "3",
            name: "Sara Khaled",
            email: "sara.khaled@gmail.com",
            image: "https://randomuser.me/api/portraits/women/2.jpg"
        },
        {
            id: "4",
            name: "Mona Ali",
            email: "mona.ali@example.com",
            image: "https://randomuser.me/api/portraits/women/4.jpg"
        },
    ];
    // تحويل البيانات لتناسب الكومبوننت مع الاحتفاظ بالبيانات الإضافية
    const selectOptions = [
        {id: "all", element: "All Employees", isSelectAll: true},
        ...employeesFactory.map(emp => ({
            id: emp.id,
            element: emp.name, // سيستخدم كـ "Tag" عند الاختيار
            email: emp.email,
            image: emp.image
        }))
    ];

    return (
        <Modal
            title={"Send Notification"}
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            isHideCancel={true}
            btnApplyTitle={"Send"}
            onClick={() => {
                console.log("Submit logic");
            }}
        >
            <div className="flex flex-col gap-4 px-4">
                <div className="w-full flex flex-col gap-4">
                    <ElementsSelect
                        title={"Employees"}
                        isMultiple={true}
                        options={selectOptions}
                        renderOption={(option) => (
                            <div className="flex items-center gap-3">
                                {option.image && (
                                    <img
                                        src={option.image}
                                        className="w-8 h-8 rounded-full object-cover border border-gray-100"
                                        alt=""
                                    />
                                )}
                                <div className="flex flex-col">
                                    <span className="text-gray-900 dark:text-white text-sm">
                                        {option.element}
                                    </span>
                                    {option.email && (
                                        <span className="text-xs text-gray-500">
                                            {option.email}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    />
                    <InputAndLabel title={"Title"} type={"text"} placeholder={""} isRequired={true}  />
                   <ElementsSelect title={"Model Type"} options={[
                       {id:"1",element:"type 1"},
                   {id:"2",element:"type 2"}
                   ]} />
                    <ElementsSelect title={"Related Model"} options={[
                        {id:"1",element:"type 1"},
                        {id:"2",element:"type 2"}
                    ]} />
                    <TextAreaWithLabel title={"Message"} placeholder={"Enter message..."} />
                </div>
            </div>
        </Modal>
    );
}

export default SendNotificationModal;