"use client";
import { RiFacebookFill } from "react-icons/ri";
import { FaTwitter  } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { CgMail } from "react-icons/cg";
import { AiOutlineYoutube } from "react-icons/ai";
import Tabs from "@/components/Tabs.jsx";
import Page from "../../../components/Page.jsx";
import dynamic from "next/dynamic";

const FacebookTab = dynamic(() => import("@/app/dashboard/social-media/_Tabs/Facebook.tab.jsx"), {
    loading: () => <p>Loading Facebook...</p>,
    ssr: false,
});

const TweeterTab = dynamic(() => import("@/app/dashboard/social-media/_Tabs/Tweeter.tab.jsx"), {
    loading: () => <p>Loading Twitter...</p>,
    ssr: false,
});

function SocialMediaPage() {
    const tabsData = [
        {
            title: "Facebook",
            icon: RiFacebookFill,
            content: <FacebookTab/>,
        },
        {
            title: "Twitter",
            icon: FaTwitter,
            content: <TweeterTab />,
        },
        {
            title: "Instagram",
            icon: IoLogoInstagram,
            content: <div>Instagram content goes here</div>,
        },
        {
            title: "Gmail",
            icon: CgMail,
            content: <div>Gmail content goes here</div>,
        },
        {
            title: "Youtube",
            icon: AiOutlineYoutube,
            content: <div>Youtube content goes here</div>,
        },
    ];

    return (
        <Page title={"Social Media"}>
            <Tabs tabs={tabsData}/>
        </Page>
    );
}

export default SocialMediaPage;
