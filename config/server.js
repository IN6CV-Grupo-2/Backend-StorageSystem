import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { dbConnection } from "./mongo.js"
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import movementRoutes from './routes/movement.routes.js';


const middlewares = (app)=>{
    app.use(express.urlencoded({extended: false})) 
    app.use(express.json()) 
    app.use(cors()) 
    app.use(helmet()) 
    app.use(morgan('dev')) 
}

const routes = (app)=>{
    app.use('/storageSystem/products', productRoutes);
    app.use('/storageSystem/categories', categoryRoutes);
    app.use('/storageSystem/movements', movementRoutes);
}

const conectarDb = async ()=>{
    try {
        await dbConnection()
        console.log('Conexión exitosa con la DB')
    } catch (error) {
        console.log('Error al conectarse a la DB',error)
    }
}


export const initServer = ()=>{
    const app = express()
    const port= process.env.PORT || 3001

    try {
        middlewares(app)
        conectarDb()
        routes(app);
        app.listen(port)
        console.log(`Server running on port ${port}`)
    } catch (error) {
        console.log(`Server init failed ${error}`)
    }
}