const Dream = require('../models/dream');
const { cloudinary } = require("../cloudinary");
const generateWordCloud = require('../public/javascripts/wordcloud');

module.exports.index = async (req, res) => {
    const dreams = await Dream.find({}).populate('author');
    res.render('dreams/index', { dreams })
}


module.exports.myDreams = async (req, res) => {
    try {
        // Find dreams that belong to the logged-in user
        const dreams = await Dream.find({ author: req.user._id }).populate('author');

        if (dreams.length === 0) {
            // No dreams, render the page with a blank image or no word cloud
            return res.render('dreams/mydream', { dreams, wordCloudImage: null, tags: [] });
        }

        const concatDescriptions = dreams.map(dream => dream.description).join(' ');
        const tags = await Dream.getAllTags(req.user._id);
        const words = concatDescriptions.split(/\s+/).filter(word => word.trim().length > 0);
        const wordCloudImage = await generateWordCloud(words);

        res.render('dreams/mydream', { dreams, wordCloudImage, tags });
    } catch (error) {
        console.error('Error generating word cloud:', error);
        res.status(500).send('Error generating word cloud');
    }
};

module.exports.renderNewForm = (req, res) => {
    res.render('dreams/new');
}

/*
module.exports.getAllTags = async (req, res) => {
    const tags = await Dream.getAllTags(req.user._id);
    res.json(tags);
}
*/

module.exports.getTagSuggestions = async (req, res) => {
    const query = req.query.value.toLowerCase();
    const allTags = await Dream.getAllTags(req.user._id);
    const suggestions = allTags.filter(tag =>
        tag.toLowerCase().includes(query)
    );
    res.json(suggestions);
}

module.exports.createDream = async (req, res, next) => {
    const dream = new Dream(req.body.dream);
    dream.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    dream.author = req.user._id;
    await dream.save();
    console.log(dream);
    req.flash('success', 'Dream has been recorded.');
    res.redirect(`/dreams/${dream._id}`)
}


module.exports.toggleLike = async (req, res) => {
    const { id } = req.params;
    const dream = await Dream.findById(id);
    const userId = req.user._id;

    const index = dream.like.indexOf(userId);
    if (index === -1) {
        // User hasn't liked the dream yet, so add the like
        dream.like.push(userId);
    } else {
        // User has already liked the dream, so remove the like
        dream.like.splice(index, 1);
    }
    await dream.save();
    res.json({ liked: index === -1, likeCount: dream.like.length });
};

module.exports.showDream = async (req, res) => {
    const dream = await Dream.findById(req.params.id).populate('author');
    if (!dream) {
        req.flash('error', 'Cannot find that dream!');
        return res.redirect('/dreams');
    }
    res.render('dreams/show', { dream, currentUser: req.user || null });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const dream = await Dream.findById(id)
    if (!dream) {
        req.flash('error', 'Cannot find that dream!');
        return res.redirect('/dreams');
    }
    res.render('dreams/edit', { dream });
}

module.exports.updateDream = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const dream = await Dream.findByIdAndUpdate(id, { ...req.body.dream });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    dream.images.push(...imgs);
    await dream.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await dream.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Updated dream.');
    res.redirect(`/dreams/${dream._id}`)
}

module.exports.deleteDream = async (req, res) => {
    const { id } = req.params;
    await Dream.findByIdAndDelete(id);
    req.flash('success', 'Dream has been deleted.');
    res.redirect('/dreams/mydream');
}