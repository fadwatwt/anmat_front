"use client";
import { useTranslation } from "react-i18next";
import { RiBillLine, RiCalendarTodoLine, RiFileList3Line, RiFilePaperLine, RiMoneyDollarCircleLine, RiPencilLine, RiProfileLine, RiWalletLine } from "@remixicon/react";
import TabModal from "@/components/Modal/TabsContener/TabModal.jsx";
import Sidebar from "@/components/Subcomponents/Sidebar.jsx";
import { useState } from "react";
import Details from "@/pages/Subscription/Components/Details.jsx";
import Orders from "@/pages/Subscription/Components/Orders.jsx";
import OrdersTable from "@/pages/Subscription/Components/Orders.jsx";
import Page from "@/pages/Page.jsx";
import Pricing from "@/pages/Subscription/Components/Pricing.jsx";
import BillingHistory from "@/pages/Subscription/Components/BillingHistory.jsx";
import ChangeBillingInfoModal from "@/pages/Subscription/Components/partials/ChangeBillingInfoModal.jsx";


function SubscriptionsPage() {
    const { t } = useTranslation()

    const listSideBar = [
        { id: "subscription-info", title: "Subscription Information", content: <Details />, icon: <RiFileList3Line /> },
        { id: "billing-history", title: "Billing History", content: <BillingHistory />, icon: <RiBillLine /> },
        { id: "orders", title: "Orders", content: <OrdersTable />, icon: <RiCalendarTodoLine /> },
        { id: "pricing", title: "Pricing", content: <Pricing />, icon: <RiMoneyDollarCircleLine /> }
    ]
    const [activeTab, setActiveTab] = useState('subscription-info');

    const handelChangeActiveTab = (activeTap) => {
        setActiveTab(activeTap);
    }

    const [billingInfoModalOpen, setBillingInfoModalOpen] = useState(false);

    const toggleBillingInfoModal = () => {
        setBillingInfoModalOpen(!billingInfoModalOpen);
    }

    return (
        <>
            {/* <div className={"flex flex-col gap-6 justify-start dark:bg-gray-900 h-full overflow-auto pb-2"}> */}
                <div className={"flex justify-between md:flex-row flex-col items-center bg-white dark:bg-gray-800 p-4"}>
                    <div
                        className="title-page flex items-center gap-2 bg-none text-start w-full md:py-6 py-3 text-base sm:text-lg md:text-xl text-gray-600">
                        <div className={"p-2 rounded-full bg-gray-100 dark:bg-gray-900"}>
                            <RiWalletLine size="25"
                                className={"group-hover:text-primary-500  dark:text-gray-100"} />
                        </div>
                        <div>
                            <h3 className={"text-black dark:text-gray-200 text-lg"}>{t("Plans & Subscription")}</h3>
                            <p className={"dark:text-gray-400 text-sm"}>{t("Manage your plans and subscriptions.")}</p>
                        </div>

                    </div>
                </div>
                <Page title={t(listSideBar.find(item => item.id === activeTab)?.title || "Subscriptions")}
                    isBtn={activeTab === 'billing-history'} btnTitle={t("Change Billing Info")} btnOnClick={toggleBillingInfoModal}
                    btnIcon={<RiPencilLine className="text-white text-md dark:text-black" />}
                    >
                        
                    <ChangeBillingInfoModal isOpen={billingInfoModalOpen} onClose={toggleBillingInfoModal} />
                    
                    <div className="box-border flex flex-col gap-4 mb-16">
                        <div className={"flex md:gap-8 gap-4 w-full md:flex-row flex-col"}>
                            <div className={"hidden md:block"}>
                                <div className={"bg-white dark:bg-gray-800 py-3 px-2 w-64 flex flex-col gap-2 rounded-2xl border border-gray-200"}>
                                    <p className={"uppercase text-sm px-3 text-start dark:text-gray-200"}>{t("select menu")}</p>
                                    <Sidebar activeItem={activeTab} onClick={handelChangeActiveTab} list={listSideBar} />
                                </div>
                            </div>
                            <div>
                                {/* <div className={"md:hidden block"}>
                                    <TabModal classNameItem={"justify-start mx-1 "} classNameContent={"h-[20rem]"} tabs={tabsData} />
                                </div> */}

                                <div className={"hidden md:block"}>
                                    {
                                        listSideBar.map((tab, index) => (
                                            <div key={index} className={`tab-content ${activeTab === tab.id ? 'block' : 'hidden'}`}>
                                                {tab.content}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                        </div>
                    </div>
                </Page>
            {/* </div> */}
        </>
    );
}

export default SubscriptionsPage;