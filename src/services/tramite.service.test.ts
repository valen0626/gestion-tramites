import { EstadoTramite } from "../entities/Tramite";

let mockCreate: jest.Mock;
let mockSave: jest.Mock;
let mockFindOneBy: jest.Mock;
let mockMerge: jest.Mock;
let mockDelete: jest.Mock;
let mockFind: jest.Mock;

jest.mock("../database/data-source", () => {
    const actual = jest.requireActual("../database/data-source");
    mockCreate = jest.fn();
    mockSave = jest.fn();
    mockFindOneBy = jest.fn();
    mockMerge = jest.fn();
    mockDelete = jest.fn();
    mockFind = jest.fn();

    return {
        ...actual,
        AppDataSource: {
            getRepository: jest.fn().mockReturnValue({
                findOneBy: mockFindOneBy,
                create: mockCreate,
                save: mockSave,
                merge: mockMerge,
                delete: mockDelete,
                find: mockFind,
            }),
        },

    };
});

import { crearTramite, editarTramite, eliminarTramite, obtenerTramites } from "../../src/services/tramite.service";
import { Between, ILike } from "typeorm";

describe("Servicio de trámites", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("obtenerTramites", () => {
        beforeEach(() => {
            mockFind.mockResolvedValue([]);
        });

        it("filtra solo por estado", async () => {
            const filtros = { estado: "pendiente" };

            await obtenerTramites(filtros);

            const llamada = mockFind.mock.calls[0][0];

            expect(llamada.relations).toEqual(["usuario"]);

            expect(llamada.where).toEqual(expect.objectContaining({}));

            expect(llamada.where.estado).toBeDefined();
            expect(llamada.where.estado._type).toBe("ilike");
            expect(llamada.where.estado._value).toBe("%pendiente%");
        });

        it("filtra solo por usuarioId", async () => {
            const filtros = { usuarioId: 5 };

            await obtenerTramites(filtros);

            const llamada = mockFind.mock.calls[0][0];

            expect(llamada.relations).toEqual(["usuario"]);

            expect(llamada.where).toEqual(expect.objectContaining({
                usuario: { id: 5 },
            }));
        });

        it("filtra solo por fechas", async () => {
            const filtros = { desde: "2024-01-01", hasta: "2024-12-31" };

            await obtenerTramites(filtros);

            const llamada = mockFind.mock.calls[0][0];

            expect(llamada.relations).toEqual(["usuario"]);

            expect(llamada.where.fecha).toBeDefined();
            expect(llamada.where.fecha._type).toBe("between");
            expect(llamada.where.fecha._value[0]).toEqual(new Date("2024-01-01"));
            expect(llamada.where.fecha._value[1]).toEqual(new Date("2024-12-31"));
        });

        it("filtra todos los campos combinados", async () => {
            const filtros = {
                estado: "pendiente",
                usuarioId: 5,
                desde: "2024-01-01",
                hasta: "2024-12-31",
            };

            await obtenerTramites(filtros);

            const llamada = mockFind.mock.calls[0][0];

            expect(llamada.relations).toEqual(["usuario"]);

            expect(llamada.where.usuario).toEqual({ id: 5 });

            expect(llamada.where.estado).toBeDefined();
            expect(llamada.where.estado._type).toBe("ilike");
            expect(llamada.where.estado._value).toBe("%pendiente%");

            expect(llamada.where.fecha).toBeDefined();
            expect(llamada.where.fecha._type).toBe("between");
            expect(llamada.where.fecha._value[0]).toEqual(new Date("2024-01-01"));
            expect(llamada.where.fecha._value[1]).toEqual(new Date("2024-12-31"));
        });

    });

    it("debe crear un nuevo trámite y guardarlo", async () => {
        const datosMock = {
            tipo: "Multa",
            descripcion: "Multa por velocidad",
            fecha: new Date(),
            estado: EstadoTramite.PENDIENTE,
            activo: true,
            usuario: { id: 1 },
        };

        const mockUsuario = { id: 1, nombre: "Valentina" };
        mockFindOneBy.mockResolvedValue(mockUsuario);
        mockCreate.mockReturnValue({ ...datosMock, usuario: mockUsuario });
        mockSave.mockResolvedValue({ id: 1, ...datosMock, usuario: mockUsuario });

        const resultado = await crearTramite(datosMock);

        expect(mockFindOneBy).toHaveBeenCalledWith({ id: 1 });
        expect(mockCreate).toHaveBeenCalledWith({ ...datosMock, usuario: mockUsuario });
        expect(mockSave).toHaveBeenCalledWith({ ...datosMock, usuario: mockUsuario });
        expect(resultado).toEqual({ id: 1, ...datosMock, usuario: mockUsuario });
    });

    it("debe lanzar error si no encuentra usuario en crearTramite", async () => {
        mockFindOneBy.mockResolvedValue(null);

        const datosMock = {
            tipo: "Multa",
            descripcion: "Multa por velocidad",
            fecha: new Date(),
            estado: EstadoTramite.PENDIENTE,
            activo: true,
            usuario: { id: 999 },
        };

        await expect(crearTramite(datosMock)).rejects.toThrow("Usuario no encontrado");
        expect(mockFindOneBy).toHaveBeenCalledWith({ id: 999 });
    });

    describe("Editar trámite", () => {
        it("lanza error si trámite no existe", async () => {
            mockFindOneBy.mockResolvedValue(null);

            await expect(editarTramite(1, { descripcion: "nuevo" })).rejects.toThrow("Trámite no encontrado");
            expect(mockFindOneBy).toHaveBeenCalledWith({ id: 1 });
        });

        it("lanza error si estado es finalizado", async () => {
            mockFindOneBy.mockResolvedValue({ id: 1, estado: "finalizado" });

            await expect(editarTramite(1, { descripcion: "nuevo" })).rejects.toThrow("No se puede editar este trámite");
        });

        it("lanza error si estado es cancelado", async () => {
            mockFindOneBy.mockResolvedValue({ id: 1, estado: "cancelado" });

            await expect(editarTramite(1, { descripcion: "nuevo" })).rejects.toThrow("No se puede editar este trámite");
        });

        it("hace merge y guarda correctamente", async () => {
            const tramiteExistente = { id: 1, estado: "pendiente", descripcion: "viejo" };
            const cambios = { descripcion: "nuevo" };
            const tramiteActualizado = { ...tramiteExistente, ...cambios };

            mockFindOneBy.mockResolvedValue(tramiteExistente);
            mockMerge.mockImplementation((obj, data) => Object.assign(obj, data));
            mockSave.mockResolvedValue(tramiteActualizado);

            const resultado = await editarTramite(1, cambios);

            expect(mockFindOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(mockMerge).toHaveBeenCalledWith(tramiteExistente, cambios);
            expect(mockSave).toHaveBeenCalledWith(tramiteExistente);
            expect(resultado).toEqual(tramiteActualizado);
        });
    });

    describe("Eliminar trámite", () => {
        it("lanza error si trámite no existe", async () => {
            mockFindOneBy.mockResolvedValue(null);

            await expect(eliminarTramite(1)).rejects.toThrow("Trámite no encontrado");
            expect(mockFindOneBy).toHaveBeenCalledWith({ id: 1 });
        });

        it("desactiva trámite y guarda", async () => {
            const tramiteExistente = { id: 1, activo: true };
            const tramiteDesactivado = { id: 1, activo: false };

            mockFindOneBy.mockResolvedValue(tramiteExistente);
            mockSave.mockResolvedValue(tramiteDesactivado);

            const resultado = await eliminarTramite(1);

            expect(mockFindOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(mockSave).toHaveBeenCalledWith({ ...tramiteExistente, activo: false });
            expect(resultado).toEqual(tramiteDesactivado);
        });
    });
});
