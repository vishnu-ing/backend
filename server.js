const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const PORT = process.env.PORT || 5000;

dotenv.config();

//can move this function to dedicated connection file if needed, dont think our project is big enough
const connectDB = async ()=>{
    try {
        const con = await mongoose.connect(process.env.MONGO_URI);
        console.log('database connection success: ' + con.connection.host);
    } catch (error) {
        console.log(`connection to database failed, error: ${error}`);
    }
}
connectDB();


const app = express();
app.use(express.json());

app.listen(PORT,()=>{
    console.log(`server running at port: ${PORT}`);
});