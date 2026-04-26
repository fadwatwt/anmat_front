import PropTypes from "prop-types";
import { useState } from "react";
import 'dayjs/locale/ar';
import {translateTime} from "@/functions/Days.js";
import { RiDeleteBinLine, RiEdit2Line } from "react-icons/ri";
import { ImSpinner2 } from "react-icons/im";
import CommentInput from "@/components/CommentInput";

function TaskComments({comments, currentUserId, authUserType, onDeleteComment, onEditComment, loadingComments = {}}) {
    const [editingCommentId, setEditingCommentId] = useState(null);
    return (

        <div className={"max-h-64 h-auto flex flex-col w-full overflow-hidden overflow-y-auto custom-scroll"}>
            {
                comments?.map(( comment ,index) => {
                    const creatorId = (comment.created_by?._id || comment.created_by)?.toString();
                    const currentIdStr = currentUserId?.toString();
                    const canDelete = authUserType === "Subscriber" || creatorId === currentIdStr;
                    const canEdit = creatorId === currentIdStr;
                    
                    return (
                    <div className={"flex gap-2 justify-start items-start h-auto mt-2"} key={index}>
                        <div className={"flex flex-col justify-start items-center h-full"}>
                            <div className={"min-w-8"}>
                                <img
                                    src={comment.created_by?.avatar || "https://ui-avatars.com/api/?name=" + (comment.created_by?.name || "U")}
                                    alt={comment.created_by?.name}
                                    className="w-8 h-8 object-cover rounded-full"
                                />
                            </div>
                            {index < comments.length - 1 && (
                                <div className={"w-[1px] bg-gray-200 dark:bg-soft-500 h-full min-h-[30px]"}></div>
                            )}
                        </div>
                        <div className={"flex flex-col items-start gap-2 pb-4 w-full"}>
                            <div className={"flex gap-1 justify-between items-baseline w-full pr-2"}>
                                <div className={"flex gap-2 items-baseline"}>
                                    <p className={"text-sm dark:text-gray-200 font-semibold"}>{comment.created_by?.name || "User"}</p>
                                    <span className={"text-[11px] text-soft-400 dark:text-soft-200"}>{new Date(comment.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {canEdit && (
                                        <button 
                                            onClick={() => setEditingCommentId(comment._id)} 
                                            className="text-primary-base hover:text-primary-600 transition"
                                            title="Edit Comment"
                                            disabled={loadingComments[comment._id]}
                                        >
                                            <RiEdit2Line size={14} />
                                        </button>
                                    )}
                                    {canDelete && (
                                        <button 
                                            onClick={() => onDeleteComment(comment._id)} 
                                            className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                                            title="Delete Comment"
                                            disabled={loadingComments[comment._id]}
                                        >
                                            {loadingComments[comment._id] === 'deleting' ? (
                                                <ImSpinner2 className="animate-spin" size={14} />
                                            ) : (
                                                <RiDeleteBinLine size={14} />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {editingCommentId === comment._id ? (
                                <CommentInput 
                                    initialValue={comment.text}
                                    onCancel={() => setEditingCommentId(null)}
                                    onSend={(newText) => {
                                        onEditComment(comment._id, newText);
                                        setEditingCommentId(null);
                                    }}
                                    isLoading={loadingComments[comment._id] === 'editing'}
                                />
                            ) : (
                                <p className={"max-w-full text-wrap text-start text-xs text-sub-500 dark:text-sub-300"}>
                                    {comment.text}
                                </p>
                            )}
                            <div className={"images flex gap-1 justify-start"}>
                                {
                                    comment.images?.map((image, idx) => (
                                        <img className={"w-[41.48px] h-[28px] rounded"} key={idx} src={image}
                                             alt={"image comment"}/>
                                    ))
                                }
                            </div>
                        </div>

                    </div>
                )})
            }
        </div>
    );
}

TaskComments.propTypes = {
    comments: PropTypes.array.isRequired
}

export default TaskComments;