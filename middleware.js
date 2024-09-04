const { dreamSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Dream = require('./models/dream');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Please sign in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateDream = (req, res, next) => {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Dream object:', JSON.stringify(req.body.dream, null, 2));
    const { error } = dreamSchema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const dream = await Dream.findById(id);
    if (!dream.author.equals(req.user._id)) {
        req.flash('error', 'You are not the author.');
        return res.redirect(`/dreams/${id}`);
    }
    next();
}

/*
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/dreams/${id}`);
    }
    next();
}


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
    
*/