const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');



// Route for uploading a single file
router.post('/upload', uploadController.uploadAndPars);



module.exports = router;