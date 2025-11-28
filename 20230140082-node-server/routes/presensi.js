const express = require('express');
const router = express.Router();
const { Presensi } = require('../models');
const { authenticateToken } = require('../middleware/permissionMiddleware');

// Check-in: create presensi with userId from token
router.post('/check-in', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const presensi = await Presensi.create({
      userId,
      checkIn: new Date(),
      checkOut: null
    });
    return res.status(201).json({ message: 'Check-in berhasil', data: presensi });
  } catch (err) {
    return res.status(500).json({ message: 'Check-in gagal', error: err.message });
  }
});

// Check-out: find last presensi for user with null checkOut and set checkOut
router.post('/check-out', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const last = await Presensi.findOne({
      where: { userId, checkOut: null },
      order: [['checkIn', 'DESC']]
    });

    if (!last) return res.status(400).json({ message: 'Tidak ditemukan presensi terbuka untuk user ini' });

    last.checkOut = new Date();
    await last.save();
    return res.json({ message: 'Check-out berhasil', data: last });
  } catch (err) {
    return res.status(500).json({ message: 'Check-out gagal', error: err.message });
  }
});

module.exports = router;