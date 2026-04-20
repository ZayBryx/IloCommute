/**
 * Adjusts the order numbers for inbound and outbound routes
 * Makes outbound routes start from 0 and inbound routes continue from the last outbound order
 * @param {Array} outbound - Array of outbound routes
 * @param {Array} inbound - Array of inbound routes
 * @returns {Array} Combined array with adjusted orders
 */
export const adjustRouteOrders = (outbound = [], inbound = []) => {
  // Start with outbound routes
  const adjustedOutbound = outbound.map((route, index) => ({
    ...route,
    order: index,
    isOutBound: true,
  }));

  // Get the last order number from outbound
  const lastOutboundOrder =
    adjustedOutbound.length > 0
      ? Math.max(...adjustedOutbound.map((r) => r.order))
      : -1;

  // Continue order numbers for inbound routes
  const adjustedInbound = inbound.map((route, index) => ({
    ...route,
    order: lastOutboundOrder + 1 + index,
    isOutBound: false,
  }));

  // Combine both arrays
  return [...adjustedOutbound, ...adjustedInbound];
};

/**
 * Example usage:
 * const outboundRoutes = [
 *   { name: "Stop 1", order: 5 },
 *   { name: "Stop 2", order: 2 }
 * ];
 *
 * const inboundRoutes = [
 *   { name: "Stop 3", order: 1 },
 *   { name: "Stop 4", order: 8 }
 * ];
 *
 * const adjusted = adjustRouteOrders(outboundRoutes, inboundRoutes);
 * Result:
 * [
 *   { name: "Stop 1", order: 0, isOutBound: true },
 *   { name: "Stop 2", order: 1, isOutBound: true },
 *   { name: "Stop 3", order: 2, isOutBound: false },
 *   { name: "Stop 4", order: 3, isOutBound: false }
 * ]
 */
