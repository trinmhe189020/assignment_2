const { openReturn } = require('./returns.js');

try {
    openReturn({ id: 'ORD-999', status: 'cancelled' }, [{ id: 'L1' }]);
    console.log('FAIL: should have rejected cancelled order');
} catch (err) {
    console.log('PASS:', err.message);
}
