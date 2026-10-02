import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB max file size
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      const error: any = new Error("Only image files are allowed.");
      error.statusCode = 400;
      return cb(error);
    }
    cb(null, true);
  },
});
