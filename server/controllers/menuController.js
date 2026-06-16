const MenuItem = require('../models/MenuItem');

// GET /api/menu — All menu items
exports.getAllItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ isAvailable: true }).sort('category');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/menu/:category — Items by category
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
