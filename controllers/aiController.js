const { GoogleGenerativeAI } = require('@google/generative-ai');
const Query = require('../models/queryModel');
const fetch = require('node-fetch');
require('dotenv').config();
const multer = require('multer');
const path = require('path');

// Function to call Gemini API
async function callGemini(prompt) {
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText}. Body: ${errorBody}`);
    }

    const result = await response.json();

    if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
        return result.candidates[0].content.parts[0].text;
    } else {
        throw new Error("No content generated. The response was empty or malformed.");
    }
}

// Multer config: only allow .csv and .xlsx, max size 10MB
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.csv' && ext !== '.xlsx') {
      return cb(new Error('Only .csv and .xlsx files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

exports.upload = upload;

exports.datasetUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  // You can add parsing/processing here if needed
  res.json({
    message: 'File uploaded successfully!',
    file: {
      originalname: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    }
  });
};

exports.askInsight = async (req, res) => {
    try {
        const { query } = req.body;
        const answer = await callGemini(query);
        // Optionally save query
        if (req.user && req.user.id) {
            await Query.create({ user: req.user.id, query, result: answer, type: 'insight' });
        } else {
            await Query.create({ query, result: answer, type: 'insight' });
        }
        res.json({ answer });
    } catch (err) {
        console.error('Gemini/DB error:', err);
        res.status(500).json({ error: 'Failed to get insight.' });
    }
};

exports.analyzeDataset = async (req, res) => {
    try {
        const { query } = req.body;
        // For demo: just send the query to Gemini
        // In production, parse CSV and send summary prompt
        const answer = await callGemini(`Analyze this dataset: ${query}`);
        if (req.user) {
            await Query.create({ user: req.user.id, query, result: answer, type: 'dataset' });
        }
        res.json({ answer });
    } catch (err) {
        res.status(500).json({ error: 'Failed to analyze dataset.' });
    }
};

exports.decisionSupport = async (req, res) => {
    try {
        const { query } = req.body;
        const answer = await callGemini(`Decision support: ${query}`);
        if (req.user) {
            await Query.create({ user: req.user.id, query, result: answer, type: 'decision' });
        }
        res.json({ answer });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get decision support.' });
    }
};

exports.getQueries = async (req, res) => {
    try {
        const queries = await Query.find({ user: req.user.id });
        res.json(queries);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch queries.' });
    }
};

exports.saveQuery = async (req, res) => {
    try {
        const { query, result, type } = req.body;
        const saved = await Query.create({ user: req.user.id, query, result, type });
        res.json(saved);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save query.' });
    }
};

exports.rerunQuery = async (req, res) => {
    try {
        const { id } = req.body;
        const q = await Query.findById(id);
        if (!q) return res.status(404).json({ error: 'Query not found.' });
        const answer = await callGemini(q.query);
        q.result = answer;
        await q.save();
        res.json(q);
    } catch (err) {
        res.status(500).json({ error: 'Failed to rerun query.' });
    }
};

exports.bookmarkQuery = async (req, res) => {
    try {
        const { id } = req.body;
        const q = await Query.findById(id);
        if (!q) return res.status(404).json({ error: 'Query not found.' });
        q.bookmarked = true;
        await q.save();
        res.json(q);
    } catch (err) {
        res.status(500).json({ error: 'Failed to bookmark query.' });
    }
};
