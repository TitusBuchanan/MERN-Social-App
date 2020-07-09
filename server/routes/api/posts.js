const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');


// @route       POST api/posts 
// @description Create a post
// @access      Private
router.post('/',[auth,[
    check('text','Text is required').not().isEmpty()
]], async (req,res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post ({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();

        res.json(post)
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
    
    
    
    
}
);

// @route       GET api/posts 
// @description Get All Posts
// @access      Private

router.get('/', auth, async (req,res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts)
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route       GET api/posts/:id 
// @description Get post by id
// @access      Private

router.get('/:id', auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if(!post){
            return res.status(404).json({ msg:'Post Not Found' })
        }

        res.json(post)
    } catch (error) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg:'Post Not Found' })
        }
        res.status(500).send('Server Error');
    }
});

// @route       DELETE api/posts /:id
// @description Delete a post
// @access      Private

router.delete('/:id', auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ msg:'Post Not FOund' });
        }
        
        //Check on the user 
        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg:'User Not Authorized' });
        }

        await post.remove();

        res.json({ msg:'Post removed' })
    } catch (error) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg:'Post Not Found' })
        }
        res.status(500).send('Server Error');
    }
});



// @route       Put api/posts /like/:id
// @description Like a Post
// @access      Private

router.put('/like/:id', auth, async(req,res)=> {
    try {
        const post = await Post.findById(req.params.id);

        //Check if post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.json(400).json({ msg: 'Post Already Liked' })
        }
        post.likes.unshift({ user: req.user.id })

        await post.save();

        res.json(post.likes);
        
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;