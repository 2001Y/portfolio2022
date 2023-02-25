import { Client } from 'figma-js';

export default async function fetchFigma(fileId: string, pageName: string): Promise<any> {
    const client = await Client({
        personalAccessToken: process.env.FIGMA_ACCESS_TOKEN,
    });

    const fileResponse = await client.file(fileId);
    const file = fileResponse.data;

    const page = file.document.children.find((node: any) => node.name === pageName);
    const frames = (page as any).children.filter((node: any) => node.type === 'FRAME');

    frames.sort((a, b) => {
        // xプロパティで比較
        if (a.absoluteBoundingBox.x !== b.absoluteBoundingBox.x) {
            return a.absoluteBoundingBox.x - b.absoluteBoundingBox.x;
        }
        // xプロパティが同じ場合は、yプロパティで比較
        return a.absoluteBoundingBox.y - b.absoluteBoundingBox.y;
    });

    const imageIds = frames.map((frame: any) => frame.id);
    const batchSize = 25;
    const imageBatches = [];

    for (let i = 0; i < imageIds.length; i += batchSize) {
        const batch = imageIds.slice(i, i + batchSize);
        imageBatches.push(batch);
    }

    const imagesPromises = imageBatches.map(async (batch: string[]) => {
        const imageResponse = await client.fileImages(fileId, {
            format: 'jpg',
            ids: batch,
        });

        const images = imageResponse.data.images;

        return batch.map((id: string) => ({
            name: frames.find((frame: any) => frame.id === id).name,
            image: images[id],
        }));
    });

    const imageArrays = await Promise.all(imagesPromises);

    const images = imageArrays.flat();

    return images;
}