import { AppDataSource } from "../database/data-source";
import { Usuario } from "../entities/Usuario";
import { ILike } from "typeorm";

const usuarioRepo = AppDataSource.getRepository(Usuario);

// Crear usuario
export const crearUsuario = async (datos: Partial<Usuario>) => {
    const nuevoUsuario = usuarioRepo.create(datos);
    return await usuarioRepo.save(nuevoUsuario);
};

// Obtener usuarios con filtros opcionales
export const listarUsuarios = async (filtros: {
    activo?: boolean;
    nombre?: string;
    tramites?: number;
}) => {
    const where: any = {};

    if (filtros.activo !== undefined) {
    where.activo = { activo: filtros.activo }
  }

  if (filtros.nombre) {
    where.nombre = ILike(`%${filtros.nombre}%`);
  }

  if (filtros.tramites !== undefined) {
    where.tramites = { tramites: filtros.tramites }
  }

  return await usuarioRepo.find(where);
};

// Obtener un usuario por ID
export const obtenerUsuarioPorId = async (id: number) => {
    const usuario = await usuarioRepo.findOneBy({ id });
    if (!usuario) throw new Error("Usuario no encontrado");
    return usuario;
};

// Actualizar usuario
export const actualizarUsuario = async (id: number, datos: Partial<Usuario>) => {
    const usuario = await usuarioRepo.findOneBy({ id });
    if (!usuario) throw new Error("Usuario no encontrado");
    usuarioRepo.merge(usuario, datos);
    return await usuarioRepo.save(usuario);
};

// Eliminar usuario 
export const eliminarUsuario = async (id: number) => {
    const usuario = await usuarioRepo.findOneBy({ id });
    if (!usuario) throw new Error("Usuario no encontrado");
    return await usuarioRepo.delete(usuario);
};
