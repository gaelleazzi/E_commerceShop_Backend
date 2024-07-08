import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Controller to handle user registration
export const createUser = async (req, res, next) => {
  const { email, password, confirmPassword, gender, type } = req.body;

  try {
    //12 round before creating the hashed password
    const hashedPassword = await bcrypt.hash(password, 12);
    const hashedComfirmPassword = await bcrypt.hash(confirmPassword, 12);

    // Check if passwords match
    if (password !== confirmPassword) {
      const error = new Error("Passwords do not match");
      error.statusCode = 422;
      throw error;
    }

    // Create new user
    const user = new User({
      email: email,
      password: hashedPassword,
      confirmPassword: hashedComfirmPassword,
      gender: gender,
      type: type,
    });

    // Save user to database
    await user.save();

    res
      .status(201)
      .json({ message: "User created successfully", userId: user._id });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const signInUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Verify password
    const isMatch = password === user.password;

    if (!isMatch) {
      const error = new Error("Password is incorrect");
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT token

    const token = jwt.sign(
      { userId: user._id, type: user.type },
      "yourSecretKey",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Sign-in successful", token });
  } catch (err) {
    next(err);
  }
};

export const getUsersPerPage = async (req, res, next) => {
  const UserPerPage = req.params.perPage; // Default per page to 10 if not provided
  const pageNumber = req.query.pageNumber; // Default page number to 1 if not provided

  console.log(UserPerPage, "perPage");
  console.log(pageNumber, "pageNumber");

  try {
    // Calculate skip value based on page number and items per page
    const skip = (pageNumber - 1) * UserPerPage;

    // Query MongoDB using skip and limit
    const users = await User.find({ gender: "female" })
      .skip(skip)
      .limit(UserPerPage)
      .exec();

    res.status(200).json({
      pageNumber,
      UserPerPage,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    next(error);
  }
};
