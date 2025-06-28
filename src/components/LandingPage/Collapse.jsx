"use client";
import {MinusCircle, PlusCircle} from "lucide-react";

function Collapse({title,text}) {
    let isOpen = false;
    const handelIsOpen = () => {
        isOpen = !isOpen;
    }
    return (
        <div className={"w-full flex flex-col py-5 gap-3 border-b border-gray-300"}>
            <div className={"flex justify-between items-center"}>
                <p className={"text-gray-800 "}>{title}</p>
                {
                    isOpen ?
                        <MinusCircle onClick={handelIsOpen} size={"20"} className={"text-primary-500 cursor-pointer"}/>
                        :
                        <PlusCircle onClick={handelIsOpen} size={"20"} className={"text-primary-500 cursor-pointer"}/>

                }
            </div>
            <p className={`${isOpen ?"show":"hidden"} text-start transition duration-150 ease-in-out max-w-full text-wrap`}>
                {text}
            </p>
        </div>
    );
}

export default Collapse;