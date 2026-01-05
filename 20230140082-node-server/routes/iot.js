const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');

// Endpoint penerima data sensor
// URL: http://localhost:3001/api/iot/data
router.post('/data', iotController.receiveSensorData);

module.exports = router;


router.post('/data', iotController.receiveSensorData);

router.post('/ping', iotController.testConnection);

// routes/iot.js
router.get('/history', iotController.getSensorHistory);


module.exports = router;