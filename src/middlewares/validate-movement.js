import Movement from "../movement/movement.model.js";
import Product from "../products/product.model.js";

export const canCreateMovement = async (req, res, next) => {
    const data = req.body;
    
    const prod = await Product.findById(data.product);

    const hasSufficientStock = prod.quantity >= data.quantity;
    
      if (!hasSufficientStock) {
        return res.status(400).json({
          msg: "Insufficient stock to carry out the exit.",
          currentStock: prod.quantity,
          requested: data.quantity
        });
      }
      if (data.type !== "entrada" || data.type !== "salida") {
        return res.status(400).json({
            msg: "Invalid type of movement. Use 'entrada' or 'salida'.",
            currentType: data.type
        });  
      }
    next();
}

export const canUpdateMovement = async (req, res, next) => {    
    const { id } = req.params;
    const data = req.body;
    
    const movement = await Movement.findById(id);
    if (!movement) {
        return res.status(404).json({
            msg: "Movement not found",
        });
    }
    
    const prod = await Product.findById(data.product);
    if (!prod) {
        return res.status(404).json({
            msg: "Product not found",
        });
    }
    
    const hasSufficientStock = prod.quantity >= data.quantity;
    
      if (!hasSufficientStock) {
        return res.status(400).json({
          msg: "Insufficient stock to carry out the exit.",
          currentStock: prod.quantity,
          requested: data.quantity
        });
      }
      if (data.type !== "entrada"|| data.type !== "salida") {
        return res.status(400).json({
            msg: "Invalid type of movement. Use 'entrada' or 'salida'.",
            currentType: data.type
        });  
      }
    next();
}

export const canDeleteMovement = async (req, res, next) => {
    const { id } = req.params;
    const {confirm} = req.body

    
    const movement = await Movement.findById(id);
    if (!movement) {
        return res.status(404).json({
            msg: "Movement not found",
        });
    }
    
    const prod = await Product.findById(movement.product);
    if (!prod) {
        return res.status(404).json({
            msg: "Product not found",
        });
    }
    
    if (!confirm) {
        return res.status(400).json({
            msg: "Are you sure you want to delete this movement? Send a 'true' value to confirm.",
        });
    }
    
    next();
}
