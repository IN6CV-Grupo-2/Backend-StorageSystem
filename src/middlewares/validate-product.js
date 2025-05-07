import Product from "../products/product.model.js";
import Provider from "../provider/provider.model.js";

export const canGetProducts = async (req, res, next) => {
    const { id } = req.params;
    
            if (id) {
                const product = await Product.findById(id);
                if (!product) {
                    return res.status(404).json({
                        message: "Product not found"
                    });
                }
            }
    
        const products = await Product.find();
            if (!products) {
                return res.status(404).json({
                    message: "Products not found"
                });
            }
    
        next();
}

export const canCreateProduct = async (req, res, next) => {
    const { name, category, provider } = req.body;

    const providers = await Provider.findById(provider);
    if (!providers) {
        return res.status(404).json({
        msg: "Provider not found.",
        });
    }
    
    if (!name || !category ) {
        return res.status(400).json({
        msg: "Missing required fields: name, category, entryDate.",
        });
    }
    
    next();
}

export const canUpdateProduct = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({
            msg: "Product not found.",
        });
    }   

    const providerId = data.provider;
    const provider = await Provider.findById(providerId);
    if(provider !== null){
        if (!provider) {
            return res.status(404).json({
            msg: "Provider not found.",
            });
        }  
    }
    


    next();
}

export const canDeleteProduct = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    const {confirm} = req.body

    if (!product) {
        return res.status(404).json({
            msg: "Product not found.",
        });
    }

    if (!confirm) {
        return res.status(400).json({
            msg: "Are you sure you want to delete this product? Send a 'true' value to confirm.",
        });
    }


    next();
}
