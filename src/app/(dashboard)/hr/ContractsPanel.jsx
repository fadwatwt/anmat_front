"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectUserType } from "@/redux/auth/authSlice";
import { usePermission } from "@/Hooks/usePermission";
import { useGetEmployeesQuery, useGetEmployeeDocumentsQuery } from "@/redux/employees/employeesApi";
import {
  useGetEmployeeContractsQuery, useGetExpiringContractsQuery, useGetExpiringEmployeeDocumentsQuery, useGetMyContractsQuery,
  useCreateEmployeeContractMutation, useUpdateEmployeeContractMutation,
  useApproveEmployeeContractMutation, useAcknowledgeMyContractMutation,
} from "@/redux/employees/contractsApi";

const field = "rounded-lg border border-gray-300 bg-surface px-3 py-2 text-cell-primary dark:border-gray-700";
const button = "rounded-lg bg-primary-500 px-4 py-2 text-white disabled:opacity-50";
const blank = { employee_id: "", title: "", contract_type: "FIXED_TERM", starts_at: "", ends_at: "", probation_ends_at: "", attachment_id: "", supersedes_contract_id: "" };
const day = (value) => value ? new Date(value).toISOString().slice(0, 10) : "";
const errorText = (error) => {
  const value = error?.data?.message || error?.message;
  return Array.isArray(value) ? value.join("، ") : value || "Operation failed";
};
const idOf = (value) => String(value?._id || value || "");

export default function ContractsPanel() {
  const { t } = useTranslation();
  const userType = useSelector(selectUserType);
  const isEmployee = userType === "Employee";
  const canList = usePermission("employee_contracts.list");
  const canCreate = usePermission("employee_contracts.create");
  const canUpdate = usePermission("employee_contracts.update");
  const canApprove = usePermission("employee_contracts.approve");
  const canListEmployees = usePermission("employee_details.list");
  const canViewDocuments = usePermission("employee_contracts.view");
  const { data: contracts = [], isLoading, error } = useGetEmployeeContractsQuery(undefined, { skip: !canList });
  const { data: expiring = [] } = useGetExpiringContractsQuery(undefined, { skip: !canList });
  const { data: expiringDocuments = [] } = useGetExpiringEmployeeDocumentsQuery(undefined, { skip: !canList });
  const { data: mine = [], isLoading: loadingMine, error: mineError } = useGetMyContractsQuery(undefined, { skip: !isEmployee });
  const { data: employees = [] } = useGetEmployeesQuery(undefined, { skip: !canListEmployees });
  const [createContract] = useCreateEmployeeContractMutation();
  const [updateContract] = useUpdateEmployeeContractMutation();
  const [approveContract] = useApproveEmployeeContractMutation();
  const [acknowledgeContract] = useAcknowledgeMyContractMutation();
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { data: documents = [] } = useGetEmployeeDocumentsQuery(form.employee_id, { skip: !form.employee_id || !canViewDocuments });
  const people = employees.filter((employee) => employee.registration_status !== "pending" && employee.user_id);
  const nameOf = (id) => people.find((employee) => idOf(employee.user_id) === idOf(id))?.user?.name || idOf(id);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const run = async (action, success) => {
    setBusy(true); setFeedback("");
    try { await action(); setFeedback(t(success)); }
    catch (caught) { setFeedback(errorText(caught)); }
    finally { setBusy(false); }
  };

  const submit = (event) => {
    event.preventDefault();
    if (form.ends_at && form.ends_at <= form.starts_at) { setFeedback(t("Contract end must follow start")); return; }
    const body = {
      employee_id: form.employee_id, title: form.title.trim(), contract_type: form.contract_type,
      starts_at: `${form.starts_at}T00:00:00.000Z`,
      ...(form.ends_at ? { ends_at: `${form.ends_at}T00:00:00.000Z` } : {}),
      ...(form.probation_ends_at ? { probation_ends_at: `${form.probation_ends_at}T00:00:00.000Z` } : {}),
      ...(form.attachment_id ? { attachment_id: form.attachment_id } : {}),
      ...(!editingId && form.supersedes_contract_id ? { supersedes_contract_id: form.supersedes_contract_id } : {}),
    };
    run(async () => {
      if (editingId) await updateContract({ id: editingId, body: { ...body, employee_id: undefined,
        ends_at: form.ends_at ? body.ends_at : null,
        probation_ends_at: form.probation_ends_at ? body.probation_ends_at : null,
      } }).unwrap();
      else await createContract(body).unwrap();
      setForm(blank); setEditingId("");
    }, editingId ? "Contract updated" : "Contract created");
  };

  const startEdit = (contract) => {
    setEditingId(contract._id);
    setForm({ employee_id: idOf(contract.employee_id), title: contract.title,
      contract_type: contract.contract_type, starts_at: day(contract.starts_at), ends_at: day(contract.ends_at),
      probation_ends_at: day(contract.probation_ends_at), attachment_id: idOf(contract.attachment_id || ""),
      supersedes_contract_id: idOf(contract.supersedes_contract_id || "") });
  };
  const newVersion = (contract) => {
    setEditingId("");
    setForm({ ...blank, employee_id: idOf(contract.employee_id), title: contract.title,
      contract_type: contract.contract_type, supersedes_contract_id: contract._id });
  };

  if (isEmployee && !canList) return <section className="space-y-3" dir="auto">
    <h2 className="text-lg font-semibold text-cell-primary">{t("My contracts")}</h2>
    {loadingMine && <p>{t("Loading...")}</p>}
    {mineError && <p role="alert" className="text-red-600">{errorText(mineError)}</p>}
    {!loadingMine && !mine.length && <p>{t("No approved contracts yet")}</p>}
    {mine.map((contract) => <article key={contract._id} className="space-y-2 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <h3 className="font-semibold text-cell-primary">{contract.title}</h3>
      <p className="text-sm text-cell-secondary">{t(contract.contract_type)} · {day(contract.starts_at)}{contract.ends_at ? ` — ${day(contract.ends_at)}` : ""}</p>
      {contract.attachment_id?.url && <a className="text-primary-500 underline" href={contract.attachment_id.url} target="_blank" rel="noopener noreferrer">{t("View contract document")}</a>}
      <p className="text-sm text-cell-secondary">{contract.acknowledged_at ? `${t("Acknowledged")}: ${day(contract.acknowledged_at)}` : t("Acknowledgment pending")}</p>
      {!contract.acknowledged_at && <button type="button" className={button} disabled={busy} onClick={() => run(() => acknowledgeContract(contract._id).unwrap(), "Contract acknowledged")}>{t("Acknowledge receipt")}</button>}
    </article>)}
    {feedback && <p role="status">{feedback}</p>}
  </section>;

  if (isLoading) return <p>{t("Loading...")}</p>;
  if (error) return <p role="alert" className="text-red-600">{errorText(error)}</p>;
  return <div className="space-y-5" dir="auto">
    {feedback && <p role="status" className="rounded-lg bg-status-bg p-3 text-cell-primary">{feedback}</p>}
    <section className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <h2 className="mb-2 text-lg font-semibold text-cell-primary">{t("Contracts expiring in 30 days")}</h2>
      {!expiring.length ? <p className="text-cell-secondary">{t("No contracts expiring soon")}</p> : expiring.map((contract) => <p key={contract._id} className="text-sm text-amber-700">{nameOf(contract.employee_id)} · {contract.title} · {day(contract.ends_at)}</p>)}
    </section>
    <section className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <h2 className="mb-2 text-lg font-semibold text-cell-primary">{t("Documents expiring in 30 days")}</h2>
      {!expiringDocuments.length ? <p className="text-cell-secondary">{t("No documents expiring soon")}</p> : expiringDocuments.map((document) => <p key={document._id} className="text-sm text-amber-700">{people.find((person) => idOf(person._id) === idOf(document.model_id))?.user?.name || document.name} · {document.name} · {day(document.expires_at)}</p>)}
    </section>
    {(canCreate || (editingId && canUpdate)) && <form onSubmit={submit} className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-cell-primary">{t(editingId ? "Edit draft contract" : "Create contract")}</h2>
      <div className="flex flex-wrap gap-2">
        <select className={field} required disabled={!!editingId || !!form.supersedes_contract_id} value={form.employee_id} onChange={(event) => set("employee_id", event.target.value)} aria-label={t("Employee")}><option value="">{t("Select employee")}</option>{people.map((person) => <option key={person._id} value={person.user_id}>{person.user?.name || person.user?.email}</option>)}</select>
        <input className={field} required minLength={2} maxLength={100} value={form.title} onChange={(event) => set("title", event.target.value)} placeholder={t("Contract title")} aria-label={t("Contract title")} />
        <select className={field} value={form.contract_type} onChange={(event) => set("contract_type", event.target.value)} aria-label={t("Contract type")}><option value="FIXED_TERM">{t("FIXED_TERM")}</option><option value="INDEFINITE">{t("INDEFINITE")}</option><option value="PART_TIME">{t("PART_TIME")}</option><option value="OTHER">{t("OTHER")}</option></select>
        <label className="text-sm text-cell-primary">{t("Start date")} <input className={field} required type="date" value={form.starts_at} onChange={(event) => set("starts_at", event.target.value)} /></label>
        <label className="text-sm text-cell-primary">{t("End date")} <input className={field} required={form.contract_type === "FIXED_TERM"} type="date" value={form.ends_at} onChange={(event) => set("ends_at", event.target.value)} /></label>
        <label className="text-sm text-cell-primary">{t("Probation end")} <input className={field} type="date" value={form.probation_ends_at} onChange={(event) => set("probation_ends_at", event.target.value)} /></label>
        <select className={field} value={form.attachment_id} onChange={(event) => set("attachment_id", event.target.value)} aria-label={t("Contract document")}><option value="">{t("No document")}</option>{documents.filter((doc) => doc.category === "CONTRACT").map((doc) => <option key={doc._id} value={doc._id}>{doc.name}</option>)}</select>
      </div>
      {form.supersedes_contract_id && <p className="text-sm text-cell-secondary">{t("New version of previous contract")}</p>}
      <div className="flex gap-2"><button className={button} disabled={busy}>{t(editingId ? "Save draft" : "Create contract")}</button>{(editingId || form.supersedes_contract_id) && <button type="button" className={field} onClick={() => { setEditingId(""); setForm(blank); }}>{t("Cancel")}</button>}</div>
    </form>}
    <section className="space-y-2"><h2 className="text-lg font-semibold text-cell-primary">{t("Employee contracts")}</h2>
      {!contracts.length && <p className="text-cell-secondary">{t("No contracts yet")}</p>}
      {contracts.map((contract) => <article key={contract._id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-cell-primary">{nameOf(contract.employee_id)} · {contract.title}</strong><span className="text-sm text-cell-secondary">{t(contract.status)}</span></div>
        <p className="text-sm text-cell-secondary">{t(contract.contract_type)} · {day(contract.starts_at)}{contract.ends_at ? ` — ${day(contract.ends_at)}` : ""}{contract.probation_ends_at ? ` · ${t("Probation end")}: ${day(contract.probation_ends_at)}` : ""}</p>
        {contract.acknowledged_at && <p className="text-sm text-green-700">{t("Acknowledged")}: {day(contract.acknowledged_at)}</p>}
        <div className="mt-2 flex flex-wrap gap-2">{contract.status === "DRAFT" && canUpdate && <button type="button" className={field} onClick={() => startEdit(contract)}>{t("Edit draft")}</button>}{contract.status === "DRAFT" && canApprove && <button type="button" className={button} disabled={busy} onClick={() => { if (window.confirm(t("Approve contract confirmation"))) run(() => approveContract(contract._id).unwrap(), "Contract approved"); }}>{t("Approve")}</button>}{contract.status === "APPROVED" && canCreate && <button type="button" className={field} onClick={() => newVersion(contract)}>{t("Create new version")}</button>}</div>
        <details className="mt-2 text-sm text-cell-secondary"><summary className="cursor-pointer">{t("Audit history")}</summary>{contract.events?.map((event, index) => <p key={index}>{t(event.action)} · {new Date(event.at).toLocaleString()} · {idOf(event.actor_id)}</p>)}</details>
      </article>)}
    </section>
  </div>;
}
