const mongoose = require('mongoose');
const User = require('../models/User');
const House = require('../models/House');

async function addRandomResidents() {
  await mongoose.connect('mongodb://localhost:27017/employee-portal');
  const houseId = '69500886b3b19994ffba93f2';

  // Create 3 random users
  const users = await User.insertMany([
    {
      userName: 'randomuser1_' + Date.now(),
      email: 'random1_' + Date.now() + '@test.com',
      password: 'Password123!',
      firstName: 'Random',
      lastName: 'UserOne',
      ssn: Math.floor(Math.random() * 1e9)
        .toString()
        .padStart(9, '0'),
      DOB: '1990-01-01',
      cellPhone: '555-0001',
      address: {
        street: '123 Main',
        city: 'Testville',
        state: 'TS',
        zip: '12345',
      },
      gender: 'Other',
    },
    {
      userName: 'randomuser2_' + Date.now(),
      email: 'random2_' + Date.now() + '@test.com',
      password: 'Password123!',
      firstName: 'Random',
      lastName: 'UserTwo',
      ssn: Math.floor(Math.random() * 1e9)
        .toString()
        .padStart(9, '0'),
      DOB: '1991-02-02',
      cellPhone: '555-0002',
      address: {
        street: '456 Main',
        city: 'Testville',
        state: 'TS',
        zip: '12345',
      },
      gender: 'Other',
    },
    {
      userName: 'randomuser3_' + Date.now(),
      email: 'random3_' + Date.now() + '@test.com',
      password: 'Password123!',
      firstName: 'Random',
      lastName: 'UserThree',
      ssn: Math.floor(Math.random() * 1e9)
        .toString()
        .padStart(9, '0'),
      DOB: '1992-03-03',
      cellPhone: '555-0003',
      address: {
        street: '789 Main',
        city: 'Testville',
        state: 'TS',
        zip: '12345',
      },
      gender: 'Other',
    },
  ]);

  // Add their IDs to the house
  await House.findByIdAndUpdate(houseId, {
    $push: { residents: { $each: users.map((u) => u._id) } },
  });
  console.log('Added random residents to house', houseId);
  await mongoose.disconnect();
}

addRandomResidents();
