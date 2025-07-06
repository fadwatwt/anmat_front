import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Page from "./Page.jsx";

const AgendaPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const agenda = location.state?.agenda || "No agenda provided.";

  return (
    <Page isTitle={false}>
      <div className="flex flex-col items-center justify-center w-full min-h-[80vh] gap-8 p-8">
        <div className="flex flex-col items-center gap-4 mt-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mt-2">
            Meeting Agenda
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 max-w-xl w-full border border-gray-100 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-200 text-lg whitespace-pre-line">{agenda}</p>
          </div>
          <button
            className="mt-6 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
            onClick={() => navigate("/assistant")}
          >
            Back to Assistant
          </button>
        </div>
      </div>
    </Page>
  );
};

export default AgendaPage; 