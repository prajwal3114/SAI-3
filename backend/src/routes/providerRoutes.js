const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const { uploadsDir } = require('../config/uploads');

const {
  addProvider,
  getProviders,
  getProviderById,
  addReview,
  bookProvider,
  seedProviders,
} = require('../controllers/providerController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdir(uploadsDir, { recursive: true }, (error) => cb(error, uploadsDir));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

router.get('/', getProviders);
router.get('/seed', seedProviders);
router.get('/:id', getProviderById);

router.post('/', authMiddleware, upload.array('images', 5), addProvider);
router.post('/:id/reviews', authMiddleware, addReview);
router.post('/:id/book', authMiddleware, bookProvider);

module.exports = router;

