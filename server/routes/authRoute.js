const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require('../controller/authController');

const authenticateMiddleware = require("../middleWare/auth-middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authenticateMiddleware, (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user,
    },
  });
});

module.exports = router;