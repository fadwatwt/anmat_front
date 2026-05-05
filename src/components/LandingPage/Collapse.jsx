import { useState } from "react";
import {MinusCircle, PlusCircle} from "lucide-react";

function Collapse({title,text}) {
    const [isOpen, setIsOpen] = useState(false);
    const handelIsOpen = () => {
        setIsOpen(!isOpen);
    }
    return (
        <div className={"w-full flex flex-col py-5 gap-3 border-b border-gray-300"}>
            <div className={"flex justify-between items-center"}>
                <p className={"text-gray-900 font-semibold"}>{title}</p>
                {
                    isOpen ?
                        <MinusCircle onClick={handelIsOpen} size={"22"} className={"text-primary-600 cursor-pointer"}/>
                        :
                        <PlusCircle onClick={handelIsOpen} size={"22"} className={"text-primary-600 cursor-pointer"}/>

                }
            </div>
            {isOpen && (
                <p className={"text-start transition-all duration-300 ease-in-out max-w-full text-wrap text-gray-600 text-sm"}>
                    {text}
                </p>
            )}
        </div>
    );
}

export default Collapse;