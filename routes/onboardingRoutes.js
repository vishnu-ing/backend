const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const onboardingController = require('../controllers/onboardingController');
const protect = require('../middlewares/auth.js');

router.get('/:username', protect, onboardingController.getOnboardingData);

router.patch('/submit',
    protect,
    onboardingController.submitOnboarding
);

module.exports = router;