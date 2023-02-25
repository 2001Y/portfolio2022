import { Client } from 'figma-js';

export default async function fetchFigma(fileId, pageName) {

    const client = await Client({
        personalAccessToken: process.env.FIGMA_ACCESS_TOKEN,
    });

    const fileResponse = await client.file(fileId);
    const file = fileResponse.data;

    const page = file.document.children.find((node) => node.name === pageName);

    const frames = page.children.filter((node) => node.type === 'FRAME');

    const imagesPromises = frames.map(async (frame) => {
        const imageResponse = await client.fileImages(fileId, {
            format: 'jpg',
            ids: [frame.id],
        });
        const image = imageResponse.data.images;

        const url = Object.values(image)[0];

        return {
            name: frame.name,
            image: url
        };
    });

    const images = await Promise.all(imagesPromises);

    return images;
}