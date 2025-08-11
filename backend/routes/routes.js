const express = require('express');
const router = express.Router();
const verify = require('../middleware/auth')
const { login } = require('../controllers/auth/login');
const { register } = require('../controllers/auth/register');
const {createpost, getpost, likepost, comment, deletepost, deletecomment} = require('../controllers/post')
const {getprofile, uploadimage} = require('../controllers/profile')

router.post('/login', login);
router.post('/register', register);

router.get('/feed', verify, getpost);
router.post('/createpost', verify, createpost);
router.post('/:postId/like', verify, likepost);
router.post('/:postId/comment', verify, comment);
router.delete('/:postId', verify, deletepost);
router.delete('/:postId/comment/:commentId', verify, deletecomment);

router.get("/profile", verify, getprofile);
router.put("/profile-image", verify, uploadimage);

module.exports = router;