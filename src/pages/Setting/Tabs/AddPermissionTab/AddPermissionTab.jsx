import { useState } from "react";
import { useTranslation } from "react-i18next";
import DefaultButton from "../../../../components/Form/DefaultButton";
import AddPermissionModal from "./AddPermissionModal";
import EditPermissionModal from "./EditPermissionModal";
import { RiArrowRightSLine} from "@remixicon/react";

function AddPermissionTab() {
  const { t } = useTranslation();

  // State for opening/closing modals
  const [isAddPermissionModalOpen, setAddPermissionModalOpen] = useState(false);
  const [isEditPermissionModalOpen, setEditPermissionModalOpen] =
    useState(false);

  // Form fields
  const [permissionName, setPermissionName] = useState("");
  const [category, setCategory] = useState([]);
  const [permissions, setPermissions] = useState([]);

  return (
    <div className="flex justify-center w-full">
      {/* Main Content Section */}
      {/* Main Content Section */}
      <div className="flex justify-center w-full md:p-6 p-3 rounded-2xl bg-white dark:bg-gray-800 lg:w-[40%] md:w-[60%] sm:w-[90%] overflow-auto">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col text-start gap-1">
            <h2 className="text-md  dark:text-gray-200">
              {t("Add Permission")}
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("Define roles, categories, and actions efficiently.")}
            </p>
          </div>

          <div className="w-full border-t-[1px] border-[#E2E4E9] dark:border-gray-700 my-2" />

          {/* Row 1: Projects */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <p className="text-sm dark:text-gray-200">
                {t("Projects")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-[#375DFB] dark:text-primary-200">
                <span className="text-xs">{t("Edit")} </span>
                <RiArrowRightSLine size="15" />
              </button>
            </div>
          </div>

          {/* Row 2: Permission Name */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <p className="text-sm dark:text-gray-200">
                {t("Permission Name")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditPermissionModalOpen(1)}
                className="flex items-center gap-1 text-[#375DFB] dark:text-primary-200"
              >
                <span className="text-xs">{t("Edit")} </span>
                <RiArrowRightSLine size="15" />
              </button>
            </div>
          </div>

          {/* Add Permission Button */}
          <div className="flex justify-center w-full mt-6">
            <DefaultButton
              type="button"
              title={`+ ${t("Add Permission")}`}
              className="w-full py-3 border-[1px] border-[#375DFB] text-[#375DFB] dark:text-primary-200 bg-transparent flex items-center justify-center gap-4 px-[10px]"
              iconLeft="add-line"
              onClick={() => setAddPermissionModalOpen(1)}
            />
          </div>
        </div>
      </div>

      {/* Add Permission Modal */}
      <AddPermissionModal
        isOpen={isAddPermissionModalOpen}
        onClose={() => setAddPermissionModalOpen(false)}
        permissionName={permissionName}
        setPermissionName={setPermissionName}
        category={category}
        setCategory={setCategory}
        permissions={permissions}
        setPermissions={setPermissions}
      />

      {/* Edit Permission Modal */}
      <EditPermissionModal
        isOpen={isEditPermissionModalOpen}
        onClose={() => setEditPermissionModalOpen(false)}
        permissionName={permissionName}
        setPermissionName={setPermissionName}
        category={category}
        setCategory={setCategory}
        permissions={permissions}
        setPermissions={setPermissions}
      />
    </div>
  );
}

export default AddPermissionTab;
