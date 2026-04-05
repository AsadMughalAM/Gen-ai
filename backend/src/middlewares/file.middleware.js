import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, cb) {
    const isPdf =
      file.mimetype === "application/pdf" ||
      file.originalname?.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return cb(new Error("Only PDF resumes are supported right now."));
    }

    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});


export default upload;
