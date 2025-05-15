import { actualizar, crear, eliminar, listar, obtener } from '../controllers/tramite.controller';
import * as tramiteService from '../services/tramite.service';

jest.mock('../services/tramite.service');

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
} as any;

afterEach(() => jest.clearAllMocks());


describe('tramites controller', () => {
    describe('crearTramite controller', () => {
        const req = {
            params: { id: '1' },
            body: {
                tipo: "Multa",
                descripcion: "Multa por exceso de velocidad",
                fecha: "2025-05-12",
                estado: "PENDIENTE",
                activo: true,
                usuarioId: 1
            }
        } as any;

        it('retorna 201 y el tramite creado', async () => {
            (tramiteService.crearTramite as jest.Mock).mockResolvedValue(expect.objectContaining({ id: 1, usuario: { id: 1 } }));

            await crear(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1, usuario: { id: 1 } }));
        });


        it('retorna 500 si el servicio lanza error', async () => {
            const fakeError = new Error('Falló el servicio');
            (tramiteService.crearTramite as jest.Mock).mockRejectedValue(fakeError);

            await crear(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Falló el servicio' });
        });
    });

    describe('listar tramites controller', () => {
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        } as any;

        it('debe retornar tramites correctamente sin filtros', async () => {
            const req = { query: {} } as any;
            const mockTramites = [{ id: 1, tipo: 'Multa', usuarioId: 1 }];
            (tramiteService.obtenerTramites as jest.Mock).mockResolvedValue(mockTramites);

            const resultado = await listar(req, res);

            expect(tramiteService.obtenerTramites).toHaveBeenCalledWith({
                estado: undefined,
                usuarioId: undefined,
                desde: undefined,
                hasta: undefined,
            });
            expect(res.json).toHaveBeenCalledWith(mockTramites);
        });

        it('debe retornar tramites con filtros', async () => {
            const req = {
                query: {
                    estado: 'PENDIENTE',
                    usuarioId: '1',
                    desde: '2025-05-10',
                    hasta: '2025-05-14',
                }
            } as any;

            await listar(req, res);

            expect(tramiteService.obtenerTramites).toHaveBeenCalledWith({
                estado: 'PENDIENTE',
                usuarioId: 1,
                desde: '2025-05-10',
                hasta: '2025-05-14',
            });
        });

        it('debe manejar error tipo Error', async () => {
            const req = { query: {} } as any;
            (tramiteService.obtenerTramites as jest.Mock).mockRejectedValue(new Error('fallo'));

            await listar(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'fallo' });
        });

        it('debe manejar error desconocido', async () => {
            const req = { query: {} } as any;
            (tramiteService.obtenerTramites as jest.Mock).mockRejectedValue('fallo plano');

            await listar(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error desconocido' });
        });
    });

    describe('obtener tramites controller', () => {

        it('debe retornar el tramite correctamente', async () => {
            const req = { params: { id: '1' } } as any;
            const mockUsuario = { id: 1, tipo: 'Multa', usuarioId: 1 };
            (tramiteService.obtenerTramitePorId as jest.Mock).mockResolvedValue(mockUsuario);

            await obtener(req, res);

            expect(tramiteService.obtenerTramitePorId).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(mockUsuario);
        });

        it('debe manejar error tipo Error', async () => {
            const req = { params: { id: '1' } } as any;
            (tramiteService.obtenerTramitePorId as jest.Mock).mockRejectedValue(new Error('fallo'));

            await obtener(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'fallo' });
        });

        it('debe manejar error desconocido', async () => {
            const req = { params: { id: '1' } } as any;
            (tramiteService.obtenerTramitePorId as jest.Mock).mockRejectedValue('error extraño');

            await obtener(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error desconocido' });
        });
    });

    describe('eliminar tramite controller', () => {

        it('desactiva tramite y retorna mensaje', async () => {
            const req = { params: { id: '1' } } as any;
            const res = { json: jest.fn() } as any;
            (tramiteService.eliminarTramite as jest.Mock).mockResolvedValue(true);

            await eliminar(req, res);

            expect(res.json).toHaveBeenCalledWith({
                mensaje: "Trámite desactivado",
                tramite: true,
            });
        });

        it('retorna 500 si eliminar lanza error', async () => {
            const req = { params: { id: '1' } } as any;
            (tramiteService.eliminarTramite as jest.Mock).mockRejectedValue(new Error('Error al eliminar'));

            await eliminar(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error al eliminar' });
        });
    })

    describe('actualizar tramite controller', () => {
        it('actualiza tramite correctamente', async () => {
            const req = { params: { id: '1' }, body: { descripcion: 'multa por parqueo' } } as any;
            (tramiteService.editarTramite as jest.Mock).mockResolvedValue({ id: 1, descripcion: 'multa por parqueo' });

            await actualizar(req, res);

            expect(res.json).toHaveBeenCalledWith({ id: 1, descripcion: 'multa por parqueo' });
        });

        it('retorna 500 si actualizarUsuario lanza error', async () => {
            const req = { params: { id: '1' }, body: {} } as any;
            (tramiteService.editarTramite as jest.Mock).mockRejectedValue(new Error('Falló actualización'));

            await actualizar(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Falló actualización' });
        });
    });

});