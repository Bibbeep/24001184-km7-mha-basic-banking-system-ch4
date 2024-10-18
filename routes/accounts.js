const express = require('express');
const {
    createAccount,
    getAccounts,
    getAccountById
} = require('../controllers/accounts');

const router = express.Router();

// ○ POST /api/v1/accounts: menambahkan akun baru ke user yang sudah didaftarkan.
// ○ GET /api/v1/accounts: menampilkan daftar akun.
// ○ GET /api/v1/accounts/:id: menampilkan detail akun.

router.post('/', createAccount);
router.get('/', getAccounts);
router.get('/:id', getAccountById);

module.exports = router;