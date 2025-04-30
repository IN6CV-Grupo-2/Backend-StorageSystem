import Customer from "../customer/customer.model.js";

export const canGetCustomers = async (req, res, next) => {
    const { id } = req.params;

        if (!id) {
            const customer = await Customer.findById(id);
            if (!customer) {
                return res.status(404).json({
                    message: "Customer not found"
                });
            }
        }

    const customers = await Customer.find();
        if (!customers) {
            return res.status(404).json({
                message: "Customers not found"
            });
        }

    next();
}

export const customerNotFound = async (req, res, next) => {
    const { id } = req.params;

    const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }
    next();
}
