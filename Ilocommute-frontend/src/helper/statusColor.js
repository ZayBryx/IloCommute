/**
 * Returns the color of the status
 * @param {string} status - The status of the route
 * @returns {string} The color of the status
 */
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'text-green-600';
    case 'empty':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}; 