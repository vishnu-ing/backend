const User = require('../models/User')
const VisaDocument = require("../models/VisaDocument");

exports.getPersonalInfo = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .select("-password -role -onboardingStatus")
      .populate({
        path: "VisaDocument",
        select: "type startDate endDate fileUrl"
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      name: {
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        preferredName: user.preferredName,
        profilePicture: user.profilePicture,
        email: user.email,
        ssn: user.ssn,
        dob: user.DOB,
        gender: user.gender
      },

      address: {
        buildingApt: user.address.buildingApt,
        street: user.address.street,
        city: user.address.city,
        state: user.address.state,
        zip: user.address.zip
      },

      contactInfo: {
        cellPhone: user.cellPhone,
        workPhone: user.workPhone
      },

      driverlicense: {
        hasLicense: user.driverlicense?.hasLicense,
        number: user.driverlicense?.number,
        fileUrl: user.driverlicense?.fileUrl
      },

      visaDocuments: user.VisaDocument.map(doc => ({
        _id: doc._id,
        type: doc.type,
        startDate: doc.startDate,
        endDate: doc.endDate,
        status: doc.status,
        feedback: doc.feedback,
        fileUrl: doc.fileUrl
      })),

      emergencyContacts: user.emergencyContacts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load personal info" });
  }
};


exports.updatePersonalInfo = async (req, res) => {
  try {
    const {
      name,
      address,
      contactInfo,
      driverlicense,
      emergencyContacts,
      visaDocuments
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstName: name.firstName,
        lastName: name.lastName,
        middleName: name.middleName,
        preferredName: name.preferredName,
        profilePicture: name.profilePicture,
        email: name.email,
        ssn: name.ssn,
        DOB: name.dob,
        gender: name.gender,

        address: {
          buildingApt: address.buildingApt,
          street: address.street,
          city: address.city,
          state: address.state,
          zip: address.zip
        },

        cellPhone: contactInfo.cellPhone,
        workPhone: contactInfo.workPhone,

        driverlicense: {
          hasLicense: driverlicense.hasLicense,
          expirationDate: driverlicense.expirationDate,
          number: driverlicense.number,
          fileUrl: driverlicense.fileUrl
        },

        emergencyContacts,


      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }



    if (Array.isArray(visaDocuments)) {
      for (const doc of visaDocuments) {
        if (doc._id) {
          await VisaDocument.findByIdAndUpdate(
            doc._id,
            {
              type: doc.type,
              startDate: doc.startDate,
              endDate: doc.endDate,
              fileUrl: doc.fileUrl,
              fileKey: doc.fileKey,
            },
            { runValidators: true }
          );
        } else {
          const created = await VisaDocument.create({
            owner: updatedUser._id,
            type: doc.type,
            startDate: doc.startDate,
            endDate: doc.endDate,
            fileUrl: doc.fileUrl,
            fileKey: doc.fileKey,
          });

          await User.findByIdAndUpdate(
            updatedUser._id,
            { $push: { VisaDocument: created._id } }
          );
        }
      }
    }



    res.json(updatedUser);
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(400).json({ error: err.message });
  }
};


