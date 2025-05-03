import Product from './product.model.js';
import Provider from '../provider/provider.model.js';

export const createProduct = async (req, res) => {
  try {
    const data = req.body;

    const provider = await Provider.findById(data.provider);

    const product = await Product.create({
        name: data.name,
        category: data.category,
        quantity: data.quantity,
        provider: provider._id,
        entryDate: data.entryDate,
        expirationDate: data.expirationDate,
        stockAlertLevel: data.stockAlertLevel, 
    });

    provider.products.push(product._id);
    await provider.save()

    res.status(201).json({
       msg: 'Product added successfully.', 
       product 
    });

  } catch (e) {
    res.status(500).json({ 
      msg: 'Error adding product.',
      error: e.message 
    });
  }
};

export const getProducts = async (req, res) => {
  try {
  const { name, category, entryDate } = req.query;

  const query = {
    ...(name && { name: { $regex: name, $options: 'i' } }),
    ...(category && { category }),
    ...(entryDate && { entryDate: { $gte: new Date(entryDate) } })
  };
  
  
    const products = await Product.find(query).populate('category').populate('provider');
    res.status(200).json(
      message = 'Products retrieved successfully.',
      products
    );
  } catch (e) {
    res.status(500).json({
      msg: 'Error retrieving products.',
      error: e.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {

    const { id } = req.params;
  
    const product = await Product.findById(id).populate('category').populate('provider');

    res.status(200).json(
      msg = 'Product retrieved successfully.',
      product
    );

  } catch (e) {
    res.status(500).json({
      msg: 'Error retrieving product.',
      error: e.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const data = req.body;

    const provider = await Provider.findById(data.provider);

    const oldProduct = await Product.findById(id);

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    if (provider){
        // Si el proveedor es diferente al actual, eliminar el producto del proveedor anterior
        if (oldProduct.provider.toString() !== provider._id.toString()) {
            const oldProvider = await Provider.findById(oldProduct.provider);
            oldProvider.products = oldProvider.products.filter(p => p.toString() !== id);
            await oldProvider.save();
        }
        // Agregar el producto al nuevo proveedor
        provider.products.push(product._id);
        await provider.save()
    }

    res.status(200).json({
       msg: 'Product updated successfully.', 
       product 
    });

  } catch (e) {
    res.status(500).json({
      msg: 'Error updating product.',
      error: e.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {

    const { id } = req.params;
    
    const product = await Product.findByIdAndDelete(id);

    res.status(200).json({
       msg: 'Product deleted successfully.',
       product
    });
  } catch (e) {
    res.status(500).json({
       msg: 'Error deleting product.',
       error: e.message
    });
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
