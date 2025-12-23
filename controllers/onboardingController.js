const User = require('../models/User');
const VisaDocument = require('../models/VisaDocument');

exports.getOnboardingData = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ userName: username }).populate('VisaDocument');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const applicationdata = {
            onboardingStatus: user.onboardingStatus,
            formData: user
        };
        return res.status(200).json(applicationdata);
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.submitOnboarding = async (req, res) => {
    try {
        const { userName } = req.body;
        const onboardingdata = {};

        //dynamic parsing 
        Object.keys(req.body).forEach(key => {
            if (key === 'userName') return; 
            try {
                onboardingdata[key] = JSON.parse(req.body[key]);
            } catch (e) {
                onboardingdata[key] = req.body[key];
            }
        });

        const user = await User.findOne({ userName: userName });

        ['visaStart', 'visaEnd', 'licenseExp', 'DOB'].forEach(dateField => {
            if (onboardingdata[dateField] === "") {
                onboardingdata[dateField] = null; 
            }
        });

        //create visa
        if (onboardingdata.isCitizen === "No" && onboardingdata.workAuth) {
            const visaPayload = {
                owner: user._id, 
                type: onboardingdata.workAuth === "F1" ? "OPT Receipt" : "Other",
                startDate: onboardingdata.visaStart,
                endDate: onboardingdata.visaEnd,
                status: 'Pending'
            };
            if (req.files && req.files['optReceipt']) {
                visaPayload.fileUrl = req.files['optReceipt'][0].path;
            }
            //check if it exist, if it doesnt create if not override
            if (user.VisaDocument && user.VisaDocument.length > 0) {
                const currentDocId = user.VisaDocument[user.VisaDocument.length - 1];
                await VisaDocument.findByIdAndUpdate(currentDocId, visaPayload);
            } 
            else {
                if (!visaPayload.fileUrl) visaPayload.fileUrl = "";
                const newVisaDoc = await VisaDocument.create(visaPayload);
                if (!user.VisaDocument) user.VisaDocument = [];
                user.VisaDocument.push(newVisaDoc._id);
                onboardingdata.VisaDocument = user.VisaDocument;
            }
        }

        //file handling
        if (req.files) {
            if (req.files['profilePicture']) onboardingdata.profilePicture = req.files['profilePicture'][0].path;
            if (req.files['licenseCopy']) {
                onboardingdata.driverlicense = {
                    ...onboardingdata.driverlicense,
                    photo: req.files['licenseCopy'][0].path
                };
            }
        }

        const updateUser = await User.findOneAndUpdate(
            { userName: userName },
            { $set: { ...onboardingdata, onboardingStatus: 'Pending' } },
            { new: true }
        ).populate('VisaDocument');

        return res.status(200).json({ 
            onboardingStatus: updateUser.onboardingStatus, 
            formData: updateUser 
        });
    } catch (error) {
        return res.status(500).json({ message: "Update failed", error: error.message });
    }
};