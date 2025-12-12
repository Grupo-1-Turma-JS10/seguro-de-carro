import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'tb_contratos' })
export class Contrato {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 100 })
    nome: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 14 })
    cpf_cnpj: string;

    @IsNotEmpty()
    @Column({ type: 'timestamp' })
    data_inicio: Date;

    @IsNotEmpty()
    @Column({ type: 'timestamp' })
    data_fim: Date;

    @IsNotEmpty()
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    valor: number;

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 50 })
    status: string;

    @IsNotEmpty()
    @Column({ type: 'text' })
    cobertura: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    data_criacao: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    data_atualizacao: Date;
}