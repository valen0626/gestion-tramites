import { Router } from "express";
import { listar, obtener, crear, actualizar, eliminar } from "../controllers/tramite.controller";

const router = Router();

/**
 * @openapi
 * /tramite:
 *   get:
 *     summary: Listar todos los trámites, puede filtrar por estado, usuario, rango de fechas
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Estado del trámite
 *       - in: query
 *         name: usuarioId
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha desde
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha hasta
 *     responses:
 *       200:
 *         description: Lista de trámites
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tramite'
 */
router.get("/", listar);

/**
 * @openapi
 * /tramite/{id}:
 *   get:
 *     summary: Obtiene un trámite por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trámite
 *     responses:
 *       200:
 *         description: Trámite encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tramite'
 *       404:
 *         description: Trámite no encontrado
 */
router.get("/:id", obtener);

/**
 * @openapi
 * /tramite:
 *   post:
 *     summary: Crea un nuevo trámite
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TramiteInput'
 *     responses:
 *       201:
 *         description: Trámite creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tramite'
 */
router.post("/", crear);

/**
 * @openapi
 * /tramite/{id}:
 *   put:
 *     summary: Actualiza un trámite por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trámite
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TramiteInput'
 *     responses:
 *       200:
 *         description: Trámite actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tramite'
 *       404:
 *         description: Trámite no encontrado
 */
router.put("/:id", actualizar);

/**
 * @openapi
 * /tramite/{id}:
 *   delete:
 *     summary: Elimina un trámite por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trámite
 *     responses:
 *       200:
 *         description: Trámite eliminado correctamente
 *       404:
 *         description: Trámite no encontrado
 */
router.delete("/:id", eliminar);

export default router;
