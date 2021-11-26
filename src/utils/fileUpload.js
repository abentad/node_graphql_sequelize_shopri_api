const path = require('path');
const { createWriteStream, unlink } = require('fs');
const { v4: uuidv4 } = require('uuid');

const uploadProfileImage = async (file) => {
    let isUploaded = true;
    let filelocation = "";
    const re = /(?:\.([^.]+))?$/;
    const { createReadStream, filename, mimetype, encoding } = await file;
    if(mimetype.startsWith('image/')){
        const ext = re.exec(filename)[1]; 
        const stream = createReadStream();
        const newFileName = uuidv4() + `.${ext}`;
        filelocation = path.join(__dirname, `/../images/profile/${newFileName}`);
        await new Promise((resolve, reject) => {
            const writeStream = createWriteStream(filelocation);
            writeStream.on('finish', resolve);
            writeStream.on('error', (error) => { unlink(filelocation, () => { reject(error); }); });
            stream.on('error', (error) => writeStream.destroy(error));
            stream.pipe(writeStream);
        });
    }else{
        isUploaded = false;
    } 
    return { filelocation , isUploaded };
}

const removeProfileImage = (filePath) => {
    let isRemoved = true;
    unlink(filePath, (error)=> {
        if(error) isRemoved = false;
    });
    return isRemoved;
}

module.exports = { uploadProfileImage, removeProfileImage };