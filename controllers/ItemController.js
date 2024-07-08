import Item from "../models/ItemModel.js";

export const createItem = async (req, res, next) => {
  const { name, qty, price, category } = req.body;
  const image = req.file ? req.file.path : null;
  console.log(req.file);
  try {
    const item = new Item({
      name,
      qty,
      price,
      category,
      image,
    });

    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    next(err);
  }
};

export const getItemById = async (req, res, next) => {
  const itemId = req.params.id;
  console.log("itemId", itemId);
  // const { query } = req.query;
  // console.log("query", query);
  try {
    const item = await Item.findById(itemId)
      .select("name price qty category image _id")
      .populate("category", "name")
      .exec();

    if (!item) {
      const error = new Error("Item not found");
      error.statusCode = 404;
      throw error;
    }

    const response = {
      item: {
        _id: item._id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        category: item.category.name,
        image: item.image,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find().populate("category", "name");

    const itemsWithCategoryNames = items.map((item) => ({
      ...item.toObject(),
      category: item.category.map((cat) => cat.name),
    }));
    res.status(200).json(itemsWithCategoryNames);
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  const itemId = req.params.itemId;
  const updatePayload = req.body;

  try {
    const updatedItem = await Item.findByIdAndUpdate(itemId, updatePayload, {
      new: true,
    });
    if (!updatedItem) {
      const error = new Error("Item not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  const itemId = req.params.itemId;

  try {
    const deletedItem = await Item.findByIdAndDelete(itemId);
    if (!deletedItem) {
      const error = new Error("Item not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Item deleted successfully",
      deletedItem: deletedItem,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAllItems = async (req, res, next) => {
  try {
    const deletedItems = await Item.deleteMany();

    res.status(200).json("all items are deleted");
  } catch (err) {
    next(err);
  }
};
