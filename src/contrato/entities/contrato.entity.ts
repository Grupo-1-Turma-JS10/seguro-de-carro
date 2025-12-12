import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Veiculo } from "../../veiculo/entities/veiculo.entity";

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
    @Column({ type: 'date' })
    data_nascimento: Date;

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 200 })
    endereco: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 100 })
    email: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 20 })
    telefone: string;

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

    @OneToMany(() => Veiculo, veiculo => veiculo.id)
    veiculos: Veiculo[];
}