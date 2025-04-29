import Product from './product.model.js';

//  Registrar un producto
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ msg: 'Producto creado', product });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Error al crear producto' });
  }
};

//  Obtener todos los productos (con filtros)
export const getProducts = async (req, res) => {
  const { name, category, entryDate } = req.query;

  const query = {};
  if (name) query.name = { $regex: name, $options: 'i' };
  if (category) query.category = category;
  if (entryDate) query.entryDate = { $gte: new Date(entryDate) };

  try {
    const products = await Product.find(query).populate('category');
    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ msg: 'Error al obtener productos' });
  }
};

//  Obtener un producto por ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate('category');
    if (!product) return res.status(404).json({ msg: 'Producto no encontrado' });
    res.status(200).json(product);
  } catch (e) {
    res.status(500).json({ msg: 'Error al obtener producto' });
  }
};

//  Editar un producto
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ msg: 'Producto actualizado', product: updated });
  } catch (e) {
    res.status(500).json({ msg: 'Error al actualizar producto' });
  }
};

//  Eliminar un producto 
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { confirm } = req.query; // confirmación vía query string

  if (confirm !== 'true') {
    return res.status(400).json({
      msg: 'Confirmación requerida para eliminar el producto. Agrega ?confirm=true a la URL.',
    });
  }

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: 'Producto no encontrado' });

    res.status(200).json({ msg: 'Producto eliminado correctamente' });
  } catch (e) {
    res.status(500).json({ msg: 'Error al eliminar producto' });
  }
};
// Reporte Del Invertario
export const getInventoryReport = async (req, res) => {
  try {
    const products = await Product.find();
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);

    const productDetails = products.map(p => ({
      name: p.name,
      stock: p.stock,
      unitPrice: p.price,
      totalValue: p.stock * p.price,
    }));

    res.json({ totalStock, totalValue, products: productDetails });
  } catch (err) {
    res.status(500).json({ msg: 'Error al generar el informe de inventario', err });
  }
};

// Informe de movimientos por fecha
export const getMovementReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const movements = await Movement.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).populate('product');

    res.json(movements);
  } catch (err) {
    res.status(500).json({ msg: 'Error al generar el informe de movimientos', err });
  }
};

// Estadísticas: productos más movidos
export const getProductStatistics = async (req, res) => {
  try {
    const stats = await Movement.aggregate([
      {
        $group: {
          _id: '$product',
          totalEntries: {
            $sum: { $cond: [{ $eq: ['$type', 'ENTRY'] }, '$quantity', 0] },
          },
          totalExits: {
            $sum: { $cond: [{ $eq: ['$type', 'EXIT'] }, '$quantity', 0] },
          }
        }
      },
      { $sort: { totalExits: -1 } },
      { $limit: 10 }
    ]);

    const enriched = await Promise.all(stats.map(async s => {
      const product = await Product.findById(s._id);
      return {
        product: product?.name || 'Desconocido',
        totalEntries: s.totalEntries,
        totalExits: s.totalExits
      };
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener estadísticas', err });
  }
};
