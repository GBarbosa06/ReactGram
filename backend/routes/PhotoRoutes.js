const express = require("express");
const router = express.Router();

// Controller
const { insertPhoto, removePhoto } = require("../controllers/PhotoController");


// Middlewares
const { photoInsertValidation } = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const { imageUpload } = require("../middlewares/imageUpload");

// Routes
router.post("/", authGuard, imageUpload.single("image"), photoInsertValidation(), validate, insertPhoto);
router.delete("/:id", authGuard, removePhoto);


module.exports = router;