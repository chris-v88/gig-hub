import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } from '../constants/app.constant';

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

export default cloudinary;
