import "reflect-metadata"
import express from "express"
import { AppDataSource } from "./database/data-source"
import usuarioRoutes from "./routes/usuario.routes"
import tramiteRoutes from "./routes/tramite.routes"
import { setupSwagger } from "./swagger"

const app = express()

app.use(express.json())

// RUTAS
app.use("/api/usuarios", usuarioRoutes)
app.use("/api/tramites", tramiteRoutes)

setupSwagger(app);

const PORT = 3000

AppDataSource.initialize()
    .then(()=> {
        console.log("Conectado a la base de datos")

        app.listen(PORT, ()=>{
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
            console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
        })
    })
    .catch((error) => console.log("Error al conectar a la base de datos", error))


