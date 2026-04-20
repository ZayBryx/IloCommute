/**
 * Formats the last change time
 * @param {Object} lastChange - The last change object
 * @returns {string} The formatted last change time
 */
export const formatLastChange = (lastChange) => {
  if (!lastChange?.time) return 'No changes recorded';

  const date = new Date(lastChange.time);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  let timeAgo;
  if (diffInSeconds < 60) {
    timeAgo = 'just now';
  } else if (diffInMinutes < 60) {
    timeAgo = `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    timeAgo = `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    timeAgo = `${diffInDays}d ago`;
  } else {
    timeAgo = date.toLocaleDateString();
  }

  return `${lastChange.message || 'No message'} by ${lastChange.changedBy || 'Unknown'} • ${timeAgo}`;
}; 