// createAdminUser.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";

const mongoURI = "mongodb://localhost:27017/Shop";

const adminEmail = "admin@example.com";
const adminPassword = "securepassword";
const adminGender = "female";
const adminType = "admin";

const createAdminUser = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminUser = new User({
      email: adminEmail,
      password: hashedPassword,
      gender: adminGender,
      type: adminType,
    });

    await adminUser.save();
    console.log("Admin user created successfully.");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdminUser();
