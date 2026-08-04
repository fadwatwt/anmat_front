"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Page from "@/components/Page.jsx";
import { useGetKbEntriesQuery, useCreateKbEntryMutation, useUpdateKbEntryMutation, useDeleteKbEntryMutation, useUploadKbFileMutation } from "@/redux/api/knowledgeBaseApi";
import { X, FileText, Search, Plus, Trash2, Edit, FileUp } from "lucide-react";

export default function KnowledgeBasePage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", tags: "", category: "general" });
  const [uploadFile, setUploadFile] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useGetKbEntriesQuery({
    page, limit: 20, search: debouncedSearch,
  });
  const [createEntry] = useCreateKbEntryMutation();
  const [updateEntry] = useUpdateKbEntryMutation();
  const [deleteEntry] = useDeleteKbEntryMutation();
  const [uploadFileMutation, { isLoading: isUploading }] = useUploadKbFileMutation();

  const entries = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  const openCreate = () => {
    setEditId(null);
    setForm({ title: "", content: "", tags: "", category: "general" });
    setUploadFile(null);
    setShowModal(true);
  };

  const openEdit = (entry) => {
    setEditId(entry._id);
    setForm({
      title: entry.title,
      content: entry.content,
      tags: (entry.tags || []).join(", "),
      category: entry.category || "general",
    });
    setUploadFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const body = {
      title: form.title,
      content: form.content,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      category: form.category,
    };

    try {
      if (uploadFile) {
        await uploadFileMutation({
          title: form.title,
          category: form.category,
          file: uploadFile,
        }).unwrap();
      } else if (editId) {
        await updateEntry({ id: editId, ...body }).unwrap();
      } else {
        await createEntry(body).unwrap();
      }
      setShowModal(false);
      setUploadFile(null);
    } catch (err) {
      console.error("KB submit error", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEntry(id).unwrap();
      setDeleteConfirm(null);
    } catch (err) {
      console.error("KB delete error", err);
    }
  };

  const categories = ["general", "policy", "procedure", "faq", "document"];

  return (
    <Page>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t("Knowledge Base")}</h1>
            <p className="text-sm text-gray-500 mt-1">{t("Manage company documentation, policies, and FAQs")}</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium transition-colors">
            <Plus size={16} />
            {t("Add Entry")}
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={isAr ? "بحث في المعرفة..." : "Search knowledge base..."}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-400">{t("Loading...")}</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">{t("No entries found")}</p>
            <button onClick={openCreate} className="mt-3 text-sm text-primary-500 hover:text-primary-600">{t("Add the first entry")}</button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  <th className="text-start px-4 py-3 font-medium">{t("Title")}</th>
                  <th className="text-start px-4 py-3 font-medium">{t("Category")}</th>
                  <th className="text-start px-4 py-3 font-medium">{t("Tags")}</th>
                  <th className="text-start px-4 py-3 font-medium">{t("Added")}</th>
                  <th className="text-end px-4 py-3 font-medium">{t("Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {entries.map((entry) => (
                  <tr key={entry._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">{entry.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{entry.content?.slice(0, 80)}...</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium capitalize">{entry.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(entry.tags || []).slice(0, 3).map((tag, i) => (
                          <span key={i} className="inline-block px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs">{tag}</span>
                        ))}
                        {(entry.tags || []).length > 3 && (
                          <span className="text-xs text-gray-400">+{entry.tags.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(entry.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(entry)} className="p-1.5 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => setDeleteConfirm(entry._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-600 disabled:opacity-30">{t("Previous")}</button>
            <span className="text-sm text-gray-500">{page} / {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-600 disabled:opacity-30">{t("Next")}</button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editId ? t("Edit Entry") : t("Add Entry")}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Title")} *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Content")}</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={6}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-400 resize-y"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Category")}</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Tags")}</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder={isAr ? "مفصولة بفاصلة" : "comma-separated"}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              </div>

              {!editId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Or upload a file")}</label>
                  <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary-400 transition-colors">
                    <FileUp size={20} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{uploadFile ? uploadFile.name : t("PDF, DOCX, or TXT")}</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setUploadFile(f);
                      }}
                    />
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  {t("Cancel")}
                </button>
                <button type="submit" disabled={isUploading || !form.title.trim()} className="px-4 py-2.5 text-sm rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors disabled:opacity-40">
                  {isUploading ? t("Uploading...") : editId ? t("Save") : t("Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-gray-900 dark:text-white font-medium mb-2">{t("Delete this entry?")}</p>
            <p className="text-sm text-gray-500 mb-4">{t("This action cannot be undone")}</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 transition-colors">
                {t("Cancel")}
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 text-sm rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors">
                {t("Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
