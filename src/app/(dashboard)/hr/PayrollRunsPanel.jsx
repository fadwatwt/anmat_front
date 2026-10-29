"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootRoute } from "@/Root.Route";
import { selectAuth } from "@/redux/auth/authSlice";
import { usePermission } from "@/Hooks/usePermission";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import { toMinorUnits } from "./payrollMoney";
import {
  useGetPayrollCountryPacksQuery, useGetPayrollRunsQuery,
  useCreatePayrollRunMutation, useCalculatePayrollRunMutation,
  useTransitionPayrollRunMutation, useGetPayrollRunItemsQuery,
  useGetPayrollRunExceptionsQuery, useResolvePayrollExceptionMutation,
  useGetPayrollRunPayslipsQuery, useGetPayrollRunAdjustmentsQuery,
  useCreatePayrollAdjustmentMutation, useCancelPayrollAdjustmentMutation,
  useGetAccountingDeliveryQuery, useEnqueueAccountingDeliveryMutation, useRetryAccountingDeliveryMutation,
} from "@/redux/employees/payrollRunsApi";

const field = "rounded-lg border border-gray-300 bg-surface px-3 py-2 text-cell-primary dark:border-gray-700";
const button = "rounded-lg bg-primary-500 px-4 py-2 text-white disabled:opacity-50";
const nextStatus = { CALCULATED: "UNDER_REVIEW", UNDER_REVIEW: "APPROVED", APPROVED: "LOCKED", LOCKED: "PAYMENT_RECORDED" };
const messageOf = (error) => {
  const message = error?.data?.message || error?.message;
  return Array.isArray(message) ? message.join("، ") : message || "Operation failed";
};
const formatAmount = (minor, run) => new Intl.NumberFormat(undefined, {
  style: "currency", currency: run.currency, minimumFractionDigits: run.currency_minor_unit_digits,
  maximumFractionDigits: run.currency_minor_unit_digits,
}).format((minor || 0) / 10 ** run.currency_minor_unit_digits);

export default function PayrollRunsPanel() {
  const { t, i18n } = useTranslation();
  const { token } = useSelector(selectAuth);
  const canCreate = usePermission("salary_transactions.create");
  const canUpdate = usePermission("salary_transactions.update");
  const canManageSettings = usePermission("salary_transactions.manage_settings");
  const canListEmployees = usePermission("employee_details.list");
  const { data: runs = [], isLoading, error } = useGetPayrollRunsQuery();
  const { data: packs = [] } = useGetPayrollCountryPacksQuery(undefined, { skip: !canManageSettings });
  const { data: employees = [] } = useGetEmployeesQuery(undefined, { skip: !canUpdate || !canListEmployees });
  const [createRun] = useCreatePayrollRunMutation();
  const [calculateRun] = useCalculatePayrollRunMutation();
  const [transitionRun] = useTransitionPayrollRunMutation();
  const [resolveException] = useResolvePayrollExceptionMutation();
  const [createAdjustment] = useCreatePayrollAdjustmentMutation();
  const [cancelAdjustment] = useCancelPayrollAdjustmentMutation();
  const [enqueueAccounting] = useEnqueueAccountingDeliveryMutation();
  const [retryAccounting] = useRetryAccountingDeliveryMutation();
  const [selectedId, setSelectedId] = useState("");
  const { data: items = [] } = useGetPayrollRunItemsQuery(selectedId, { skip: !selectedId });
  const { data: exceptions = [] } = useGetPayrollRunExceptionsQuery(selectedId, { skip: !selectedId });
  const { data: payslips = [] } = useGetPayrollRunPayslipsQuery(selectedId, { skip: !selectedId });
  const { data: adjustments = [] } = useGetPayrollRunAdjustmentsQuery(selectedId, { skip: !selectedId });
  const [runForm, setRunForm] = useState({ name: "", period_start: "", period_end: "", country_code: "", currency: "" });
  const [runKey, setRunKey] = useState("");
  const [adjustment, setAdjustment] = useState({ employee_id: "", source_payroll_run_id: "", type: "EARNING", amount: "", reason: "" });
  const [adjustmentKey, setAdjustmentKey] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState({});
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const run = runs.find((entry) => entry._id === selectedId);
  const { data: accountingDelivery, error: accountingError, refetch: refreshAccounting } = useGetAccountingDeliveryQuery(selectedId, {
    skip: !selectedId || !["LOCKED", "PAYMENT_RECORDED"].includes(run?.status),
  });
  const people = employees.filter((entry) => entry.registration_status !== "pending" && entry.user_id);
  const countryPack = packs.find((pack) => pack.country_code === runForm.country_code);
  const selectedSource = runs.find((entry) => entry._id === adjustment.source_payroll_run_id);
  const allowedSources = runs.filter((entry) => ["LOCKED", "PAYMENT_RECORDED"].includes(entry.status) && entry.currency === run?.currency);
  const execute = async (action, success) => {
    setBusy(true); setFeedback("");
    try { await action(); setFeedback(t(success)); }
    catch (caught) { setFeedback(messageOf(caught)); }
    finally { setBusy(false); }
  };

  const submitRun = (event) => {
    event.preventDefault();
    const key = runKey || crypto.randomUUID();
    setRunKey(key);
    execute(async () => {
      const created = await createRun({
        ...runForm,
        country_code: runForm.country_code.toUpperCase(),
        currency: runForm.currency.toUpperCase(),
        period_start: `${runForm.period_start}T00:00:00.000Z`,
        period_end: `${runForm.period_end}T23:59:59.999Z`,
        idempotency_key: key,
      }).unwrap();
      setSelectedId(created._id);
      setRunForm({ name: "", period_start: "", period_end: "", country_code: "", currency: "" });
      setRunKey("");
    }, "Payroll run created");
  };

  const advance = () => {
    const status = nextStatus[run.status];
    if (!status) return;
    if (["APPROVED", "LOCKED", "PAYMENT_RECORDED"].includes(status) && !window.confirm(t("Confirm payroll transition"))) return;
    execute(() => transitionRun({ id: run._id, body: { status, ...(status === "PAYMENT_RECORDED" ? { payment_reference: paymentReference.trim() } : {}) } }).unwrap(), "Payroll status updated");
  };

  const submitAdjustment = (event) => {
    event.preventDefault();
    const amount_minor = toMinorUnits(adjustment.amount, run.currency_minor_unit_digits);
    if (!amount_minor) { setFeedback(t("Invalid monetary amount")); return; }
    const key = adjustmentKey || crypto.randomUUID();
    setAdjustmentKey(key);
    execute(async () => {
      await createAdjustment({
        employee_id: adjustment.employee_id,
        source_payroll_run_id: adjustment.source_payroll_run_id,
        target_payroll_run_id: run._id,
        type: adjustment.type,
        amount_minor,
        reason: adjustment.reason,
        idempotency_key: key,
      }).unwrap();
      setAdjustment({ employee_id: "", source_payroll_run_id: "", type: "EARNING", amount: "", reason: "" });
      setAdjustmentKey("");
    }, "Payroll adjustment created");
  };

  const downloadCsv = async (kind) => {
    setBusy(true); setFeedback("");
    try {
      const response = await fetch(`${RootRoute.replace(/\/$/, "")}/api/subscriber/organization/payroll-runs/${run._id}/export/${kind}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error(t("Export failed"));
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url; link.download = `payroll-${run._id}-${kind}.csv`; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (caught) { setFeedback(messageOf(caught)); }
    finally { setBusy(false); }
  };

  if (isLoading) return <p>{t("Loading...")}</p>;
  if (error) return <p role="alert" className="text-red-600">{messageOf(error)}</p>;

  return <div className="space-y-6" dir="auto">
    {feedback && <p role="status" className="rounded-lg bg-status-bg p-3 text-cell-primary">{feedback}</p>}
    {canCreate && <form onSubmit={submitRun} className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-cell-primary">{t("Create payroll run")}</h2>
      <div className="flex flex-wrap gap-3">
        <input className={field} required maxLength={100} value={runForm.name} onChange={(event) => setRunForm({ ...runForm, name: event.target.value })} placeholder={t("Run name")} aria-label={t("Run name")} />
        <label className="text-sm text-cell-primary">{t("Period start")} <input className={field} required type="date" value={runForm.period_start} onChange={(event) => setRunForm({ ...runForm, period_start: event.target.value })} /></label>
        <label className="text-sm text-cell-primary">{t("Period end")} <input className={field} required type="date" min={runForm.period_start || undefined} value={runForm.period_end} onChange={(event) => setRunForm({ ...runForm, period_end: event.target.value })} /></label>
        {canManageSettings && packs.length ? <select className={field} required value={runForm.country_code} onChange={(event) => { const pack = packs.find((entry) => entry.country_code === event.target.value); setRunForm({ ...runForm, country_code: event.target.value, currency: pack?.currencies?.[0]?.code || "" }); }} aria-label={t("Country")}><option value="">{t("Select country")}</option>{packs.map((pack) => <option key={pack.country_code} value={pack.country_code}>{i18n.language === "ar" ? pack.name_ar : pack.name_en}</option>)}</select> : <input className={`${field} w-24`} required minLength={2} maxLength={2} value={runForm.country_code} onChange={(event) => setRunForm({ ...runForm, country_code: event.target.value.toUpperCase() })} placeholder={t("Country code")} aria-label={t("Country code")} />}
        {countryPack?.currencies?.length ? <select className={field} required value={runForm.currency} onChange={(event) => setRunForm({ ...runForm, currency: event.target.value })} aria-label={t("Currency")}>{countryPack.currencies.map((currency) => <option key={currency.code} value={currency.code}>{currency.code}</option>)}</select> : <input className={`${field} w-24`} required minLength={3} maxLength={3} value={runForm.currency} onChange={(event) => setRunForm({ ...runForm, currency: event.target.value.toUpperCase() })} placeholder={t("Currency")} aria-label={t("Currency")} />}
      </div>
      {countryPack && countryPack.status !== "VERIFIED" && <p className="text-sm text-amber-700">{t("Country payroll rules require validation")}</p>}
      <button className={button} disabled={busy}>{t("Create run")}</button>
    </form>}

    <section className="space-y-3"><h2 className="text-lg font-semibold text-cell-primary">{t("Payroll runs")}</h2>
      {!runs.length && <p className="text-cell-secondary">{t("No payroll runs yet")}</p>}
      <div className="flex flex-wrap gap-2">{runs.map((entry) => <button key={entry._id} type="button" className={`${field} ${selectedId === entry._id ? "border-primary-500" : ""}`} onClick={() => { setSelectedId(entry._id); setPaymentReference(""); }}>{entry.name} · {t(entry.status)}</button>)}</div>
    </section>

    {run && <section className="space-y-5 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <div className="flex flex-wrap justify-between gap-2"><h2 className="text-lg font-semibold text-cell-primary">{run.name}</h2><span className="text-cell-secondary">{t(run.status)} · {run.currency} · {run.employee_count} {t("employees")}</span></div>
      <p className="text-sm text-cell-secondary">{t("Gross")}: {formatAmount(run.gross_minor, run)} · {t("Deductions")}: {formatAmount(run.deductions_minor, run)} · {t("Net")}: {formatAmount(run.net_minor, run)}</p>
      {canUpdate && <div className="flex flex-wrap items-center gap-2">
        {run.status === "DRAFT" && <button type="button" className={button} disabled={busy} onClick={() => execute(() => calculateRun(run._id).unwrap(), "Payroll calculated")}>{t("Calculate")}</button>}
        {nextStatus[run.status] && <><button type="button" className={button} disabled={busy || (run.status === "LOCKED" && !paymentReference.trim())} onClick={advance}>{t(nextStatus[run.status])}</button>{run.status === "LOCKED" && <input className={field} required maxLength={150} value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} placeholder={t("Payment reference")} aria-label={t("Payment reference")} />}</>}
      </div>}
      <div className="space-y-2"><h3 className="font-semibold text-cell-primary">{t("Payroll items")}</h3>
        {!items.length && <p className="text-cell-secondary">{t("No payroll items yet")}</p>}
        {items.map((item) => <div key={item._id} className="rounded-lg bg-status-bg p-3 text-sm text-cell-primary"><strong>{item.employee_name}</strong> · {item.employee_number} · {t("Gross")}: {formatAmount(item.gross_minor, run)} · {t("Net")}: {formatAmount(item.net_minor, run)}<details><summary className="cursor-pointer">{t("Components")}</summary><ul>{item.components?.map((component) => <li key={component.code}>{component.name}: {formatAmount(component.amount_minor, run)} · {t(component.type)}</li>)}</ul></details></div>)}
      </div>
      <div className="space-y-2"><h3 className="font-semibold text-cell-primary">{t("Payroll exceptions")}</h3>
        {!exceptions.length && <p className="text-cell-secondary">{t("No exceptions")}</p>}
        {exceptions.map((exception) => <div key={exception._id} className="rounded-lg bg-status-bg p-3 text-sm text-cell-primary"><strong>{t(exception.severity)}</strong> · {exception.message} · {t(exception.status)}{exception.status === "OPEN" && canUpdate && <div className="mt-2 flex flex-wrap gap-2"><input className={field} minLength={3} maxLength={500} value={resolutionNotes[exception._id] || ""} onChange={(event) => setResolutionNotes({ ...resolutionNotes, [exception._id]: event.target.value })} placeholder={t("Resolution note")} aria-label={t("Resolution note")} /><button type="button" className={button} disabled={busy || (resolutionNotes[exception._id] || "").trim().length < 3} onClick={() => execute(() => resolveException({ id: exception._id, resolution_note: resolutionNotes[exception._id] }).unwrap(), "Exception resolved")}>{t("Resolve")}</button></div>}</div>)}
      </div>
      <div className="space-y-2"><h3 className="font-semibold text-cell-primary">{t("Payslips")}</h3><p className="text-sm text-cell-secondary">{payslips.length} {t("payslips issued")}</p>{payslips.map((payslip) => <details key={payslip._id} className="rounded-lg bg-status-bg p-3 text-sm text-cell-primary"><summary className="cursor-pointer">{payslip.immutable_snapshot?.item?.employee_name || items.find((item) => item.employee_id === payslip.employee_id)?.employee_name || payslip.employee_id} · {new Date(payslip.issued_at).toLocaleDateString()}</summary><p className="mt-2">{t("Gross")}: {formatAmount(payslip.immutable_snapshot?.item?.gross_minor, run)} · {t("Net")}: {formatAmount(payslip.immutable_snapshot?.item?.net_minor, run)}</p><ul>{payslip.immutable_snapshot?.item?.components?.map((component) => <li key={component.code}>{component.name}: {formatAmount(component.amount_minor, run)}</li>)}</ul></details>)}</div>
      {["LOCKED", "PAYMENT_RECORDED"].includes(run.status) && <div className="flex flex-wrap gap-2"><button type="button" className={button} disabled={busy} onClick={() => downloadCsv("accounting")}>{t("Export accounting CSV")}</button><button type="button" className={button} disabled={busy} onClick={() => downloadCsv("payment")}>{t("Export payment CSV")}</button></div>}
      {["LOCKED", "PAYMENT_RECORDED"].includes(run.status) && <div className="space-y-2 rounded-lg border border-status-border p-3 text-sm text-cell-primary">
        <h3 className="font-semibold">{t("Accounting delivery")}</h3>
        {accountingError && <p role="alert">{messageOf(accountingError)}</p>}
        {accountingDelivery && !accountingDelivery.configured && <p>{t("Accounting destination is not configured")}</p>}
        {accountingDelivery?.delivery && <p>{t("Delivery status")}: {t(accountingDelivery.delivery.status)} · {t("Attempts")}: {accountingDelivery.delivery.attempts}
          {accountingDelivery.delivery.next_attempt_at && ` · ${t("Next retry")}: ${new Date(accountingDelivery.delivery.next_attempt_at).toLocaleString()}`}
          {accountingDelivery.delivery.sent_at && ` · ${t("Sent at")}: ${new Date(accountingDelivery.delivery.sent_at).toLocaleString()}`}</p>}
        {accountingDelivery?.delivery?.last_error && <p role="alert">{t(accountingDelivery.delivery.last_error)}</p>}
        <div className="flex flex-wrap gap-2">
          {canUpdate && accountingDelivery?.configured && !accountingDelivery.delivery && <button type="button" className={button} disabled={busy} onClick={() => execute(() => enqueueAccounting(run._id).unwrap(), "Accounting delivery started")}>{t("Send to accounting")}</button>}
          {canUpdate && accountingDelivery?.configured && accountingDelivery.delivery?.status === "FAILED" && <button type="button" className={button} disabled={busy} onClick={() => execute(() => retryAccounting(run._id).unwrap(), "Accounting retry started")}>{t("Retry accounting delivery")}</button>}
          {accountingDelivery?.configured && <button type="button" className={field} disabled={busy} onClick={() => refreshAccounting()}>{t("Refresh status")}</button>}
        </div>
      </div>}
      {run.status === "DRAFT" && canUpdate && canListEmployees && allowedSources.length > 0 && <form onSubmit={submitAdjustment} className="flex flex-wrap items-end gap-2 rounded-lg bg-status-bg p-3">
        <h3 className="w-full font-semibold text-cell-primary">{t("Create documented adjustment")}</h3>
        <select required className={field} value={adjustment.source_payroll_run_id} onChange={(event) => setAdjustment({ ...adjustment, source_payroll_run_id: event.target.value })} aria-label={t("Source payroll run")}><option value="">{t("Source payroll run")}</option>{allowedSources.map((source) => <option key={source._id} value={source._id}>{source.name}</option>)}</select>
        <select required className={field} value={adjustment.employee_id} onChange={(event) => setAdjustment({ ...adjustment, employee_id: event.target.value })} aria-label={t("Employee")}><option value="">{t("Select employee")}</option>{people.map((person) => <option key={person._id} value={person.user_id}>{person.user?.name || person.user?.email}</option>)}</select>
        <select className={field} value={adjustment.type} onChange={(event) => setAdjustment({ ...adjustment, type: event.target.value })} aria-label={t("Adjustment type")}><option value="EARNING">{t("EARNING")}</option><option value="DEDUCTION">{t("DEDUCTION")}</option></select>
        <input className={`${field} w-28`} required inputMode="decimal" value={adjustment.amount} onChange={(event) => setAdjustment({ ...adjustment, amount: event.target.value })} placeholder={run.currency} aria-label={t("Amount")} />
        <input className={field} required minLength={3} maxLength={500} value={adjustment.reason} onChange={(event) => setAdjustment({ ...adjustment, reason: event.target.value })} placeholder={t("Adjustment reason")} aria-label={t("Adjustment reason")} />
        <button className={button} disabled={busy || !selectedSource}>{t("Add adjustment")}</button>
      </form>}
      <div className="space-y-2"><h3 className="font-semibold text-cell-primary">{t("Adjustments")}</h3>{adjustments.map((entry) => <div key={entry._id} className="flex flex-wrap items-center gap-2 text-sm text-cell-primary">{entry.reason} · {t(entry.type)} · {formatAmount(entry.amount_minor, run)} · {t(entry.status)}{entry.status === "PENDING" && canUpdate && <button type="button" className="text-red-600" disabled={busy} onClick={() => { const reason = window.prompt(t("Cancellation reason")); if (reason?.trim()?.length >= 3) execute(() => cancelAdjustment({ id: entry._id, reason: reason.trim() }).unwrap(), "Adjustment cancelled"); }}>{t("Cancel adjustment")}</button>}</div>)}</div>
    </section>}
  </div>;
}
