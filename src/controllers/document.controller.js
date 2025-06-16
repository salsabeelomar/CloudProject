const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Document = require('../models/documents.model');

const extractTextFromFile = async (filePath, mimetype) => {
  if (mimetype === 'application/pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const data = await mammoth.extractRawText({ path: filePath });
    return data.value;
  }
  return '';
};

const uploadDocument = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const text = await extractTextFromFile(file.path, file.mimetype);
    const title = text.split('\n').find(line => line.trim() !== '') || 'Untitled';
    const sizeKB = Math.ceil(file.size / 1024);

    const document = new Document({
      title: title.trim(),
      filename: file.filename,
      content: text,
      fileType: file.mimetype.includes('pdf') ? 'pdf' : 'docx',
      sizeKB,
      cloudURL: `uploads/${file.filename}`, // مؤقتاً، حتى نرفعها على render لاحقاً
    });

    await document.save();
    res.status(201).json({ message: 'File uploaded and processed', document });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing file' });
  }
};

const searchDocuments = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ message: 'Query is required' });

    const regex = new RegExp(query, 'i'); // غير حساس لحالة الأحرف

    const results = await Document.find({ content: regex });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error searching documents' });
  }
};

const getSortedDocuments = async (req, res) => {
  try {
    const documents = await Document.find().sort({ title: 1 }); // ترتيب تصاعدي A-Z
    res.json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving sorted documents' });
  }
};

const classifyDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    const result = {};

    documents.forEach(doc => {
      const category = doc.category || 'Uncategorized';
      if (!result[category]) result[category] = [];
      result[category].push(doc);
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error classifying documents' });
  }
};

const getDocumentStats = async (req, res) => {
  try {
    const documents = await Document.find();

    const total = documents.length;
    const totalSizeKB = documents.reduce((sum, doc) => sum + doc.sizeKB, 0);
    const averageSizeKB = total ? totalSizeKB / total : 0;

    const categories = {};
    documents.forEach(doc => {
      const cat = doc.category || 'Uncategorized';
      if (!categories[cat]) categories[cat] = 0;
      categories[cat]++;
    });

    res.json({ total, totalSizeKB, averageSizeKB, categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving statistics' });
  }
};



module.exports = {
  uploadDocument,
  searchDocuments,
  getSortedDocuments,
  classifyDocuments,
  getDocumentStats
};
