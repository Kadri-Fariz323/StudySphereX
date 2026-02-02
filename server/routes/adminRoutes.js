const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controller/AdminController");
const authenticateMiddleware = require("../middleWare/auth-middleware");

router.get("/stats", getDashboardStats);

module.exports = router;
