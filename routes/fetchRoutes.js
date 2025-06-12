const express = require('express');
const router = express.Router();
const fetchController = require('../controllers/fetchController');



// Route for uploading a single file
router.get('/fetchall', fetchController.fetchall);



module.exports = router;