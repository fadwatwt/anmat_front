import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import { useState } from "react";
import FileUpload from "@/components/Form/FileUpload.jsx";
import StarRatingInput from "@/components/Form/StarRatingInput";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";
import { useTranslation } from "react-i18next";

function TeamRatingModal({ isOpen, onClose, team }) {
    const { t } = useTranslation();
    const teamName = team?.name || "Publishing Team";
    const [ratings, setRatings] = useState({
        timeDelivery: 0,
        quality: 0,
        communication: 0,
    });

    const [comments, setComments] = useState("");

    const handleRating = (category, rating) => {
        setRatings((prev) => ({ ...prev, [category]: rating }));
    };

    const categories = [
        { key: "timeDelivery", label: "Time Delivery" },
        { key: "quality", label: "Quality" },
        { key: "communication", label: "Communication" },
    ];

    const handleSubmit = () => {
        // Handle submit logic here
        console.log("Submitted Rating", { teamName, ratings, comments });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            title={`${teamName} ${t("Rating")}`}
            btnApplyTitle={t("Submit")}
            btnCancelTitle={t("Cancel")}
            onClick={handleSubmit}
            classNameOpacity={"bg-opacity-20"}
            className="lg:w-[500px] md:w-8/12 w-11/12 px-3" // Adjust width to be closer to the screenshot
        >
            <div className="w-full flex flex-col items-start gap-6 px-2 mb-2">

                {/* Ratings Section */}
                <div className="flex flex-col w-full items-start gap-5">
                    {categories.map((cat) => (
                        <StarRatingInput
                            key={cat.key}
                            title={t(cat.label) + ":"}
                            value={ratings[cat.key]}
                            onChange={(val) => handleRating(cat.key, val)}
                        />
                    ))}
                </div>

                {/* File Upload Section */}
                <div className="w-full border-t pt-4 border-dashed border-gray-200">
                    <FileUpload />
                </div>

                {/* Comments Section */}
                <div className="w-full">
                    <TextAreaWithLabel
                        title="Comment"
                        placeholder="Write your comments here"
                        rows={4}
                        maxLength={200}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        isOptional={true}
                    />
                </div>
            </div>
        </Modal>
    );
}

TeamRatingModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    team: PropTypes.object,
};

export default TeamRatingModal;
