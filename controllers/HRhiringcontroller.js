const User = require('../models/User');
const RegistrationToken = require('../models/RegistrationToken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.getallemployee = async (req, res) => {
    try {
        const employees = await User.find({ role: { $ne: 'HR' } });
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { userId, status, feedback } = req.body;

        //find user by ID and update specific fields
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                onboardingStatus: status, 
                feedback: feedback 
            },
            { new: true } //return the updated document so frontend can update 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllRegistrationTokens = async (req, res) => {
    try {
        //sort by newest
        const tokens = await RegistrationToken.find().sort({ createdAt: -1 });
        res.json(tokens);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.generateRegistrationToken = async (req, res) => {
    try {
        console.log("generating token function");
        const { email, name } = req.body;
        await RegistrationToken.findOneAndDelete({ email });
        const token = crypto.randomBytes(32).toString('hex');

        //save to db
        const newToken = await RegistrationToken.create({
            token,
            email,
            name,
            status: 'Pending'
        });
        //registration link, change if frontend running at diff port
        const registrationLink = `http://localhost:5173/register?token=${token}`;

        // --- REAL EMAIL CODE (Uncomment when you have credentials) ---
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'thehr3617@gmail.com',
                pass: 'muso cmvp hssf vcjj'
            }
        });

        const mailOptions = {
            from: '"HR Team" <thehr3617@gmail.com>',
            to: email,
            subject: 'Finish your Registration',
            text: `Hi ${name},\n\nPlease complete your registration here: ${registrationLink}\n\nThis link expires in 3 hours.`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("token generated");
        res.status(201).json({ message: 'Token generated and email sent', token: newToken });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};