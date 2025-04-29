import Customer from "./customer.model";

export const saveCustomer = async (req, res) => {
    
    try {
        const data = req.body;

        const customer = await Customer.create({
            name: data.name,
            email: data.email,
            phone: data.phone
        });

        res.status(201).json({
            message: "Customer added successfully",
            customer
        });  
    } catch (error) {
        res.status(500).json({
            message: "Error adding customer",
            error: error.message

        });
    }
}

export const getCustomers = async (req, res) => {
    try {
        const customer = await Customer.find();
        res.status(200).json({
            message: "Customers retrieved successfully",
            customer
        });
    } catch (error) {
        res.status(500).json({
            message:"Error retrieving customers",
            error: error.message
        });
    }
}

export const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findById(id);
        
        res.status(200).json({
            message: "Customer retrieved successfully",
            customer
        });
    } catch (error) {
        res.status(500).json({
            message:"Error retrieving customer",
            error: error.message
        })
    }
}

export const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const customer = await Customer.findByIdAndUpdate(id, data, { new: true });
        
        res.status(200).json({
            message: "Customer updated successfully",
            customer
        });
    } catch (error) {
        res.status(500).json({
            message:"Error updating customer",
            error: error.message
        })
    }
}

export const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Customer.findByIdAndDelete(id);
        
        res.status(200).json({
            message: "Customer deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message:"Error deleting customer",
            error: error.message
        })
    }
}