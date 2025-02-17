import {LiaUser} from "react-icons/lia";
import {useTranslation} from "react-i18next";
import {GoMail} from "react-icons/go";
import {IoIosLock} from "react-icons/io";
import WordTheMiddleAndLine from "../../components/Subcomponents/WordTheMiddleAndLine.jsx";
import {FcGoogle} from "react-icons/fc";

function LoginPage() {
    const {t,i18n} = useTranslation()
    return (
        <div className={"w-full flex h-screen justify-start py-1"}>
            <div className={"flex flex-col w-[40%] justify-between px-9 py-7"}>
                <div className={"flex items-center justify-start gap-3"}>
                    <img
                        className="w-10 h-10 rounded-full"
                        src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8Hov7jcWb4cWae_alBRxB-N1tJiTFrpt1PA&s"}
                        alt={""}
                    />
                    <div className={"text-sm text-sub-500 text-start dark:text-sub-300"}>
                        <p>Employees</p>
                        <p>Management</p>
                    </div>
                </div>
                <div className={"loginForm flex flex-col gap-3 w-11/12"}>
                    <div className={"flex flex-col items-center gap-3"}>
                        <div className={"flex w-20 h-20 justify-center items-center rounded-full bg-[#F3F3F4]"}>
                            <div className={"flex w-12 h-12 justify-center items-center rounded-full bg-white shadow-md"}>
                                <LiaUser size={30} />
                            </div>
                        </div>
                        <div className={"text-sm text-sub-500 flex flex-col justify-center items-center text-start dark:text-sub-300"}>
                            <p className={"text-2xl text-black"}>Login to your account</p>
                            <p className={"text-gray-500"}>Enter your details to login</p>
                        </div>
                        <div className={"w-full px-12"}>
                            <div className={"flex flex-col gap-2 w-full"}>
                                <div className={"flex flex-col items-start gap-2 w-full "}>
                                    <p className={"text-sm text-black dark:text-white"}> {t("Email Address")}</p>
                                    <label
                                        className={"flex bg-white pl-2 px-2 w-full items-center text-xs dark:bg-white-0 dark:border-gray-700 border-2 rounded-xl  focus:outline-none focus:border-blue-500 dark:text-gray-200 "}
                                        htmlFor={"email"}>
                                        <GoMail className={"text-gray-500 w-10"} size={18}/>
                                        <input type={"text"}
                                               placeholder={"Enter your Email"}
                                               className={" custom-date-input dark:bg-white-0 w-full py-3 px-2 outline-none appearance-none focus:outline-none peer " + (i18n.language === 'ar' && "text-end")}
                                               name={"email"}/>
                                    </label>
                                </div>
                                <div className={"flex flex-col items-start gap-2 w-full"}>
                                    <p className={"text-sm dark:text-white text-black"}> {t("Password")}</p>
                                    <label
                                        className={"flex bg-white pl-2 px-2 w-full items-center text-xs dark:bg-white-0 dark:border-gray-700 border-2 rounded-xl  focus:outline-none focus:border-blue-500 dark:text-gray-200 "}
                                        htmlFor={"password"}>
                                        <IoIosLock className={"text-gray-500 w-10"} size={18}/>
                                        <input
                                            placeholder={"*********"}
                                            className={" custom-date-input dark:bg-white-0 w-full py-3 px-2 outline-none appearance-none focus:outline-none peer " + (i18n.language === 'ar' && "text-end")}
                                            name={"password"}
                                        />
                                    </label>

                                </div>
                                <div className={"flex justify-between items-center"}>
                                    <div className={"flex items-center gap-2"}>
                                        <input type={"checkbox"}/>
                                        <p className={"text-sm text-black"}>Keep me logged in </p>
                                    </div>
                                    <p className={"text-sm text-gray-500 underline"}>Forging password?</p>
                                </div>
                                <button className={"w-full rounded-lg bg-primary-base text-white py-1.5 "}>Login in
                                </button>
                                <WordTheMiddleAndLine word={"Or"} classNameText={"text-xs"}/>
                                <button className={"w-full rounded-lg border border-gray-400 py-1.5 flex gap-2 justify-center items-center "}>
                                    <FcGoogle />
                                    <span className={"text-sm"}>Login with Google</span>
                                </button>
                            </div>
                            <label></label>
                        </div>
                    </div>
                </div>
                <div className={"flex justify-start"}>
                    <p>عربي</p>
                </div>
            </div>
            <div className={"flex flex-col h-full justify-center flex-1 rounded-md bg-gray-200"}>

            </div>
        </div>
    );
}

export default LoginPage;