"use client";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal/Modal";
import InputAndLabel from "@/components/Form/InputAndLabel";
import ElementsSelect from "@/components/Form/ElementsSelect";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import {
  useCreateChatMutation,
  useGetChatCandidatesQuery,
} from "@/redux/conversations/conversationsAPI";

const NewConversationModal = ({ isOpen, onClose, onCreate }) => {
  const { t } = useTranslation();
  const [createChat, { isLoading: isCreating }] = useCreateChatMutation();

  const { data: candidatesData, isLoading: isLoadingCandidates } =
    useGetChatCandidatesQuery(undefined, { skip: !isOpen });

  const candidates = candidatesData?.data || candidatesData || [];

  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [groupTitle, setGroupTitle] = useState("");
  const [apiResponse, setApiResponse] = useState({
    isOpen: false,
    status: "",
    message: "",
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedParticipants([]);
      setGroupTitle("");
      setApiResponse({ isOpen: false, status: "", message: "" });
    }
  }, [isOpen]);

  const isGroup = selectedParticipants.length > 1;

  // Pre-fill the group title from the selected participants' names.
  useEffect(() => {
    if (isGroup) {
      setGroupTitle(
        selectedParticipants.map((p) => p.name).filter(Boolean).join(", "),
      );
    }
  }, [isGroup, selectedParticipants]);

  const participantOptions = candidates.map((candidate) => ({
    id: candidate._id,
    name: candidate.name || t("Unknown"),
    element: (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center text-[10px] font-bold shrink-0 bg-blue-100 text-primary">
          {candidate.avatar ? (
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="w-full h-full object-cover"
            />
          ) : (
            (candidate.name || "?").charAt(0).toUpperCase()
          )}
        </div>
        <span>{candidate.name || t("Unknown")}</span>
      </div>
    ),
  }));

  const handleSave = async () => {
    const participantIds = (selectedParticipants || [])
      .map((p) => p.id)
      .filter(Boolean);

    if (participantIds.length === 0) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: t("Please select at least one participant"),
      });
      return;
    }

    if (isGroup && !groupTitle.trim()) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: t("Please enter a group title"),
      });
      return;
    }

    try {
      const directTitle = selectedParticipants[0]?.name;
      const result = await createChat({
        title: isGroup ? groupTitle.trim() : directTitle || undefined,
        participants_ids: participantIds,
        is_group: isGroup,
      }).unwrap();

      const chatObject = result?.data || result;

      // Ensure the active chat window shows a name right away even when the
      // backend returns an existing (already created) direct chat.
      if (chatObject && !chatObject.title && !isGroup && directTitle) {
        chatObject.title = directTitle;
      }

      onClose();
      if (onCreate && chatObject?._id) {
        onCreate(chatObject);
      }
    } catch (err) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: err?.data?.message || t("Failed to create conversation"),
      });
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t("New Conversation")}
        isBtns={true}
        btnApplyTitle={isCreating ? t("Creating...") : t("Start Conversation")}
        onClick={handleSave}
        className="lg:w-[40%] md:w-9/12 sm:w-11/12 w-full p-6"
      >
        <div className="flex flex-col gap-4">
          <ElementsSelect
            title={t("Participants")}
            options={participantOptions}
            placeholder={
              isLoadingCandidates ? t("Loading...") : t("Select Participants")
            }
            onChange={setSelectedParticipants}
            isMultiple={true}
          />

          {isGroup && (
            <InputAndLabel
              title={t("Group Title")}
              isRequired={true}
              name="groupTitle"
              value={groupTitle}
              onChange={(e) => setGroupTitle(e.target.value)}
              placeholder={t("Enter group title")}
            />
          )}

          <div className="flex gap-2 items-start bg-blue-50 p-2 rounded-md dark:bg-gray-700">
            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
            <p className="text-xs text-gray-500 dark:text-gray-300">
              {t(
                "Select one member for a direct chat or multiple members to start a group conversation.",
              )}
            </p>
          </div>
        </div>
      </Modal>

      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={() => setApiResponse({ ...apiResponse, isOpen: false })}
      />
    </>
  );
};

NewConversationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func,
};

export default NewConversationModal;
