import { useTranslation } from "react-i18next";

export default function UnavailableIntegration({ platform }) {
  const { t } = useTranslation();
  return (
    <section className="rounded-xl border border-status-border p-6 text-start" role="status">
      <h2 className="font-semibold text-cell-primary">{t("Integration unavailable", { platform: t(platform) })}</h2>
      <p className="mt-2 text-cell-secondary">{t("This integration is not connected. Account management and publishing are unavailable.")}</p>
    </section>
  );
}
