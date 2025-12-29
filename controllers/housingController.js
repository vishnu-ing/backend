// Delete a house by ID with optional resident reassignment
exports.deleteHousing = async (req, res) => {
  try {
    const { id } = req.params;
    const { reassign } = req.query;
    const house = await House.findById(id);
    if (!house) return res.status(404).json({ message: 'House not found' });
    const residents = house.residents;
    // Delete the house
    await House.findByIdAndDelete(id);
    if (reassign && residents.length > 0) {
      // Get all other houses and their resident counts
      let otherHouses = await House.aggregate([
        { $match: { _id: { $ne: house._id } } },
        { $project: { _id: 1, residentsCount: { $size: '$residents' } } },
        { $sort: { residentsCount: 1 } },
      ]);
      if (otherHouses.length > 0) {
        // Assign each resident to the house with the current smallest number of residents
        for (const residentId of residents) {
          // Always pick the house with the smallest number of residents
          otherHouses = await House.aggregate([
            { $match: { _id: { $ne: house._id } } },
            { $project: { _id: 1, residentsCount: { $size: '$residents' } } },
            { $sort: { residentsCount: 1 } },
          ]);
          const targetHouseId = otherHouses[0]._id;
          await House.findByIdAndUpdate(targetHouseId, {
            $push: { residents: residentId },
          });
        }
      }
    }
    res.json({
      message:
        'House deleted' +
        (reassign && residents.length > 0 ? ' and residents reassigned' : ''),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
// Create a new house
exports.createHousing = async (req, res) => {
  try {
    console.log('POST /api/housing body:', req.body);
    const { address, landlord, facilityInfo, residents } = req.body;
    const newHouse = new House({ address, landlord, facilityInfo, residents });
    const savedHouse = await newHouse.save();
    res.status(201).json(savedHouse);
  } catch (error) {
    console.error('Error in createHousing:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
      stack: error.stack,
    });
  }
};
// Get all housing information
exports.getAllHousing = async (req, res) => {
  try {
    const houses = await House.find().populate({
      path: 'residents',
      select: 'firstName lastName userName cellPhone email car',
    });
    res.json(
      houses.map((house) => ({
        ...house.toObject(),
        residents: house.residents.map((r) => ({
          firstName: r.firstName,
          lastName: r.lastName,
          userName: r.userName,
          cellPhone: r.cellPhone,
          email: r.email,
          car: r.car || null,
        })),
        employeeCount: house.residents.length,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
// Get housing information by house ID
exports.getHousingById = async (req, res) => {
  try {
    console.log('getHousingById called with houseId:', req.params.id);
    const house = await House.findById(req.params.id).populate({
      path: 'residents',
      select: 'firstName lastName userName cellPhone email car',
    });
    if (!house) {
      console.warn('No housing found for houseId:', req.params.id);
      return res
        .status(404)
        .json({ message: 'No housing found for this house ID' });
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
        car: r.car || null,
      })),
    });
  } catch (error) {
    console.error('Error in getHousingById:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
      stack: error.stack,
    });
  }
};
// housing controller

const House = require('../models/House');

// Get housing information for the logged-in user
exports.getMyHousing = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user is populated by authentication middleware
    const house = await House.findOne({ residents: userId }).populate({
      path: 'residents',
      select: 'firstName lastName userName cellPhone email car',
    });

    if (!house) {
      return res
        .status(404)
        .json({ message: 'No housing information found for this user' });
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
        car: r.car || null,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
