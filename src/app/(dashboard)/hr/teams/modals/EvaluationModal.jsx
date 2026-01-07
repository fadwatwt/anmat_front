import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import { useState } from "react";
import FileUpload from "@/components/Form/FileUpload.jsx";
import { FaStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function TeamEvaluationModal({ isOpen, onClose, team }) {
    const [ratings, setRatings] = useState({
        performance: 0,
        collaboration: 0,
        timeliness: 0,
    });

    const [comments, setComments] = useState("");
    const { t } = useTranslation();

    const handleRating = (category, rating) => {
        setRatings((prev) => ({ ...prev, [category]: rating }));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            title={team?.name + " " + t("Evaluation")}
            classNameOpacity={"bg-opacity-20"}
        >
            <div className="w-full flex flex-col items-start gap-5 px-1 mb-2">
                <div className="flex flex-col w-full gap-1 items-start">
                    <p className="text-md dark:text-gray-200">
                        <span className={"dark:text-sub-300 text-md"}>
                            {t("Department")}:
                        </span>
                        {team?.department || "-"}
                    </p>
                    <div className="text-sm flex gap-1 items-center">
                        <span className={"dark:text-sub-300"}>{t("Members Count")}: </span>{" "}
                        <span className="font-semibold">{team?.members_count || 0}</span>
                    </div>
                </div>

                {/* Ratings Section */}
                <div className="flex flex-col w-full items-start gap-4">
                    {["Performance", "Collaboration", "Timeliness"].map(
                        (category, index) => {
                            const key = category.toLowerCase();
                            return (
                                <div
                                    key={index}
                                    className="w-full flex flex-col items-start gap-2"
                                >
                                    <p className="text-sm dark:text-gray-200">{t(category)}:</p>
                                    <div className="flex justify-around w-full">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                size={25}
                                                className={`cursor-pointer ${ratings[key] >= star
                                                        ? "text-yellow-500"
                                                        : "text-gray-300"
                                                    }`}
                                                onClick={() => handleRating(key, star)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>

                {/* File Upload Section */}
                <div className="w-full">
                    <FileUpload />
                </div>

                {/* Comments Section */}
                <div className="flex flex-col gap-1 items-start w-full ">
                    <p className="text-sm dark:text-gray-200">
                        {`${t("Comment")}`}
                        <span className={"text-sm dark:text-sub-300 text-sub-500 mx-1"}>
                            ({t("Optional")}):
                        </span>
                    </p>
                    <div className={"w-full"}>
                        <textarea
                            className="w-full p-2 dark:bg-white-0  border dark:border-soft-500 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder={t("Write your comments here...")}
                            rows="4"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                        ></textarea>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

TeamEvaluationModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    team: PropTypes.object,
};

export default TeamEvaluationModal;
