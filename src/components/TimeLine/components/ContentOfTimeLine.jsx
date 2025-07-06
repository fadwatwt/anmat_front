import {BiLike} from "react-icons/bi";
import {FaRegComment} from "react-icons/fa";
import {RiSendPlane2Fill} from "react-icons/ri";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";


function ContentOfTimeLine({text, images , account, date,myAccount}) {
    const {t, i18n} = useTranslation()
    return (
        <div
            className={"p-2 flex  gap-2 w-full border-[0.5px] border-soft-200 dark:border-gray-700 items-center flex-col bg-gray-50 dark:bg-veryWeak-500 rounded-xl"}>
            <div className={"flex flex-col gap-2 w-full items-start"}>
                <div className={"flex gap-2 w-full"}>
                    <div className={""}>
                        <img src={account.imageProfile}
                             alt={"profile"}
                             className={"max-w-full h-6 w-6 rounded-full"}/>
                    </div>
                    <div className={"w-full flex flex-col items-start"}>
                        <p className={"text-sm dark:text-main-900"}>{account.name}</p>
                        <p className={"text-xs text-gray-500 dark:text-soft-400"}>{date}</p>
                    </div>
                </div>
                <div className={"description text-start"}>
                    <div className={"text-sm dark:text-main-900"} dangerouslySetInnerHTML={{__html: text}} />

                </div>
                {
                    images && images.length > 0 ? (
                <div className={"images flex flex-col gap-1 w-full"}>
                    <div className={"large-image flex-1"}>
                        <img
                            src={images[0]}
                            alt={"large image"} className={"rounded max-w-full object-cover"}/>
                    </div>
                            <div className={"another-images flex-1 flex gap-1 w-full flex-wrap"}>
                                {
                                    images.slice(1).map((image, index) => (
                                        <div key={index} className={"flex-1"}>
                                            <img
                                                src={images[index]}
                                                alt={"large image"}
                                                className={"rounded max-w-full w-full h-16 object-cover"}/>
                                        </div>
                                    ))
                                }
                            </div>

                </div>
                    ) : null
                }
            </div>
            <div className={"flex flex-col gap-3 pr-1 w-full"}>
                <div className={"actions self-start flex w-full justify-between"}>
                    <div className={"flex gap-1 flex-1"}>
                        <div
                            className={"px-2 py-1 cursor-pointer bg-primary-lighter dark:bg-primary-700 flex gap-1 items-baseline rounded-lg"}>
                            <BiLike className={"text-sm text-primary-base dark:text-primary-150"}/><span
                            className={"text-primary-base text-xs dark:text-primary-150"}>{t("Like")}</span>
                        </div>
                        <div
                            className={"py-1 px-2 cursor-pointer bg-primary-lighter flex gap-1 items-center rounded-lg dark:bg-primary-700"}>
                            <FaRegComment className={"text-sm text-primary-base dark:text-primary-150"}/><span
                            className={"text-primary-base text-xs dark:text-primary-150"}>{t("Comment")}</span>
                        </div>
                    </div>
                    <div className={"flex justify-end items-center flex-1"}>
                        <div
                            className={`flex items-center justify-start gap-1 ${i18n.language == "ar" ? "flex-row-reverse" : "flex-row"}`}>
                            <BiLike className={"text-xs text-gray-400 dark:text-gray-100"}/>
                            <p className={"text-gray-400 text-[11px] dark:text-gray-100"}>20</p>
                        </div>
                    </div>
                </div>
                <div className={"flex items-center w-full gap-1"}>
                    <div className={"h-6 w-6"}>
                        <img
                            src={ myAccount && myAccount.imageProfile}
                            alt={""} className={"max-w-full w-6 h-6 rounded-full"}/>
                    </div>
                    <div className={"flex-1"}>
                        <input type={"text"}
                               className={" flex-2 rounded-xl w-[98%] p-2 box-border border-[0.5px] border-sub-300 placeholder:text-soft-400 dark:bg-white-0 dark:placeholder:text-soft-200 dark:border-veryWeak-500  text-xs"}
                               placeholder={t("Write A Comment..")}/>
                    </div>
                    <div className={"w-[17.12px] cursor-pointer"}>
                        <RiSendPlane2Fill className={"text-primary-base text-lg "}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

ContentOfTimeLine.propTypes = {
    text: PropTypes.node,
    images: PropTypes.array,
    date: PropTypes.string,
    account: PropTypes.arrayOf({
        name: PropTypes.string,
        imageProfile: PropTypes.string
    }),
    myAccount: PropTypes.object
}

export default ContentOfTimeLine;