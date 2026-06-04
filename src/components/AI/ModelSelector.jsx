import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { AI_MODELS, getModelsByProvider } from "@/config/aiModels";

const ModelSelector = ({ selectedModel, onSelectModel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const providers = getModelsByProvider();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentModel = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
      >
        <span className="text-base">{currentModel.icon}</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium hidden sm:inline">{currentModel.name}</span>
        <ChevronDown size={14} className={`text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 py-2 animate-scale-in max-h-[420px] overflow-y-auto">
          {Object.entries(providers).map(([provider, models]) => (
            <div key={provider}>
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {provider}
              </div>
              {models.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    onSelectModel(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-start hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedModel === model.id ? "bg-primary-50 dark:bg-primary-900/20" : ""
                  }`}
                >
                  <span className="text-xl shrink-0">{model.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{model.name}</span>
                      {selectedModel === model.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate block">{model.description}</span>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
