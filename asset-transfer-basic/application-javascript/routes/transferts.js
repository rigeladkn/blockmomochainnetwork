const express = require('express');
const router = express.Router();
const transfertController = require('../controllers/transfert.controller');

router.post('/',transfertController.sendTransaction);
router.post('/soldes',transfertController.updateSoldes);


module.exports = router; 