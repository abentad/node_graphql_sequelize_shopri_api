const path = require('path');
const { createWriteStream, unlink } = require('fs');
const { v4: uuidv4 } = require('uuid');

const uploadProfileImage = async (file) => {
    let isUploaded = true;
    let newFileName = "";
    const re = /(?:\.([^.]+))?$/;
    const { createReadStream, filename, mimetype, encoding } = await file;
    if(mimetype.startsWith('image/')){
        const ext = re.exec(filename)[1]; 
        const stream = createReadStream();
        newFileName = uuidv4() + `.${ext}`;
        const filelocation = path.join(__dirname, `../images/profile/${newFileName}`);
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
    return { newFileName , isUploaded };
}

const uploadProductImages = async (files) => {
    console.log("files ", files);
    let isUploaded = true;
    let uploadedFileNames = [];
    for(var i = 0; i < files.length; i++){
        const { newFileName, isUploaded } = await productImageUpload(files[i]);
        if(!isUploaded) {
            isUploaded = false;
            break;
        }
        uploadedFileNames.push(newFileName);
    }
    return { uploadedFileNames , isUploaded };
}


const productImageUpload = async (file) => {
    let isUploaded = true;
    let newFileName = "";
    const re = /(?:\.([^.]+))?$/;
    const { createReadStream, filename, mimetype, encoding } = await file;
    if(mimetype.startsWith('image/')){
        const ext = re.exec(filename)[1]; 
        const stream = createReadStream();
        newFileName = uuidv4() + `.${ext}`;
        const filelocation = path.join(__dirname, `../images/products/${newFileName}`);
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
    return { newFileName , isUploaded };
}


const removeProfileImage = (fileName) => {
    let isRemoved = true;
    const filepath = path.join(__dirname, `../images/profile/${fileName}`);
    unlink(filepath, (error)=> {
        if(error) isRemoved = false;
    });
    return isRemoved;
}

module.exports = { uploadProfileImage, uploadProductImages, removeProfileImage };