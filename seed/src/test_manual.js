const { openReturn } = require('./src/returns.js');

const order = { id: 'ORD-001' };

// Case 1: Tất cả final-clearance → phải throw
try {
  openReturn(order, [
    { id: 'L1', finalClearance: true },
    { id: 'L2', finalClearance: true },
  ]);
  console.log('❌ Case 1 FAILED — should have thrown');
} catch (e) {
  console.log('✅ Case 1 PASSED —', e.message);
}

// Case 2: Mix → phải thành công, chỉ giữ line bình thường
try {
  const result = openReturn(order, [
    { id: 'L1', finalClearance: true },
    { id: 'L2', finalClearance: false },
  ]);
  const passed = result.lines.length === 1 && result.lines[0].id === 'L2';
  console.log(passed ? '✅ Case 2 PASSED' : '❌ Case 2 FAILED', result.lines);
} catch (e) {
  console.log('❌ Case 2 FAILED — should not have thrown:', e.message);
}

// Case 3: Không có final-clearance → thành công như cũ
try {
  const result = openReturn(order, [
    { id: 'L1', finalClearance: false },
    { id: 'L2', finalClearance: false },
  ]);
  const passed = result.lines.length === 2;
  console.log(passed ? '✅ Case 3 PASSED' : '❌ Case 3 FAILED', result.lines);
} catch (e) {
  console.log('❌ Case 3 FAILED — should not have thrown:', e.message);
}

// Case 4: Lines rỗng → vẫn throw như cũ
try {
  openReturn(order, []);
  console.log('❌ Case 4 FAILED — should have thrown');
} catch (e) {
  console.log('✅ Case 4 PASSED —', e.message);
}