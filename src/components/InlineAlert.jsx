import {RiInformationFill} from "@remixicon/react";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";

function InlineAlert({type,text}) {
    const {t} = useTranslation()
    switch (type) {
        case 'info':
            return (
                <div className={"w-full flex items-center justify-start gap-1 rounded-lg bg-primary-lighter p-2 py-3"}>
                    <RiInformationFill className="text-primary-base" size="15"/>
                    <p className={"text-xs text-wrap"}>{t(text)}</p>
                </div>
            )
    }
    return (
        <div className={"w-full flex items-center justify-start gap-2 bg-primary-lighter"}>

        </div>
    );
}
InlineAlert.propTypes = {
    type: PropTypes.string.isRequired,
    text: PropTypes.string,
}

export default InlineAlert;