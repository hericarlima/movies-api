const fs = require("fs"); //manip. de arquivos
const path = require("path");
const uploadConfig = require("../configs/upload");

class DiskStorage {
    async saveFile(file) {
        await fs.promises.rename(
            path.resolve(uploadConfig.TMP_FOLDER, file), //move da tmp
            path.resolve(uploadConfig.UPLOADS_FOLDER, file) //para uploads
        );

        return file;
    }

    async deleteFile(file) {
        const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

        try {
            await fs.promises.stat(filePath); //status
        } catch {
            return;
        }

        await fs.promises.unlink(filePath); //deleta
    }
}

module.exports = DiskStorage;