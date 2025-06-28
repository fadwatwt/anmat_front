"use client"
import {I18nextProvider} from 'react-i18next'
import i18n from '../../public/lib/i18n'
import PropTypes from "prop-types";
import {Provider} from "react-redux";
import {store} from "@/redux/store";

const Providers = ({children}) => {
    return (
        <Provider store={store}>
            <I18nextProvider i18n={i18n}>
                {children}
            </I18nextProvider>
        </Provider>
    );
};

Providers.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Providers;