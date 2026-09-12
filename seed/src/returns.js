// Returns handling for OrderDesk.
//
// A return covers one or more lines of an order. A refund against it must be
// approved by a refunds clerk before any money moves.

/**
 * Open a return request against an order.
 *
 * @param {object} order  the order being returned against
 * @param {Array}  lines  the order lines the customer is sending back
 * @returns {object} the new return request
 */

function openReturn(order, lines, user) {
  // Commit 1: Kiểm tra trạng thái hoạt động của người dùng
  if (!user) {
    throw new Error('user is required');
  }

  // Commit 2: Kiểm tra role của user
  const allowedRoles = ['customer_service', 'operations'];
  if (!allowedRoles.includes(user.role)) {
    throw new Error('unauthorized user role');
  }

  // Lọc ra những lines KHÔNG phải final-clearance
  const returnableLines = lines.filter(line => !line.finalClearance);

  // Nếu TẤT CẢ đều là final-clearance → không có gì để return
  if (returnableLines.length === 0) {
    throw new Error(
      'a return cannot be opened: all lines are final-clearance items'
    );
  }

  return {
    orderId: order.id, lines,
    raisedAt: new Date().toISOString(),
    approvedBy: null,
    approvedAt: null,
  };
}

function approve(returnRequest, clerkId, reason) {
  if (!reason) {
    throw new Error('a refund approval must carry a reason');
  }

  return {
    ...returnRequest,
    approvedBy: clerkId,
    approvedAt: new Date().toISOString(),
    reason,
  };
}

module.exports = { openReturn, approve };
