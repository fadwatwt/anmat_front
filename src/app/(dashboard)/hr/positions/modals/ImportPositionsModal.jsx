"use client";
import { useState } from "react";
import Modal from "@/components/Modal/Modal.jsx";
import { useTranslation } from "react-i18next";
import { useCreatePositionMutation } from "@/redux/positions/positionsApi";
import { previewPositionImport } from "@/functions/positionImport";

export default function ImportPositionsModal({ isOpen, onClose, existingPositions }) {
    const { i18n } = useTranslation();
    const ar = i18n.language?.startsWith("ar");
    const [rows, setRows] = useState([]);
    const [fileName, setFileName] = useState("");
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);
    const [createPosition] = useCreatePositionMutation();
    const label = (arabic, english) => ar ? arabic : english;

    const readFile = async (file) => {
        setMessage("");
        setRows([]);
        setFileName(file?.name || "");
        if (!file) return;
        if (!/\.(csv|xlsx|xls)$/i.test(file.name) || file.size > 2 * 1024 * 1024) {
            setMessage(label("اختر ملف CSV أو Excel بحجم لا يتجاوز 2 ميغابايت.", "Choose a CSV or Excel file up to 2 MB."));
            return;
        }
        try {
            const XLSX = await import("xlsx");
            const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
            const records = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
            if (!records.length || records.length > 500) throw new Error("row_count");
            setRows(previewPositionImport(records, existingPositions));
        } catch {
            setMessage(label("تعذر قراءة الملف. تأكد من الأعمدة وعدد الصفوف (حتى 500).", "Could not read the file. Check its columns and row count (up to 500)."));
        }
    };

    const importReady = async () => {
        setBusy(true);
        const updated = [...rows];
        for (let index = 0; index < updated.length; index += 1) {
            if (updated[index].status !== "ready") continue;
            try {
                await createPosition({ title: updated[index].title, description: updated[index].description, level: updated[index].level }).unwrap();
                updated[index] = { ...updated[index], status: "imported" };
            } catch (error) {
                updated[index] = { ...updated[index], status: "failed", error: ar ? "تحقق من بيانات الصف أو وجود منصب بالاسم نفسه." : String(error?.data?.message || "Check this row or an existing position with the same name.") };
            }
            setRows([...updated]);
        }
        setBusy(false);
        setMessage(label("اكتمل الاستيراد. راجع حالة كل صف أدناه.", "Import finished. Review each row below."));
    };

    const close = () => {
        if (busy) return;
        setRows([]);
        setFileName("");
        setMessage("");
        onClose();
    };
    const readyCount = rows.filter((row) => row.status === "ready").length;
    const statuses = {
        ready: label("جاهز", "Ready"), duplicate: label("مكرر", "Duplicate"),
        invalid: label("غير صالح", "Invalid"), imported: label("تمت الإضافة", "Imported"),
        failed: label("فشلت الإضافة", "Failed"),
    };

    return <Modal isOpen={isOpen} onClose={close} isBtns={false} title={label("استيراد المناصب", "Import positions")} className="w-11/12 max-w-3xl px-3">
        <div className="space-y-4 p-2" dir={ar ? "rtl" : "ltr"}>
            <p className="text-sm text-cell-secondary">{label("ارفع ملف CSV أو Excel. الأعمدة: title وdescription وlevel (اختياري، الافتراضي 1). يمكنك استخدام المنصب والوصف والمستوى بالعربية. ستُتجاهل المناصب المكررة.", "Upload a CSV or Excel file. Columns: title, description, and optional level (defaults to 1). Existing and repeated positions will be skipped.")}</p>
            <input aria-label={label("ملف المناصب", "Positions file")} type="file" accept=".csv,.xlsx,.xls" disabled={busy} onChange={(event) => readFile(event.target.files?.[0])} className="block w-full text-sm" />
            {fileName && <p className="text-sm text-cell-secondary">{fileName}</p>}
            {message && <p role="status" className="text-sm text-cell-primary">{message}</p>}
            {rows.length > 0 && <>
                <p className="text-sm font-semibold">{label("جاهز للإضافة", "Ready to import")}: {readyCount} / {rows.length}</p>
                <div className="max-h-72 overflow-auto border border-status-border rounded-lg">
                    <table className="w-full text-sm"><thead><tr className="bg-surface"><th className="p-2 text-start">#</th><th className="p-2 text-start">{label("المنصب", "Position")}</th><th className="p-2 text-start">{label("المستوى", "Level")}</th><th className="p-2 text-start">{label("الحالة", "Status")}</th></tr></thead><tbody>
                        {rows.map((row) => <tr key={row.row} className="border-t border-status-border"><td className="p-2">{row.row}</td><td className="p-2">{row.title || "—"}</td><td className="p-2">{row.level}</td><td className="p-2">{statuses[row.status]}{row.error ? `: ${row.error}` : ""}</td></tr>)}
                    </tbody></table>
                </div>
            </>}
            <div className="flex gap-2 justify-end"><button type="button" disabled={busy} onClick={close} className="rounded-lg border border-status-border px-4 py-2">{label("إغلاق", "Close")}</button><button type="button" disabled={busy || !readyCount} onClick={importReady} className="rounded-lg bg-primary-500 px-4 py-2 text-white disabled:opacity-50">{busy ? label("جارٍ الاستيراد...", "Importing...") : label("إضافة الصفوف الجاهزة", "Import ready rows")}</button></div>
        </div>
    </Modal>;
}
