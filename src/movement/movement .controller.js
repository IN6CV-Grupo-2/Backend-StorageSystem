import Movement from './movement.model.js';
import Product from '../product/product.model.js';

// Registrar entrada o salida
export const createMovement = async (req, res) => {
  try {
    const { product, type, quantity } = req.body;

    const prod = await Product.findById(product);
    if (!prod) return res.status(404).json({ msg: 'Producto no encontrado' });

    // Actualizar stock
    if (type === 'entrada') prod.quantity += quantity;
    else if (type === 'salida') {
      if (prod.quantity < quantity) return res.status(400).json({ msg: 'Stock insuficiente' });
      prod.quantity -= quantity;
    }

    await prod.save();
    const movement = await Movement.create(req.body);

    res.status(201).json({ msg: 'Movimiento registrado', movement });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Error al registrar movimiento' });
  }
};

// Obtener historial de movimientos (opcional por producto)
export const getMovements = async (req, res) => {
  const { product } = req.query;

  const query = {};
  if (product) query.product = product;

  try {
    const movements = await Movement.find(query).populate('product employee');
    res.status(200).json(movements);
  } catch (e) {
    res.status(500).json({ msg: 'Error al obtener movimientos' });
  }
};

// Obtener un movimiento por ID
export const getMovementById = async (req, res) => {
  try {
    const movement = await Movement.findById(req.params.id).populate('product employee');
    if (!movement) return res.status(404).json({ msg: 'Movimiento no encontrado' });
    res.status(200).json(movement);
  } catch (e) {
    res.status(500).json({ msg: 'Error al obtener movimiento' });
  }
};

// Actualizar movimiento (técnicamente no común, pero se permite)
export const updateMovement = async (req, res) => {
  try {
    const updated = await Movement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ msg: 'Movimiento actualizado', movement: updated });
  } catch (e) {
    res.status(500).json({ msg: 'Error al actualizar movimiento' });
  }
};

// Eliminar un movimiento
export const deleteMovement = async (req, res) => {
  const { confirm } = req.query;

  if (confirm !== 'true') {
    return res.status(400).json({
      msg: 'Confirmación requerida para eliminar el movimiento. Agrega ?confirm=true a la URL.',
    });
  }

  try {
    const deleted = await Movement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Movimiento no encontrado' });

    res.status(200).json({ msg: 'Movimiento eliminado correctamente' });
  } catch (e) {
    res.status(500).json({ msg: 'Error al eliminar movimiento' });
  }
};

