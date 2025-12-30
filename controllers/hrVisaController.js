const User = require('../models/User')
const VisaDocument = require("../models/VisaDocument");
const { sendMail } = require('../utils/emailService');


exports.getEmployeesWithApprovedVisas = async (req, res) => {
   try {
       const employees = await User.find({
           role: "Employee",
           workAuth: "F1"
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

const VISA_ORDER = [
  'OPT Receipt',
  'EAD Card',
  'I-983',
  'I-20',
];

function getNextVisa(docs) {
  const map = new Map(docs.map(d => [d.type, d]));

  for (const type of VISA_ORDER) {
    const doc = map.get(type);
    if (!doc) {
      return {
        kind: 'MISSING',
        type,
      };
    }
    if (doc.status !== 'Approved') {
      return {
        kind: 'EXISTING',
        document: doc,
      };
    }
  }
  return null;
}


// GET /api/hr/employees/in-progress
exports.getInProgressF1Visas = async (req, res) => {
  try {
    const users = await User.find({
      role: 'Employee',
      workAuth: 'F1',
    })
      .select('firstName lastName preferredName email VisaDocument')
      .populate('VisaDocument');

    const response = [];

    for (const user of users) {
      const activeVisa = getNextVisa(user.VisaDocument);

      
      if (!activeVisa) continue;

      response.push({
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        preferredName: user.preferredName,
        email: user.email,
        approvedVisas: user.VisaDocument.filter(v => v.status === 'Approved'),
        activeVisa,
      });
    }

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load in-progress visas' });
  }
};

// PATCH /api/hr/employees/:visaId/status

exports.updateVisaStatus = async (req, res) => {
  const { visaId } = req.params;
  const { status, feedback } = req.body;

  const visa = await VisaDocument.findById(visaId).populate('owner');
  if (!visa) return res.status(404).json({ error: 'Visa not found' });

  visa.status = status;
  if (status === 'Rejected') {
    visa.feedback = feedback || '';
  }

  await visa.save();
  res.json({ success: true });
};

// POST /api/hr/employees/:visaId/notify
exports.notifyEmployee = async (req, res) => {
  const visa = await VisaDocument.findById(req.params.visaId).populate('owner');

  if (!visa || visa.status !== 'Approved') {
    return res.status(400).json({ error: 'Visa not approved' });
  }

  await sendMail({
    to: visa.owner.email,
    subject: "Next Visa Step Required",
    text: `Your ${visa.type} was approved. Please submit the next visa document.`,
  });

  res.json({ success: true });
};
