"use client";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal/Modal.jsx";
import { useCreateEmployeeMutation } from "@/redux/employees/employeesApi";
import { useGetDepartmentsQuery } from "@/redux/departments/departmentsApi";
import { useGetPositionsQuery } from "@/redux/positions/positionsApi";
import { previewEmployeeImport } from "@/functions/employeeImport";

export default function ImportEmployeesModal({ onClose, employees }) {
  const { i18n } = useTranslation();
  const ar = i18n.language?.startsWith("ar");
  const label = (arabic, english) => ar ? arabic : english;
  const { data: departments = [], isFetching: loadingDepartments, isError: departmentError } = useGetDepartmentsQuery();
  const { data: positions = [], isFetching: loadingPositions, isError: positionError } = useGetPositionsQuery();
  const [createEmployee] = useCreateEmployeeMutation();
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const fileVersion = useRef(0);
  const readyCount = rows.filter((row) => row.status === "ready").length;
  const readFile = async (file) => {
    const version = ++fileVersion.current;
    setRows([]); setMessage("");
    if (!file) return;
    if (!/\.(csv|xlsx|xls)$/i.test(file.name) || file.size > 2 * 1024 * 1024) {
      setMessage(label("اختر CSV أو Excel بحجم حتى 2 ميغابايت.", "Choose CSV or Excel up to 2 MB.")); return;
    }
    setBusy(true);
    try {
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: false });
      const records = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "", raw: false });
      if (!records.length || records.length > 500) throw new Error("row count");
      if (version === fileVersion.current) setRows(previewEmployeeImport(records, employees, departments, positions));
    } catch {
      if (version === fileVersion.current) setMessage(label("تعذر قراءة الملف. الحد الأقصى 500 صف.", "Could not read file. Maximum 500 rows."));
    } finally { if (version === fileVersion.current) setBusy(false); }
  };
  const importReady = async () => {
    if (lock.current) return;
    lock.current = true; setBusy(true);
    const updated = [...rows];
    try {
      for (let index = 0; index < updated.length; index += 1) {
        if (updated[index].status !== "ready") continue;
        try {
          await createEmployee(updated[index].payload).unwrap();
          updated[index] = { ...updated[index], status: "imported", payload: undefined };
        } catch (error) {
          const uncertain = !Number.isInteger(error?.status) || error.status >= 500;
          updated[index] = { ...updated[index], status: uncertain ? "uncertain" : "failed", payload: undefined };
          setRows([...updated]);
          // Stop on uncertain writes, authorization failures, or rate limits.
          if (uncertain || [401, 403, 429].includes(error?.status)) break;
        }
        setRows([...updated]);
      }
      setMessage(label("راجع حالة كل صف. عند نتيجة غير مؤكدة، تحقق من قائمة الموظفين قبل إعادة الاستيراد.", "Review each row. For uncertain results, check the employee list before importing again."));
    } finally { setBusy(false); lock.current = false; }
  };
  const statusLabel = { ready: label("جاهز", "Ready"), invalid: label("غير صالح", "Invalid"), duplicate: label("مكرر", "Duplicate"), imported: label("تمت الإضافة", "Imported"), failed: label("فشلت الإضافة", "Failed"), uncertain: label("نتيجة غير مؤكدة", "Uncertain result") };
  return <Modal isOpen onClose={() => { if (!busy) onClose(); }} isBtns={false} title={label("استيراد الموظفين", "Import employees")} className="w-11/12 max-w-4xl px-3">
    <div className="space-y-4 p-2" dir={ar ? "rtl" : "ltr"}>
      <p className="text-sm">{label("الأعمدة المطلوبة: name, email, phone, password, date_of_birth, salary. التاريخ بصيغة YYYY-MM-DD؛ الهاتف كنص للحفاظ على الصفر الأول. كلمة المرور مؤقتة ولا تظهر في المعاينة.", "Required columns: name, email, phone, password, date_of_birth, salary. Dates: YYYY-MM-DD; keep phones as text to preserve leading zeros. Temporary passwords are hidden in preview.")}</p>
      <p className="text-sm">{label("اختياري: employee_number, department, position, work_hours, yearly_day_offs. استخدم أسماء الأقسام والمناصب الموجودة. الافتراضي: 8 ساعات، 14 يوم إجازة، ولا أيام عطلة أسبوعية؛ راجع إعدادات الدوام بعد الاستيراد.", "Optional: employee_number, department, position, work_hours, yearly_day_offs. Use existing department and position names. Defaults: 8 hours, 14 leave days, no weekend days; review work schedules after import.")}</p>
      <a href="/templates/employees-import.csv" download className="block text-primary-600 underline">{label("تنزيل نموذج CSV", "Download CSV template")}</a>
      <input type="file" aria-label={label("ملف الموظفين", "Employees file")} accept=".csv,.xlsx,.xls" disabled={busy || loadingDepartments || loadingPositions || departmentError || positionError} onChange={(event) => readFile(event.target.files?.[0])} />
      {(departmentError || positionError) && <p role="alert">{label("تعذر جلب الأقسام أو المناصب. أغلق النافذة وأعد المحاولة.", "Could not load departments or positions. Close and try again.")}</p>}
      {message && <p role="status">{message}</p>}
      {!!rows.length && <><p>{label("جاهز للإضافة", "Ready to import")}: {readyCount} / {rows.length}</p>
        <div className="max-h-72 overflow-auto"><table className="w-full text-sm"><thead><tr>{["#", label("الاسم", "Name"), label("البريد", "Email"), label("الحالة / الحقول غير الصالحة", "Status / invalid fields")].map((heading) => <th key={heading} className="p-2 text-start">{heading}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.row}><td className="p-2">{row.row}</td><td className="p-2">{row.name}</td><td className="p-2">{row.email}</td><td className="p-2">{statusLabel[row.status]} {row.errors.join(", ")}</td></tr>)}</tbody></table></div></>}
      <div className="flex justify-end gap-2"><button type="button" disabled={busy} onClick={onClose} className="rounded-lg border px-4 py-2">{label("إغلاق", "Close")}</button><button type="button" disabled={busy || !readyCount} onClick={importReady} className="rounded-lg bg-primary-500 px-4 py-2 text-white disabled:opacity-50">{busy ? label("جارٍ المعالجة...", "Processing...") : label("إضافة الصفوف الجاهزة", "Import ready rows")}</button></div>
    </div>
  </Modal>;
}
