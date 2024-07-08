import Category from "../models/CategoryModel.js";

// Create a new category
export const createCategory = async (req, res, next) => {
  console.log(req.body, "name");
  const { name } = req.body;

  try {
    const category = new Category({
      name,
    });

    const savedCategory = await category.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    next(error);
  }
};

// Get all categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};
