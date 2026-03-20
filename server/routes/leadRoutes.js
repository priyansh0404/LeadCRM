const express = require('express');
const { getLeads, createLead, updateLead, deleteLead } = require('../controllers/leadController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect); // Protect all lead routes

router.get('/', getLeads);
router.post('/', upload.single('image'), createLead);
router.put('/:id', upload.single('image'), updateLead);
router.delete('/:id', deleteLead);

module.exports = router;
