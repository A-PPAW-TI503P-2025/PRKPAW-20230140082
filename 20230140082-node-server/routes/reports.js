const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { authenticateToken, isAdmin } = require("../middleware/permissionMiddleware");

router.get("/daily", authenticateToken, isAdmin, reportController.daily);

module.exports = router;
