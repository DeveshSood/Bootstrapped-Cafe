const MenuItem = require('../models/MenuItem');


exports.getAllItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ isAvailable: true }).sort('category');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getByCategory = async (req, res) => {
  try {
    const items = await MenuItem.find({
      category: req.params.category,
      isAvailable: true,
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
