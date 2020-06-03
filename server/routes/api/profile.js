const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check,validationResult } = require('express-validator/check');
const Profile = require('../../models/Profile');

// @route       GET api/profile/me
// @description Get current users Profile 
// @acsess      Private
router.get('/me', auth, async(req,res) => {
    try{
        const profile = await Profile.findOne({ user: req.user.id }).populate('user',['name','avatar']);
        
        if(!profile) {
            return res.status(400).json({ msg:'There is no profile for this user' })
        }
        res.json(profile)

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route       POST api/profile
// @description create or update user profile 
// @acsess      Private

router.post('/', [auth, [
    check('status','Status is required').not().isEmpty(),
    check('skills','Skills is required').not().isEmpty()
]], async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors:errors.array() });
    }
    
    const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
      } = req.body;

    
      
      //Build Profile Object
      const profileFields = {};
      profileFields.user = req.user.id
      if(company) profileFields.company = company

      


})

module.exports = router;