import {useTranslation} from "react-i18next";


import ContentOfTimeLine from "./components/ContentOfTimeLine.jsx";

function TimeLine() {
    const {t} = useTranslation()
    const account = {
        name:"Ahmed Mohamed",
        imageProfile:"https://i.pinimg.com/originals/17/9e/25/179e258f61d2d0f56b850b7d85c76493.jpg"
    }
    const images = [
        "https://mybayutcdn.bayut.com/mybayut/wp-content/uploads/Heydar-Aliyev-Center-Baku-Azerbaijan-ar02072020-1024x640.jpg",
        "https://www.alquds.co.uk/wp-content/uploads/2024/02/07-11.jpg",
        "https://i.cdn.turner.com/dr/cnnarabic/cnnarabic/release/sites/default/files/styles/landscape_780x440/public/image/1_6.JPG?itok=pmNMX7TP",
        "https://cdn.cgway.net/wp-content/uploads/2023/12/the-most-famous-arab-architects-01.jpg"
    ]
    const myAccount = {
        imageProfile:"https://sowarprofil.com/wp-content/uploads/2024/04/%D8%B5%D9%88%D8%B1%D8%A9-%D8%A7%D9%84%D9%85%D9%84%D9%81-%D8%A7%D9%84%D8%B4%D8%AE%D8%B5%D9%8A-%D9%81%D9%8A-%D8%A7%D9%84%D9%81%D9%8A%D8%B3%D8%A8%D9%88%D9%83-1-1024x1024.png.webp"
    }
    return (
        <div className={"p-3 w-full bg-white rounded-2xl dark:bg-gray-800"}>
            <div className={"p-2 flex w-full flex-col gap-5 dark:bg-white-0 h-full rounded-2xl"}>
                <div className={"flex justify-between items-center w-full py-1"}>
                    <p className={"text-lg dark:text-main-900"}>{t("Timeline")}</p>
                    <div className={"px-1 py-0.5"}>
                        {/*<p className={"text-xs text-primary-500 dark:text-primary-200 cursor-pointer"}>{t("View all")}</p>*/}
                    </div>
                </div>
                <div className={"max-h-[75vh] flex flex-col gap-2 overflow-hidden overflow-y-auto tab-content"}>
                    <ContentOfTimeLine account={account} date={` 25  ${t("Dec")}  - 1:30  ${t("PM")}`} text={
                        `
                     We&apos;re excited to welcome {(<span className={"text-primary-base"}>@Ahemd</span>)} to
                        our team! Next month, we&apos;ll be unveiling a range
                        of new features designed to elevate your experience with our software. Keep an eye
                        out for more updates!
                    `
                    } images={images} myAccount={myAccount}/>

                    <ContentOfTimeLine account={account} date={` 25  ${t("Dec")}  - 1:30  ${t("PM")}`} text={
                        `
                     We&apos;re excited to welcome {(<span className={"text-primary-base"}>@Ahemd</span>)} to
                        our team! Next month, we&apos;ll be unveiling a range
                        of new features designed to elevate your experience with our software. Keep an eye
                        out for more updates!
                    `
                    } myAccount={myAccount}/>
                </div>

            </div>
        </div>
    );
}

export default TimeLine;