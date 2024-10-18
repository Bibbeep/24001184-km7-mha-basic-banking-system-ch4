const express = require('express');
const {
    createUser,
    getUsers,
    getUserById
} = require('../controllers/users');

const router = express.Router();

// ○ POST /api/v1/users: menambahkan user baru beserta dengan profilnya.
// ○ GET /api/v1/users: menampilkan daftar users.
// ○ GET /api/v1/users/:userId: menampilkan detail informasi user (tampilkan juga profilnya).

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);

module.exports = router;