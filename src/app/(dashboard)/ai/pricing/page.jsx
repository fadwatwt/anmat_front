"use client";

import React, { useState } from "react";
import Page from "@/components/Page.jsx";
import { Zap, Check, Crown, ArrowRight, Loader2 } from "lucide-react";
import { useCreateTokenCheckoutMutation, useGetTokenPackagesQuery } from "@/redux/api/aiApi";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

const PricingPage = () => {
  const { data: packages, isLoading: loadingPackages } = useGetTokenPackagesQuery();
  const [createCheckout, { isLoading: isCreatingCheckout }] = useCreateTokenCheckoutMutation();
  const [purchasingId, setPurchasingId] = useState(null);
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  const handlePurchase = async (packageId) => {
    setPurchasingId(packageId);
    try {
      const response = await createCheckout({ package_id: packageId }).unwrap();
      if (response?.url) {
        window.location.href = response.url;
      } else {
        throw new Error("No checkout URL returned from server.");
      }
    } catch (err) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: err?.data?.message || err?.message || "Failed to create payment session.",
      });
      setPurchasingId(null);
    }
  };

  const getIcon = (id) => {
    switch (id) {
      case "starter_pack":
        return <Zap className="text-blue-500 w-8 h-8" />;
      case "pro_pack":
        return <Crown className="text-amber-500 w-8 h-8" />;
      default:
        return <Crown className="text-purple-500 w-8 h-8" />;
    }
  };

  const getGradient = (id) => {
    switch (id) {
      case "starter_pack":
        return "from-blue-500 to-indigo-600";
      case "pro_pack":
        return "from-amber-500 to-orange-600";
      default:
        return "from-purple-500 to-pink-600";
    }
  };

  const getFeatures = (id) => {
    switch (id) {
      case "starter_pack":
        return [
          "10,000 AI tokens",
          "Ideal for trial & simple tasks",
          "Shared with organization",
          "Access to basic agents",
        ];
      case "pro_pack":
        return [
          "50,000 AI tokens",
          "Most popular package",
          "Shared pool enabled",
          "Access to advanced tools & agents",
          "Priority background actions",
        ];
      default:
        return [
          "150,000 AI tokens",
          "Best value for high-volume use",
          "Full organization sharing pool",
          "Unlimited basic & advanced agents",
          "Priority support & API throughput",
        ];
    }
  };

  return (
    <Page isTitle={false}>
      <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-950 py-12 px-6 min-h-[calc(100vh-100px)]">
        <div className="text-center max-w-2xl mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Power Up Your AI Assistant
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Choose a token top-up pack to continue executing actions, running commands, and generating smart files.
          </p>
        </div>

        {loadingPackages ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            <span className="text-gray-500 dark:text-gray-400 font-medium">Loading token packages...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
            {(packages || []).map((pkg) => {
              const isPro = pkg.id === "pro_pack";
              const isPurchasing = purchasingId === pkg.id && isCreatingCheckout;

              return (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col justify-between rounded-3xl bg-white dark:bg-gray-900 p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border ${
                    isPro
                      ? "border-amber-400 dark:border-amber-500/50 ring-2 ring-amber-400/20"
                      : "border-gray-200 dark:border-gray-800"
                  }`}
                >
                  {isPro && (
                    <span className="absolute top-0 right-8 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-xs font-bold text-white uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/80 rounded-2xl">
                        {getIcon(pkg.id)}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Tokens Pack</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">
                          {pkg.tokens?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {pkg.name}
                    </h3>
                    
                    <div className="my-6 flex items-baseline">
                      <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                        ${pkg.price}
                      </span>
                      <span className="ml-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        / one-time
                      </span>
                    </div>

                    <ul className="mt-8 space-y-4 border-t border-gray-100 dark:border-gray-800/80 pt-6">
                      {getFeatures(pkg.id).map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <Check className="text-emerald-500 w-5 h-5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    disabled={isCreatingCheckout}
                    onClick={() => handlePurchase(pkg.id)}
                    className={`mt-8 w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-white font-bold text-sm shadow-sm transition-all duration-200 hover:shadow-md ${
                      isPurchasing ? "opacity-75" : ""
                    } bg-gradient-to-r ${getGradient(pkg.id)}`}
                  >
                    {isPurchasing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Redirecting to Stripe...</span>
                      </>
                    ) : (
                      <>
                        <span>Get {pkg.name}</span>
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
