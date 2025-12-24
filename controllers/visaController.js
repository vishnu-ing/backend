const path = require('path');
const VisaDocument = require('../models/VisaDocument');
const User = require('../models/User');
const { uploadFile } = require('../utils/s3Service');

// GET /api/visa - list all visa documents for the authenticated user
exports.getUserVisaDocuments = async (req, res) => {
	try {
		const userId = req.user.userId;
		const docs = await VisaDocument.find({ owner: userId }).sort({ createdAt: 1 });
		res.json(docs);
	} catch (err) {
		console.error('Error fetching visa documents:', err);
		res.status(500).json({ error: 'Failed to fetch visa documents' });
	}
};

// POST /api/visa/upload - upload a visa document
exports.uploadVisaDocument = async (req, res) => {
	try {
		const userId = req.user.userId;
		const { type, startDate = '', endDate = '' } = req.body;

		if (!type) return res.status(400).json({ error: 'Document type is required' });
		if (!req.file) return res.status(400).json({ error: 'No file provided' });

		const file = req.file;
		const ext = path.extname(file.originalname);
		const key = `visas/${userId}/${type.replace(/\s+/g, '-')}/${Date.now()}${ext}`;

		const data = await uploadFile(file.buffer, key, file.mimetype);

		// If a document of this type already exists for the user, replace it
		let visaDoc = await VisaDocument.findOne({ owner: userId, type });
		if (visaDoc) {
			visaDoc.fileUrl = data.Location;
			visaDoc.fileKey = key;
			visaDoc.status = 'Pending';
			visaDoc.startDate = startDate || '';
			visaDoc.endDate = endDate || '';
			visaDoc.feedback = '';
			await visaDoc.save();
		} else {
			visaDoc = new VisaDocument({
				owner: userId,
				type,
				fileUrl: data.Location,
				fileKey: key,
				status: 'Pending',
				startDate: startDate || '',
				endDate: endDate || '',
				feedback: ''
			});

			await visaDoc.save();

			// Add reference to user.VisaDocument array
			try {
				await User.findByIdAndUpdate(userId, { $addToSet: { VisaDocument: visaDoc._id } });
			} catch (e) {
				console.error('Failed to attach visa document to user:', e);
			}
		}

		res.json(visaDoc);
	} catch (err) {
		console.error('Upload visa document error:', err);
		res.status(500).json({ error: 'Failed to upload visa document' });
	}
};

