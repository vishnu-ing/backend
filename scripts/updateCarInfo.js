const mongoose = require('mongoose');
const User = require('../models/User');

async function updateCarInfo() {
  await mongoose.connect('mongodb://localhost:27017/employee-portal'); // Change to your DB name
  const user = await User.findOne({ userName: 'citizen1' });
  if (!user) {
    console.log('User not found');
    return;
  }
  user.car = {
    make: 'Toyota',
    model: 'Camry',
    color: 'Blue',
  };
  await user.save();
  console.log('Updated car info for citizen1:', user.car);
  await mongoose.disconnect();
}

updateCarInfo();
