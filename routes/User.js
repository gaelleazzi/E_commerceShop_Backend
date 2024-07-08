import express from "express";
import {
  createUser,
  getUsers,
  signInUser,
  getUsersPerPage,
} from "../controllers/UserController.js";

const router = express.Router();

// Define your user routes here
router.post("/register", createUser);
router.post("/signin", signInUser);
router.get("/all", getUsers);
router.get("/:perPage", getUsersPerPage);
export default router;
