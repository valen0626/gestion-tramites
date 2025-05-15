import { AppDataSource } from "../database/data-source";
import { Tramite } from "../entities/Tramite";
import { Usuario } from "../entities/Usuario";
import { Between, ILike } from "typeorm";

const usuarioRepo = AppDataSource.getRepository(Usuario);
/**
 * Crear un nuevo trámite
 */
type TramiteInput = Omit<Partial<Tramite>, 'usuario'> & {
    usuario: { id: number }
};

export const crearTramite = async (data: TramiteInput) => {
    const tramiteRepo = AppDataSource.getRepository(Tramite);
    const usuario = await usuarioRepo.findOneBy({ id: data.usuario?.id });
    if (!usuario) throw new Error("Usuario no encontrado");

    const nuevoTramite = tramiteRepo.create({ ...data, usuario });
    const resultado = await tramiteRepo.save(nuevoTramite);
    return resultado
};

/**
 * Obtener todos los trámites con filtros opcionales
 */
export const obtenerTramites = async (filtros: {
    estado?: string;
    usuarioId?: number;
    desde?: string;
    hasta?: string;
}) => {
    const tramiteRepo = AppDataSource.getRepository(Tramite);
    const where: any = {};

    if (filtros.estado) {
        where.estado = ILike(`%${filtros.estado}%`);
    }
    if (filtros.usuarioId) {
        where.usuario = { id: filtros.usuarioId };
    }
    if (filtros.desde && filtros.hasta) {
        where.fecha = Between(new Date(filtros.desde), new Date(filtros.hasta));
    }
    return await tramiteRepo.find({ where, relations: ["usuario"] });
};

/**
 * Obtener un trámite por ID
 */
export const obtenerTramitePorId = async (id: number) => {
    const tramiteRepo = AppDataSource.getRepository(Tramite);
    const tramite = await tramiteRepo.findOne({
        where: { id },
        relations: ["usuario"],
    });
    if (!tramite) throw new Error("Trámite no encontrado");
    return tramite;
};

/**
 * Editar trámite (solo si no está finalizado o cancelado)
 */
export const editarTramite = async (id: number, data: Partial<Tramite>) => {
    const tramiteRepo = AppDataSource.getRepository(Tramite);
    const tramite = await tramiteRepo.findOneBy({ id });
    if (!tramite) throw new Error("Trámite no encontrado");

    if (["finalizado", "cancelado"].includes(tramite.estado)) {
        throw new Error("No se puede editar este trámite");
    }

    tramiteRepo.merge(tramite, data);
    return await tramiteRepo.save(tramite);
};

/**
 * Eliminar trámite 
 */
export const eliminarTramite = async (id: number) => {
    const tramiteRepo = AppDataSource.getRepository(Tramite);
    const tramite = await tramiteRepo.findOneBy({ id });
    if (!tramite) throw new Error("Trámite no encontrado");
    tramite.activo = false;
    return await tramiteRepo.save(tramite);
};
