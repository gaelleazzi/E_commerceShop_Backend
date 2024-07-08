// Import necessary modules
import Mock from "mockjs";
import mongoose from "mongoose";
import User from "../models/UserModel.js";

// MongoDB connection URI
const mongoURI = "mongodb://localhost:27017/Shop";

// Function to create mock users
const createManyUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Define a template for mock data using Mock.js syntax
    const template = {
      "users|2": [
        {
          email: () => Mock.Random.guid() + "@example.com",
          type: "user", // Assuming 'type' is a required field with a default value
          gender: Mock.Random.pick(["male", "female"]), // Assuming 'gender' is a required field with a random value
          password: "@string",
        },
      ],
    };

    // Generate mock data based on the template
    const mockData = Mock.mock(template).users;

    // Batch insert users to the database in chunks of 100
    const chunkSize = 100;
    for (let i = 0; i < mockData.length; i += chunkSize) {
      const chunk = mockData.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map(async (userData) => {
          const user = new User(userData);
          return await user.save();
        })
      );
    }

    console.log(`Created ${mockData.length} users.`);
  } catch (error) {
    console.error("Error creating users:", error);
  } finally {
    // Disconnect from MongoDB after operation completes
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

// Call the function to create users
createManyUsers();
