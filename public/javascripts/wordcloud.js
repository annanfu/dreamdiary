const { createCanvas } = require('canvas');
const cloud = require('d3-cloud');

function generateWordCloud(words) {
    return new Promise((resolve, reject) => {
        // Count word frequencies
        const wordFrequencies = words.reduce((acc, word) => {
            acc[word] = (acc[word] || 0) + 1;
            return acc;
        }, {});

        // Sort words by frequency
        const sortedWords = Object.entries(wordFrequencies)
            .sort((a, b) => b[1] - a[1]);

        const maxFrequency = sortedWords[0][1];

        // Create word objects with sizes based on frequency
        const wordObjects = sortedWords.map(([text, frequency], index) => ({
            text,
            size: calculateFontSize(frequency, maxFrequency),
            originalRank: index // Keep track of original rank
        }));
        const width = 620;
        const height = 280;

        cloud()
            .size([width, height])
            .canvas(() => createCanvas(1, 1))
            .words(wordObjects)
            .padding(3)
            .rotate(() => Math.floor(Math.random() * 2) * 90)
            .font("Courier New")
            .fontSize(d => d.size)
            .spiral('rectangular') // Change spiral to rectangular for better space utilization
            .on("end", (words) => {
                const canvas = createCanvas(width, height);
                const ctx = canvas.getContext('2d');

                // Set background
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, width, height);

                // Sort words to ensure high-frequency words are drawn last (on top)
                words.sort((a, b) => b.originalRank - a.originalRank);

                words.forEach(word => {
                    ctx.font = `${word.size}px Courier New`;
                    ctx.fillStyle = `hsl(${170 + Math.random() * 150}, 70%, 60%)`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.save();
                    ctx.translate(word.x + width/2, word.y + height/2);
                    ctx.rotate(word.rotate * Math.PI / 180);
                    ctx.fillText(word.text, 0, 0);
                    ctx.restore();
                });

                // Ensure the most frequent word is always included
                const mostFrequentWord = wordObjects[0];
                if (!words.some(w => w.text === mostFrequentWord.text)) {
                    ctx.font = `${mostFrequentWord.size}px Courier New`;
                    ctx.fillStyle = `hsl(${170 + Math.random() * 150}, 70%, 60%)`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(mostFrequentWord.text, width / 2, height /2); // Center of the canvas
                }

                resolve(canvas.toDataURL());
            })
            .start();
    });
}

function calculateFontSize(frequency, maxFrequency) {
    const minSize = 10;
    const maxSize = 80; // Reduced max size to increase chances of fitting
    return minSize + (maxSize - minSize) * Math.sqrt(frequency / maxFrequency);
}

module.exports = generateWordCloud;