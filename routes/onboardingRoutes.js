const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const onboardingController = require('../controllers/onboardingController');
const protect = require('../middlewares/auth.js');

router.get('/:username', protect, onboardingController.getOnboardingData);

router.patch('/submit', upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'licenseCopy', maxCount: 1 },
        { name: 'optReceipt', maxCount: 1 }
    ]),
    protect,
    onboardingController.submitOnboarding
);

module.exports = router;