const User = require('../models/User')

exports.getEmployeesWithApprovedVisas = async (req, res) => {
    try {
        const employees = await User.find({
            role: "Employee",
            "workAuth.kind": "F1"
        }).select("firstName lastName preferredName VisaDocument workAuth")
            .populate({
                path: 'VisaDocument',
                match: { status: "Approved" },
                select: "type status startDate endDate fileUrl feedback"
            });
        res.json(employees)
    } catch (err) {
        console.log("Error in hr.controller: ", err)
        res.status(500).json({ message: "Failed to fetch employees" })
    }
}