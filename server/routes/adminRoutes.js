const express = require("express");
const router = express.Router();

const { getDashboardStats, getAllUsers, toggleUserBlockStatus } = require("../controller/AdminController");
const authenticateMiddleware = require("../middleWare/auth-middleware");

router.get("/stats", getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleUserBlockStatus);

module.exports = router;
