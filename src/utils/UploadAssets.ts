import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import fs from "fs";
import multer from "multer";
import { config } from "../config";

cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
});

export const uploadAssets = (
    filename: string,
    path: string,
): Promise<{ secure_url: string; bytes: number }> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(path, { public_id: filename.trim() }, function (error, result) {
            if (error) {
                reject(error);
            }
            resolve(result as UploadApiResponse);
            // delete a file asynchronously
            fs.unlink(path, (err) => {
                if (err) {
                    reject(err);
                }
            });
        });
    });
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "/tmp/uploads/";
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]);
    },
});

export const upload = multer({
    storage: storage,
    // limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});
