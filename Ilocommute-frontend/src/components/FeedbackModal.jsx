import { FaStar, FaTimes } from "react-icons/fa";

const FeedbackModal = ({ isOpen, onClose, feedbackMessages }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">User Feedback Messages</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
          {feedbackMessages.length > 0 ? (
            <div className="space-y-4">
              {feedbackMessages.map((feedback) => (
                <div
                  key={feedback.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`w-4 h-4 ${
                            index < feedback.star
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(feedback.date)}
                    </span>
                  </div>
                  {feedback.message && (
                    <p className="text-gray-700">{feedback.message}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No feedback messages yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
