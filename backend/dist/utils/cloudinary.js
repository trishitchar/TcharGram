import { v2 as Cloudinary } from "cloudinary";
import dotenv from 'dotenv';
dotenv.config();
const { CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME } = process.env;
if (!CLOUDINARY_API_SECRET || !CLOUDINARY_API_KEY || !CLOUDINARY_CLOUD_NAME) {
    console.log("cloudinary api key missing");
    process.exit(1);
}
Cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});
export default Cloudinary;
