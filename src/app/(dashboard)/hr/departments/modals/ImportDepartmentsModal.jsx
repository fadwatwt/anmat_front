"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal/Modal.jsx";
import { useCreateDepartmentMutation } from "@/redux/departments/departmentsApi";
import { useGetPositionsQuery } from "@/redux/positions/positionsApi";
import { previewDepartmentImport } from "@/functions/departmentImport";

export default function ImportDepartmentsModal({ isOpen, onClose, departments }) {
  const { i18n } = useTranslation();
  const ar = i18n.language?.startsWith("ar");
  const label = (arabic, english) => ar ? arabic : english;
  const { data: positions = [] } = useGetPositionsQuery(undefined, { skip: !isOpen });
  const [createDepartment] = useCreateDepartmentMutation();
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const close = () => { if (busy) return; setRows([]); setMessage(""); onClose(); };

  const readFile = async (file) => {
    setRows([]); setMessage("");
    if (!file) return;
    if (!/\.(csv|xlsx|xls)$/i.test(file.name) || file.size > 2 * 1024 * 1024) {
      setMessage(label("اختر ملف CSV أو Excel بحجم لا يتجاوز 2 ميغابايت.", "Choose a CSV or Excel file up to 2 MB.")); return;
    }
    try {
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const records = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
      if (!records.length || records.length > 500) throw new Error("Invalid row count");
      setRows(previewDepartmentImport(records, departments, positions));
    } catch {
      setMessage(label("تعذر قراءة الملف. تحقق من الأعمدة وعدد الصفوف (حتى 500).", "Could not read the file. Check its columns and row count (up to 500)."));
    }
  };

  const importReady = async () => {
    setBusy(true);
    const updated = [...rows];
    for (let index = 0; index < updated.length; index += 1) {
      if (updated[index].status !== "ready") continue;
      try {
        await createDepartment({ name: updated[index].name, description: updated[index].description, positions_ids: updated[index].positions_ids }).unwrap();
        updated[index] = { ...updated[index], status: "imported" };
      } catch {
        updated[index] = { ...updated[index], status: "failed" };
      }
      setRows([...updated]);
    }
    setBusy(false);
    setMessage(label("اكتمل الاستيراد. راجع حالة كل صف.", "Import finished. Review each row."));
  };
  const readyCount = rows.filter((row) => row.status === "ready").length;
  const statusLabel = { ready: label("جاهز", "Ready"), duplicate: label("مكرر", "Duplicate"), invalid: label("غير صالح", "Invalid"), imported: label("تمت الإضافة", "Imported"), failed: label("فشلت الإضافة", "Failed") };

  return <Modal isOpen={isOpen} onClose={close} isBtns={false} title={label("استيراد الأقسام", "Import departments")} className="w-11/12 max-w-3xl px-3">
    <div className="space-y-4 p-2" dir={ar ? "rtl" : "ltr"}>
      <p className="text-sm text-cell-secondary">{label("أعمدة الملف: name وdescription وpositions، أو القسم والوصف والمناصب. افصل أسماء المناصب بعلامة ; ويجب أن تكون موجودة مسبقًا.", "Columns: name, description, and positions. Separate position names with ; and create those positions first.")}</p>
      <input type="file" aria-label={label("ملف الأقسام", "Departments file")} accept=".csv,.xlsx,.xls" disabled={busy || !positions.length} onChange={(event) => readFile(event.target.files?.[0])} className="block w-full text-sm" />
      {!positions.length && <p className="text-sm text-cell-secondary">{label("أضف منصبًا واحدًا على الأقل قبل الاستيراد.", "Create at least one position before importing.")}</p>}
      {message && <p role="status" className="text-sm text-cell-primary">{message}</p>}
      {!!rows.length && <><p className="text-sm font-semibold">{label("جاهز للإضافة", "Ready to import")}: {readyCount} / {rows.length}</p>
        <div className="max-h-72 overflow-auto rounded-lg border border-status-border"><table className="w-full text-sm"><thead><tr className="bg-surface"><th className="p-2 text-start">#</th><th className="p-2 text-start">{label("القسم", "Department")}</th><th className="p-2 text-start">{label("المناصب", "Positions")}</th><th className="p-2 text-start">{label("الحالة", "Status")}</th></tr></thead><tbody>{rows.map((row) => <tr key={row.row} className="border-t border-status-border"><td className="p-2">{row.row}</td><td className="p-2">{row.name || "—"}</td><td className="p-2">{row.positionNames.join("; ") || "—"}</td><td className="p-2">{statusLabel[row.status]}{row.unknownPositions.length ? `: ${row.unknownPositions.join("; ")}` : ""}</td></tr>)}</tbody></table></div></>}
      <div className="flex justify-end gap-2"><button type="button" disabled={busy} onClick={close} className="rounded-lg border border-status-border px-4 py-2">{label("إغلاق", "Close")}</button><button type="button" disabled={busy || !readyCount} onClick={importReady} className="rounded-lg bg-primary-500 px-4 py-2 text-white disabled:opacity-50">{busy ? label("جارٍ الاستيراد...", "Importing...") : label("إضافة الصفوف الجاهزة", "Import ready rows")}</button></div>
    </div>
  </Modal>;
}
