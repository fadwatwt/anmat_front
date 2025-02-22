import React from 'react';
import { FaBell, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const NotificationsPage = () => {
  const notifications = [
    {
      id: 1,
      user: "Ibn Sina",
      avatar: "/path-to-ibn-avatar.jpg",
      avatarImage: true,
      action: "made an action",
      content: "Lorem Ipsum is simply dummy text of the",
      time: "2 hours ago"
    },
    {
      id: 2,
      user: "Sarah Ahmed",
      avatar: "S",
      avatarColor: "bg-blue-100 text-blue-500",
      action: "scheduled a team meeting",
      content: "Sprint Planning",
      additionalText: "on Today at 3:00 PM",
      time: "2 hours ago",
      actionButton: "Join the meeting",
      icon: "calendar"
    },
    {
      id: 3,
      user: "Alpha Team",
      avatar: "A",
      avatarColor: "bg-green-100 text-green-500",
      action: "completed the task",
      content: "Website QA Testing",
      time: "2 weeks ago",
      icon: "check"
    },
    {
      id: 4,
      content: "A new task 'Client Proposal Review' was added by Project Manager Sara Ahmed",
      time: "30 mins ago",
      icon: "bell"
    },
    {
      id: 5,
      content: "Project 'Q4 Marketing Campaign' deadline is in 7 days. Ensure all tasks are completed",
      time: "1 week ago",
      icon: "alert"
    },
    {
      id: 5,
      content: "Project 'Q4 Marketing Campaign' deadline is in 7 days. Ensure all tasks are completed",
      time: "1 week ago",
      icon: "alert"
    },
    {
      id: 6,
      user: "Ali Hassan",
      action: "submitted a leave request for",
      content: "20th Nov - 23rd Nov",
      additionalText: "Pending your approval",
      time: "2 hours ago",
      hasApprovalActions: true,
      icon: "clock"
    }
  ];

  const NotificationIcon = ({ type }) => {
    const iconClasses = "w-5 h-5";
    switch (type) {
      case 'alert':
        return <FaExclamationTriangle className={`${iconClasses} text-amber-500`} />;
      case 'clock':
        return <FaClock className={`${iconClasses} text-gray-400`} />;
      default:
        return <FaBell className={`${iconClasses} text-blue-500`} />;
    }
  };

  return (
    <div className="w-full space-y-2 text-left max-w-6xl mx-auto m-5" >
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-start gap-3 flex-row-reverse">
          <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
            
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm text-gray-900 dark:text-gray-100">
                {notification.user && (
                  <span className="font-medium">{notification.user} </span>
                )}
                <span className="text-gray-600 dark:text-gray-300">
                  {notification.action} 
                </span>
                {notification.content && (
                  <span className="font-medium">'{notification.content}'</span>
                )}
                {notification.additionalText && (
                  <span className="text-gray-600 dark:text-gray-300">
                    . {notification.additionalText}
                  </span>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {notification.time}
                </div>
                
                {notification.actionButton && (
                  <button className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    {notification.actionButton}
                  </button>
                )}
                
                {notification.hasApprovalActions && (
                  <div className="flex space-x-2">
                    {/* add bgcolor */}
                    <button className="px-4 py-1.5 text-red-500 text-sm font-medium hover:text-red-600 transition-colors bg-red-100 ">
                      Reject
                    </button>
                    <button className="px-4 py-1.5 text-green-500 text-sm font-medium hover:text-green-600 transition-colors bg-green-100">
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
            
           
            <div className="flex-shrink-0">
              {notification.avatarImage ? (
                <img 
                  src={notification.avatar} 
                  alt={notification.user} 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                  <NotificationIcon type={notification.icon} />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-center py-4">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default NotificationsPage;
