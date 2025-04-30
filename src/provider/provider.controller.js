import Provider from "./provider.model.js"
import Product from "../products/product.model.js"

export const saveProvider = async (req, res) => {
    try {
        const data = req.body;

        const product = await Product.findById(data.ProductId);
        

        const provider = await Provider.create({
            name: data.name,
            email: data.email,
            phone: data.phone
        });

        if (product){
            provider.products.push(product);
            await provider.save();
        };

        res.status(201).json({
            message: "Provider added successfully",
            provider
        });
    
    } catch (error) {
        res.status(500).json({
            message:"Error adding provider",
            error: error.message
        })
    }
}

export const getProviders = async (req, res) => {
    try {
        const providers = await Provider.find().populate('products');
        res.status(200).json({
            message: "Providers retrieved successfully",
            providers
        });
    } catch (error) {
        res.status(500).json({
            message:"Error retrieving providers",
            error: error.message
        })
    }
}

export const getProviderById = async (req, res) => {    
    try {
        const { id } = req.params;
        const provider = await Provider.findById(id).populate('products');
        
        res.status(200).json({
            message: "Provider retrieved successfully",
            provider
        });
    } catch (error) {
        res.status(500).json({
            message:"Error retrieving provider",
            error: error.message
        })
    }
}

export const updateProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const provider = await Provider.findByIdAndUpdate(id, data, { new: true }).populate('products');
        
        res.status(200).json({
            message: "Provider updated successfully",
            provider
        });
    } catch (error) {
        res.status(500).json({
            message:"Error updating provider",
            error: error.message
        })
    }
}

export const deleteProvider = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Provider.findByIdAndDelete(id);
        
        res.status(200).json({
            message: "Provider deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message:"Error deleting provider",
            error: error.message
        })
    }
}
export const addProductToProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;
        
        const provider = await Provider.findById(id);
        const product = await Product.findById(productId);
        
        provider.products.push(product);
        await provider.save();
        product.provider = provider._id;
        await product.save();
        
        res.status(200).json({
            message: "Product added to provider successfully",
            provider
        });
    } catch (error) {
        res.status(500).json({
            message:"Error adding product to provider",
            error: error.message
        })
    }
}

