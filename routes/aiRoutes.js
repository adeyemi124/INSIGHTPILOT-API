const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/insight/ask', auth.optional, aiController.askInsight);
router.post('/insight/dataset', auth.optional, aiController.analyzeDataset);
router.post('/insight/decision', auth.optional, aiController.decisionSupport);

// Multer file upload route
router.post('/insight/dataset-upload', aiController.upload.single('file'), aiController.datasetUpload);

router.get('/dashboard/queries', auth.required, aiController.getQueries);
router.post('/dashboard/queries', auth.required, aiController.saveQuery);
router.post('/dashboard/queries/rerun', auth.required, aiController.rerunQuery);
router.post('/dashboard/bookmark', auth.required, aiController.bookmarkQuery);

module.exports = router;
