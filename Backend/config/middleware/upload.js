import multer from "multer";
import path from "path";
import fs from "fs";

const createStorage = (folderName) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(process.cwd(), "public", "images", folderName);

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
      cb(null, `${folderName}-` + uniqueSuffix + path.extname(cleanName));
    },
  });
};

// Product Upload (Multiple images)
export const upload = multer({
  storage: createStorage("products"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

// Restaurant Upload (Single image)
export const uploadRestaurant = multer({
  storage: createStorage("restaurants"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});