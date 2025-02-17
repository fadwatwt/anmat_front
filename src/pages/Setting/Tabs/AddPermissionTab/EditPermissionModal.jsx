
import Modal from "../../../../components/Modal/Modal";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types"; // Import prop-types

const EditPermissionModal = ({
                               isOpen,
                               onClose,
                               permissionName,
                               setPermissionName,
                               category,
                               setCategory,
                               permissions,
                               setPermissions,
                             }) => {
  const { t } = useTranslation();

  // Handle multi-select changes
  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setCategory(selectedOptions);
  };

  const handlePermissionsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setPermissions(selectedOptions);
  };

  return (
      <Modal
          isOpen={isOpen}
          onClose={onClose}
          title={t("Edit a Permission")}
          isBtns={true}
          btnApplyTitle={t("Save")}
          onClick={() => {
            // Handle Save action here
            onClose();
          }}
      >
        <div className="flex flex-col gap-4 p-4">
          {/* Permission Name */}
          <div className="flex flex-col items-start">
            <label className="mb-1">{t("Permission Name")}</label>
            <input
                type="text"
                placeholder={t("Add a Permission...")}
                value={permissionName}
                onChange={(e) => setPermissionName(e.target.value)}
                className="w-full h-[40px] border-[1px] border-[#E2E4E9] rounded-[10px] px-3 focus:border-[#375DFB] focus:outline-none transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-col items-start">
            <label className="mb-1">{t("Categories")}</label>
            <select
                multiple
                value={category}
                onChange={handleCategoryChange}
                className="w-full h-[40px] border-[1px] border-[#E2E4E9] rounded-[10px] px-3 focus:border-[#375DFB] focus:outline-none"
            >
              <option value="category1">category 1</option>
              <option value="category2">category 2</option>
              <option value="category3">category 3</option>
            </select>
            {category.length === 0 && (
                <em className="text-gray-500 italic mt-1">Select Category...</em>
            )}
          </div>

          {/* Permissions */}
          <div className="flex flex-col items-start">
            <label className="mb-1">{t("Permissions")}</label>
            <select
                multiple
                value={permissions}
                onChange={handlePermissionsChange}
                className="w-full h-[40px] border-[1px] border-[#E2E4E9] rounded-[10px] px-3 focus:border-[#375DFB] focus:outline-none"
            >
              <option value="Permission1">Permission 1</option>
              <option value="Permission2">Permission 2</option>
              <option value="Permission3">Permission 3</option>
            </select>
            {permissions.length === 0 && (
                <em className="text-gray-500 italic mt-1">Select Permissions...</em>
            )}
          </div>
        </div>
      </Modal>
  );
};

export default EditPermissionModal;

EditPermissionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  permissionName: PropTypes.string.isRequired,
  setPermissionName: PropTypes.func.isRequired,
  category: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCategory: PropTypes.func.isRequired,
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  setPermissions: PropTypes.func.isRequired,
};
