import { DataSource } from "typeorm";
import { Usuario } from "../entities/Usuario";
import { Tramite } from "../entities/Tramite";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Usuario, Tramite],
    migrations: [],
    subscribers: [],
})