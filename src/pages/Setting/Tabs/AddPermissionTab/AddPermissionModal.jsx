import {
  Chip,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { FaChevronDown } from "react-icons/fa6";
import Modal from "../../../../components/Modal/Modal";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types"; // Import prop-types

const AddPermissionModal = ({
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
    const selectedOptions = e.target.value;
    setCategory(selectedOptions);
  };

  const handlePermissionsChange = (e) => {
    const selectedOptions = e.target.value;
    setPermissions(selectedOptions);
  };

  // Styles
  const selectStyles = {
    width: "100%",
    height: "40px",
    borderRadius: "10px",
    borderColor: "#375DFB",
    "&:hover": {
      borderColor: "#375DFB",
    },
    "&.Mui-focused": {
      borderColor: "#375DFB",
    },
    "& .MuiSelect-icon": {
      right: "12px",
      color: "#0A0D14",
    },
  };

  const chipStyles = {
    fontFamily: "Almarai",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "16px",
    height: "20px",
    borderRadius: "999px",
    backgroundColor: "#EBF1FF",
    border: "1px solid #E2E4E9",
    padding: "2px 8px",
    margin: "2px",
    "& .MuiChip-label": {
      padding: 0,
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("Add a Permission")}
      isBtns={true}
      btnApplyTitle={t("Add")}
      onClick={() => {
        // Handle Add action here
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
          <FormControl fullWidth>
            <Select
              multiple
              size="small"
              value={category}
              onChange={handleCategoryChange}
              input={<OutlinedInput />}
              IconComponent={FaChevronDown}
              sx={{
                ...selectStyles,
                textAlign: "left", // Ensure text inside Select is left-aligned
              }}
              displayEmpty // This ensures the placeholder is visible when no value is selected
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return (
                    <em
                      style={{
                        color: "#aaa", // Light gray color to resemble placeholder
                        fontStyle: "italic", // Italicize to indicate it's a placeholder
                        textAlign: "left", // Align placeholder text to the left
                        width: "100%", // Ensure the placeholder takes up the full width
                      }}
                    >
                      Select Category...
                    </em>
                  );
                }
                return (
                  <div
                    style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}
                  >
                    {selected.map((value) => (
                      <Chip key={value} label={value} sx={chipStyles} />
                    ))}
                  </div>
                );
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 200,
                    "& .MuiMenuItem-root": {
                      fontFamily: "Almarai",
                      fontSize: "14px",
                    },
                  },
                },
              }}
            >
              <MenuItem value="category1">category 1</MenuItem>
              <MenuItem value="category2">category 2</MenuItem>
              <MenuItem value="category3">category 3</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Permissions */}
        <div className="flex flex-col items-start">
          <label className="mb-1">{t("Permissions")}</label>
          <FormControl fullWidth>
            <Select
              multiple
              size="small"
              value={permissions}
              onChange={handlePermissionsChange}
              input={<OutlinedInput />}
              IconComponent={FaChevronDown}
              sx={{
                ...selectStyles,
                textAlign: "left", // Align text to the left
              }}
              displayEmpty // Ensures placeholder is visible when no value is selected
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return (
                    <em
                      style={{
                        color: "#aaa", // Light gray color to resemble placeholder
                        fontStyle: "italic", // Italicized text to indicate it's a placeholder
                        textAlign: "left", // Left-align the placeholder text
                        width: "100%", // Ensure the placeholder spans the full width
                      }}
                    >
                      Select Permissions...
                    </em>
                  );
                }
                return (
                  <div
                    style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}
                  >
                    {selected.map((value) => (
                      <Chip key={value} label={value} sx={chipStyles} />
                    ))}
                  </div>
                );
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 200,
                    "& .MuiMenuItem-root": {
                      fontFamily: "Almarai",
                      fontSize: "14px",
                    },
                  },
                },
              }}
            >
              <MenuItem value="Permission1">Permission 1</MenuItem>
              <MenuItem value="Permission2">Permission 2</MenuItem>
              <MenuItem value="Permission3">Permission 3</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </Modal>
  );
};

export default AddPermissionModal;

AddPermissionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  permissionName: PropTypes.string.isRequired,
  setPermissionName: PropTypes.func.isRequired,
  category: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCategory: PropTypes.func.isRequired,
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  setPermissions: PropTypes.func.isRequired,
};
