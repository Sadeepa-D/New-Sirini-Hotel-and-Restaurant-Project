const Liquor = require("../../models/Liquor");

const getLiquorStockValue = async (req, res) => {
  try {
    const liquors = await Liquor.find({});
    let totalValue = 0;
    const items = liquors.map(liquor => {
      const stock = liquor.currentQuantityInBottles || 0;
      const buyingPrice = liquor.buyingPrice || 0;
      const value = stock * buyingPrice;
      totalValue += value;
      return {
        name: liquor.name,
        stock,
        value
      };
    });
    
    items.sort((a, b) => b.value - a.value);

    res.json({ totalValue, items });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch liquor stock value", error });
  }
};

const getLiquorStockLevels = async (req, res) => {
  try {
    const liquors = await Liquor.find({});
    const items = liquors.map(liquor => {
      return {
        name: liquor.name,
        stock: liquor.currentQuantityInBottles || 0,
        minStock: liquor.lowStockThreshold || 0,
      };
    });

    items.sort((a, b) => {
      const aDiff = a.stock - a.minStock;
      const bDiff = b.stock - b.minStock;
      return aDiff - bDiff;
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch liquor stock levels", error });
  }
};

const getLiquorCategoryStock = async (req, res) => {
  try {
    const liquors = await Liquor.find({});
    const categoryMap = {};

    liquors.forEach(liquor => {
      const category = liquor.category || "Other";
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += liquor.currentQuantityInBottles || 0;
    });

    const data = Object.keys(categoryMap).map(key => ({
      name: key,
      value: categoryMap[key]
    })).filter(item => item.value > 0);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category stock", error });
  }
};

const getLiquorBrandProfit = async (req, res) => {
  try {
    const liquors = await Liquor.find({});
    const itemMap = {};
    let totalProfit = 0;

    liquors.forEach(liquor => {
      const itemName = liquor.name || "Unknown";
      const stock = liquor.currentQuantityInBottles || 0;
      const sellingPrice = liquor.sellingPrice || 0;
      const buyingPrice = liquor.buyingPrice || 0;
      const profitPerBottle = sellingPrice - buyingPrice;
      const totalProjectedProfit = profitPerBottle * stock;

      if (!itemMap[itemName]) {
        itemMap[itemName] = 0;
      }
      itemMap[itemName] += totalProjectedProfit;
      totalProfit += totalProjectedProfit;
    });

    const data = Object.keys(itemMap).map(key => ({
      name: key,
      profit: itemMap[key]
    })).sort((a, b) => b.profit - a.profit);

    res.json({ totalProfit, items: data });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch brand profit", error });
  }
};

module.exports = {
  getLiquorStockValue,
  getLiquorStockLevels,
  getLiquorCategoryStock,
  getLiquorBrandProfit
};
