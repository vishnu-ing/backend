const mongoose = require("mongoose");
const User = require("./models/User");
const House = require("./models/House");
const VisaDocument = require("./models/VisaDocument");
const dotenv = require("dotenv");

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await User.deleteMany({});
    await House.deleteMany({});
    await VisaDocument.deleteMany({});
    console.log("Cleared existing data");

    // Create houses
    const houses = await House.insertMany([
      {
        address: "123 Tech Lane, Edison, NJ",
        landlord: {
          name: "John Smith",
          phone: "555-0101",
          email: "john@landlord.com",
        },
        facilityInfo: { beds: 4, mattresses: 4, tables: 2, chairs: 4 },
      },
      {
        address: "456 Code Road, Jersey City, NJ",
        landlord: {
          name: "Jane Doe",
          phone: "555-0202",
          email: "jane@landlord.com",
        },
        facilityInfo: { beds: 3, mattresses: 3, tables: 1, chairs: 3 },
      },
      {
        address: "789 Dev Street, New York, NY",
        landlord: {
          name: "Bob Builder",
          phone: "555-0303",
          email: "bob@landlord.com",
        },
        facilityInfo: { beds: 6, mattresses: 6, tables: 3, chairs: 6 },
      },
    ]);
    console.log(" Houses created");


    // Create HR staff ONE BY ONE to trigger password hashing
    const hr1 = await User.create({
      userName: "hr1",
      email: "hr1@company.com",
      password: "Password1%",
      role: "HR",
      firstName: "David",
      lastName: "Smith",
      ssn: "222-00-1223",
      DOB: "1882-10-10",
      cellPhone: "421-888-7771",
      address: {
        buildingApt: '2R',
        street: "10 Oak Rd",
        city: "Jersey City",
        state: "NJ",
        zip: "07302",
      },
      isCitizen: "Yes",
      reference: {
        firstname: "Ref",
        lastname: "One",
        phone: "000",
        email: "r@r.com",
        relationship: "Friend",
      },

      emergencyContacts: [{
        firstName: 'tom',
        lastName: 'cat',
        middleName: 'hi',
        phone: '201-943-2923',
        email: 'andrewheo1225@gmail.com',
        relationship: 'friend'
      }],
      driverlicense: { fileUrl: 'driverlicense.jpeg', hasLicense: "Yes", expirationDate: '1991-01-15', number: '111111111' },
      profilePicture: 'cat.jpeg',

    });

    const hr2 = await User.create({
      userName: "hr2",
      email: "hr2@company.com",
      password: "Password1%",
      role: "HR",
      firstName: "Bob",
      lastName: "HR",
      ssn: "111-00-2222",
      DOB: "1988-08-20",
      cellPhone: "123-456-7891",
      address: {
        buildingApt: '2R',
        street: "2 Main St",
        city: "Edison",
        state: "NJ",
        zip: "08817",
      },
      emergencyContacts: [{
        firstName: 'tom',
        lastName: 'cat',
        middleName: 'hi',
        phone: '201-943-2923',
        email: 'andrewheo1225@gmail.com',
        relationship: 'friend'
      }],
      isCitizen: "Yes",
    });

    const hr3 = await User.create({
      userName: "hr3",
      email: "hr3@company.com",
      password: "Password1%",
      role: "HR",
      firstName: "Charlie",
      lastName: "HR",
      ssn: "111-00-3333",
      DOB: "1990-01-15",
      cellPhone: "123-456-7892",
      address: {
        buildingApt: '2R',
        street: "3 Main St",
        city: "Edison",
        state: "NJ",
        zip: "08817",
      },
      emergencyContacts: [{
        firstName: 'tom',
        lastName: 'cat',
        middleName: 'hi',
        phone: '201-943-2923',
        email: 'andrewheo1225@gmail.com',
        relationship: 'friend'
      }],
      isCitizen: "Yes",
    });

    console.log("HR staff created with hashed passwords");

    console.log("\n Seeding successful!");
    console.log("\n Test Credentials:");
    console.log("Employees: citizen1, citizen2, visa1");
    console.log("HR Staff: hr1, hr2, hr3");
    console.log("Password for all: Password1%");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log(" Error seeding the database:", error);
    process.exit(1);
  }
};

seedDatabase();
