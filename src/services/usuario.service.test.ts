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

import { actualizarUsuario, crearUsuario, eliminarUsuario, listarUsuarios, obtenerUsuarioPorId } from "../../src/services/usuario.service";

describe("Servicio de usuarios", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('obtener usuarios', () => {
        it("debe lanzar error si el usuario no existe al obtener por ID", async () => {
            mockFindOneBy.mockResolvedValue(null);

            await expect(obtenerUsuarioPorId(999)).rejects.toThrow("Usuario no encontrado");
            expect(mockFindOneBy).toHaveBeenCalledWith({ id: 999 });
        });


        it("debe listar usuarios sin filtros", async () => {
            const usuariosMock = [
                { id: 1, nombre: "Ana", activo: true },
                { id: 2, nombre: "Luis", activo: false },
            ];
            mockFind.mockResolvedValue(usuariosMock);

            const resultado = await listarUsuarios({});

            expect(mockFind).toHaveBeenCalledWith({});
            expect(resultado).toEqual(usuariosMock);
        });

        it("debe listar usuarios filtrando por activo", async () => {
            const usuariosMock = [{ id: 1, nombre: "Ana", activo: true }];
            mockFind.mockResolvedValue(usuariosMock);

            const resultado = await listarUsuarios({ activo: true });

            expect(mockFind).toHaveBeenCalledWith({
                activo: { activo: true }
            });
            expect(resultado).toEqual(usuariosMock);
        });

        it("debe listar usuarios filtrando por nombre", async () => {
            const usuariosMock = [{ id: 1, nombre: "Luis", activo: true }];
            mockFind.mockResolvedValue(usuariosMock);

            const resultado = await listarUsuarios({ nombre: "Luis" });

            expect(mockFind).toHaveBeenCalledWith({
                nombre: expect.any(Object)  // ILike()
            });
            expect(resultado).toEqual(usuariosMock);
        });

        it("debe listar usuarios filtrando por cantidad de trámites", async () => {
            const usuariosMock = [{ id: 1, nombre: "Luis", tramites: 3 }];
            mockFind.mockResolvedValue(usuariosMock);

            const resultado = await listarUsuarios({ tramites: 3 });

            expect(mockFind).toHaveBeenCalledWith({
                tramites: { tramites: 3 }
            });
            expect(resultado).toEqual(usuariosMock);
        });

        it("debe listar usuarios filtrando por activo y nombre", async () => {
            const usuariosMock = [{ id: 1, nombre: "Ana", activo: true }];
            mockFind.mockResolvedValue(usuariosMock);

            const resultado = await listarUsuarios({ activo: true, nombre: "Ana" });

            expect(mockFind).toHaveBeenCalledWith({
                activo: { activo: true },
                nombre: expect.any(Object)
            });
            expect(resultado).toEqual(usuariosMock);
        });

    })

    it("debe crear un nuevo usuario y guardarlo", async () => {
        const datosMock = { nombre: "Ana", apellido: "Mendez", email: "ana@mail.com" };
        const usuarioMock = { id: 1, ...datosMock };

        mockCreate.mockReturnValue(usuarioMock);
        mockSave.mockResolvedValue(usuarioMock);

        const resultado = await crearUsuario(datosMock);

        expect(mockCreate).toHaveBeenCalledWith(datosMock);
        expect(mockSave).toHaveBeenCalledWith(usuarioMock);
        expect(resultado).toEqual(usuarioMock);
    });

    describe('elimar usuario', () => {
        it("debe eliminar el usuario", async () => {

            const datosMock = { nombre: "Ana", apellido: "Mendez", email: "ana@mail.com", activo: true }

            const usuarioExistente = { id: 1, ...datosMock };

            mockFindOneBy.mockResolvedValue(usuarioExistente);
            mockDelete.mockResolvedValue(usuarioExistente);

            const resultado = await eliminarUsuario(1);

            expect(mockFindOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(mockDelete).toHaveBeenCalledWith(usuarioExistente);
            expect(resultado).toEqual(usuarioExistente);
        })

        it("debe lanzar error si el usuario no existe al eliminar", async () => {
            mockFindOneBy.mockResolvedValue(null);

            await expect(eliminarUsuario(999)).rejects.toThrow("Usuario no encontrado");

            expect(mockFindOneBy).toHaveBeenCalledWith({ id: 999 });
        });
    })

    describe('actualizar usuario', () => {
        it("debe editar un usuario existente", async () => {
            const usuarioExistente = { nombre: "Ana", apellido: "Mendez", email: "ana@mail.com", activo: true }

            const cambios = {
                nombre: "Luisa",
                apellido: "Perez",
            };

            const usuarioActualizado = { ...usuarioExistente, ...cambios };

            mockFindOneBy.mockResolvedValue(usuarioExistente);
            mockMerge.mockImplementation((obj, data) => Object.assign(obj, data));
            mockSave.mockResolvedValue(usuarioActualizado);

            const resultado = await actualizarUsuario(1, cambios);

            expect(mockFindOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(mockMerge).toHaveBeenCalledWith(usuarioExistente, cambios);
            expect(mockSave).toHaveBeenCalledWith(usuarioExistente);
            expect(resultado).toEqual(usuarioActualizado);
        });

        it("debe lanzar error si el usuario no existe al actualizar", async () => {
            mockFindOneBy.mockResolvedValue(null);

            await expect(actualizarUsuario(999, { nombre: "Nuevo" }))
                .rejects.toThrow("Usuario no encontrado");

            expect(mockFindOneBy).toHaveBeenCalledWith({ id: 999 });
        });

    })

});

