import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database is connected");
  } catch (err) {
    console.log(`Error is ${err.message}`);
  }
};

export default dbConnection;
