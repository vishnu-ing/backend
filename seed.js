require('dotenv').config({ path: __dirname + '/.env' });
console.log('MONGODB_URI:', process.env.MONGODB_URI);
const mongoose = require('mongoose');
const User = require('./models/User');
const House = require('./models/House');
const VisaDocument = require('./models/VisaDocument');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await House.deleteMany({});
    await VisaDocument.deleteMany({});
    console.log('Cleared existing data');

    // Create houses
    const houses = await House.insertMany([
      {
        address: '123 Tech Lane, Edison, NJ',
        landlord: {
          name: 'John Smith',
          phone: '555-0101',
          email: 'john@landlord.com',
        },
        facilityInfo: { beds: 4, mattresses: 4, tables: 2, chairs: 4 },
      },
      {
        address: '456 Code Road, Jersey City, NJ',
        landlord: {
          name: 'Jane Doe',
          phone: '555-0202',
          email: 'jane@landlord.com',
        },
        facilityInfo: { beds: 3, mattresses: 3, tables: 1, chairs: 3 },
      },
      {
        address: '789 Dev Street, New York, NY',
        landlord: {
          name: 'Bob Builder',
          phone: '555-0303',
          email: 'bob@landlord.com',
        },
        facilityInfo: { beds: 6, mattresses: 6, tables: 3, chairs: 6 },
      },
    ]);
    console.log(' Houses created');

    // Create employees ONE BY ONE to trigger Password hashing
    const employee1 = await User.create({
      userName: "citizen1",
      email: "emp1@gmail.com",
      password: "PassWord1234@",
      role: "Employee",
      firstName: "David",
      lastName: "Smith",
      ssn: "222-00-1111",
      preferredName:'preferred name temp',
      DOB: "1995-10-10",
      cellPhone: "999-888-7771",
      address: {
        buildingApt: '2R',
        street: '10 Oak Rd',
        city: 'Jersey City',
        state: 'NJ',
        zip: '07302',
      },
      isCitizen: 'Yes',
      reference: {
        firstname: 'Ref',
        lastname: 'One',
        phone: '000',
        email: 'r@r.com',
        relationship: 'Friend',
      },

      emergencyContacts: [
        {
          firstName: 'tom',
          lastName: 'cat',
          middleName: 'hi',
          phone: '201-943-2923',
          email: 'andrewheo1225@gmail.com',
          relationship: 'friend',
        },
      ],

      driverlicense: {
        fileUrl: 'driverlicense.jpeg',
        hasLicense: 'Yes',
        expirationDate: '1991-01-15',
        number: '111111111',
      },
      profilePicture: 'cat.jpeg',
    });

    const employee2 = await User.create({
      userName: "citizen2",
      email: "emp2@gmail.com",
      password: "Password1!",
      role: "Employee",
      firstName: "Eve",
      lastName: "Jones",
      preferredName:'preferred name temp',
      ssn: "222-00-2222",
      DOB: "1997-12-05",
      cellPhone: "999-888-7772",
      address: {
        buildingApt: '2R',
        street: '11 Pine Ln',
        city: 'Jersey City',
        state: 'NJ',
        zip: '07302',
      },
      emergencyContacts: [
        {
          firstName: 'tom',
          lastName: 'cat',
          middleName: 'hi',
          phone: '201-943-2923',
          email: 'andrewheo1225@gmail.com',
          relationship: 'friend',
        },
      ],
      isCitizen: 'Yes',
      greencard: 'Yes',
      driverlicense: {
        fileUrl: 'driverlicense.jpeg',
        hasLicense: 'Yes',
        expirationDate: '1991-01-15',
        number: '111111111',
      },
      profilePicture: 'cat.jpeg',
    });

    const visaDoc2 = await VisaDocument.create({
      owner: employee2._id,
      type: "OPT Receipt",
      fileUrl: "workAuth.jpeg",
      status: "Approved",
      startDate: "1993-03-30",
      endDate: "1993-03-30",
      feedback: "Awaiting HR review",
    });

    // Link visa document
    employee2.VisaDocument.push(visaDoc2._id);
    await employee2.save();

    const visaDoc2_1 = await VisaDocument.create({
      owner: employee2._id,
      type: "OPT EAD",
      fileUrl: "workAuth.jpeg",
      status: "Approved",
      startDate: "1993-03-30",
      endDate: "1993-03-30",
      feedback: "Awaiting HR review",
    });

    // Link visa document
    employee2.VisaDocument.push(visaDoc2_1._id);

    await employee2.save();
    const visaDoc2_2 = await VisaDocument.create({
      owner: employee2._id,
      type: "I-983",
      fileUrl: "workAuth.jpeg",
      status: "Approved",
      startDate: "1993-03-30",
      endDate: "1993-03-30",
      feedback: "Awaiting HR review",
    });

    // Link visa document
    employee2.VisaDocument.push(visaDoc2_2._id);
    await employee2.save();

    const visaDoc2_3 = await VisaDocument.create({
      owner: employee2._id,
      type: "I-20",
      fileUrl: "workAuth.jpeg",
      status: "Approved",
      startDate: "1993-03-30",
      endDate: "1993-03-30",
      feedback: "Awaiting HR review",
    });

    // Link visa document
    employee2.VisaDocument.push(visaDoc2_3._id);
    await employee2.save();


    const employee3 = await User.create({
      userName: "citizen3",
      email: "andrewheo1225@gmail.com",
      password: "Password1!",
      role: "Employee",
      firstName: "Kit",
      lastName: "Harp",
      preferredName:'preferred name temp',
      ssn: "323-00-2222",
      DOB: "1997-12-05",
      cellPhone: "999-888-7772",
      address: {
        buildingApt: '2R',
        street: "11 Pine Ln",
        city: "Jersey City",
        state: "NJ",
        zip: "07302",
      },
      workAuth: { isCitizen: "No", kind: "F1" },
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

    const visaDoc3 = await VisaDocument.create({
      owner: employee3._id,
      type: "OPT Receipt",
      fileUrl: "workAuth.jpeg",
      status: "Approved",
      startDate: "1993-03-30",
      endDate: "1993-03-30",
      feedback: "Awaiting HR review",
    });

    // Link visa document
    employee3.VisaDocument.push(visaDoc3._id);
    await employee3.save();

    const visaDoc3_1 = await VisaDocument.create({
      owner: employee3._id,
      type: "OPT EAD",
      fileUrl: "workAuth.jpeg",
      status: "Approved",
      startDate: "1993-03-30",
      endDate: "1993-03-30",
      feedback: "Awaiting HR review",
    });

    // Link visa document
    employee3.VisaDocument.push(visaDoc3_1._id);
    await employee3.save();

    const visaDoc3_2 = await VisaDocument.create({
      owner: employee3._id,
      type: "I-983",
      fileUrl: "workAuth.jpeg",
      status: "Pending",
      startDate: "1993-03-30",
      endDate: "1993-03-30",
      feedback: "Awaiting HR review",
    });

    // Link visa document
    employee3.VisaDocument.push(visaDoc3_2._id);
    await employee3.save();


     const employee4 = await User.create({
      userName: "citizen4",
      email: "temp@gmail.com",
      password: "Password1!",
      role: "Employee",
      firstName: "New",
      lastName: "User",
      preferredName:'preferred name temp',
      ssn: "323-00-3214",
      DOB: "1997-12-05",
      cellPhone: "999-888-7772",
      address: {
        buildingApt: '2R',
        street: "11 Pine Ln",
        city: "Jersey City",
        state: "NJ",
        zip: "07302",
      },
      workAuth: { isCitizen: "No", kind: "F1" },
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
    await employee4.save();


    const frank = await User.create({
      userName: "frankTemp",
      email: "emp3@gmail.com",
      password: "Password1!",
      role: "Employee",
      firstName: "Frank",
      lastName: "Visa",
      preferredName:'preferred name temp',
      ssn: "222-00-3333",
      DOB: "1993-03-30",
      cellPhone: "999-888-7773",
      address: {
        buildingApt: '2R',
        street: '12 Maple Ave',
        city: 'New York',
        state: 'NY',
        zip: '10001',
      },
      emergencyContacts: [
        {
          firstName: 'tom',
          lastName: 'cat',
          middleName: 'hi',
          phone: '201-943-2923',
          email: 'andrewheo1225@gmail.com',
          relationship: 'friend',
        },
      ],
      workAuth: 'F1',

      driverlicense: {
        fileUrl: 'driverlicense.jpeg',
        hasLicense: 'Yes',
        expirationDate: '1991-01-15',
        number: '111111111',
      },
      profilePicture: 'cat.jpeg',
    });
    console.log(" Employees created with hashed passwords");

    // Create visa document for Frank
    const visaDoc = await VisaDocument.create({
      owner: frank._id,
      type: 'OPT Receipt',
      fileUrl: 'workAuth.jpeg',
      status: 'Pending',
      startDate: '1993-03-30',
      endDate: '1993-03-30',
      feedback: 'Awaiting HR review',
    });

    // Link visa document to Frank
    frank.VisaDocument.push(visaDoc._id);
    await frank.save();


    const visaDoc_frank  = await VisaDocument.create({
      owner: frank._id,
      type: "OPT EAD",
      fileUrl: "workAuth.jpeg",
      status: "Pending",
      startDate: "1993-03-30",
      endDate: "1993-03-30",
      feedback: "Awaiting HR review",
    });

    // Link visa document
    frank.VisaDocument.push(visaDoc_frank._id);
    await frank.save();


    // Assign employees to houses
    houses[0].residents.push(employee1._id, employee2._id);
    houses[1].residents.push(frank._id);
    await Promise.all([houses[0].save(), houses[1].save()]);

    console.log(' Employees assigned to houses');

    // Create HR staff ONE BY ONE to trigger password hashing
    const hr1 = await User.create({
      userName: "hr1",
      email: "hr1@company.com",
      password: "Password1!",
      role: "HR",
      firstName: "David",
      lastName: "Smith",
      ssn: "222-00-1223",
      DOB: "1882-10-10",
      cellPhone: "421-888-7771",
      address: {
        buildingApt: '2R',
        street: '10 Oak Rd',
        city: 'Jersey City',
        state: 'NJ',
        zip: '07302',
      },
      isCitizen: 'Yes',
      reference: {
        firstname: 'Ref',
        lastname: 'One',
        phone: '000',
        email: 'r@r.com',
        relationship: 'Friend',
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
      userName: 'hr2',
      email: 'hr2@company.com',
      password: 'Password1%',
      role: 'HR',
      firstName: 'Bob',
      lastName: 'HR',
      ssn: '111-00-2222',
      DOB: '1988-08-20',
      cellPhone: '123-456-7891',
      address: {
        buildingApt: '2R',
        street: '2 Main St',
        city: 'Edison',
        state: 'NJ',
        zip: '08817',
      },
      emergencyContacts: [
        {
          firstName: 'tom',
          lastName: 'cat',
          middleName: 'hi',
          phone: '201-943-2923',
          email: 'andrewheo1225@gmail.com',
          relationship: 'friend',
        },
      ],
      isCitizen: 'Yes',
    });

    const hr3 = await User.create({
      userName: 'hr3',
      email: 'hr3@company.com',
      password: 'Password1%',
      role: 'HR',
      firstName: 'Charlie',
      lastName: 'HR',
      ssn: '111-00-3333',
      DOB: '1990-01-15',
      cellPhone: '123-456-7892',
      address: {
        buildingApt: '2R',
        street: '3 Main St',
        city: 'Edison',
        state: 'NJ',
        zip: '08817',
      },
      emergencyContacts: [
        {
          firstName: 'tom',
          lastName: 'cat',
          middleName: 'hi',
          phone: '201-943-2923',
          email: 'andrewheo1225@gmail.com',
          relationship: 'friend',
        },
      ],
      isCitizen: 'Yes',
    });

    console.log('HR staff created with hashed passwords');

    console.log('\n Seeding successful!');
    console.log('\n Test Credentials:');
    console.log('Employees: citizen1, citizen2, visa1');
    console.log('HR Staff: hr1, hr2, hr3');
    console.log('Password for all: Password1%');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log(' Error seeding the database:', error);
    process.exit(1);
  }
};

seedDatabase();
