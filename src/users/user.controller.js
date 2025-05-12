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

        if (password) {
            data.password = await hash(password);
        }

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

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.user; // ID del usuario autenticado
    const { password, username, email } = req.body;

    console.log("Datos recibidos para actualizar el perfil:", { username, email, password });

    const data = {};
    if (username) data.username = username;
    if (email) data.email = email;

    // Encriptar la nueva contraseña si se proporciona
    if (password && password.trim() !== "") {
      data.password = await hash(password);
      console.log("Contraseña encriptada:", data.password);
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.status(200).json({
      msg: "Perfil actualizado correctamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error.message);
    res.status(500).json({
      msg: "Error al actualizar el perfil",
      error: error.message,
    });
  }
}