const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadDocument, searchDocuments, getSortedDocuments, classifyDocuments, getDocumentStats } = require('../controllers/document.controller');

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/search', searchDocuments);
router.get('/sorted', getSortedDocuments);
router.get('/categories', classifyDocuments);
router.get('/stats', getDocumentStats);

module.exports = router;

