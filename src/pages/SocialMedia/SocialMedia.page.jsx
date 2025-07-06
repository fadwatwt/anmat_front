import { RiFacebookFill } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io";
import { CgMail } from "react-icons/cg";
import { AiOutlineYoutube } from "react-icons/ai";
import Tabs from "../../components/Tabs.jsx";
import FacebookTab from "./Tabs/Facebook.tab.jsx";
import TweeterTab from "./Tabs/Tweeter.tab.jsx";
import Page from "../Page.jsx";

function SocialMediaPage() {
    const tabsData = [
        {
            title: "Facebook",
            icon: RiFacebookFill,
            content: <FacebookTab/>,
        },
        {
            title: "Twitter",
            icon: FaXTwitter,
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
