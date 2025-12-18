const mongoose = require('mongoose');
const User = require('./models/User');
const House = require('./models/House');
const VisaDocument = require('./models/VisaDocument');
const dotenv = require('dotenv');

dotenv.config();

const seedDatabase = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);

        await User.deleteMany({});
        await House.deleteMany({});
        await VisaDocument.deleteMany({});

        //3 houses
        const houses = await House.insertMany([
            {
                address: "123 Tech Lane, Edison, NJ",
                landlord: { name: "John Smith", phone: "555-0101", email: "john@landlord.com" },
                facilityInfo: { beds: 4, mattresses: 4, tables: 2, chairs: 4 }
            },
            {
                address: "456 Code Road, Jersey City, NJ",
                landlord: { name: "Jane Doe", phone: "555-0202", email: "jane@landlord.com" },
                facilityInfo: { beds: 3, mattresses: 3, tables: 1, chairs: 3 }
            },
            {
                address: "789 Dev Street, New York, NY",
                landlord: { name: "Bob Builder", phone: "555-0303", email: "bob@landlord.com" },
                facilityInfo: { beds: 6, mattresses: 6, tables: 3, chairs: 6 }
            }
        ]);

        //3 Employee, 2 citizen 1 visa
        const Employee = await User.insertMany([
            {
                userName: "citizen1", email: "emp1@gmail.com", password: "password",
                role: "Employee", firstName: "David", lastName: "Smith", ssn: "222-00-1111", DOB: "1995-10-10",
                cellPhone: "999-888-7771", address: { street: "10 Oak Rd", city: "Jersey City", state: "NJ", zip: "07302" },
                workAuth: { isCitizen: "Yes", kind: "Citizen" },
                reference: { firstname: "Ref", lastname: "One", phone: "000", email: "r@r.com", relationship: "Friend" }
            },
            {
                userName: "citizen2", email: "emp2@gmail.com", password: "password",
                role: "Employee", firstName: "Eve", lastName: "Jones", ssn: "222-00-2222", DOB: "1997-12-05",
                cellPhone: "999-888-7772", address: { street: "11 Pine Ln", city: "Jersey City", state: "NJ", zip: "07302" },
                workAuth: { isCitizen: "Yes", kind: "Citizen" }
            },
            {
                userName: "visa1", email: "emp3@gmail.com", password: "password",
                role: "Employee", firstName: "Frank", lastName: "Visa", ssn: "222-00-3333", DOB: "1993-03-30",
                cellPhone: "999-888-7773", address: { street: "12 Maple Ave", city: "New York", state: "NY", zip: "10001" },
                workAuth: { isCitizen: "No", kind: "F1(CPT/OPT)" }
            }
        ]);

        //1 visa for simplicity
        const frank = Employee[2];
        const visaDoc = await VisaDocument.create({
            owner: frank._id,
            type: 'OPT Receipt',
            fileUrl: "https://placeholder-aws-s3.com/opt-receipt-frank.pdf",
            status: 'Pending',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2025-01-01'),
            feedback: "Awaiting HR review"
        });

        //linking the models entity
        frank.VisaDocument.push(visaDoc._id);
        await frank.save();

        houses[0].residents.push(Employee[0]._id, Employee[1]._id);
        houses[1].residents.push(frank._id);
        await Promise.all([houses[0].save(), houses[1].save()]);

        const HR_Staff = await User.insertMany([
            {
                userName: "hr1", email: "hr1.com", password: "password",
                role: "HR", firstName: "Alice", lastName: "HR", ssn: "111-00-1111", DOB: "1985-05-12",
                cellPhone: "123-456-7890", address: { street: "1 Main St", city: "Edison", state: "NJ", zip: "08817" },
                workAuth: { isCitizen: "Yes", kind: "Citizen" },
            },
            {
                userName: "hr2", email: "hr2.com", password: "password",
                role: "HR", firstName: "Bob", lastName: "HR", ssn: "111-00-2222", DOB: "1988-08-20",
                cellPhone: "123-456-7891", address: { street: "2 Main St", city: "Edison", state: "NJ", zip: "08817" },
                workAuth: { isCitizen: "Yes", kind: "Citizen" },
            },
            {
                userName: "hr3", email: "hr3.com", password: "password",
                role: "HR", firstName: "Charlie", lastName: "HR", ssn: "111-00-3333", DOB: "1990-01-15",
                cellPhone: "123-456-7892", address: { street: "3 Main St", city: "Edison", state: "NJ", zip: "08817" },
                workAuth: { isCitizen: "Yes", kind: "Citizen" },
            }
        ]);
        console.log("seeding successfull");
        await mongoose.connection.close();
        process.exit(0);
    }
    catch(error){
        console.log("error seeding the database : " + error);
    }
}
seedDatabase();