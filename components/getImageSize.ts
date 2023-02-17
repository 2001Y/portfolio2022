const http = require('http');
const sharp = require('sharp');

async function getImageSize(url) {
    const response = await http.get(url);
    let imageData = Buffer.alloc(0);
    response.on('data', (chunk) => {
        imageData = Buffer.concat([imageData, chunk]);
    });
    await new Promise((resolve, reject) => {
        response.on('end', resolve);
        response.on('error', reject);
    });
    try {
        const metadata = await sharp(imageData).metadata();
        const { width, height } = metadata;
        return { width, height };
    } catch (err) {
        console.error('Error while processing image metadata:', err);
        throw err;
    }
}