const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");
const { authenticateToken } = require("../middleware/permissionMiddleware");

// Route check-in dengan upload foto
router.post("/check-in", authenticateToken, presensiController.upload.single('photo'), presensiController.CheckIn);
router.post("/check-out", authenticateToken, presensiController.CheckOut);

router.put("/:id", authenticateToken, presensiController.updatePresensi);

router.delete("/:id", authenticateToken, presensiController.hapusPresensi);

module.exports = router;