const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');
const { body, validationResult } = require('express-validator');

router.use(addUserData);

// validator untuk PUT /api/presensi/:id
const validatePresensiUpdate = [
  // sesuai tugas: validasi waktuCheckIn / waktuCheckOut format tanggal (ISO 8601)
  body('waktuCheckIn')
    .optional()
    .isISO8601()
    .withMessage('waktuCheckIn harus berupa tanggal ISO 8601 yang valid'),
  body('waktuCheckOut')
    .optional()
    .isISO8601()
    .withMessage('waktuCheckOut harus berupa tanggal ISO 8601 yang valid'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);
// pasang validator di sini
router.put('/:id', validatePresensiUpdate, presensiController.updatePresensi);
router.delete('/:id', presensiController.deletePresensi);

module.exports = router;