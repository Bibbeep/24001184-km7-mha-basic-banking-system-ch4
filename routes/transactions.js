const express = require('express');
const {
    createTransaction,
    getTransactions,
    getTransactionById
} = require('../controllers/transactions');

const router = express.Router();

// ○ POST /api/v1/transactions: mengirimkan uang dari 1 akun ke akun lain (tentukan request body nya).
// ○ GET /api/v1/transactions: menampilkan daftar transaksi.
// ○ GET /api/v1/transactions/:id: menampilkan detail transaksi (tampilkan juga pengirim dan penerimanya).

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/:id', getTransactionById);

module.exports = router;