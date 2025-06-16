const express = require('express');
const router = express.Router();

const documentRoutes = require('./documents.route');

router.use('/documents', documentRoutes); 

module.exports = router;

