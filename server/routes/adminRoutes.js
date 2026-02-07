const express = require("express");
const router = express.Router();

const { getDashboardStats, getAllUsers, toggleUserBlockStatus, getAllContacts, updateContactStatus, updateCourseApproval, getAllCourses, getCourseDetails } = require("../controller/AdminController");

router.get("/stats", getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleUserBlockStatus);
router.get('/contacts', getAllContacts);
router.put('/contacts/:id/status', updateContactStatus);
router.get('/courses', getAllCourses);
router.put('/courses/:id/approval',updateCourseApproval);
router.get('/courses/:id', getCourseDetails);

module.exports = router;
