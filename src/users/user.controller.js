import User from "./user.model.js"

export const getUsers = async (req,res) => {
    try {
        const query = {estado:true}
        
        const [total,users] = await Promise.all([
            User.countDocuments(query),
            User.find(query).populate("role")
        ])
        
        res.status(200).json({
            ss: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to get users.",
            error: error.message
        })
    }
}

export const updateUser = async (req,res) => {
    try {
        const {id} = req.params
        const {password,...data} = req.body
        const updatedUser = await User.findByIdAndUpdate(id,data,{new:true})

        res.status(200).json({
            ss: true,
            msg: 'Update successful.',
            updatedUser
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Failed to update user.",
            error: error.message
        })
    }
}

export const deleteUser = async (req,res) => {
    try {
        const {id} = req.params
        const user = await User.findByIdAndUpdate(id,{estado:false},{new:true})
        res.status(200).json({
            ss:true,
            message: "Successfully deleted user.",
            user
        })
    } catch (error) {
        res.status(500).json({
            message: "error when deleting.",
            error: error.message
        })
    }
}