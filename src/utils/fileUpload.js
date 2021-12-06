const path = require('path');
const { createWriteStream, unlink } = require('fs');
const { v4: uuidv4 } = require('uuid');
const { encode } = require('blurhash');

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
    let uploaded = true;
    let areImageFiles = true;
    let uploadedFileNames = [];
    //* for checking if the uploaded files are images
    for(var i = 0; i < files.length; i++){
        const { mimetype } = await files[i];
        if(!mimetype.startsWith('image/')){
            areImageFiles = false;
        }    
    }
    //
    if(areImageFiles){
        for(var i = 0; i < files.length; i++){
            const { newFileName } = await productImageUpload(files[i]);
            // if(i === 0){
                // ! for the first image create a blurhash
               
            // }
            uploadedFileNames.push(newFileName);
        }
    }else{
        uploaded = false;
    }
    return { uploadedFileNames , isUploaded: uploaded };
}

// const loadImage = async src => new Promise((resolve, reject) => {
//     const img = new Image();
//     img.onload = () => resolve(img);
//     img.onerror = (...args) => reject(args);
//     img.src = src;
// });

// const getImageData = image => {
//   const canvas = document.createElement("canvas");
//   canvas.width = image.width;
//   canvas.height = image.height;
//   const context = canvas.getContext("2d");
//   context.drawImage(image, 0, 0);
//   return context.getImageData(0, 0, image.width, image.height);
// };

// const encodeImageToBlurhash = async imageUrl => {
//   const image = await loadImage(imageUrl);
//   const imageData = getImageData(image);
//   return encode(imageData.data, imageData.width, imageData.height, 4, 4);
// };


const productImageUpload = async (file) => {
    let newFileName = "";
    const re = /(?:\.([^.]+))?$/;
    const { createReadStream, filename, mimetype, encoding } = await file;
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
    return { newFileName };
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