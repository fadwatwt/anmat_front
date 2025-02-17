import DefaultButton from "../../../components/Form/DefaultButton.jsx";
import { useTranslation } from "react-i18next";
import DefaultSelect from "../../../components/Form/DefaultSelect.jsx";

function AttendanceTab() {
  const { t } = useTranslation();

  const minutesBeforeSentOptions = [
    { id: "60", value: `60 ${t("min")}` },
    { id: "40", value: `40 ${t("min")}` },
    { id: "30", value: `30 ${t("min")}` },
    { id: "20", value: `20 ${t("min")}` },
    { id: "10", value: `10 ${t("min")}` },
  ];

  const numberDailyHoursOptions = [
    { id: "8", value: `8 ${t("hours")}` },
    { id: "6", value: `6 ${t("hours")}` },
    { id: "4", value: `4 ${t("hours")}` },
    { id: "2", value: `2 ${t("hours")}` },
    { id: "1", value: `1 ${t("hours")}` },
  ];

  return (
    <div className="flex w-full justify-center">
      <div className="md:p-5 p-4 rounded-2xl bg-white dark:bg-gray-900 transition-all duration-300 lg:w-[39%] shadow-md dark:shadow-lg">
        <div className="w-full md:py-2 flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col text-start gap-1">
              <p className="text-md text-black dark:text-white font-semibold">
                {t("Attendance Preferences")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {t("Configure delay warnings and daily working hours.")}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Minutes before Warning */}
              <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col items-start justify-center w-9/12 gap-1">
                  <p className="text-sm text-black dark:text-white">
                    {t("Minutes before Warning Message Sent")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("Time allowed for lateness before sending a warning.")}
                  </p>
                </div>
                <DefaultSelect
                  classNameContainer="flex-1"
                  classNameSelect="text-black dark:text-white dark:bg-gray-800 dark:border-gray-600 text-sm p-3 transition-all duration-300"
                  onChange={() => {}}
                  options={minutesBeforeSentOptions}
                />
              </div>

              {/* Daily Working Hours */}
              <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col items-start justify-center w-9/12 gap-1">
                  <p className="text-sm text-black dark:text-white">
                    {t("Number of daily working hours for each employee")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("Standard daily working hours per employee.")}
                  </p>
                </div>
                <DefaultSelect
                  classNameContainer="flex-1"
                  classNameSelect="text-black dark:text-white dark:bg-gray-800 dark:border-gray-600 text-sm p-3 transition-all duration-300"
                  onChange={() => {}}
                  options={numberDailyHoursOptions}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
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

export default AttendanceTab;
