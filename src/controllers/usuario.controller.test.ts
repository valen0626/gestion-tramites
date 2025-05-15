import { actualizarUsuario, crearUsuario, eliminarUsuario, listarUsuarios, obtenerUsuario } from '../controllers/usuario.controller';
import * as usuarioService from '../services/usuario.service';

jest.mock('../services/usuario.service');

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
} as any;

afterEach(() => jest.clearAllMocks());

describe('usuario controller', () => {
    describe('Crear usuario controller', () => {
        const req = {
            params: { id: '1' },
            body: {
                nombre: "Mariana",
                apellido: "Molina",
                email: "mariana@correo.com",
                activo: true
            }
        } as any;

        it('retorna 201 y el usuario creado', async () => {
            (usuarioService.crearUsuario as jest.Mock).mockResolvedValue(expect.objectContaining({ id: 1, nombre: "valentina" }));

            await crearUsuario(req, res);

            expect(usuarioService.crearUsuario).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1, nombre: "valentina" }));
        });


        it('retorna 500 si el servicio lanza error', async () => {
            const fakeError = new Error('Falló el servicio');
            (usuarioService.crearUsuario as jest.Mock).mockRejectedValue(fakeError);

            await crearUsuario(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Falló el servicio' });
        });
    });

    describe('listarUsuarios controller', () => {

        it('debe retornar usuarios correctamente sin filtros', async () => {
            const req = { query: {} } as any;
            const mockUsuarios = [{ id: 1, nombre: 'Valentina' }];
            (usuarioService.listarUsuarios as jest.Mock).mockResolvedValue(mockUsuarios);

            const resultado = await listarUsuarios(req, res);

            expect(usuarioService.listarUsuarios).toHaveBeenCalledWith({
                activo: undefined,
                nombre: undefined,
                tramites: undefined,
            });
            expect(res.json).toHaveBeenCalledWith(mockUsuarios);
        });

        it('debe retornar usuarios con filtros', async () => {
            const req = {
                query: { activo: 'true', nombre: 'Ana', tramites: '2' }
            } as any;

            await listarUsuarios(req, res);

            expect(usuarioService.listarUsuarios).toHaveBeenCalledWith({
                activo: true,
                nombre: 'Ana',
                tramites: 2,
            });
        });

        it('debe manejar error tipo Error', async () => {
            const req = { query: {} } as any;
            (usuarioService.listarUsuarios as jest.Mock).mockRejectedValue(new Error('fallo'));

            await listarUsuarios(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'fallo' });
        });

        it('debe manejar error desconocido', async () => {
            const req = { query: {} } as any;
            (usuarioService.listarUsuarios as jest.Mock).mockRejectedValue('fallo plano');

            await listarUsuarios(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error desconocido' });
        });
    });

    describe('obtenerUsuario por id controller', () => {

        it('debe retornar el usuario correctamente', async () => {
            const req = { params: { id: '1' } } as any;
            const mockUsuario = { id: 1, nombre: 'Valentina' };
            (usuarioService.obtenerUsuarioPorId as jest.Mock).mockResolvedValue(mockUsuario);

            await obtenerUsuario(req, res);

            expect(usuarioService.obtenerUsuarioPorId).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(mockUsuario);
        });

        it('debe manejar error tipo Error', async () => {
            const req = { params: { id: '1' } } as any;
            (usuarioService.obtenerUsuarioPorId as jest.Mock).mockRejectedValue(new Error('fallo'));

            await obtenerUsuario(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'fallo' });
        });

        it('debe manejar error desconocido', async () => {
            const req = { params: { id: '1' } } as any;
            (usuarioService.obtenerUsuarioPorId as jest.Mock).mockRejectedValue('error extraño');

            await obtenerUsuario(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error desconocido' });
        });
    });

    describe('actualizarUsuario controller', () => {
        it('actualiza usuario correctamente', async () => {
            const req = { params: { id: '1' }, body: { nombre: 'Actualizado' } } as any;
            (usuarioService.actualizarUsuario as jest.Mock).mockResolvedValue({ id: 1, nombre: 'Actualizado' });

            await actualizarUsuario(req, res);

            expect(res.json).toHaveBeenCalledWith({ id: 1, nombre: 'Actualizado' });
        });

        it('retorna 500 si actualizarUsuario lanza error', async () => {
            const req = { params: { id: '1' }, body: {} } as any;
            (usuarioService.actualizarUsuario as jest.Mock).mockRejectedValue(new Error('Falló actualización'));

            await actualizarUsuario(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Falló actualización' });
        });
    });

    describe('Eliminar usuario controller', () => {
        it('elimina usuario y retorna mensaje', async () => {
            const req = { params: { id: '1' } } as any;
            const res = { json: jest.fn() } as any;
            (usuarioService.eliminarUsuario as jest.Mock).mockResolvedValue(true);

            await eliminarUsuario(req, res);

            expect(res.json).toHaveBeenCalledWith({
                mensaje: "Usuario eliminado"
            });
        });

        it('retorna 500 si eliminarUsuario lanza error', async () => {
            const req = { params: { id: '1' } } as any;
            (usuarioService.eliminarUsuario as jest.Mock).mockRejectedValue(new Error('Error al eliminar'));

            await eliminarUsuario(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error al eliminar' });
        });
    })
})