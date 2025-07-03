import { useTranslation } from "react-i18next";
import { FaRegComment } from "react-icons/fa";
import { BiLike } from "react-icons/bi";
import { RiSendPlane2Fill } from "react-icons/ri";
import PropTypes from "prop-types";
import ReadMore from "../../functions/ReadMore.jsx";

function BriefTimeLine({ myAccount, tweet }) {
    const { t, i18n } = useTranslation();
    const text = `<p class="text-sm dark:text-main-900">${tweet.text} </p>`

    return (
        <div className="p-3 w-full bg-white rounded-2xl dark:bg-gray-800">
            <div className="p-2 flex w-full flex-col gap-5 border-[0.5px] border-soft-200 dark:border-gray-700 dark:bg-white-0 h-full rounded-2xl">
                <div className="flex justify-between items-center w-full py-1">
                    <p className="text-sm dark:text-main-900">{t("Timeline")}</p>
                    <div className="px-1 py-0.5">
                        <p className="text-xs text-primary-500 dark:text-primary-200 cursor-pointer">{t("View all")}</p>
                    </div>
                </div>
                <div className="p-2 flex gap-2 w-full items-center flex-col bg-gray-50 dark:bg-veryWeak-500 rounded-xl">
                    <div className="flex flex-col gap-2 w-full items-start">
                        <div className="flex gap-2 w-full">
                            <div>
                                <img
                                    src="https://i.pinimg.com/originals/17/9e/25/179e258f61d2d0f56b850b7d85c76493.jpg"
                                    alt="profile"
                                    className="max-w-full h-6 w-6 rounded-full"
                                />
                            </div>
                            <div className="w-full flex flex-col items-start">
                                <p className="text-sm dark:text-main-900">{tweet.accountName}</p>
                                <p className="text-xs text-gray-500 dark:text-soft-400">{tweet.date}</p>
                            </div>
                        </div>
                        <div className="description text-start">
                            <ReadMore maxLength={100} htmlContent={text}/>
                        </div>
                        {tweet.images && tweet.images.length > 0 ? (
                            <div className="images flex flex-col gap-1 w-full">
                                <div className="large-image flex-1">
                                    <img
                                        src={tweet.images[0]}
                                        alt="large image"
                                        className="rounded max-w-full object-cover"
                                    />
                                </div>
                                <div className="another-images flex-1 flex gap-1 w-full flex-wrap">
                                    {tweet.images.slice(1).map((image, index) => (
                                        <div key={index} className="flex-1">
                                            <img
                                                src={image}
                                                alt="small image"
                                                className="rounded max-w-full w-full h-16 object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="flex flex-col gap-3 pr-1 w-full">
                        <div className="actions self-start flex w-full justify-between">
                            <div className="flex gap-1 flex-1">
                                <div className="px-2 py-1 cursor-pointer bg-primary-lighter dark:bg-primary-700 flex gap-1 items-baseline rounded-lg">
                                    <BiLike className="text-sm text-primary-base dark:text-primary-150" />
                                    <span className="text-primary-base text-xs dark:text-primary-150">{t("Like")}</span>
                                </div>
                                <div className="py-1 px-2 cursor-pointer bg-primary-lighter flex gap-1 items-center rounded-lg dark:bg-primary-700">
                                    <FaRegComment className="text-sm text-primary-base dark:text-primary-150" />
                                    <span className="text-primary-base text-xs dark:text-primary-150">{t("Comment")}</span>
                                </div>
                            </div>
                            <div className="flex justify-end items-center flex-1">
                                <div
                                    className={`flex items-center justify-start gap-1 ${
                                        i18n.language === "ar" ? "flex-row-reverse" : "flex-row"
                                    }`}
                                >
                                    <BiLike className="text-xs text-gray-400 dark:text-gray-100" />
                                    <p className="text-gray-400 text-[11px] dark:text-gray-100">20</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center w-full gap-1">
                            <div className="h-6 w-6">
                                <img
                                    src={myAccount.imageProfile}
                                    alt=""
                                    className="max-w-full w-6 h-6 rounded-full"
                                />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    className="flex-2 rounded-xl w-[98%] p-2 box-border border-[0.5px] border-sub-300 placeholder:text-soft-400 dark:bg-white-0 dark:placeholder:text-soft-200 dark:border-veryWeak-500 text-xs"
                                    placeholder={t("Write A Comment..")}
                                />
                            </div>
                            <div className="w-[17.12px] cursor-pointer">
                                <RiSendPlane2Fill className="text-primary-base text-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

BriefTimeLine.propTypes = {
    myAccount: PropTypes.object,
    tweet: PropTypes.object.isRequired,
};

export default BriefTimeLine;
