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
function openReturn(order, lines) {
  if (lines.length === 0) {
    throw new Error('a return must cover at least one line');
  }
  // Story D (ODK-170): Refuse returns against cancelled orders
  if (order.status === 'cancelled') {
    throw new Error('cannot open a return against a cancelled order');
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
    orderId: order.id,
    lines: returnableLines,   // chỉ giữ lines bình thường
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
