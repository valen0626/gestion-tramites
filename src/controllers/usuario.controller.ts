import { Request, Response } from "express";
import * as usuarioService from "../services/usuario.service";

export const listarUsuarios = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { activo, nombre, tramites } = req.query;
        const usuarios = await usuarioService.listarUsuarios({
            activo: activo ? Boolean(activo) : undefined,
            nombre: nombre?.toString(),
            tramites: tramites ? Number(tramites) : undefined,
        });
        return res.json(usuarios)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message })
        } else {
            return res.status(500).json({ error: 'Error desconocido' });
        }
    }
}

export const obtenerUsuario = async (req: Request, res: Response): Promise<Response> => {
    try {
        const usuario = await usuarioService.obtenerUsuarioPorId(Number(req.params.id))
        return res.json(usuario)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message })
        } else {
            return res.status(500).json({ error: 'Error desconocido' });
        }
    }
}

export const crearUsuario = async (req: Request, res: Response): Promise<Response> => {
    try {
        const resultado = await usuarioService.crearUsuario(req.body)
        return res.status(201).json(resultado)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message })
        } else {
            return res.status(500).json({ error: 'Error desconocido' });
        }
    }
}

export const actualizarUsuario = async (req: Request, res: Response): Promise<Response> => {
    try {
        const resultado = await usuarioService.actualizarUsuario(Number(req.params.id), req.body)
        return res.json(resultado)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message })
        } else {
            return res.status(500).json({ error: 'Error desconocido' });
        }
    }
}

export const eliminarUsuario = async (req: Request, res: Response): Promise<Response> => {
    try {
        const resultado = await usuarioService.eliminarUsuario(Number(req.params.id))
        return res.json({ mensaje: "Usuario eliminado" })
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message })
        } else {
            return res.status(500).json({ error: 'Error desconocido' });
        }
    }
}