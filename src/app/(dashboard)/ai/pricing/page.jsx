"use client";

import React, { useState } from "react";
import Page from "@/components/Page.jsx";
import { Zap, Crown, Rocket, Sparkles, Check, ArrowRight, Loader2 } from "lucide-react";
import { useCreateTokenCheckoutMutation, useGetTokenPackagesQuery } from "@/redux/api/aiApi";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useTranslation } from "react-i18next";

const iconMap = {
  Starter: Zap,
  Growth: Crown,
  Scale: Rocket,
};

const gradientMap = {
  Starter: "from-blue-500 to-indigo-600",
  Growth: "from-amber-500 to-orange-600",
  Scale: "from-violet-500 to-purple-600",
  Enterprise: "from-purple-500 to-pink-600",
};

function getPackStyle(tokens) {
  if (tokens <= 10000) return "Starter";
  if (tokens <= 50000) return "Growth";
  if (tokens <= 100000) return "Scale";
  return "Enterprise";
}

const PricingPage = () => {
  const { t } = useTranslation();
  const { data: packages, isLoading: loadingPackages } = useGetTokenPackagesQuery();
  const [createCheckout, { isLoading: isCreatingCheckout }] = useCreateTokenCheckoutMutation();
  const [purchasingId, setPurchasingId] = useState(null);
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  const handlePurchase = async (packageId) => {
    setPurchasingId(packageId);
    try {
      const response = await createCheckout({ package_id: packageId }).unwrap();
      const checkoutUrl = response?.checkout_url || response?.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error(t("No checkout URL returned from server."));
      }
    } catch (err) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: err?.data?.message || err?.message || t("Failed to create payment session."),
      });
      setPurchasingId(null);
    }
  };

  return (
    <Page isTitle={false}>
      <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-950 py-12 px-6 min-h-[calc(100vh-100px)]">
        <div className="text-center max-w-2xl mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {t("Power Up Your AI Assistant")}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            {t("Choose a token top-up pack to continue executing actions, running commands, and generating smart files.")}
          </p>
        </div>

        {loadingPackages ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            <span className="text-gray-500 dark:text-gray-400 font-medium">{t("Loading token packages...")}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
            {(packages || []).map((pkg) => {
              const style = getPackStyle(pkg.tokens);
              const Icon = iconMap[style] || Sparkles;
              const gradient = gradientMap[style] || gradientMap.Enterprise;
              const isPro = style === "Growth";
              const isPurchasing = purchasingId === pkg._id && isCreatingCheckout;

              return (
                <div
                  key={pkg._id}
                  className={`relative flex flex-col justify-between rounded-3xl bg-white dark:bg-gray-900 p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border ${
                    isPro
                      ? "border-amber-400 dark:border-amber-500/50 ring-2 ring-amber-400/20"
                      : "border-gray-200 dark:border-gray-800"
                  }`}
                >
                  {isPro && (
                    <span className="absolute top-0 right-8 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-xs font-bold text-white uppercase tracking-wider">
                      {t("Most Popular")}
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/80 rounded-2xl">
                        <Icon className="w-8 h-8 text-primary-500" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t("Tokens Pack")}</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">
                          {pkg.tokens?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {pkg.name}
                    </h3>
                    {pkg.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{pkg.description}</p>
                    )}

                    <div className="my-6 flex items-baseline">
                      <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                        {pkg.price_label}
                      </span>
                      <span className="ml-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        {t("/ one-time")}
                      </span>
                    </div>

                    <ul className="mt-8 space-y-4 border-t border-gray-100 dark:border-gray-800/80 pt-6">
                      {(pkg.features || []).map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <Check className="text-emerald-500 w-5 h-5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    disabled={isCreatingCheckout}
                    onClick={() => handlePurchase(pkg._id)}
                    className={`mt-8 w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-white font-bold text-sm shadow-sm transition-all duration-200 hover:shadow-md ${
                      isPurchasing ? "opacity-75" : ""
                    } bg-gradient-to-r ${gradient}`}
                  >
                    {isPurchasing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t("Redirecting to Stripe...")}</span>
                      </>
                    ) : (
                      <>
                        <span>{t("Get")} {pkg.name}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={() => setApiResponse({ isOpen: false, status: "", message: "" })}
      />
    </Page>
  );
};

export default PricingPage;
