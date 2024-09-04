const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// future plan: use ai to generate a picture with the text quote 
const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const DreamSchema = new Schema({
    title: String,
    date: Date,
    description: String,
    images: [ImageSchema],
    sentiment: Number,
    isPrivate: Boolean,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // future plan: use ai to recommend tags  
    tag: [String],
    // future plan: use ai to recommend followers  
    like: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, opts);

// Static method to get all unique tags
DreamSchema.statics.getAllTags = async function (userId) {
    return await this.find({ author: userId }).distinct('tag');
};



/*DreamSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
*/
module.exports = mongoose.model('Dream', DreamSchema);