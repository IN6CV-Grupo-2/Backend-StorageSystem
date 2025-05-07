import Movement from './movement.model.js';
import Product from '../products/product.model.js';

export const createMovement = async (req, res) => {
  try {
    const data = req.body;

    const prod = await Product.findById(data.product);

    if (data.type === "entrada") {
      prod.quantity += data.quantity;
    } else if (data.type === "salida") {
      prod.quantity -= data.quantity;
    }  
    
    await prod.save();
    const movement = await Movement.create({
      ...data,
      employee: req.user._id,
    });

    res.status(201).json({
      msg: "Movement registered successfully",
      movement,
    });
  } catch (e) {
    res.status(500).json({
      msg: "Error registering movement",
      error: e.message,
    });
  }
};

export const getMovements = async (req, res) => {
  try {
    const { product } = req.query;

    const query = {};

    if (product) {
      query.product = product;
    }

    const movements = await Movement.find(query)
      .populate('product')
      .populate('employee');

    res.status(200).json({
      message: 'Movements retrieved successfully',
      movements
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving movements',
      error: error.message
    });
  }
};

export const getMovementById = async (req, res) => {
  try {
    const { id } = req.params;

    const movement = await Movement.findById(id)
      .populate("product")
      .populate("employee");

    if (!movement)
      return res.status(404).json({
        msg: "Movement not found",
      });

    res.status(200).json({
      msg: "Movement found",
      movement,
    });
  } catch (e) {
    res.status(500).json({
      msg: "Error retrieving movement",
      error: e.message,
    });
  }
};

export const updateMovement = async (req, res) => {
  try {

    const { id } = req.params;
    const { product, type, quantity } = req.body;

    const movement = await Movement.findById(id);

    const prod = await Product.findById(product);

    if (type === "entrada") {
      prod.quantity += quantity;
    }
    else if (type === "salida") {
      prod.quantity -= quantity;
    } 
    await prod.save();
    movement.product = product;
    movement.type = type;
    movement.quantity = quantity;
    movement.employee = req.user._id; 
    movement.date = new Date(); 
    movement.reason = req.body.reason || movement.reason; 
    movement.destination = req.body.destination || movement.destination; 
    await movement.save();

    res.status(200).json({ 
      msg: "Movement updated successfully", 
      movement
    });
  } catch (e) {
    res.status(500).json({ 
      msg: "Error updating movement", 
      error: e.message
    });
  }
};

export const deleteMovement = async (req, res) => {
  try {
    const { id } = req.params;

    const movement = await Movement.findById(id);

    const prod = await Product.findById(movement.product);

    if (movement.type === "entrada") {
      prod.quantity -= movement.quantity;
    } else if (movement.type === "salida") {
      prod.quantity += movement.quantity;
    }

    await prod.save();
    await Movement.findByIdAndDelete(id);

    res.status(200).json({
      msg: "Movement deleted successfully.",
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Error al eliminar movimiento",
      error: e.message,
    });
  }
};

