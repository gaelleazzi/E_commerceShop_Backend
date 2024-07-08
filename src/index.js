import express, { request, response } from "express";
import mongoose from "mongoose";
import userroutes from "../routes/User.js";
import itemroutes from "../routes/Item.js";
import categoryroutes from "../routes/Category.js";
import authMiddleware from "../middleware/authMiddleware.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
//makes the folder statically publicly available
app.use(express.static("uploads"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// app.use(authMiddleware);
app.use("/user", userroutes);
app.use("/item", itemroutes);
app.use("/category", categoryroutes);

app.use((error, req, res, next) => {
  console.error(error); // Log the error for debugging purposes
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect("mongodb://localhost:27017/Shop")
  .then((result) => {
    console.log("Connected to mongodb from shop");
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
