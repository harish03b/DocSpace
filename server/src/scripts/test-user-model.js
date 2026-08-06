import mongoose from "mongoose";

import connectDatabase from "../config/database.js";
import User from "../modules/user/user.model.js";

const testUserModel = async () => {
  try {
    await connectDatabase();

    const existingUser = await User.findOne({
      email: "harish@example.com",
    });

    if (existingUser) {
      console.log("⚠️ Test user already exists.");
    } else {
      const user = await User.create({
        name: "Harish Thakre",
        email: "harish@example.com",
        password: "password123",
      });

      console.log("✅ User Created Successfully");
      console.log(user);
    }

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

testUserModel();