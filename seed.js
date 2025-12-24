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

    // Create employees ONE BY ONE to trigger password hashing
    const employee1 = await User.create({
      userName: "citizen1",
      email: "emp1@gmail.com",
      password: "PassWord1234@",
      role: "Employee",
      firstName: "David",
      lastName: "Smith",
      ssn: "222-00-1111",
      DOB: "1995-10-10",
      cellPhone: "999-888-7771",
      address: {
        street: "10 Oak Rd",
        city: "Jersey City",
        state: "NJ",
        zip: "07302",
      },
      workAuth: { isCitizen: "Yes", kind: "Citizen" },
      reference: {
        firstname: "Ref",
        lastname: "One",
        phone: "000",
        email: "r@r.com",
        relationship: "Friend",
      },
      driverlicense: {
        fileUrl: "driverlicense.jpeg",
        hasLicense: "Yes",
        expirationDate: "1991-01-15",
        number: "111111111",
      },
      profilePicture: "cat.jpeg",
    });

    const employee2 = await User.create({
      userName: "citizen2",
      email: "emp2@gmail.com",
      password: "password",
      role: "Employee",
      firstName: "Eve",
      lastName: "Jones",
      ssn: "222-00-2222",
      DOB: "1997-12-05",
      cellPhone: "999-888-7772",
      address: {
        street: "11 Pine Ln",
        city: "Jersey City",
        state: "NJ",
        zip: "07302",
      },
      workAuth: { isCitizen: "Yes", kind: "Citizen" },
      driverlicense: {
        fileUrl: "driverlicense.jpeg",
        hasLicense: "Yes",
        expirationDate: "1991-01-15",
        number: "111111111",
      },
      profilePicture: "cat.jpeg",
    });

    const frank = await User.create({
      userName: "visa1",
      email: "emp3@gmail.com",
      password: "password",
      role: "Employee",
      firstName: "Frank",
      lastName: "Visa",
      ssn: "222-00-3333",
      DOB: "1993-03-30",
      cellPhone: "999-888-7773",
      address: {
        street: "12 Maple Ave",
        city: "New York",
        state: "NY",
        zip: "10001",
      },
      workAuth: { isCitizen: "No", kind: "F1(CPT/OPT)" },
      driverlicense: {
        fileUrl: "driverlicense.jpeg",
        hasLicense: "Yes",
        expirationDate: "1991-01-15",
        number: "111111111",
      },
      profilePicture: "cat.jpeg",
    });

    console.log(" Employees created with hashed passwords");

    // Create visa document for Frank
    const visaDoc = await VisaDocument.create({
      owner: frank._id,
      type: "OPT Receipt",
      fileUrl: "workAuth.jpeg",
      status: "Pending",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-01-01"),
      feedback: "Awaiting HR review",
    });

    // Link visa document to Frank
    frank.VisaDocument.push(visaDoc._id);
    await frank.save();

    // Assign employees to houses
    houses[0].residents.push(employee1._id, employee2._id);
    houses[1].residents.push(frank._id);
    await Promise.all([houses[0].save(), houses[1].save()]);

    console.log(" Employees assigned to houses");

    // Create HR staff ONE BY ONE to trigger password hashing
    const hr1 = await User.create({
      userName: "hr1",
      email: "hr1@company.com",
      password: "password",
      role: "HR",
      firstName: "David",
      lastName: "Smith",
      ssn: "222-00-1223",
      DOB: "1882-10-10",
      cellPhone: "421-888-7771",
      address: {
        street: "10 Oak Rd",
        city: "Jersey City",
        state: "NJ",
        zip: "07302",
      },
      workAuth: { isCitizen: "Yes", kind: "Citizen" },
      reference: {
        firstname: "Ref",
        lastname: "One",
        phone: "000",
        email: "r@r.com",
        relationship: "Friend",
      },
      driverlicense: {
        fileUrl: "driverlicense.jpeg",
        hasLicense: "Yes",
        expirationDate: "1991-01-15",
        number: "111111111",
      },
      profilePicture: "cat.jpeg",
    });

    const hr1visaDoc = await VisaDocument.create({
      owner: hr1._id,
      type: "OPT Receipt",
      fileUrl: "workAuth.jpeg",
      status: "Pending",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-01-01"),
      feedback: "Awaiting HR review",
    });

    // Link visa document to Frank
    hr1.VisaDocument.push(hr1visaDoc._id);
    await hr1.save();

    const hr2 = await User.create({
      userName: "hr2",
      email: "hr2@company.com",
      password: "password",
      role: "HR",
      firstName: "Bob",
      lastName: "HR",
      ssn: "111-00-2222",
      DOB: "1988-08-20",
      cellPhone: "123-456-7891",
      address: {
        street: "2 Main St",
        city: "Edison",
        state: "NJ",
        zip: "08817",
      },
      workAuth: { isCitizen: "Yes", kind: "Citizen" },
    });

    const hr3 = await User.create({
      userName: "hr3",
      email: "hr3@company.com",
      password: "password",
      role: "HR",
      firstName: "Charlie",
      lastName: "HR",
      ssn: "111-00-3333",
      DOB: "1990-01-15",
      cellPhone: "123-456-7892",
      address: {
        street: "3 Main St",
        city: "Edison",
        state: "NJ",
        zip: "08817",
      },
      workAuth: { isCitizen: "Yes", kind: "Citizen" },
    });

    console.log("HR staff created with hashed passwords");

    console.log("\n Seeding successful!");
    console.log("\n Test Credentials:");
    console.log("Employees: citizen1, citizen2, visa1");
    console.log("HR Staff: hr1, hr2, hr3");
    console.log("Password for all: password");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log(" Error seeding the database:", error);
    process.exit(1);
  }
};

seedDatabase();
