// Get housing information by house ID
exports.getHousingById = async (req, res) => {
  try {
    const house = await House.findById(req.params.id).populate(
      "residents",
      "name phone email"
    );
    if (!house) {
      return res.status(404).json({ message: "No housing found with this ID" });
    }
    res.json({
      address: house.address,
      landlord: house.landlord,
      facilityInfo: house.facilityInfo,
      residents: house.residents.map((r) => ({
        name: r.name,
        phone: r.phone,
        email: r.email,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
// housing controller

const House = require("../models/House");

// Get housing information for the logged-in user
exports.getMyHousing = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user is populated by authentication middleware
    const house = await House.findOne({ residents: userId }).populate(
      "residents",
      "name phone email"
    );

    if (!house) {
      return res
        .status(404)
        .json({ message: "No housing information found for this user" });
    }

    res.json({
      address: house.address,
      landlord: house.landlord,
      facilityInfo: house.facilityInfo,
      residents: house.residents.map((r) => ({
        name: r.name,
        phone: r.phone,
        email: r.email,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
