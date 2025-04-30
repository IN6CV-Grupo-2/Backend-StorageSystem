import Provider from "../provider/provider.model.js";
import Product from "../products/product.model.js";

export const canSaveProvider = async( req, res, next) =>{
    const data = req.body;

    const product = await Product.findById(data.ProductId);
        if(product !== null){
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
        }
    next();
}

export const canGetProviders = async( req, res, next) =>{
    const { id } = req.params;

        if (id) {
            const provider = await Provider.findById(id).populate('products');
            if (!provider) {
                return res.status(404).json({
                    message: "Provider not found"
                });
            }
        }

    const providers = await Provider.find().populate('products');
        if (!providers) {
            return res.status(404).json({
                message: "Providers not found"
            });
        }
    next();
}

export const canUpdateProvider = async( req, res, next) =>{
    const { id } = req.params;
    const data = req.body;

    const provider = await Provider.findById(id).populate('products');
        if (!provider) {
            return res.status(404).json({
                message: "Provider not found"
            });
        }

    const product = await Product.findById(data.ProductId);
        if(product!==null){
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
        }
        
    next();
}


export const canDeleteProvider = async( req, res, next) =>{
    const { id } = req.params;

    const provider = await Provider.findById(id).populate('products');
        if (!provider) {
            return res.status(404).json({
                message: "Provider not found"
            });
        }
    next();
}