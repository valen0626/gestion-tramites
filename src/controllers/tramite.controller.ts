import { mock } from 'jest-mock-extended';
import { Request, Response } from "express";
import {obtenerTramites, crearTramite, obtenerTramitePorId, editarTramite, eliminarTramite} from "../services/tramite.service";

export const crear = async (req: Request, res: Response): Promise<Response>  => {
    try {
        const tramite = await crearTramite(req.body);
        return res.status(201).json(tramite);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message })
        } else {
            return res.status(500).json({ error: 'Error desconocido' });
        }
    }
};

export const listar = async (req: Request, res: Response): Promise<Response>  => {
    try {
        const { estado, usuarioId, desde, hasta } = req.query;
        const tramites = await obtenerTramites({
            estado: estado?.toString(),
            usuarioId: usuarioId ? Number(usuarioId) : undefined,
            desde: desde?.toString(),
            hasta: hasta?.toString(),
        });
        return res.json(tramites);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message })
        } else {
            return res.status(500).json({ error: 'Error desconocido' });
        }
    }
};

export const obtener = async (req: Request, res: Response): Promise<Response>  => {
    try {
        const tramite = await obtenerTramitePorId(Number(req.params.id));
        return res.json(tramite);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message })
        } else {
            return res.status(500).json({ error: 'Error desconocido' });
        }
    }
};

export const actualizar = async (req: Request, res: Response): Promise<Response>  => {
    try {
        const tramite = await editarTramite(Number(req.params.id), req.body);
        return res.json(tramite);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message })
        } else {
            return res.status(500).json({ error: 'Error desconocido' });
        }
    }
};

export const eliminar = async (req: Request, res: Response): Promise<Response>  => {
    try {
        const tramite = await eliminarTramite(Number(req.params.id));
        return res.json({ mensaje: "Trámite desactivado", tramite });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message })
        } else {
            return res.status(500).json({ error: 'Error desconocido' });
        }
    }
};
