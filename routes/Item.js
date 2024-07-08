import express from "express";
import {
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
  deleteAllItems,
  getItemById,
} from "../controllers/ItemController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Folder where the images will be stored , callback
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the original file extension
  },
});
const upload = multer({ storage: storage });

// Define your user routes here
router.post("/create", upload.single("image"), createItem);
router.get("/all", authMiddleware, getAllItems);
router.get("/:id", getItemById);
router.put("/update/:itemId", authMiddleware, adminMiddleware, updateItem);
router.delete("/delete/:itemId", authMiddleware, adminMiddleware, deleteItem);
router.delete("/delete", authMiddleware, adminMiddleware, deleteAllItems);

export default router;
