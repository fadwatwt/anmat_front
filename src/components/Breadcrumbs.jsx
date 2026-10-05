import React from 'react';
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
import Link from 'next/link';

const Breadcrumbs = ({ breadcrumbs }) => {
    const {t} = useTranslation("common")
    return (
        <nav aria-label={t("Breadcrumb")} className="text-sm text-cell-secondary flex items-center shrink-0">
            <ol className="list-none flex flex-nowrap items-center gap-1 whitespace-nowrap">
                {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={index}>
                        <li className="flex items-center">
                            {breadcrumb.path ? (
                                <Link href={breadcrumb.path} className="text-primary-600 dark:text-primary-200 hover:underline font-medium">
                                    {t(breadcrumb.title)}
                                </Link>
                            ) : (
                                <span className={"text-nowrap text-cell-primary font-medium"} aria-current="page">{t(breadcrumb.title)}</span>
                            )}
                        </li>
                        {index < breadcrumbs.length - 1 && <span className="mx-1 text-cell-secondary/60" aria-hidden="true">/</span>}
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
