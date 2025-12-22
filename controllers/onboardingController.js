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

        //create visa
        if (onboardingdata.isCitizen === "No" && onboardingdata.workAuth) {
            const newVisaDoc = await VisaDocument.create({
                owner: user._id, 
                type: onboardingdata.workAuth === "F1" ? "OPT Receipt" : "Other",
                fileUrl: req.files['optReceipt']?.[0]?.path || "",
                startDate: onboardingdata.visaStart,
                endDate: onboardingdata.visaEnd,
                status: 'Pending'
            });
            onboardingdata.VisaDocument = user.VisaDocument || [];
            onboardingdata.VisaDocument.push(newVisaDoc._id);
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