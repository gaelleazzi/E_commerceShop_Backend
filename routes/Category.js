import express from "express";
import {
  createCategory,
  getCategories,
} from "../controllers/CategoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// POST /api/categories
router.post("/create", authMiddleware, adminMiddleware, createCategory);

// GET /api/categories
router.get("/get", authMiddleware, adminMiddleware, getCategories);

export default router;
