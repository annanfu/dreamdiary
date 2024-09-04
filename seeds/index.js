const mongoose = require('mongoose');
const Dream = require('../models/dream');
const { descriptions, titles, userIds, tags } = require('./seedHelper');

const dbUrl = 'mongodb://localhost:27017/dreamdiary';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const getUniqueTags = (tags, count) => {
    let selectedTags = new Set();
    while (selectedTags.size < count) {
        selectedTags.add(sample(tags));
    }
    return Array.from(selectedTags);
};

const seedDB = async () => {
    await Dream.deleteMany({});
    for (let i = 0; i < 30; i++) {
        const random5 = Math.floor(Math.random() * 5 + 1); // random user id
        const randomTags = getUniqueTags(tags, 2); // Ensure two unique tags
        const dream = new Dream({
            title: sample(titles),
            date: new Date('2024-09-18T00:00:00.000Z'),
            author: sample(userIds),
            description: sample(descriptions),
            images: [
                {
                    url: 'https://res.cloudinary.com/dbgkvs7nz/image/upload/v1725344436/DreamDiary/hckvnftfcqwzflwlyu9f.jpg',
                    filename: 'DreamDiary/hckvnftfcqwzflwlyu9f'
                }
            ],
            sentiment: random5,
            isPrivate: false,
            tag: randomTags
        })
        await dream.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})