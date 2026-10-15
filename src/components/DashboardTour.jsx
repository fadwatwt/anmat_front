"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { selectUserType } from "@/redux/auth/authSlice";
import { FiChevronLeft, FiChevronRight, FiX, FiHelpCircle } from "react-icons/fi";

const TOUR_KEY = "subscriber_dashboard_tour_completed";
const GAP = 14;
const PADDING = 12;

const tourSteps = [
  {
    id: "sidebar",
    selector: "[data-tour='sidebar']",
    titleKey: "tour.step1.title",
    descKey: "tour.step1.desc",
    position: "right",
  },
  {
    id: "menu-overview",
    selector: "[data-tour='menu-overview']",
    titleKey: "tour.menu.overview.title",
    descKey: "tour.menu.overview.desc",
    position: "right",
  },
  {
    id: "menu-work",
    selector: "[data-tour='menu-work']",
    titleKey: "tour.menu.work.title",
    descKey: "tour.menu.work.desc",
    position: "right",
  },
  {
    id: "menu-team",
    selector: "[data-tour='menu-team']",
    titleKey: "tour.menu.team.title",
    descKey: "tour.menu.team.desc",
    position: "right",
  },
  {
    id: "menu-analytics",
    selector: "[data-tour='menu-analytics']",
    titleKey: "tour.menu.analytics.title",
    descKey: "tour.menu.analytics.desc",
    position: "right",
  },
  {
    id: "header",
    selector: "[data-tour='header']",
    titleKey: "tour.step2.title",
    descKey: "tour.step2.desc",
    position: "bottom",
  },
  {
    id: "tasks-summary",
    selector: "[data-tour='tasks-summary']",
    titleKey: "tour.step3.title",
    descKey: "tour.step3.desc",
    position: "bottom",
  },
  {
    id: "departments",
    selector: "[data-tour='departments']",
    titleKey: "tour.step4.title",
    descKey: "tour.step4.desc",
    position: "bottom",
  },
  {
    id: "projects-table",
    selector: "[data-tour='projects-table']",
    titleKey: "tour.step5.title",
    descKey: "tour.step5.desc",
    position: "top",
  },
  {
    id: "activity-logs",
    selector: "[data-tour='activity-logs']",
    titleKey: "tour.step6.title",
    descKey: "tour.step6.desc",
    position: "left",
  },
  {
    id: "requests",
    selector: "[data-tour='requests']",
    titleKey: "tour.step7.title",
    descKey: "tour.step7.desc",
    position: "top",
  },
];

function clearHighlights() {
  document.querySelectorAll(".tour-highlight").forEach((el) => el.classList.remove("tour-highlight"));
}

export default function DashboardTour() {
  const { t } = useTranslation();
  const userType = useSelector(selectUserType);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [targetRect, setTargetRect] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: -9999, left: -9999 });
  const [effectivePosition, setEffectivePosition] = useState("bottom");
  const tooltipRef = useRef(null);
  const posTimerRef = useRef(null);

  const visibleSteps = isMobile ? tourSteps.filter((step) => step.id !== "sidebar" && !step.id.startsWith("menu-")) : tourSteps;
  const currentStep = visibleSteps[Math.min(currentStepIndex, visibleSteps.length - 1)];
  const isLastStep = currentStepIndex >= visibleSteps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => { setIsMobile(media.matches); setCurrentStepIndex(0); };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // All coordinates are viewport-based (position: fixed) — no scroll offsets.
  const updatePosition = useCallback(() => {
    if (!isOpen || !tooltipRef.current) return;
    const el = document.querySelector(currentStep.selector);
    if (!el) {
      setTargetRect(null);
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setTargetRect(null);
      return;
    }

    const tip = tooltipRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const space = {
      top: rect.top,
      bottom: vh - rect.bottom,
      left: rect.left,
      right: vw - rect.right,
    };
    const fits = {
      bottom: rect.bottom + GAP + tip.height <= vh - PADDING,
      top: rect.top - GAP - tip.height >= PADDING,
      right: rect.right + GAP + tip.width <= vw - PADDING,
      left: rect.left - GAP - tip.width >= PADDING,
    };

    let pos = currentStep.position;
    if (!fits[pos]) {
      pos =
        ["right", "left", "top", "bottom"]
          .filter((p) => p !== pos && fits[p])
          .sort((a, b) => space[b] - space[a])[0] ||
        Object.keys(space).sort((a, b) => space[b] - space[a])[0];
    }

    let top;
    let left;
    if (pos === "right") {
      top = rect.top + rect.height / 2 - tip.height / 2;
      left = rect.right + GAP;
    } else if (pos === "left") {
      top = rect.top + rect.height / 2 - tip.height / 2;
      left = rect.left - GAP - tip.width;
    } else if (pos === "bottom") {
      top = rect.bottom + GAP;
      left = rect.left + rect.width / 2 - tip.width / 2;
    } else {
      top = rect.top - GAP - tip.height;
      left = rect.left + rect.width / 2 - tip.width / 2;
    }

    top = Math.max(PADDING, Math.min(top, vh - PADDING - tip.height));
    left = Math.max(PADDING, Math.min(left, vw - PADDING - tip.width));

    setTooltipPosition({ top, left });
    setEffectivePosition(pos);
    setTargetRect({ top: rect.top, left: rect.left, bottom: rect.bottom, right: rect.right, width: rect.width, height: rect.height });
  }, [currentStep, isOpen]);

  // Initialize tour for new subscribers — فقط على /dashboard حتى لا يشرح لوحة أخرى
  useEffect(() => {
    setMounted(true);
    if (userType === "Subscriber" && pathname === "/dashboard" && !localStorage.getItem(TOUR_KEY)) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setCurrentStepIndex(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [userType, pathname]);

  // On step change: highlight target, scroll into view, then measure & place tooltip
  useEffect(() => {
    if (!isOpen) return undefined;

    clearHighlights();
    const el = document.querySelector(currentStep.selector);

    if (!el) {
      setTargetRect(null);
      return undefined;
    }

    updatePosition();
    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    el.classList.add("tour-highlight");

    clearTimeout(posTimerRef.current);
    posTimerRef.current = setTimeout(updatePosition, 400);

    return () => {
      clearTimeout(posTimerRef.current);
      el.classList.remove("tour-highlight");
    };
  }, [isOpen, currentStepIndex, currentStep.selector, updatePosition]);

  // Keep spotlight + tooltip glued to the target during scroll/resize
  useEffect(() => {
    if (!isOpen) return undefined;
    const handler = () => updatePosition();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [isOpen, updatePosition]);

  // Escape closes the tour
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") completeTour();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => () => clearHighlights(), []);

  const goToStep = (index) => {
    if (index >= 0 && index < visibleSteps.length) setCurrentStepIndex(index);
  };

  const handleNext = () => (isLastStep ? completeTour() : goToStep(currentStepIndex + 1));
  const handlePrev = () => goToStep(currentStepIndex - 1);

  const completeTour = () => {
    localStorage.setItem(TOUR_KEY, "true");
    clearHighlights();
    setIsOpen(false);
  };

  const handleSkip = () => completeTour();

  if (!mounted || userType !== "Subscriber" || !isOpen) return null;

  const hasTarget = Boolean(targetRect);

  // Spotlight hole built from 4 dark divs around the target (viewport coords)
  let overlays = [];
  if (hasTarget) {
    const holeTop = targetRect.top - GAP;
    const holeBottom = targetRect.bottom + GAP;
    const holeLeft = targetRect.left - GAP;
    const holeRight = targetRect.right + GAP;
    overlays = [
      { top: 0, left: 0, right: 0, height: Math.max(0, holeTop) },
      { top: holeBottom, left: 0, right: 0, bottom: 0 },
      { top: holeTop, left: 0, width: Math.max(0, holeLeft), height: holeBottom - holeTop },
      { top: holeTop, left: holeRight, right: 0, height: holeBottom - holeTop },
    ];
  }

  // Arrow always points at the target based on the EFFECTIVE side chosen
  const arrowStyleBySide = {
    bottom: { top: -6, left: "calc(50% - 6px)" },
    top: { bottom: -6, left: "calc(50% - 6px)" },
    left: { right: -6, top: "calc(50% - 6px)" },
    right: { left: -6, top: "calc(50% - 6px)" },
  };
  const arrowBorderBySide = {
    bottom: "border-l border-t",
    top: "border-r border-b",
    left: "border-t border-r",
    right: "border-b border-l",
  };

  return (
    <>
      {/* Spotlight overlay */}
      <div className="fixed inset-0 z-[9998]" aria-hidden="true">
        {hasTarget ? (
          overlays.map((o, i) => (
            <div
              key={i}
              className="absolute bg-black/75 pointer-events-auto"
              style={o}
              onClick={handleSkip}
            />
          ))
        ) : (
          <div className="absolute inset-0 bg-black/75 pointer-events-auto" onClick={handleSkip} />
        )}
      </div>

      {/* Target frame */}
      {hasTarget && (
        <div
          aria-hidden="true"
          className="fixed z-[9998] pointer-events-none rounded-lg border-2 border-blue-400 shadow-[0_0_0_4px_rgba(59,130,246,0.35)]"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        role="dialog"
        dir="auto"
        className={
          "fixed z-[9999] w-[320px] max-w-[calc(100vw-24px)] " +
          (hasTarget ? "" : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2")
        }
        style={hasTarget ? { top: tooltipPosition.top, left: tooltipPosition.left } : undefined}
      >
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {hasTarget && (
            <span
              aria-hidden="true"
              className={`absolute w-3 h-3 rotate-45 bg-white dark:bg-gray-900 ${arrowBorderBySide[effectivePosition]} border-gray-200 dark:border-gray-700`}
              style={arrowStyleBySide[effectivePosition]}
            />
          )}

          <div className="flex items-start justify-between gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FiHelpCircle size={20} className="text-white" />
              </div>
              <div className="min-w-0">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                  {t(currentStep.titleKey)}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">
                  {t(currentStep.descKey)}
                </p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              aria-label={t("tour.skip")}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            {visibleSteps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goToStep(i)}
                aria-label={t("tour.go_to_step", { step: i + 1 })}
                className={`h-2.5 rounded-full transition-all ${
                  i === currentStepIndex
                    ? "bg-blue-500 w-6"
                    : i < currentStepIndex
                      ? "bg-green-500 w-2.5"
                      : "bg-gray-300 dark:bg-gray-600 w-2.5"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 p-4">
            <button
              onClick={handlePrev}
              disabled={isFirstStep}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FiChevronLeft size={18} />
              <span>{t("tour.previous")}</span>
            </button>

            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:scale-[1.02] bg-gradient-to-r from-blue-500 to-blue-600"
            >
              <span>{isLastStep ? t("tour.finish") : t("tour.next")}</span>
              <FiChevronRight size={18} />
            </button>
          </div>

          <button
            onClick={handleSkip}
            className="block mx-auto mb-4 w-fit text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline underline-offset-2"
          >
            {t("tour.skip_for_now")}
          </button>
        </div>
      </div>

      {/* Highlight pulse on the live element */}
      <style>{`
        .tour-highlight {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.55), 0 0 0 8px rgba(59, 130, 246, 0.25) !important;
          animation: tour-pulse 1.5s ease-in-out infinite;
        }
        @keyframes tour-pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.55), 0 0 0 8px rgba(59, 130, 246, 0.25); }
          50% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.7), 0 0 0 12px rgba(59, 130, 246, 0.3); }
        }
      `}</style>
    </>
  );
}
