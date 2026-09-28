"use client";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { BarChart2, CheckCircle2 } from "lucide-react";
import { useVotePollMutation, useClosePollMutation } from "@/redux/conversations/conversationsAPI";
import { useSelector } from "react-redux";
import { selectUserId } from "@/redux/auth/authSlice";

const PollBubble = ({ message }) => {
  const { t } = useTranslation();
  const currentUserId = useSelector(selectUserId);
  const [votePoll, { isLoading: isVoting }] = useVotePollMutation();
  const [closePoll, { isLoading: isClosing }] = useClosePollMutation();

  const poll = message.poll;
  if (!poll) return null;

  const totalVotes = poll.options?.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0) || 0;
  
  // Find which options the current user voted for
  const userVotedOptionIds = poll.options
    ?.filter(opt => opt.votes?.includes(currentUserId))
    .map(opt => opt._id) || [];
  
  const isCreator = message.sent_by?._id === currentUserId || message.sent_by === currentUserId;

  const handleVote = async (optionId) => {
    if (poll.is_closed || isVoting) return;

    let newOptionIds = [];
    if (poll.allow_multiple_choice) {
      if (userVotedOptionIds.includes(optionId)) {
        newOptionIds = userVotedOptionIds.filter(id => id !== optionId);
      } else {
        newOptionIds = [...userVotedOptionIds, optionId];
      }
    } else {
      // If single choice and clicking the same, maybe unvote or just do nothing. Let's send the new choice.
      newOptionIds = [optionId];
    }

    try {
      await votePoll({ pollId: poll._id, option_ids: newOptionIds }).unwrap();
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  const handleClose = async () => {
    if (isClosing) return;
    try {
      await closePoll(poll._id).unwrap();
    } catch (err) {
      console.error("Close poll failed", err);
    }
  };

  return (
    <div className="chat-poll mt-2 w-64 max-w-full rounded-xl border overflow-hidden">
      <div className="chat-poll-header p-3 border-b flex items-start gap-2">
        <BarChart2 size={16} />
        <div className="flex-1">
          <h4 className="font-bold text-sm leading-tight">{poll.question}</h4>
          <span className="chat-poll-meta text-[10px]">
            {poll.is_closed ? t("Poll closed") : poll.allow_multiple_choice ? t("Multiple choice") : t("Single choice")} • {totalVotes} {t("votes")}
          </span>
        </div>
      </div>
      
      <div className="p-2 flex flex-col gap-1.5">
        {poll.options?.map((option) => {
          const voteCount = option.votes?.length || 0;
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const isSelected = userVotedOptionIds.includes(option._id);

          return (
            <button
              key={option._id}
              onClick={() => handleVote(option._id)}
              disabled={poll.is_closed}
              className={`chat-poll-option relative flex items-center justify-between p-2 rounded-lg text-xs overflow-hidden transition-all border ${isSelected ? 'chat-poll-option-selected' : ''} ${poll.is_closed ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {/* Progress bar background */}
              <div 
                className={`absolute left-0 top-0 bottom-0 chat-poll-progress ${isSelected ? 'chat-poll-progress-selected' : ''} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              ></div>
              
              <div className="relative z-10 flex items-center gap-2 w-full">
                <div className={`w-3 h-3 rounded-full border flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'chat-poll-check-selected' : 'chat-poll-check'
                }`}>
                  {isSelected && <CheckCircle2 size={10} />}
                </div>
                <span className="flex-1 text-left truncate font-medium">{option.text}</span>
                <span className="chat-poll-meta font-semibold">{percentage}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {isCreator && !poll.is_closed && (
        <div className="px-2 pb-2">
          <button 
            onClick={handleClose}
            className="chat-button-primary w-full py-1.5 text-xs rounded-lg transition-colors font-medium"
          >
            {t("Close Poll")}
          </button>
        </div>
      )}
    </div>
  );
};

export default PollBubble;

PollBubble.propTypes = {
  message: PropTypes.shape({
    sent_by: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ _id: PropTypes.string }),
    ]),
    poll: PropTypes.shape({
      _id: PropTypes.string,
      question: PropTypes.string,
      is_closed: PropTypes.bool,
      allow_multiple_choice: PropTypes.bool,
      options: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        text: PropTypes.string,
        votes: PropTypes.arrayOf(PropTypes.string),
      })),
    }),
  }).isRequired,
};
