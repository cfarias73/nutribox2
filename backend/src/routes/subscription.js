const express = require('express');
const router = express.Router();
const { upgradeToPremium, checkSubscription } = require('../controllers/subscription');
const auth = require('../middleware/auth');

// Upgrade to premium subscription
router.post('/upgrade', auth, upgradeToPremium);

// Check subscription status
router.get('/status', auth, checkSubscription);

module.exports = router;