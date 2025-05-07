import Product from './product.model.js';
import Provider from '../provider/provider.model.js';
import Movement from '../movement/movement.model.js';

export const createProduct = async (req, res) => {
  try {
    const data = req.body;

    const provider = await Provider.findById(data.provider);

    const product = await Product.create({
      name: data.name,
      category: data.category,
      quantity: data.quantity,
      price: data.price,
      provider: provider._id,
      entryDate: data.entryDate,
      expirationDate: data.expirationDate,
      stockAlertLevel: data.stockAlertLevel,
    });

    provider.products.push(product._id);
    await provider.save();

    res.status(201).json({
      msg: "Product added successfully.",
      product,
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Error adding product.",
      error: e.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    if(Object.keys(req.query).length > 0 ){

      const { name, category, entryDate } = req.query;

      const query = {
        ...(name && { name: { $regex: name, $options: "i" } }),
        ...(category && { category }),
        ...(entryDate && { entryDate: { $gte: new Date(entryDate) } }),
      };
      
        const products = await Product.find(query)
        .populate("category")
        .populate("provider");

        res.status(200).json({
        message:"Products retrieved successfully.",
        products
      });
    }

    const products = await Product.find()
      
     res.status(200).json({
      message : "Products retrieved successfully.",
      products
    });

  } catch (e) {
     res.status(500).json({
      msg: "Error retrieving products.1",
      error: e.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("category")
      .populate("provider");

    res.status(200).json({
      msg : "Product retrieved successfully.",
      product
    });
  } catch (e) {
    res.status(500).json({
      msg: "Error retrieving product.",
      error: e.message,
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

    if (provider) {
      // Si el proveedor es diferente al actual, eliminar el producto del proveedor anterior
      if (oldProduct.provider.toString() !== provider._id.toString()) {
        const oldProvider = await Provider.findById(oldProduct.provider);
        oldProvider.products = oldProvider.products.filter(
          (p) => p.toString() !== id
        );
        await oldProvider.save();
      }
      // Agregar el producto al nuevo proveedor
      provider.products.push(product._id);
      await provider.save();
    }

    res.status(200).json({
      msg: "Product updated successfully.",
      product,
    });
  } catch (e) {
    res.status(500).json({
      msg: "Error updating product.",
      error: e.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    const provider = await Provider.findById(product.provider);

    if (provider) {
      provider.products = provider.products.filter((p) => p.toString() !== id);
      await provider.save();
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      msg: "Product deleted successfully.",
      product,
    });

  } catch (e) {
    res.status(500).json({
      msg: "Error deleting product.",
      error: e.message,
    });
  }
};

export const getInventoryReport = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('provider', 'name');

    const { totalStock, totalValue, productList } = products.reduce(
      (acc, product) => {
        const value = product.quantity * product.price;
        acc.totalStock += product.quantity;
        acc.totalValue += value;

        acc.productList.push({
          nombre: product.name,
          cantidad: product.quantity,
          precioUnitario: product.price,
          valorTotal: value,
        });

        return acc;
      },
      { totalStock: 0, totalValue: 0, productList: [] }
    );

    res.status(200).json({
      resumen: {
        totalStock,
        valorTotalInventario: totalValue,
      },
      productos: productList,
    });
  } catch (err) {
    res.status(500).json({
      mensaje: 'Error during inventory report generation',
      error: err.message || err,
    });
  }
};

export const getMovementReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        msg: 'Debe proporcionar las fechas de inicio y fin en el query: startDate y endDate',
      });
    }

    const movements = await Movement.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).populate('product', 'name price');

    let totalEntradas = 0;
    let totalSalidas = 0;

    const detalleMovimientos = movements.map((m) => {
      const valorTotal = (m.product?.price || 0) * m.quantity;

      if (m.type === 'entrada') {
        totalEntradas += valorTotal;
      } else if (m.type === 'salida') {
        totalSalidas += valorTotal;
      }

      return {
        producto: m.product?.name || 'Producto desconocido',
        tipo: m.type,
        cantidad: m.quantity,
        precioUnitario: m.product?.price || 0,
        valorTotal,
        fecha: m.date,
      };
    });

    res.status(200).json({
      periodo: {
        inicio: startDate,
        fin: endDate,
      },
      resumen: {
        totalEntradas,
        totalSalidas,
        saldo: totalEntradas - totalSalidas,
        totalMovimientos: detalleMovimientos.length,
      },
      movimientos: detalleMovimientos,
    });
  } catch (err) {
    res.status(500).json({
      msg: 'Error al generar el informe de movimientos',
      error: err.message || err,
    });
  }
};

export const getProductStatistics = async (req, res) => {
  try {
    const stats = await Movement.aggregate([
      {
        $group: {
          _id: '$product',
          totalEntradas: {
            $sum: { $cond: [{ $eq: ['$type', 'ENTRY'] }, '$quantity', 0] },
          },
          totalSalidas: {
            $sum: { $cond: [{ $eq: ['$type', 'EXIT'] }, '$quantity', 0] },
          },
          totalMovimientos: { $sum: '$quantity' },
          primeraActividad: { $min: '$date' },
          ultimaActividad: { $max: '$date' }
        }
      },
      { $sort: { totalMovimientos: -1 } },
      { $limit: 10 }
    ]);

    const enriched = await Promise.all(stats.map(async (item) => {
      const product = await Product.findById(item._id).select('name category price stock');

      return {
        producto: product?.name || 'Desconocido',
        categoria: product?.category || 'N/A',
        precioUnitario: product?.price || 0,
        stockActual: product?.quantity ?? 0,
        totalEntradas: item.totalEntradas,
        totalSalidas: item.totalSalidas,
        totalMovimientos: item.totalMovimientos,
        primeraActividad: item.primeraActividad,
        ultimaActividad: item.ultimaActividad,
        promedioMovimiento: item.totalMovimientos / ((new Date(item.ultimaActividad) - new Date(item.primeraActividad)) / (1000 * 60 * 60 * 24) || 1) // promedio por día
      };
    }));

    res.status(200).json({
      productosMasMovidos: enriched
    });

  } catch (err) {
    res.status(500).json({
      msg: 'Error al obtener estadísticas de productos',
      error: err.message || err
    });
  }
};
