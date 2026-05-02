"use client";
import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useCreatePollMutation } from "@/redux/conversations/conversationsAPI";

const CreatePollModal = ({ chatId, onClose }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [allowMultipleChoice, setAllowMultipleChoice] = useState(false);
  const [createPoll, { isLoading }] = useCreatePollMutation();

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    const validOptions = options.map(o => o.trim()).filter(o => o);
    if (validOptions.length < 2) return;

    try {
      await createPoll({
        chatId,
        question: question.trim(),
        options: validOptions,
        allow_multiple_choice: allowMultipleChoice,
      }).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to create poll", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-surface rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-status-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-cell-primary">Create Poll</h2>
          <button onClick={onClose} className="p-2 hover:bg-weak-100 rounded-full text-sub-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto flex-1 custom-scrollbar space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-cell-primary">Question</label>
            <input
              type="text"
              placeholder="Ask a question..."
              className="w-full px-4 py-2.5 bg-main border border-status-border rounded-xl text-sm text-cell-primary focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-cell-primary">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-4 py-2.5 bg-main border border-status-border rounded-xl text-sm text-cell-primary focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required={index < 2}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 text-sub-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            
            {options.length < 10 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="flex items-center gap-2 text-sm text-primary font-medium p-2 hover:bg-primary/5 rounded-lg transition-colors w-full justify-center border border-dashed border-primary/30 mt-2"
              >
                <Plus size={16} /> Add Option
              </button>
            )}
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-weak-50 rounded-xl border border-status-border">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={allowMultipleChoice}
                  onChange={(e) => setAllowMultipleChoice(e.target.checked)}
                />
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  allowMultipleChoice ? 'bg-primary border-primary text-white' : 'border-status-border bg-main'
                }`}>
                  {allowMultipleChoice && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                </div>
              </div>
              <span className="text-sm font-medium text-cell-primary select-none">Allow multiple choice</span>
            </label>
          </div>
        </form>

        <div className="p-4 border-t border-status-border bg-surface flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-sub-500 hover:bg-weak-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !question.trim() || options.filter(o => o.trim()).length < 2}
            className="px-5 py-2.5 text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm"
          >
            {isLoading ? "Creating..." : "Create Poll"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePollModal;
