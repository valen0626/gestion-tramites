import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Usuario } from './Usuario';

export enum EstadoTramite {
    PENDIENTE = "PENDIENTE",
    EN_PROCESO = "EN_PROCESO",
    FINALIZADO = "FINALIZADO",
    CANCELADO = "CANCELADO",
}

@Entity()
export class Tramite {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 100 })
    tipo!: string;

    @Column({ type: 'text' })
    descripcion!: string;

    @Column({ type: 'date' })
    fecha!: Date;

    @Column({ type: 'enum', enum: EstadoTramite, default: EstadoTramite.PENDIENTE })
    estado!: EstadoTramite;

    @Column({type: 'boolean'})
    activo!: boolean;

    @CreateDateColumn()
    fechaCreacion!: Date;

    @UpdateDateColumn()
    fechaActualizacion!: Date;

    // Un tramite pertenece a un usuario
    @ManyToOne(() => Usuario, (usuario) => usuario.tramites, { onDelete: 'CASCADE' })
    usuario!: Usuario;
}