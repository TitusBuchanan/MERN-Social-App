const express = require('express');
const router = express.Router();

// @route       GET api/users 
// @description Test Route 
// @acsess      Public
router.get('/', (req,res) => res.send('Users Route'));

module.exports = router;


