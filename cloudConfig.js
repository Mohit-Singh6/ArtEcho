const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config ({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
    // the name of the keys here should be the same as it is!!!
    // but in .env file the names like CLOUD_NAME, etc. can be anything
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ArtEcho_Images_dev',
    allowedFormats: ['png','jpg','jpeg'] 
  }
});

module.exports.storage = storage;