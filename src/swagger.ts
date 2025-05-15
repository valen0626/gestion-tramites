import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API gestión de trámites",
      version: "1.0.0",
      description: "Documentación de la API de gestión de trámites de tránsito",
    },
    components: {
      schemas: {
        EstadoTramite: {
          type: "string",
          enum: ["PENDIENTE", "EN_PROCESO", "FINALIZADO", "CANCELADO"],
          example: "PENDIENTE",
        },
        Usuario: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            nombre: { type: "string", example: "Juan" },
            apellido: { type: "string", example: "Pérez" },
            email: { type: "string", format: "email", example: "juan.perez@example.com" },
            telefono: { type: "string", example: "3001234567", nullable: true },
            activo: { type: "boolean", example: true },
            fechaCreacion: { type: "string", format: "date-time" },
            fechaActualizacion: { type: "string", format: "date-time" },
            tramites: {
              type: "array",
              items: { $ref: "#/components/schemas/Tramite" },
            },
          },
          required: ["id", "nombre", "apellido", "email", "activo", "fechaCreacion", "fechaActualizacion"],
        },
        UsuarioInput: {
          type: "object",
          properties: {
            nombre: { type: "string", example: "Juan" },
            apellido: { type: "string", example: "Pérez" },
            email: { type: "string", format: "email", example: "juan.perez@example.com" },
            telefono: { type: "string", example: "3001234567", nullable: true },
            activo: { type: "boolean", example: true },
          },
          required: ["nombre", "apellido", "email"],
        },
        Tramite: {
          type: "object",
          properties: {
            id: { type: "integer", example: 100 },
            tipo: { type: "string", example: "Licencia" },
            descripcion: { type: "string", example: "Trámite para licencia de conducir" },
            fecha: { type: "string", format: "date", example: "2025-05-14" },
            estado: { $ref: "#/components/schemas/EstadoTramite" },
            activo: { type: "boolean", example: true },
            fechaCreacion: { type: "string", format: "date-time" },
            fechaActualizacion: { type: "string", format: "date-time" },
            usuario: { $ref: "#/components/schemas/UsuarioSimplificado" },
          },
          required: ["id", "tipo", "descripcion", "fecha", "estado", "activo", "fechaCreacion", "fechaActualizacion"],
        },
        TramiteInput: {
          type: "object",
          properties: {
            tipo: { type: "string", example: "Licencia" },
            descripcion: { type: "string", example: "Trámite para licencia de conducir" },
            fecha: { type: "string", format: "date", example: "2025-05-14" },
            estado: { $ref: "#/components/schemas/EstadoTramite" },
            activo: { type: "boolean", example: true },
            usuarioId: { type: "integer", example: 1 },
          },
          required: ["tipo", "descripcion", "fecha", "usuarioId"],
        },
        UsuarioSimplificado: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            nombre: { type: "string", example: "Juan" },
            apellido: { type: "string", example: "Pérez" },
          },
          required: ["id", "nombre", "apellido"],
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // apunta a tus archivos de rutas para leer comentarios JSDoc
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}
