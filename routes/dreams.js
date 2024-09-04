const express = require('express');
const router = express.Router();
const dreams = require('../controllers/dreams');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateDream } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Dream = require('../models/dream');

router.route('/')
    .get(catchAsync(dreams.index))
    .post(isLoggedIn, upload.array('image'), validateDream, catchAsync(dreams.createDream))

// Route for user's own dreams
router.get('/mydream', isLoggedIn, catchAsync(dreams.myDreams));

router.get('/tags', isLoggedIn, catchAsync(dreams.getAllTags));
router.get('/tag-suggestions', isLoggedIn, dreams.getTagSuggestions);

router.get('/new', isLoggedIn, dreams.renderNewForm)

router.route('/:id')
    .get(catchAsync(dreams.showDream))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateDream, catchAsync(dreams.updateDream))
    .delete(isLoggedIn, isAuthor, catchAsync(dreams.deleteDream));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(dreams.renderEditForm))

// Route for liking a dream
router.post('/:id/like', isLoggedIn, catchAsync(dreams.toggleLike));

module.exports = router;