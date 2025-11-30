"use client"
import InputAndLabel from "@/components/Form/InputAndLabel";
import {RiCopperCoinLine, RiTicket2Fill} from "@remixicon/react";
import {RiTicketFill} from "react-icons/ri";

function Page({
                                 type = "",
                                 prise = ""
                             }) {
    return (
        <div className={"absolute top-0 left-0 w-screen max-h-[100vh] overflow-hidden flex flex-col justify-start"}>
            <div className={" flex justify-start z-10 items-start"}>
                <div className={"w-1/3 bg-white max-h-[100vh] h-[100vh] flex justify-start px-10 pt-28"}>
                    <div className={"max-h-[80vh] h-[60rem] flex flex-col gap-4 w-full overflow-y-auto"}>
                        <div className={"text-primary-500 text-sm cursor-pointer font-bold "}>
                            Back
                        </div>
                        <div className={"flex flex-col gap-4 w-full"}>
                            <p className={"text-sm"}>Payment method</p>
                            <div className={"w-full flex justify-between items-center"}>
                                <div className={"border border-2 border-primary-500 rounded-xl py-2 px-4  w-[48%] flex justify-between items-center"}>
                                    <div className={"flex gap-3 items-center"}>
                                        <div className={"flex items-start mt-1 self-start"}>
                                            <input type={"radio"} name={"payment1"} className={""}/>
                                        </div>
                                        <div className={"flex flex-col justify-start items-center"}>
                                            <p>**** 8304</p>
                                            <p className={"text-xs text-gray-500"}>Visa . Edit</p>
                                        </div>
                                    </div>
                                    <div className={"w-[3rem]  flex justify-center items-center"}>
                                        <img src={"https://www.pngall.com/wp-content/uploads/2017/05/Visa-Logo-High-Quality-PNG.png"} alt={""} className={"max-w-full w-full h-[1.2rem]"} />
                                    </div>
                                </div>
                                <div className={"border  border-gray-500 rounded-xl py-2 px-4  w-[48%] flex justify-between items-center"}>
                                    <div className={"flex gap-3 items-center"}>
                                        <div className={"flex items-start mt-1 self-start"}>
                                            <input type={"radio"} name={"payment1"} className={""}/>
                                        </div>
                                        <div className={"flex flex-col justify-start items-center"}>
                                            <p>**** 8304</p>
                                            <p className={"text-xs text-gray-500"}>Visa . Edit</p>
                                        </div>
                                    </div>
                                    <div className={"w-[3rem]  flex justify-center items-center"}>
                                        <img src={"https://www.pngall.com/wp-content/uploads/2017/05/Visa-Logo-High-Quality-PNG.png"} alt={""} className={"max-w-full w-full h-[1.2rem]"} />
                                    </div>
                                </div>
                            </div>
                            <div className={"w-full p-2 flex justify-center items-center bg-primary-100 rounded-lg text-md text-primary-500 cursor-pointer"}>
                                + Other payment method
                            </div>
                        </div>
                        <div className={"flex flex-col gap-2 w-full"}>
                                <InputAndLabel
                                    title={"Name on card"}
                                    name="name"
                                    value={""}
                                    onChange={() => {}}
                                    onBlur={() => {}}
                                    placeholder={"Enter department name"}
                                />
                            <InputAndLabel
                                title={"Billing address"}
                                name="name"
                                value={""}
                                onChange={() => {}}
                                onBlur={() => {}}
                                placeholder={"Enter department name"}
                            />
                            <InputAndLabel
                                title={"Card Number"}
                                name="name"
                                value={""}
                                onChange={() => {}}
                                onBlur={() => {}}
                                placeholder={"Enter department name"}
                            />
                            <div className={"flex w-full justify-center items-center gap-3"}>
                                <InputAndLabel
                                    title={"Expiration Date"}
                                    name="name"
                                    value={""}
                                    onChange={() => {}}
                                    onBlur={() => {}}
                                    placeholder={"Enter department name"}
                                />
                                <InputAndLabel
                                    title={"CVV"}
                                    name="name"
                                    value={""}
                                    onChange={() => {}}
                                    onBlur={() => {}}
                                    placeholder={"Enter department name"}
                                />
                            </div>
                            <div className={"flex w-full justify-center items-center gap-3"}>
                                <InputAndLabel
                                    title={"Zip code"}
                                    name="name"
                                    value={""}
                                    onChange={() => {}}
                                    onBlur={() => {}}
                                    placeholder={"Enter department name"}
                                />
                                <InputAndLabel
                                    title={"City"}
                                    name="name"
                                    value={""}
                                    onChange={() => {}}
                                    onBlur={() => {}}
                                    placeholder={"Enter department name"}
                                />
                            </div>

                        </div>
                        <button className={"py-3 px-2 bg-primary-500 rounded-md w-full text-white"}>
                            Pay 566$
                        </button>
                    </div>
                </div>
                <div className={"w-2/3 flex flex-col justify-start items-start px-16 pt-28 gap-10"}>
                    <div className={""}>
                        <h3 className={"text-2xl"}>Billing Information</h3>
                        <p className={"text-gray-500 text-sm"}>Lorem Ipsum Dummy Text Lorem Ipsum Dummy Text</p>
                    </div>
                    <div className={"w-full p-5 rounded-lg flex items-center justify-between bg-white border border gap-3"}>
                            <div className={"rounded-full p-2 bg-primary-200 shadow-sm shadow-primary-100 flex justify-center items-center"}>
                                <RiCopperCoinLine className={"text-primary-500 w-12 h-12"} />
                            </div>
                            <div className={"flex flex-col w-full justify-center items-start"}>
                                <div className={"flex w-full justify-between"}>
                                    <p>Professional Plan</p>
                                    <p className={"text-lg font-bold"}>$28.00</p>
                                </div>
                                <div className={"flex w-full gap-5"}>
                                   <p className={"text-sm"}><span className={"text-gray-400"}>Users: </span>20</p>
                                   <p className={"text-sm"}><span className={"text-gray-400"}>Paid: </span>Monthly</p>
                                </div>
                            </div>
                    </div>
                    <div className={"w-full flex flex-col gap-2"}>
                        <p>Discount Code</p>
                        <div className={"flex border border-2 border-primary-500 rounded-md p-2 flex justify-between w-full"}>
                            <div className={"flex gap-2 justify-center items-center"}>
                                <RiTicketFill className={"text-primary-500"} />
                                <p>BUYR|</p>
                            </div>
                            <p className={"text-primary-500 font-bold"}>Apply</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;