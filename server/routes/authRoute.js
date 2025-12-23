const express = require('express');

const {
  registerUser,
  loginUser,
} = require('../controller/authController')

router.post("/register", registerUser);

module.exports = router;