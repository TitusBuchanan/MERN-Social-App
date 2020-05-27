const express = require('express');
const router = express.Router();

// @route       GET api/auth 
// @description Test Route 
// @acsess      Public
router.get('/', (req,res) => res.send('Auth Route'));

module.exports = router;