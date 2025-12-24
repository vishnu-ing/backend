// Get housing information by house ID
exports.getHousingById = async (req, res) => {
  try {
    console.log("getHousingById called with userId:", req.params.id);
    // Find the house where this user is a resident
    const house = await House.findOne({ residents: req.params.id }).populate({
      path: "residents",
      select: "firstName lastName userName cellPhone email",
    });
    if (!house) {
      console.warn("No housing found for userId:", req.params.id);
      return res
        .status(404)
        .json({ message: "No housing found for this user" });
    }
    res.json({
      _id: house._id,
      address: house.address,
      landlord: house.landlord,
      facilityInfo: house.facilityInfo,
      residents: house.residents.map((r) => ({
        firstName: r.firstName,
        lastName: r.lastName,
        userName: r.userName,
        cellPhone: r.cellPhone,
        email: r.email,
      })),
    });
  } catch (error) {
    console.error("Error in getHousingById:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
      stack: error.stack,
    });
  }
};
// housing controller

const House = require("../models/House");

// Get housing information for the logged-in user
exports.getMyHousing = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user is populated by authentication middleware
    const house = await House.findOne({ residents: userId }).populate({
      path: "residents",
      select: "firstName lastName userName cellPhone email",
    });

    if (!house) {
      return res
        .status(404)
        .json({ message: "No housing information found for this user" });
    }

    res.json({
      _id: house._id,
      address: house.address,
      landlord: house.landlord,
      facilityInfo: house.facilityInfo,
      residents: house.residents.map((r) => ({
        firstName: r.firstName,
        lastName: r.lastName,
        userName: r.userName,
        cellPhone: r.cellPhone,
        email: r.email,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
