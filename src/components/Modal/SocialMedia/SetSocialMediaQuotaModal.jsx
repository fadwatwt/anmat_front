"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useProcessing } from "@/app/providers";
import { useUpdateSubscriberSocialMediaQuotaMutation } from "@/redux/socialMedia/socialMediaQuotaApi";

// Three modes the admin can set:
//   1. specific  — override with a fixed numeric limit
//   2. unlimited — set quota to -1 (unlimited)
//   3. reset     — clear the override so the plan's value takes effect
const MODES = {
    SPECIFIC: "specific",
    UNLIMITED: "unlimited",
    RESET: "reset",
};

function SetSocialMediaQuotaModal({ isOpen, onClose, subscriberId, currentQuota }) {
    const { t } = useTranslation();
    const [updateQuota, { isLoading }] = useUpdateSubscriberSocialMediaQuotaMutation();
    const { showProcessing, hideProcessing } = useProcessing();

    const [mode, setMode] = useState(MODES.SPECIFIC);
    const [limit, setLimit] = useState("");
    const [apiResponse, setApiResponse] = useState({
        isOpen: false,
        status: null,
        message: "",
    });

    useEffect(() => {
        if (!isOpen) return;
        if (currentQuota?.unlimited) {
            setMode(MODES.UNLIMITED);
            setLimit("");
        } else if (currentQuota?.source === "override" && typeof currentQuota?.override === "number") {
            setMode(MODES.SPECIFIC);
            setLimit(String(currentQuota.override));
        } else {
            setMode(MODES.SPECIFIC);
            setLimit(String(currentQuota?.limit ?? ""));
        }
        setApiResponse({ isOpen: false, status: null, message: "" });
    }, [isOpen, currentQuota]);

    const handleSubmit = async () => {
        if (!subscriberId) return;

        const payload = { subscriberId };
        if (mode === MODES.UNLIMITED) {
            payload.unlimited = true;
        } else if (mode === MODES.RESET) {
            payload.reset = true;
        } else {
            const parsed = parseInt(limit, 10);
            if (!Number.isFinite(parsed) || parsed < 0) {
                setApiResponse({
                    isOpen: true,
                    status: "error",
                    message: t("Limit must be a non-negative integer."),
                });
                return;
            }
            payload.limit = parsed;
        }

        showProcessing(t("Updating quota..."));
        try {
            const response = await updateQuota(payload).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: response?.message || t("Social media quota updated."),
            });
        } catch (error) {
            const message =
                error?.data?.message ||
                error?.data?.error ||
                error?.error ||
                t("Failed to update quota.");
            setApiResponse({ isOpen: true, status: "error", message });
        } finally {
            hideProcessing();
        }
    };

    const handleAlertClose = () => {
        if (apiResponse.status === "success") onClose();
        setApiResponse({ isOpen: false, status: null, message: "" });
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Set Social Media Quota"
                isBtns={true}
                btnApplyTitle={isLoading ? "Saving..." : "Save"}
                disabled={isLoading}
                onClick={handleSubmit}
                className="lg:w-4/12 md:w-7/12 sm:w-7/12 w-11/12 p-4"
            >
                <div className="flex flex-col gap-4 px-1">
                    <p className="text-cell-secondary text-xs">
                        {t(
                            "Set how many Twitter accounts this subscriber can manage. Override applies on top of their subscription plan limit.",
                        )}
                    </p>

                    {currentQuota && (
                        <div className="bg-status-bg rounded-lg p-3 text-sm">
                            <p className="text-cell-secondary text-xs mb-1">{t("Current")}</p>
                            <p className="text-cell-primary font-medium">
                                {currentQuota.used ?? 0}
                                {" / "}
                                {currentQuota.unlimited ? "∞" : (currentQuota.limit ?? 0)}
                                <span className="text-cell-secondary text-xs ms-2">
                                    ({t("source")}: {currentQuota.source || "—"})
                                </span>
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="quota-mode"
                                value={MODES.SPECIFIC}
                                checked={mode === MODES.SPECIFIC}
                                onChange={() => setMode(MODES.SPECIFIC)}
                                className="checkbox-custom"
                            />
                            <span className="text-cell-primary text-sm">{t("Set a specific limit")}</span>
                        </label>
                        {mode === MODES.SPECIFIC && (
                            <div className="ms-6">
                                <InputAndLabel
                                    title="Limit"
                                    placeholder="e.g. 5"
                                    type="number"
                                    name="limit"
                                    value={limit}
                                    onChange={(e) => setLimit(e.target.value)}
                                    isRequired
                                />
                            </div>
                        )}

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="quota-mode"
                                value={MODES.UNLIMITED}
                                checked={mode === MODES.UNLIMITED}
                                onChange={() => setMode(MODES.UNLIMITED)}
                                className="checkbox-custom"
                            />
                            <span className="text-cell-primary text-sm">{t("Unlimited accounts")}</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="quota-mode"
                                value={MODES.RESET}
                                checked={mode === MODES.RESET}
                                onChange={() => setMode(MODES.RESET)}
                                className="checkbox-custom"
                            />
                            <span className="text-cell-primary text-sm">
                                {t("Reset to plan default (clear override)")}
                            </span>
                        </label>
                    </div>
                </div>
            </Modal>

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={handleAlertClose}
            />
        </>
    );
}

SetSocialMediaQuotaModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    subscriberId: PropTypes.string,
    currentQuota: PropTypes.object,
};

export default SetSocialMediaQuotaModal;
