import Page from "./Page.jsx";
import TimeLine from "../components/TimeLine/TimeLine.jsx";

function TimeLinePage() {
    return (
        <Page isTitle={false}>
            <div className={"flex flex-col items-start"}>
                <p className={"title-page dark:text-white text-start w-full py-4 text-base sm:text-lg md:text-xl text-gray-600"}>Timeline</p>
                <div className={"flex justify-center "}>
                    <div className={"flex md:w-1/2 w-full h-full pb-20"}>
                        <TimeLine/>
                    </div>
                </div>
            </div>

        </Page>
    );
}

export default TimeLinePage;