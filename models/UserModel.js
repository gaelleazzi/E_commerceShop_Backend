import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  type: { type: String, enum: ["admin", "user"], required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
