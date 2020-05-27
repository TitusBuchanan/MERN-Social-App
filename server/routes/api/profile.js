const express = require('express');
const router = express.Router();

// @route       GET api/profile 
// @description Test Route 
// @acsess      Public
router.get('/', (req,res) => res.send('Profile Route'));

module.exports = router;