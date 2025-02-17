import DefaultButton from "../../../components/Form/DefaultButton.jsx";
import { useTranslation } from "react-i18next";
import DefaultSelect from "../../../components/Form/DefaultSelect.jsx";

function ConversationsTab() {
  const { t } = useTranslation();

  const whoCreateGroupChatOptions = [
    { id: "admins", value: `${t("Admins")}` },
    { id: "employees", value: `${t("Admins&Employees")}` },
  ];

  const whoCreateMeetingOptions = [
    { id: "employees", value: `${t("Admins&Employees")}` },
    { id: "admins", value: `${t("Admins")}` },
  ];

  return (
    <div className="flex w-full justify-center">
      <div className="md:p-5 p-4 rounded-2xl bg-white dark:bg-gray-900 lg:w-[39%] transition-all duration-300 shadow-md dark:shadow-lg">
        <div className="w-full md:py-2 flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col text-start gap-1">
              <p className="text-md text-black dark:text-white font-semibold">
                {t("Conversations/Chat")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {t("Manage chat and meeting permissions.")}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {/* Group Chat Permission */}
              <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col items-start justify-center w-[70%] gap-1">
                  <p className="text-sm text-black dark:text-white">
                    {t("Who can create a group chat?")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t(
                      "Specify which roles are allowed to initiate group chats."
                    )}
                  </p>
                </div>
                <DefaultSelect
                  classNameContainer="flex-1"
                  classNameSelect="text-black dark:text-white dark:bg-gray-800 dark:border-gray-600 text-sm p-3 transition-all duration-300"
                  onChange={() => {}}
                  options={whoCreateGroupChatOptions}
                />
              </div>
              {/* Meeting Permission */}
              <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col items-start justify-center w-[70%] gap-1">
                  <p className="text-sm text-black dark:text-white">
                    {t("Who can create a meeting?")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t(
                      "Define which roles have permission to schedule meetings."
                    )}
                  </p>
                </div>
                <DefaultSelect
                  classNameContainer="flex-1"
                  classNameSelect="text-black dark:text-white dark:bg-gray-800 dark:border-gray-600 text-sm p-3 transition-all duration-300"
                  onChange={() => {}}
                  options={whoCreateMeetingOptions}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <DefaultButton
              type="button"
              title={t("Cancel")}
              className="font-medium dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 transition-all duration-300"
            />
            <DefaultButton
              type="button"
              onClick={() => {}}
              title={t("Apply Changes")}
              className="bg-primary-500 dark:bg-primary-300 text-white dark:text-black font-medium transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConversationsTab;
