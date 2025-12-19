const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/:username', async(req,res)=>{
    try {
        const {username }= req.params;
        const user = await User.findOne({userName: username});
        const applicationdata = {
            onboardingStatus: user.onboardingStatus,
            formData:{
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName,
                preferredName: user.preferredName,
                address: user.address,
                car: user.car,
                driverlicense: user.driverlicense,
                emergencyContacts: user.emergencyContacts,
                email: user.email,
                cellPhone: user.cellPhone,
                workPhone: user.workPhone,
                ssn: user.ssn,
                DOB: user.DOB,
                VisaDocument: user.VisaDocument,
                reference: user.reference,
                profilePicture: user.profilePicture
            }
        }
        res.status(200).json(applicationdata);
    } catch (error) {
        console.error("error at fetching user on onboarding: " + error);
    }
});

router.patch('/submit', async(req,res)=>{
    try {
        const {userName, onboardingdata} = req.body;
        const updateUser = await User.findOneAndUpdate(
            {userName: userName},
            {
                $set:{
                    ...onboardingdata,
                    onboardingStatus: 'Pending'
                }
            },
            {new: true}
        );
        res.status(200).json({
            onboardingStatus: updateUser.onboardingStatus
        });
    } catch (error) {
        res.status(500).json({message: "Update during onboarding failed"});
    }
});

module.exports = router;