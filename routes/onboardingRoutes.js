const express = require('express');
const User = require('../models/User');
const router = express.Router();
const VisaDocument = require('../models/VisaDocument');
const upload = require('../middlewares/upload'); // will replace with s3 if necessary logic wise

router.get('/:username', async(req,res)=>{
    try {
        const {username }= req.params;
        const user = await User.findOne({userName: username}).populate('VisaDocument');
        //can add a check user not found, but should be handled by login
        const applicationdata = {
            onboardingStatus: user.onboardingStatus,
            formData: user
        }
        res.status(200).json(applicationdata);
    } catch (error) {
        console.error("error at fetching user on onboarding: " + error);
    }
});

router.patch('/submit', upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'licenseCopy', maxCount: 1 },
        { name: 'optReceipt', maxCount: 1 }
    ]), 
    async (req, res) => {
    try {
        const { userName } = req.body;
        const onboardingdata = {};

        // dynamically loop formdata
        Object.keys(req.body).forEach(key => {
            if (key === 'userName') return; 
            try {
                onboardingdata[key] = JSON.parse(req.body[key]);
            } catch (e) {
                onboardingdata[key] = req.body[key];
            }
        });
        // fetch the user for their mongodb id, need to discuss if we change the link to username
        const user = await User.findOne({ userName: userName });
        // create visadocument object
        if (onboardingdata.isCitizen === "No" && onboardingdata.workAuth) {
            const newVisaDoc = await VisaDocument.create({
                owner: user._id, 
                type: onboardingdata.workAuth === "F1" ? "OPT Receipt" : "Other",
                fileUrl: req.files['optReceipt']?.[0]?.path || "",
                startDate: onboardingdata.visaStart,
                endDate: onboardingdata.visaEnd,
                status: 'Pending'
            });
            //
            onboardingdata.VisaDocument = user.VisaDocument || [];
            onboardingdata.VisaDocument.push(newVisaDoc._id);
        }

        // loop through files, and map to the corresponding schema definitions
        if (req.files) {
            if (req.files['profilePicture']) {
                onboardingdata.profilePicture = req.files['profilePicture'][0].path; 
            }
            if (req.files['licenseCopy']) {
                onboardingdata.driverlicense = {
                    ...onboardingdata.driverlicense,
                    photo: req.files['licenseCopy'][0].path
                };
            }
        }
        //save in db and send data back to onboarding page
        const updateUser = await User.findOneAndUpdate(
            { userName: userName },
            { $set: { ...onboardingdata, onboardingStatus: 'Pending' } },
            { new: true }
        );

        res.status(200).json({ 
            onboardingStatus: updateUser.onboardingStatus, 
            formData: updateUser 
        }).populate('VisaDocument');
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
});

module.exports = router;