const fs = require('fs/promises');
const path = require('path');

const writeToFile = async (filePath, data) => {
    await ensureFilePathExists(filePath);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

const readFromFile = async (filePath) => {
    await ensureFilePathExists(filePath);
    return fs.readFile(filePath, { encoding: 'utf8' });
};

async function ensureFilePathExists(filePath) {
    try {
        await fs.access(filePath);
    } catch (error) {
        const dir = path.dirname(filePath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(filePath, '[]');
    }
}

module.exports = { writeToFile, readFromFile };
