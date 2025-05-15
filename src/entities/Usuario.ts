import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Tramite } from './Tramite';

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type:'varchar', length: 100 })
    nombre!: string;

    @Column({ type:'varchar', length: 100 })
    apellido!: string;

    @Column({ type:'varchar', unique: true, length: 100 })
    email!: string;

    @Column({ type:'varchar', length: 20, nullable: true })
    telefono?: string;

    @Column({ default: true})
    activo!: boolean;

    @CreateDateColumn()
    fechaCreacion!: Date;

    @UpdateDateColumn()
    fechaActualizacion!: Date;

    // Un usuario puede tener muchos tramites
    @OneToMany(() => Tramite, (tramite) => tramite.usuario, { cascade: true })
    tramites!: Tramite[];
}