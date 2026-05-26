"use client";
import { ImSpinner2 } from "react-icons/im";
import { RiFacebookFill } from "react-icons/ri";
import { FaTwitter  } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { CgMail } from "react-icons/cg";
import { AiOutlineYoutube } from "react-icons/ai";
import Tabs from "@/components/Tabs.jsx";
import Page from "../../../components/Page.jsx";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

const FacebookTab = dynamic(() => import("@/app/(dashboard)/social-media/_Tabs/Facebook.tab.jsx"), {
    loading: () => <div className="flex items-center justify-center w-full p-4"><ImSpinner2 className="animate-spin text-primary-base dark:text-primary-200" size={30} /></div>,
    ssr: false,
});

const TweeterTab = dynamic(() => import("@/app/(dashboard)/social-media/_Tabs/Tweeter.tab.jsx"), {
    loading: () => <div className="flex items-center justify-center w-full p-4"><ImSpinner2 className="animate-spin text-primary-base dark:text-primary-200" size={30} /></div>,
    ssr: false,
});

function SocialMediaPage() {
    const { t } = useTranslation();
    const tabsData = [
        {
            title: t("Facebook"),
            icon: RiFacebookFill,
            content: <FacebookTab/>,
        },
        {
            title: t("Twitter"),
            icon: FaTwitter,
            content: <TweeterTab />,
        },
        {
            title: t("Instagram"),
            icon: IoLogoInstagram,
            content: <div>{t("Instagram content goes here")}</div>,
        },
        {
            title: t("Gmail"),
            icon: CgMail,
            content: <div>{t("Gmail content goes here")}</div>,
        },
        {
            title: t("Youtube"),
            icon: AiOutlineYoutube,
            content: <div>{t("Youtube content goes here")}</div>,
        },
    ];

    return (
        <Page title={t("Social Media")}>
            <Tabs tabs={tabsData}/>
        </Page>
    );
}

export default SocialMediaPage;
