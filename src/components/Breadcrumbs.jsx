import React from 'react';
import { Link } from 'react-router';
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

const Breadcrumbs = ({ breadcrumbs }) => {
    const {t} = useTranslation()
    return (
        <nav className="text-sm text-gray-500 flex items-end">
            <ol className="list-reset flex">
                {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={index}>
                        <li>
                            {breadcrumb.path ? (
                                <Link to={breadcrumb.path} className="text-blue-500 dark:text-primary-200 hover:underline">
                                    {t(breadcrumb.title)}
                                </Link>
                            ) : (
                                <span className={"text-nowrap dark:text-gray-200"}>{t(breadcrumb.title)}</span>
                            )}
                        </li>
                        {index < breadcrumbs.length - 1 && <li><span className="mx-2 dark:text-gray-200">/</span></li>}
                    </React.Fragment>
                ))}
            </ol>
        </nav>
    );
};

Breadcrumbs.propTypes = {
    breadcrumbs: PropTypes.array.isRequired,
}

export default Breadcrumbs;
