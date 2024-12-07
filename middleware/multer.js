/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This middleware handles file uploads for the BookedUp project using Multer.
 * It configures and manages the upload process, ensuring that files are stored 
 * securely and meet the application's requirements.
 *
 */

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images"); // Set the directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create unique filenames
  },
});

const upload = multer({ storage });
module.exports = upload;
