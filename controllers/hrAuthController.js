const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required'
            })
        }

        const user = await User.findOne({ userName: username });
        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password"
            })
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }

        if (user.role !== 'HR') {
            return res.status(401).json({
                message: 'Only HR allowed'
            })
        }

        const token = jwt.sign(
            {
                userId: user._id,
                userName: user.userName,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        )

        res.json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role,
            }
        })
    } catch (error) {
        console.error("Error in hrAuthController.login", error)
        res.status(500).json({ message: "Internal Server Error hrAuthController.login)" })
    }
}