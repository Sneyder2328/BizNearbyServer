import cloudinary from 'cloudinary';
const {v2} = cloudinary;
const {config, uploader} = v2;
const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};
config(cloudinaryConfig);
export {cloudinaryConfig, uploader, cloudinary};