"use client"
import InputAndLabel from "@/components/Form/InputAndLabel";
import {RiCopperCoinLine} from "@remixicon/react";
import {RiTicketFill} from "react-icons/ri";
import Alert from "@/components/Alerts/Alert";
import PropTypes from "prop-types";
import SavedPaymentMethods from "@/app/(auth)/(account-setup)/payment/components/SavedPaymentMethods";
import PaymentProviderSelector from "@/app/(auth)/(account-setup)/payment/components/paymentProviderSelector";
import {useState} from "react";
import SavedMethodsGroup from "@/app/(auth)/(account-setup)/payment/components/SavedPaymentMethods";

function PaymentPage({
                                 type = "",
                                 prise = ""
                             }) {

    const [selectedSaved, setSelectedSaved] = useState('1');
    const [provider, setProvider] = useState('mastercard');
    const [mySavedCards] = useState([
        {
            id: '1',
            last4: '8304',
            type: 'Visa',
            logo: "/images/payments/visacard.png"
        },
        {
            id: '2',
            last4: '8304',
            type: 'Paypal',
            logo: "/images/payments/paypal.png"
        }
    ]);
    return (
        <div className={"absolute top-0 left-0 w-screen max-h-[100vh] overflow-hidden flex flex-col justify-start"}>
            <div className={" flex justify-start z-10 items-start"}>
                <div className={"w-full lg:w-1/3 bg-white dark:bg-gray-800 max-h-[100vh] h-[100vh] flex justify-start px-4 sm:px-6 lg:px-10 pt-20 lg:pt-28 overflow-y-auto"}>
                    <div className={"max-h-[80vh] h-[60rem] flex flex-col gap-4 w-full pb-3"}>
                        <div className={"text-primary-500 dark:text-primary-400 text-sm cursor-pointer font-bold "}>
                            Back
                        </div>
                        <SavedMethodsGroup
                            methods={mySavedCards}
                            selectedId={selectedSaved}
                            onSelect={setSelectedSaved}
                            onEdit={(id) => console.log('Edit', id)}
                            onAddNew={() =>{}}
                        />

                        <PaymentProviderSelector
                            selectedProvider={provider}
                            onProviderChange={setProvider}
                        />
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
                    <button className={"py-3 px-2 bg-primary-500 dark:bg-primary-200 dark:text-black rounded-md w-full text-white"}>
                            Pay 566$
                        </button>
                    </div>
                </div>
                <div className={"hidden lg:flex w-full lg:w-2/3 flex-col justify-start items-start px-8 xl:px-16 pt-20 lg:pt-28 gap-10"}>
                    <div className={""}>
                        <h3 className={"text-2xl dark:text-gray-100"}>Billing Information</h3>
                        <p className={"text-gray-500 dark:text-gray-400 text-sm"}>Lorem Ipsum Dummy Text Lorem Ipsum Dummy Text</p>
                    </div>
                    <div className={"w-full p-5 rounded-lg flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 gap-3"}>
                        <div className={"rounded-full p-2 bg-primary-200 shadow-sm shadow-primary-100 flex justify-center items-center"}>
                            <RiCopperCoinLine className={"text-primary-500 dark:text-primary-400 w-12 h-12"} />
                        </div>
                        <div className={"flex flex-col w-full justify-center items-start"}>
                            <div className={"flex w-full justify-between"}>
                                <p className="dark:text-gray-100">Professional Plan</p>
                                <p className={"text-lg font-bold dark:text-gray-100"}>$28.00</p>
                            </div>
                            <div className={"flex w-full gap-5"}>
                               <p className={"text-sm dark:text-gray-400"}><span className={"text-gray-400 dark:text-gray-500"}>Users: </span>20</p>
                               <p className={"text-sm dark:text-gray-400"}><span className={"text-gray-400 dark:text-gray-500"}>Paid: </span>Monthly</p>
                            </div>
                        </div>
                    </div>
                    <div className={"w-full flex flex-col gap-2"}>
                        <p className="dark:text-gray-100">Discount Code</p>
                        <div className={"flex border-2 border-primary-500 rounded-md p-2 flex justify-between w-full"}>
                            <div className={"flex gap-2 justify-center items-center"}>
                                <RiTicketFill className={"text-primary-500 dark:text-primary-400"} />
                                <p className="dark:text-gray-100">BUYR|</p>
                            </div>
                            <p className={"text-primary-500 dark:text-primary-400 font-bold"}>Apply</p>
                        </div>
                    </div>
                    <div className={"flex flex-col gap-3 w-full py-3 border-b border-t border-gray-200 dark:border-gray-700"}>
                        <div className={"w-full flex justify-between item-baseline"}>
                            <span className={"text-gray-400 dark:text-gray-500"}>Subtotal</span>
                            <span className={"text-black dark:text-gray-100"}>$56.00</span>
                        </div>
                        <div className={"w-full flex justify-between item-baseline"}>
                            <span className={"text-gray-400 dark:text-gray-500"}>Subtotal</span>
                            <span className={"text-black dark:text-gray-100"}>$56.00</span>
                        </div>
                        <div className={"w-full flex justify-between item-baseline"}>
                            <span className={"text-gray-400 dark:text-gray-500"}>Subtotal</span>
                            <span className={"text-black dark:text-gray-100"}>$56.00</span>
                        </div>
                        <div className={"w-full flex justify-between item-baseline"}>
                            <span className={"text-gray-400 dark:text-gray-500"}>Subtotal</span>
                            <span className={"text-black dark:text-gray-100"}>$56.00</span>
                        </div>
                    </div>
                    <div className={"w-full flex justify-between items-baseline"}>
                        <span className={"font-bold dark:text-gray-100"}>Total</span>
                        <span className={"font-bold dark:text-gray-100"}>$51.00</span>
                    </div>
                </div>
                </div>
            <Alert type={'success'} isOpen={false} title={"Success"} isBtns={true} titleCancelBtn={"Cancel"} cancelColor={"gray"} message={"Congratulations, you have successfully subscribed to the Basic Plan."} />
        </div>
    );
}
PaymentPage.prototype = {
    type: PropTypes.string,
    prise: PropTypes.string
};
export default PaymentPage;